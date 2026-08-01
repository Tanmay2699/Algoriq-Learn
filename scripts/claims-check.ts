/**
 * The gate that keeps docs/17-EVIDENCE-AND-CLAIMS-POLICY.md real.
 *
 * Three weeks before launch somebody will want a number that is not in the registry, or a
 * screenshot that is a year old. This is what says no when nobody is in the mood to.
 *
 *   pnpm claims:check
 *
 * ### Where the evidence lives
 *
 * Every `evidence.path` is a path *into the product monorepo* — `apps/api/src/modules/learn`,
 * `docs/12-PROGRESS-TRACKER.md` — because that is where the thing being claimed actually is.
 * This site used to be a folder inside that repository, so `..` found it. Split out, it does
 * not, and a check that cannot see its evidence must say so rather than pass:
 *
 *   AKECHI_PRODUCT_ROOT=../AkechiLMS pnpm claims:check
 *
 * Without it, sections 2–4 still run in full and section 1 reports how many claims went
 * unverified. It exits 0 in that state — a repository that cannot reach the product must still
 * be buildable — so read the banner rather than the exit code when the paths are the point.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { claims, type Claim } from '../src/lib/claims';

const ROOT = process.cwd();
const PRODUCT_ROOT = resolve(process.env.AKECHI_PRODUCT_ROOT ?? join(ROOT, '..'));
/** `apps/api` is the product's backend and exists in no other checkout. */
const productRepoPresent = existsSync(join(PRODUCT_ROOT, 'apps', 'api'));
const failures: string[] = [];
const warnings: string[] = [];
let unverifiedPaths = 0;

/** Today, from the environment rather than the wall clock, so a CI run is reproducible. */
const TODAY = new Date(process.env.CLAIMS_TODAY ?? '2026-07-31');

function daysOld(date: string): number {
  return Math.floor((TODAY.getTime() - new Date(date).getTime()) / 86_400_000);
}

/* ---------------------------------------------- 1. every claim has real evidence */

for (const [id, entry] of Object.entries(claims as Record<string, Claim>)) {
  if (!entry.statement || entry.statement.length < 8) {
    failures.push(`${id}: has no usable statement.`);
  }

  const { evidence } = entry;
  if (!evidence.path && !evidence.command && !evidence.url && !evidence.method) {
    failures.push(`${id}: evidence points at nothing. A claim with no pointer is an opinion.`);
  }

  if (evidence.path) {
    if (!productRepoPresent) {
      unverifiedPaths += 1;
    } else if (!existsSync(join(PRODUCT_ROOT, evidence.path))) {
      failures.push(`${id}: evidence path "${evidence.path}" does not exist in the product repository.`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.verifiedAt)) {
    failures.push(`${id}: verifiedAt "${entry.verifiedAt}" is not a date.`);
  }

  const age = daysOld(entry.verifiedAt);
  if (entry.reverify === 'quarterly' && age > 120) {
    failures.push(`${id}: last verified ${age} days ago; quarterly claims expire at 120.`);
  }
  if (entry.secondHand) {
    warnings.push(
      `${id}: taken from MEMORY.md rather than reproduced. Re-derive with \`${evidence.command ?? '—'}\` before it goes on a new page.`,
    );
  }
}

/* --------------------------------------- 2. every referenced claim id exists */

const SRC = join(ROOT, 'src');
const referenced = new Set<string>();

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.tsx?$/.test(name)) continue;
    const source = readFileSync(full, 'utf8');
    // A capture group that matched is a string; the guard is for the type system, not for us.
    for (const match of source.matchAll(/evidence="([a-z0-9-]+)"/g)) {
      if (match[1]) referenced.add(match[1]);
    }
    for (const match of source.matchAll(/<ClaimText id="([a-z0-9-]+)"/g)) {
      if (match[1]) referenced.add(match[1]);
    }
  }
}
walk(SRC);

for (const id of referenced) {
  if (!(id in claims)) {
    failures.push(`A component references the claim "${id}", which is not in the registry.`);
  }
}

/* ------------------------------------------ 3. the permission catalogue is real */

const catalogPath = join(SRC, 'content', 'permission-catalog.json');
if (!existsSync(catalogPath)) {
  failures.push('permission-catalog.json is missing. Run `pnpm sync:catalog`.');
} else {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as {
    count: number;
    permissions: unknown[];
    syncedAt: string;
  };
  if (catalog.count !== catalog.permissions.length) {
    failures.push('permission-catalog.json: count does not match the number of permissions.');
  }
  if (catalog.count !== claims['permission-keys'].value) {
    failures.push(
      `The catalogue holds ${catalog.count} keys but the claim says ${String(claims['permission-keys'].value)}. One of them is wrong.`,
    );
  }
  if (daysOld(catalog.syncedAt) > 120) {
    warnings.push(`permission-catalog.json was synced ${daysOld(catalog.syncedAt)} days ago.`);
  }
}

/* --------------------------------------------- 4. no unearned social proof */

const proof = readFileSync(join(SRC, 'components', 'sections', 'proof.tsx'), 'utf8');
for (const name of ['testimonials', 'caseStudies', 'awards', 'customerLogos']) {
  const declared = new RegExp(`export const ${name}[^=]*= \\[\\s*\\]`).test(proof);
  if (!declared) {
    warnings.push(
      `${name} is no longer empty. That is good news — check every entry has written permission from a named person (docs/17 §6).`,
    );
  }
}

/* ----------------------------------------------------------------- report */

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (unverifiedPaths > 0) {
  console.warn(
    `\n  NOT VERIFIED  ${unverifiedPaths} claim(s) point at a file in the product monorepo, which is not\n` +
      `                reachable from here. Their existence was not checked. Re-run with\n` +
      `                AKECHI_PRODUCT_ROOT=<path to the product checkout> to close this gap.\n`,
  );
}

if (failures.length > 0) {
  console.error(`\n${failures.length} claim problem(s):\n`);
  for (const failure of failures) console.error(`  fail  ${failure}`);
  console.error('\nSee docs/17-EVIDENCE-AND-CLAIMS-POLICY.md.\n');
  process.exit(1);
}

const verdict = unverifiedPaths > 0 ? `${unverifiedPaths} unverified (see above)` : 'all evidenced';
console.log(
  `claims:check — ${Object.keys(claims).length} claims, ${referenced.size} referenced in components, ${verdict}.`,
);
