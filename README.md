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
| `src/data/products.json` | All 85 products: name, category, specs, colour, tone, original description |
| `src/data/legacy-seo.json` | Exact titles, descriptions and H1s from the previous site, keyed by URL |
| `src/data/images.json` | Photo manifest: product galleries, carpet colourways, project galleries, page photos |
| `public/images/` | All photography (WebP, large 1366px and small 440px versions) |
| `public/downloads/` | Care guides and fact sheets (.docx) |
| `src/data/products.ts` | Product helpers, generated descriptions, box coverage for the calculator |
| `src/pages/` | Routes, which mirror the original site's URL structure |

## Photos & logo

The logo (`src/components/Logo.astro`), favicon and all photography come from the existing site. To add or replace a photo, drop a `.webp` file (plus a `-sm.webp` thumbnail around 440px wide) into `public/images/…` and add or edit its entry in `src/data/images.json`. For products, the first image is the board shot used on cards. Later images are room shots, or colourways for carpets.

## Before going live

1. **Enquiry form:** set `business.formEndpoint` in `src/data/site.ts` to a form backend (Formspree, Basin, Netlify Forms, or your own API). Until then the form opens the visitor's email app with the enquiry pre-filled.
2. **Box coverage:** `boxCoverage()` in `products.ts` uses typical pack sizes. Update it with real figures.
3. **Copy check:** product descriptions are generated from species and tone. Review them, and the services, FAQ and sustainability text, for accuracy.

## Improvements over the original

- **Catalogue search and filters:** filter by type, colour tone and herringbone availability. Filters are kept in the URL, so filtered views can be shared.
- **Sample list:** save up to 6 samples from any product and request them all at once. The list carries into the enquiry form.
- **Coverage calculator:** works out area across multiple rooms, adds a waste allowance, and estimates boxes.
- **Comparison table:** solid, engineered, parquetry and hybrid side by side.
- **Live showroom status:** shows whether the showroom is open now, using Melbourne time.
- **Better enquiry form:** multi-select request types, validation, a hidden spam trap (replacing the visible "How old are you?" field), and pre-filling from product pages.
- **Expanded FAQ:** 14 questions (up from 4), searchable and filterable by topic, with FAQ structured data.
- **Readable guides:** care and installation guides are web pages that can be printed to PDF.
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

## Deploying (Cloudflare Pages, free)

1. Push this repo to GitHub, then in Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
2. Build command `npm run build`, output directory `dist`.
3. Check the `*.pages.dev` preview URL.
4. **Before switching DNS:** copy every existing DNS record, especially **MX/TXT records for email**. Lower TTLs a day ahead.
5. Add the custom domain `www.southerntimberfloors.com` in Pages, and redirect the bare domain to `www`. The canonical URLs use `www`.
6. After going live, submit `https://www.southerntimberfloors.com/sitemap.xml` in Google Search Console, then watch the Pages and 404 reports for 2–4 weeks.

Old photo URLs on the agency's image server (`southern-timber-floors-assets.spicyweb.net.au`) will stop working once their hosting ends. Google Images will pick up the new copies over time.
