import type { APIRoute } from 'astro';
// The previous site split its sitemap into sections that may still be submitted in Google Search Console.
// Serve a sitemap index pointing at the new single sitemap so those submissions keep working.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${new URL('/sitemap.xml', site).href}</loc></sitemap>\n</sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
