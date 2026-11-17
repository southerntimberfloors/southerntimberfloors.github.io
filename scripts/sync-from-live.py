#!/usr/bin/env python3
"""
Pull the latest product content from the current live site (southerntimberfloors.com, built by the agency)
into this repo, so edits made there before launch aren't lost.

  python3 scripts/sync-from-live.py            # update src/data + images
  python3 scripts/sync-from-live.py --dry-run  # only report what would change

What it syncs, per product page (/flooring/<slug>):
  • name, description paragraphs, spec table (solid, engineered + parquetry; other ranges are reported for manual review
    because their tables on the old site are inconsistently formatted)
  • photo gallery (new photos downloaded and converted to .webp at 1366px + 440px)
  • products added to / removed from the range
  • <title>, meta description and <h1> for every page in src/data/legacy-seo.json (kept identical for SEO)

Needs Python 3.9+ and Pillow (pip3 install pillow). Stop using this once the domain points at the new site.
"""
import argparse, concurrent.futures as cf, hashlib, html, io, json, re, sys, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIVE = 'https://www.southerntimberfloors.com'
DATA = ROOT / 'src/data'
IMG_DIR = ROOT / 'public/images/products'
UA = {'User-Agent': 'Mozilla/5.0 (Southern Timber Floors site migration sync)'}
CATEGORY = {'Solid Timber': 'solid', 'Engineered Timber': 'engineered', 'Parquetry Timber': 'parquetry', 'Hybrid timber': 'hybrid', 'Carpet': 'carpet'}
PLACEHOLDER = 'PlaceholderFrameLight'  # the old site's filler image, not a real photo
LABELS = {
    'thickness x wear layer': 'Thickness × wear layer', 'thickness v wear layer': 'Thickness × wear layer', 'width x length': 'Width × length', 'thickeness': 'Thickness',
    'lengths': 'Length', 'finish': 'Finish', 'grading': 'Grade', 'grade': 'Grade', 'species': 'Species', 'width': 'Width',
    'thickness': 'Thickness', 'length': 'Length', 'profile': 'Profile', 'pattern': 'Pattern',
}


def fetch(path, binary=False):
    url = path if path.startswith('http') else LIVE + path
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        data = r.read()
    return data if binary else data.decode('utf-8', 'ignore')


def clean(s):
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = html.unescape(re.sub(r'<[^>]+>', '', s)).replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', s).strip()


def times(v):
    return re.sub(r'(?<=[\dm])\s*[xX×]\s*(?=\d)', ' × ', v)


def parse_product(h):
    m = re.search(r'<h1[^>]*>(.*?)</h1>(.*?)<table class="table--product-meta[^"]*">(.*?)</table>', h, re.S)
    if not m:
        return None
    paras = [p for p in (clean(x) for x in re.findall(r'<p[^>]*>(.*?)</p>', m.group(2), re.S)) if p]
    rows = []
    for th, td in re.findall(r'<tr><th>(.*?)</th><td>(.*?)</td></tr>', m.group(3), re.S):
        spans = [clean(s) for s in re.findall(r'<span class="block">(.*?)</span>', td, re.S)]
        rows.append((clean(th), ' / '.join(s for s in spans if s) if spans else clean(td)))
    gallery = [u for u in re.findall(r'data-fancybox="gallery"[^>]*data-src="([^"]+)"', h) if PLACEHOLDER not in u]
    return {'name': clean(m.group(1)), 'paras': paras, 'rows': rows, 'gallery': gallery}


def tidy_specs(rows):
    """Spec rows from the old site's table → our format (consistent labels, × for dimensions)."""
    out = []
    for k, v in rows:
        if k.lower() == 'category' or not (k or v):
            continue
        label = LABELS.get(k.lower(), k[:1].upper() + k[1:])
        if label == 'Width':  # widths are alternatives, e.g. "85mm x 130mm x 180mm" means 85 / 130 / 180
            v = re.sub(r'\s*[xX×]\s*', ' / ', v)
        v = times(v).replace('Tongue & Groove', 'Tongue and groove').replace('Tongue and Groove', 'Tongue and groove')
        if label == 'Width × length':
            v = re.sub(r'\s*/\s*Also available in Strip', '', v, flags=re.I)  # already said under Pattern
            v = re.sub(r'(\d)(?=\s*(?:/|$))', r'\1mm', v)  # "120mm × 600" → "120mm × 600mm"
            if not re.search(r'\d', v):  # the old site sometimes puts another row's text here
                continue
        out.append([label, v])
    return out


# Known slips in the old site's spec tables: (slug, label) → value. Each is backed by the matching plank's page.
SPEC_FIXES = {
    # Moonda herringbone's width cell holds "Finish / Brushed Matt"; the Moonda plank page lists the herringbone as 150mm × 900mm.
    ('engineered-european-oak-parquetry-herringbone---moondah', 'Width × length'): '150mm × 900mm',
    ('engineered-european-oak-parquetry-herringbone---moondah', 'Finish'): 'Brushed Matt',
}


