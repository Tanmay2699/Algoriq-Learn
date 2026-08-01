/**
 * Walks the built HTML and fails on a broken internal link or an orphaned page.
 *
 * `typedRoutes` already stops a link to a route that does not exist, but it cannot see a route
 * that exists and is reachable from nowhere — which is the more common failure, and the one
 * that quietly loses a page from the crawl graph.
 *
 *   pnpm --filter @akechi/website build && pnpm --filter @akechi/website links:check
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const NEXT = join(process.cwd(), '.next');
const OUT = join(NEXT, 'server', 'app');

if (!existsSync(OUT)) {
  console.error('No build output. Run `pnpm build` first.');
  process.exit(1);
}

/** Every route the build produced, as a URL path. */
const routes = new Set<string>();
const htmlFiles: string[] = [];

/**
 * Statically rendered routes leave an .html file; dynamic ones (here, only /demo, which reads
 * a search parameter) do not. Reading the route manifest as well means the checker sees the
 * whole route table rather than only the prerendered part of it — otherwise every link to
 * /demo, which is the site's main call to action, reads as broken.
 */
const manifestPath = join(NEXT, 'app-path-routes-manifest.json');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, string>;
  for (const route of Object.values(manifest)) {
    if (route.includes('[')) continue; // dynamic segments are covered by their generated pages
    routes.add(route);
  }
}

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    htmlFiles.push(full);

    const route = `/${relative(OUT, full).split(sep).join('/').replace(/\.html$/, '')}`;
    routes.add(route === '/index' ? '/' : route);
  }
}
walk(OUT);

// Routes that exist but are deliberately not linked from a page.
const ALLOWED_ORPHANS = new Set([
  '/_not-found',
  // Machine-readable, referenced by robots.txt and by the browser rather than by a link.
  '/sitemap.xml',
  '/robots.txt',
  // The one server route. Posted to by the demo form, never navigated to.
  '/api/lead',
  // /customers stays out of the navigation until it has a real case study (ADR 0004). It is
  // still reachable — /why-akechi and /about both link it — so it is not listed here.
]);

const linked = new Set<string>();
const broken: { page: string; href: string }[] = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = `/${relative(OUT, file).split(sep).join('/').replace(/\.html$/, '')}`;

  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    // The capture group matched or there would be no match; the guard is for the type system.
    if (!match[1]) continue;
    const href = match[1].replace(/\/$/, '') || '/';
    if (href.startsWith('/_next') || href.startsWith('/api/') || href.startsWith('/fonts')) continue;
    if (/\.(svg|png|ico|xml|txt|webmanifest)$/.test(href)) continue;

    linked.add(href);
    if (!routes.has(href)) {
      broken.push({ page: page === '/index' ? '/' : page, href });
    }
  }

  if (html.includes('http://') && !html.includes('http://localhost') && !html.includes('http://www.w3.org')) {
    console.warn(`  warn  ${page} contains a plain http:// link.`);
  }
}

const orphans = [...routes].filter(
  (route) => route !== '/' && !linked.has(route) && !ALLOWED_ORPHANS.has(route),
);

let failed = false;

if (broken.length > 0) {
  failed = true;
  console.error(`\n${broken.length} broken internal link(s):`);
  for (const item of broken) console.error(`  fail  ${item.page} → ${item.href}`);
}

if (orphans.length > 0) {
  failed = true;
  console.error(`\n${orphans.length} orphaned page(s) — reachable from nowhere:`);
  for (const orphan of orphans) console.error(`  fail  ${orphan}`);
  console.error('\nLink it from the navigation or a parent page, or add it to ALLOWED_ORPHANS with a reason.');
}

if (failed) process.exit(1);

console.log(`links:check — ${routes.size} routes, ${linked.size} internal targets, no orphans, nothing broken.`);
