#!/usr/bin/env python3
"""Turn the downloadable Word guides into the online versions, word for word.

    python3 scripts/guides-from-docx.py

Reads public/downloads/*.docx and writes src/data/guides.json, which /guides/<slug> renders.
Re-run it whenever a .docx in public/downloads is replaced, so the online page and the download stay identical.
"""
import html
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# slug → (document, number of title lines at the top: eyebrow, title, then an optional subtitle)
GUIDES = {
    'engineered-care': ('STF-Engineered-Floors-Maintenance.docx', 2),
    'hybrid-care': ('STF-Hybrid-Flooring-Fact-Sheet.docx', 3),
    'installation-care': ('STF-Timber-Flooring-Fact-Sheet.docx', 2),
}


def paragraphs(docx):
    """[(is_list_item, [(text, bold), …]), …] for the document body, skipping the letterhead table."""
    xml = zipfile.ZipFile(docx).read('word/document.xml').decode()
    body = re.sub(r'<w:tbl>.*?</w:tbl>', '', xml.split('<w:body>')[1], flags=re.S)
    out = []
    for p in re.findall(r'<w:p[ >].*?</w:p>', body, re.S):
        runs = []
        for r in re.findall(r'<w:r[ >].*?</w:r>', p, re.S):
            text = html.unescape(''.join(re.findall(r'<w:t[^>]*>([^<]*)', r)))
            if text:
                bold = bool(re.search(r'<w:b/>|<w:b w:val="(1|true)"/>', r))
                if runs and runs[-1][1] == bold:
                    runs[-1] = (runs[-1][0] + text, bold)
                else:
                    runs.append((text, bold))
        if ''.join(t for t, _ in runs).strip():
            out.append(('<w:numPr>' in p, runs))
    return out


def plain(runs):
    return re.sub(r'\s+', ' ', ''.join(t for t, _ in runs)).strip()


def to_html(runs):
    s = ''
    for text, bold in runs:
        t = html.escape(re.sub(r'\s+', ' ', text))
        s += f'<strong>{t}</strong>' if bold and t.strip() else t
    s = re.sub(r'\s+', ' ', s).strip()
    return s.replace('</strong> <strong>', ' ').replace('</strong><strong>', '')


def all_bold(runs):
    return all(b for t, b in runs if t.strip())


def convert(docx, n_title):
    paras = paragraphs(docx)
    head, rest = paras[:n_title], paras[n_title:]
    guide = {'eyebrow': plain(head[0][1]).title() if plain(head[0][1]).isupper() else plain(head[0][1]),
             'title': plain(head[1][1])}
    if n_title > 2:
        guide['subtitle'] = plain(head[2][1])
    blocks = []
    for is_li, runs in rest:
        text = plain(runs)
        if is_li:
            if not blocks or blocks[-1]['type'] != 'ul':
                blocks.append({'type': 'ul', 'items': []})
            blocks[-1]['items'].append(to_html(runs))
        elif re.fullmatch(r'(Name:\s*)?Signature:.*', text) or text.startswith('Name:'):
            blocks.append({'type': 'sign', 'fields': [f.strip() for f in re.findall(r'(\w+):', text)]})
        elif all_bold(runs) and text.endswith(':') and len(text) < 20:
            blocks.append({'type': 'label', 'text': text.rstrip(':')})  # e.g. "IMPORTANT:" heading the next note
        elif all_bold(runs) and len(text) < 100:
            blocks.append({'type': 'h', 'text': text})
        elif all_bold(runs):
            blocks.append({'type': 'note', 'html': to_html(runs)})
        else:
            blocks.append({'type': 'p', 'html': to_html(runs)})
    # Two or more short bold lines straight after the title are an opening statement
    # (the timber fact sheet's "No two trees are the same." lines), not headings.
    n = 0
    while n < len(blocks) and blocks[n]['type'] == 'h':
        n += 1
    if n >= 2:
        guide['statement'] = [b['text'] for b in blocks[:n]]
        blocks = blocks[n:]
    for b in blocks:
        if b['type'] == 'h':
            b['text'] = re.sub(r'\.\s*$', '', b['text']).strip()  # "Preventative Care." → "Preventative Care"
    # "IMPORTANT:" followed by a note → one note with a label.
    merged = []
    for b in blocks:
        if merged and merged[-1]['type'] == 'label' and b['type'] == 'note':
            b = {**b, 'label': merged.pop()['text']}
        merged.append(b)
    guide['blocks'] = merged
    return guide


def main():
    out = {}
    for slug, (name, n_title) in GUIDES.items():
        g = convert(ROOT / 'public' / 'downloads' / name, n_title)
        g['download'] = f'/downloads/{name}'
        out[slug] = g
        print(f"{slug}: {g['title']} ({len(g['blocks'])} blocks)")
    (ROOT / 'src' / 'data' / 'guides.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
