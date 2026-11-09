// Checks a deployed copy of the site (preview or live) serves every URL from the previous website
// directly: HTTP 200, no redirects, correct canonical. Also checks sitemap, 404 page and HTTPS.
//
//   npm run verify:live                                   # checks https://www.southerntimberfloors.com
//   npm run verify:live -- https://your-org.github.io     # checks a preview deployment
import { readFileSync } from 'node:fs';

const base = (process.argv[2] ?? 'https://www.southerntimberfloors.com').replace(/\/$/, '');
const SITE = 'https://www.southerntimberfloors.com';
const legacy = JSON.parse(readFileSync(new URL('../src/data/legacy-seo.json', import.meta.url), 'utf8'));
const paths = Object.keys(legacy);

const results = { ok: 0, redirect: [], error: [], canonical: [] };
async function check(path) {
  try {
    const res = await fetch(base + path, { redirect: 'manual', headers: { 'User-Agent': 'stf-launch-check' } });
    if (res.status >= 300 && res.status < 400) return results.redirect.push(`${path} → ${res.status} ${res.headers.get('location')}`);
    if (res.status !== 200) return results.error.push(`${path} → HTTP ${res.status}`);
    const html = await res.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const want = path === '/' ? `${SITE}/` : `${SITE}${path}`;
    if (canonical !== want) return results.canonical.push(`${path} → canonical ${canonical}`);
    results.ok++;
  } catch (e) {
    results.error.push(`${path} → ${e.message}`);
  }
}

console.log(`Checking ${paths.length} URLs on ${base} …`);
for (let i = 0; i < paths.length; i += 8) await Promise.all(paths.slice(i, i + 8).map(check));

const extra = [];
const sm = await fetch(`${base}/sitemap.xml`).catch(() => null);
extra.push(sm?.ok ? '✓ /sitemap.xml' : '✗ /sitemap.xml not reachable');
const nf = await fetch(`${base}/this-page-should-not-exist-${Date.now()}`, { redirect: 'manual' }).catch(() => null);
extra.push(nf?.status === 404 ? '✓ unknown pages return 404' : `✗ unknown pages return ${nf?.status}`);
if (base.startsWith('https://www.')) {
  const apex = await fetch(base.replace('://www.', '://'), { redirect: 'manual' }).catch(() => null);
  const loc = apex?.headers.get('location') ?? '';
  extra.push(apex && apex.status >= 300 && apex.status < 400 && loc.startsWith(base) ? '✓ bare domain redirects to www' : `✗ bare domain → ${apex?.status} ${loc}`);
  const http = await fetch(base.replace('https://', 'http://'), { redirect: 'manual' }).catch(() => null);
  extra.push(http && [301, 308].includes(http.status) ? '✓ http redirects to https' : `✗ http → ${http?.status}`);
}

console.log(`\n✓ ${results.ok}/${paths.length} URLs served directly with the correct canonical`);
for (const [label, list] of [['Redirected (should be served directly)', results.redirect], ['Errors', results.error], ['Wrong canonical', results.canonical]]) {
  if (list.length) console.log(`\n✗ ${label} (${list.length}):\n  ` + list.slice(0, 30).join('\n  '));
}
console.log('\n' + extra.join('\n'));
process.exit(results.ok === paths.length && extra.every((l) => l.startsWith('✓')) ? 0 : 1);