def apply_fixes(slug, specs):
    have = {k for k, _ in specs}
    specs = [[k, SPEC_FIXES.get((slug, k), v)] for k, v in specs]
    for (s, k), v in SPEC_FIXES.items():
        if s == slug and k not in have:
            at = next((i for i, (lk, _) in enumerate(specs) if lk == 'Profile'), len(specs))
            specs.insert(at, [k, v])
    return specs


def norm(s):
    return re.sub(r'[\s.,;:]+', '', s.lower().replace('×', 'x').replace('&', 'and'))


# Words the old site puts in spec cells inconsistently; ignored when deciding whether a spec actually changed.
NOISE = re.compile(r'mm|available|matching planks?|tongue and groove planks?|herringbone|dimensions|cut style|field type')


def values(specs):
    """The set of spec values, ignoring labels and formatting, to spot genuine changes."""
    cells = [v or k for k, v in specs if k not in ('Category', 'Construction', 'Species')]
    cells += [k for k, v in specs if v and re.search(r'\d', k)]
    out = set()
    for c in cells:
        for part in c.split('/'):
            t = norm(NOISE.sub('', part.lower().replace('×', 'x').replace('&', 'and')))
            if t:
                out.add(t)
    return out


def basename(url):
    return re.sub(r'\.[a-z0-9]+$', '', urllib.parse.unquote(url.rsplit('/', 1)[-1]), flags=re.I)


