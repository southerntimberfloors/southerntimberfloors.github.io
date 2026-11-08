import type { APIRoute } from 'astro';

import { products } from '../data/products';
import { categories, categoryOrder, projects, services } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://www.southerntimberfloors.com');
  const paths = new Set<string>([
    '/', '/timber', '/our-services', '/projects', '/about-us', '/about-us/mornington-showroom', '/about-us/catalogues-guides',
    '/about-us/sustainability', '/about-us/frequently-asked-questions', '/about-us/frequently-asked-questions/contact',
    '/guides/engineered-care', '/guides/hybrid-care', '/guides/installation-care',
    ...categoryOrder.map((k) => categories[k].path),
    ...services.map((s) => `/our-services/${s.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
    ...products.map((p) => `/flooring/${p.slug}`),
  ]);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...paths]
    .map((p) => `  <url><loc>${new URL(p, base).href}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
