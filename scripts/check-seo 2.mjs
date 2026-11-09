// Verifies the built site (dist/) still serves every URL from the previous website with the
// same <title>, canonical URL and H1. Run after `npm run build`. Exits non-zero on any mismatch.
import { readFileSync, existsSync } from 'node:fs';

const SITE = 'https://www.southerntimberfloors.com';
const legacy = JSON.parse(readFileSync(new URL('../src/data/legacy-seo.json', import.meta.url), 'utf8'));

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const text = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const problems = [];
for (const [path, want] of Object.entries(legacy)) {
  const file = path === '/' ? 'dist/index.html' : `dist${path}.html`;
  if (!existsSync(file)) { problems.push(`${path}: missing (${file})`); continue; }
  const html = readFileSync(file, 'utf8');
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  const wantCanonical = path === '/' ? `${SITE}/` : `${SITE}${path}`;
  if (title !== want.title) problems.push(`${path}: title "${title}" ≠ "${want.title}"`);
  if (canonical !== wantCanonical) problems.push(`${path}: canonical ${canonical} ≠ ${wantCanonical}`);
  if (want.h1 && h1 !== text(want.h1)) problems.push(`${path}: h1 "${h1}" ≠ "${want.h1}"`);
}

if (problems.length) {
  console.error(`✗ SEO check failed (${problems.length} problem(s)):\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ SEO check passed: all ${Object.keys(legacy).length} URLs from the previous site are present with matching title, canonical and H1.`);