def tone_of(rgb):
    import colorsys
    r, g, b = (c / 255 for c in rgb)
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if s < 0.12:
        return 'grey'
    if l > 0.62:
        return 'light'
    if l < 0.28:
        return 'dark'
    return 'rich' if h * 360 < 24 and s > 0.35 else 'natural'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    products = json.loads((DATA / 'products.json').read_text())
    images = json.loads((DATA / 'images.json').read_text())
    seo = json.loads((DATA / 'legacy-seo.json').read_text())
    ours = {p['slug']: p for p in products}

    # 1. Which products does the live site currently link to?
    listing = ['/', '/timber'] + [f'/timber/{c}' for c in ('solid-timber', 'engineered-timber', 'parquetry-timber', 'hybrid-timber', 'carpet')]
    slugs = set()
    for path in listing:
        slugs |= set(re.findall(r'href="https://www\.southerntimberfloors\.com/flooring/([^"#?/]+)"', fetch(path)))
    print(f'Live site lists {len(slugs)} products (we have {len(ours)}).')

    with cf.ThreadPoolExecutor(8) as ex:
        pages = dict(zip(sorted(slugs), ex.map(lambda s: fetch(f'/flooring/{s}'), sorted(slugs))))

    report, review = [], []
    new_products = []
    for slug in sorted(slugs):
        live = parse_product(pages[slug])
        if not live:
            review.append(f'{slug}: could not read the product page layout')
            continue
        cat_name = dict(live['rows']).get('Category', '')
        cat = CATEGORY.get(cat_name)
        p = dict(ours.get(slug) or {'slug': slug, 'category': cat, 'pattern': 'strip', 'herringbone': False})
        changes = []
        if p.get('name') != live['name']:
            changes.append(f"name: {p.get('name')!r} → {live['name']!r}")
            p['name'] = live['name']
        desc = '\n\n'.join(live['paras']) or None
        if norm(p.get('originalDescription') or '') != norm(desc or ''):
            changes.append('description')
            if desc:
                p['originalDescription'] = desc
            else:
                p.pop('originalDescription', None)
        live_specs = apply_fixes(slug, tidy_specs(live['rows']))
        if cat in ('solid', 'engineered', 'parquetry') or slug not in ours:
            if p.get('specs') != live_specs:
                if slug in ours and values(p['specs']) != values(live_specs):
                    changes.append('specs')
                p['specs'] = live_specs
            spec = dict(live_specs)
            if spec.get('Species'):
                p['species'] = re.sub(r'^Australian\s+', '', spec['Species'])
                if spec['Species'].lower() == 'australian species':  # e.g. "Spotted Gum - Herringbone"
                    p['species'] = re.split(r'\s+-\s+', live['name'])[0]
            pattern = spec.get('Pattern', '').lower()
            p['herringbone'] = cat == 'parquetry' or 'herringbone' in pattern
            if cat == 'parquetry':
                p['pattern'] = 'chevron' if 'chevron' in pattern and 'herringbone' not in pattern else 'herringbone'
        elif values(p.get('specs', [])) != values(live_specs):
            review.append(f'{slug} ({cat}): spec table changed on the live site, check by hand → {live["rows"]}')

        # Photos
        have = {i.get('name'): i for i in images['products'].get(slug, [])}
        wanted = [basename(u) for u in live['gallery']]
        if wanted and wanted != [i.get('name') for i in images['products'].get(slug, [])]:
            changes.append(f'photos ({len(have)} → {len(wanted)})')
            gallery = []
            for url, name in zip(live['gallery'], wanted):
                if name in have:
                    gallery.append(have[name]); continue
                stem = f"{slug[:48].rstrip('-')}-{hashlib.sha1(name.encode()).hexdigest()[:6]}"
                gallery.append({'src': f'/images/products/{stem}.webp', 'thumb': f'/images/products/{stem}-sm.webp', 'name': name, '_url': url})
            images['products'][slug] = gallery

        if slug not in ours:
            new_products.append(slug)
            changes.insert(0, 'NEW')
        if changes:
            report.append(f"{slug}: {', '.join(changes)}")
        ours[slug] = p

    removed = sorted(set(ours) - slugs)
    for slug in removed:
        report.append(f'{slug}: REMOVED from the live site')
        ours.pop(slug)
        images['products'].pop(slug, None)

    print('\n'.join(report) or 'No product changes.')
    if review:
        print('\nNeeds a manual look:\n  ' + '\n  '.join(review))

    # 2. Titles / descriptions / H1s for every page we keep identical for SEO.
    pages_to_check = [u for u in seo if not u.startswith('/flooring/') or u.split('/')[-1] in slugs] + \
                     [f'/flooring/{s}' for s in new_products]
    def head(path):
        try:
            h = pages.get(path.split('/')[-1]) if path.startswith('/flooring/') else None
            h = h or fetch(path)
        except Exception as e:  # noqa: BLE001
            return path, None
        t = re.search(r'<title>(.*?)</title>', h, re.S)
        d = re.search(r'<meta name="description" content="([^"]*)"', h)
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S)
        # Titles keep any non-breaking spaces exactly as the old site had them.
        title = re.sub(r'[ \t\r\n]+', ' ', html.unescape(t.group(1))).strip() if t else None
        desc = re.sub(r'[ \t\r\n]+', ' ', html.unescape(d.group(1))).strip() if d else ''
        return path, {'title': title, 'description': desc or None, 'h1': clean(h1.group(1)) if h1 else None}
    with cf.ThreadPoolExecutor(8) as ex:
        heads = dict(ex.map(head, pages_to_check))
    seo_changes = []
    new_seo = {}
    for path in pages_to_check:
        cur, live = seo.get(path), heads.get(path)
        if live is None:
            new_seo[path] = cur; continue
        if not live['h1'] and cur and cur.get('h1'):
            # The old site sometimes ships an empty <h1></h1>; keep the heading we had rather than lose it.
            print(f'  note: {path} has an empty <h1> on the live site, keeping {cur["h1"]!r}')
            live = {**live, 'h1': cur['h1']}
        if cur != live:
            seo_changes.append(f'{path}: ' + ', '.join(k for k in ('title', 'description', 'h1') if (cur or {}).get(k) != live[k]))
        new_seo[path] = live
    for path in seo:
        if path not in new_seo:
            seo_changes.append(f'{path}: removed (page gone)')
    print('\nSEO (title / description / H1) changes:\n  ' + ('\n  '.join(seo_changes) or 'none'))

    if args.dry_run:
        print('\nDry run: nothing written.')
        return

    # 3. Download + convert new photos.
    from PIL import Image
    todo = [i for g in images['products'].values() for i in g if '_url' in i]
    def convert(item):
        im = Image.open(io.BytesIO(fetch(item.pop('_url'), binary=True))).convert('RGB')
        for path, w in ((item['src'], 1366), (item['thumb'], 440)):
            out = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            out.save(ROOT / 'public' / path.lstrip('/'), 'WEBP', quality=80, method=6)
        return item['src']
    with cf.ThreadPoolExecutor(6) as ex:
        done = list(ex.map(convert, todo))
    print(f'\nDownloaded {len(done)} new photos.')

    # New products need a colour + tone for the catalogue filters (taken from the board photo).
    for slug in new_products:
        first = images['products'].get(slug, [None])[0]
        if first:
            im = Image.open(ROOT / 'public' / first['thumb'].lstrip('/')).convert('RGB')
            w, h = im.size
            rgb = im.crop((w // 4, h // 4, 3 * w // 4, 3 * h // 4)).resize((1, 1), Image.LANCZOS).getpixel((0, 0))
            ours[slug]['color'] = '#%02x%02x%02x' % rgb
            ours[slug]['tone'] = tone_of(rgb)
        ours[slug].setdefault('color', '#a8835a'); ours[slug].setdefault('tone', 'natural')

    # Delete product photos nothing uses any more.
    used = {Path(i[k]).name for g in images['products'].values() for i in g for k in ('src', 'thumb')}
    stale = [f for f in IMG_DIR.glob('*.webp') if f.name not in used]
    for f in stale:
        f.unlink()
    print(f'Removed {len(stale)} unused photo files.')

    # Keep the existing order, add new products at the end of their category.
    order = [s for s in [p['slug'] for p in products] if s in ours] + new_products
    keys = ['slug', 'name', 'category', 'species', 'color', 'tone', 'pattern', 'herringbone', 'specs', 'originalDescription']
    out = [{k: ours[s][k] for k in keys if k in ours[s]} for s in order]
    (DATA / 'products.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
    (DATA / 'images.json').write_text(json.dumps(images, indent=1, ensure_ascii=False) + '\n')
    (DATA / 'legacy-seo.json').write_text(json.dumps(new_seo, indent=2, ensure_ascii=False) + '\n')
    print('Updated src/data/products.json, images.json and legacy-seo.json.')


if __name__ == '__main__':
    sys.exit(main())
