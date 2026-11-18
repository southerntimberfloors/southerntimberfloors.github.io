// Everything the header search can find, built with the site. Loaded the first time someone opens search.
import type { APIRoute } from 'astro';
import { products } from '../data/products';
import guides from '../data/guides.json';
import { categories, categoryOrder, faqText, faqs, paths, projectSubtitle, projects, services } from '../data/site';

export type SearchEntry = { t: string; s: string; u: string; k: string; i?: string; x?: string };

export const GET: APIRoute = () => {
  const entries: SearchEntry[] = [
    ...products.map((p) => ({
      t: p.name,
      s: [categories[p.category].name, p.category !== 'hybrid' ? p.species : null].filter(Boolean).join(' · '),
      u: `/flooring/${p.slug}`,
      k: 'Product',
      i: p.images[0]?.thumb,
      x: [p.pattern, p.herringbone ? 'herringbone' : '', p.specs.map(([, v]) => v).join(' ')].join(' '),
    })),
    ...categoryOrder.map((k) => ({ t: categories[k].name, s: categories[k].short, u: categories[k].path, k: 'Range' })),
    { t: 'All flooring', s: 'Browse and filter the whole range', u: '/timber', k: 'Range' },
    ...services.map((s) => ({ t: s.name, s: s.summary[0]?.slice(0, 90) ?? '', u: `/our-services/${s.slug}`, k: 'Service', x: s.body.join(' ') })),
    ...projects.map((p) => ({ t: p.name, s: projectSubtitle(p), u: `/projects/${p.slug}`, k: 'Project', x: p.story.join(' ') })),
    ...Object.entries(guides as Record<string, { title: string; subtitle?: string; eyebrow: string }>).map(([slug, g]) => ({
      t: g.title,
      s: g.subtitle ?? g.eyebrow,
      u: `/guides/${slug}`,
      k: 'Guide',
      x: 'maintenance care cleaning information guide fact sheet',
    })),
    { t: 'Maintenance & Information Guides', s: 'Care, cleaning and installation guides', u: paths.catalogues, k: 'Page', x: 'download technical sheets' },
    { t: 'Mornington Showroom', s: 'Visit us and see the full range', u: paths.showroom, k: 'Page', x: 'address hours visit location map' },
    { t: 'About Us', s: 'Established in 2005 on the Mornington Peninsula', u: '/about-us', k: 'Page' },
    { t: 'Sustainability', s: 'Responsible timber sourcing', u: paths.sustainability, k: 'Page' },
    { t: 'Contact Us', s: 'Enquiries, samples and quotes', u: paths.contact, k: 'Page', x: 'enquire email phone quote samples' },
    { t: 'Projects', s: 'See how our flooring has transformed homes', u: '/projects', k: 'Page', x: 'gallery inspiration' },
    { t: 'Our Services', s: 'Consultations, installation, sanding and polishing', u: '/our-services', k: 'Page' },
    ...faqs.map((f) => ({ t: f.q, s: 'FAQ', u: paths.faq, k: 'FAQ', x: f.a.map(faqText).join(' ') })),
  ];
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
};
