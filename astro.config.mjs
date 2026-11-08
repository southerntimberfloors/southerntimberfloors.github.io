import { defineConfig } from 'astro/config';

// URLs are identical to the previous site, so no redirects are needed for SEO.
// `build.format: 'file'` emits /about-us.html, which hosts like Cloudflare Pages serve at /about-us
// (no trailing slash), matching the previous site's canonical URLs exactly.
// Real 301 redirects for aliases live in public/_redirects.
export default defineConfig({
  site: 'https://www.southerntimberfloors.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
