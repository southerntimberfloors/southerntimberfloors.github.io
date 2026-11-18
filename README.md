# Southern Timber Floors: website

A fast, static rebuild of southerntimberfloors.com using [Astro](https://astro.build). It keeps every page and feature of the original site, adds new tools for shoppers, and fixes the original site's weak points.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve the build
npm run check     # type-check
```

## What's where

| Path | Purpose |
| --- | --- |
| `src/data/site.ts` | Business details, hours, categories, services, projects, FAQs, nav, form endpoint |
| `src/data/products.json` | All 95 products: name, category, specs, colour, tone, original description |
| `src/data/legacy-seo.json` | Exact titles, descriptions and H1s from the previous site, keyed by URL |
| `src/data/images.json` | Photo manifest: product galleries, carpet colourways, project galleries, page photos |
| `public/images/` | All photography (WebP, large 1366px and small 440px versions) |
| `public/downloads/` | Maintenance & information guides (.docx). After replacing one, run `python3 scripts/guides-from-docx.py` so the online version (`src/data/guides.json`) matches it word for word |
| `src/data/products.ts` | Product helpers, generated descriptions, box coverage for the calculator |
| `src/pages/` | Routes, which mirror the original site's URL structure |

## Photos & logo

The logo (`src/components/Logo.astro`), favicon and all photography come from the existing site. To add or replace a photo, drop a `.webp` file (plus a `-sm.webp` thumbnail around 440px wide) into `public/images/…` and add or edit its entry in `src/data/images.json`. For products, the first image is the board shot used on cards. Later images are room shots, or colourways for carpets.

## Before going live

1. **Enquiry form:** add a Web3Forms access key (`formAccessKey`) or a Formspree URL (`formEndpoint`) in `src/data/site.ts`. Until then the form opens the visitor's email app, and the build prints a warning.
2. **Box coverage:** `boxCoverage()` in `products.ts` uses typical pack sizes. Update it with real figures.
3. **Copy check:** product descriptions are generated from species and tone. Review them, and the services, FAQ and sustainability text, for accuracy.
4. **Pull the latest edits from the old site:** while the agency's site is still live, product edits made there can be copied across with `python3 scripts/sync-from-live.py` (add `--dry-run` to only see what changed). It syncs product names, descriptions, specs, photos, added/removed products, and the titles and H1s that are kept identical for SEO. Needs Pillow (`pip3 install pillow`). Run it one last time just before switching the domain.

## Improvements over the original

- **Catalogue search and filters:** filter by type, colour tone and herringbone availability. Filters are kept in the URL, so filtered views can be shared.
- **Sample list:** save up to 6 samples from any product and request them all at once. The list carries into the enquiry form.
- **Coverage calculator:** works out area across multiple rooms, adds a waste allowance, and estimates boxes.
- **Comparison table:** solid, engineered, parquetry and hybrid side by side.
- **Live showroom status:** shows whether the showroom is open now, using Melbourne time.
- **Better enquiry form:** multi-select request types, validation, a hidden spam trap (replacing the visible "How old are you?" field), and pre-filling from product pages.
- **Expanded FAQ:** 14 questions (up from 4), searchable and filterable by topic, with FAQ structured data.
- **Readable guides:** the maintenance and information guides can be read online, word for word the same as the downloads, and printed to PDF.
- **SEO:** LocalBusiness, Product, Breadcrumb, Service and FAQ structured data, canonical URLs, Open Graph tags, sitemap and robots.txt.
- **Accessibility:** skip link, keyboard-operable menus, focus-trapped drawer, ARIA states, reduced-motion support.
- **Mobile:** sticky Call / Samples / Enquire bar.
- **Performance:** about 50 KB of HTML per page (the original homepage was 360 KB), no tracking scripts, lazy-loaded and cacheable images.

## SEO: kept identical to the previous site

The site is a drop-in replacement on the same domain:

- **Same URLs** for every page (including odd ones such as `/flooring/tasmanian-driftwwod` and `/projects/south-yarra-apparentment`). Pages have no trailing slash, matching the old canonical URLs.
- **Same `<title>` on every old URL** (from `src/data/legacy-seo.json`), the same homepage meta description, and the same H1 headings.
- **Same wording:** product descriptions, services, categories, projects, About, Showroom, Sustainability and FAQ text carried over. New content is additional only.
- **Same tracking:** Google Tag Manager `GTM-5DLDXN6G` and GA4 `G-R22YQ50297`, plus the same thank-you URL after a form is sent (`/about-us/frequently-asked-questions/contact/thanks`).
- `public/_redirects` holds real 301s for aliases (`/contact`, old sub-sitemaps).

Check before deploying: `npm run build`. All 112 old URLs should exist in `dist/` as `<path>.html`.

## Deploying

**Step-by-step go-live instructions: see [LAUNCH.md](LAUNCH.md).**

- **GitHub Pages (set up):** `.github/workflows/deploy.yml` builds and publishes on every push to `main`. Every deploy runs `npm run check:seo` first and fails if any URL, title or H1 from the previous site has gone missing.
- **Cloudflare Pages (alternative):** build command `npm run build`, output `dist`. On Cloudflare, `public/_redirects` and `public/_headers` give real 301s and cache headers; GitHub Pages ignores them, and `/contact` falls back to an instant forward page.

Useful commands:

```bash
npm run check:seo                                   # after a build: all 112 legacy URLs present and matching
npm run verify:live                                 # check the live site (URLs, canonicals, 404, https, www)
npm run verify:live -- https://<org>.github.io      # check a preview deployment
```

Old photo URLs on the agency's image server (`southern-timber-floors-assets.spicyweb.net.au`) will stop working once their hosting ends. Google Images will pick up the new copies over time.
