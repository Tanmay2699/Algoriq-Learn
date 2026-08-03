/**
 * Copies the product's permission catalogue into this site as JSON.
 *
 * A copy rather than an import: `@akechi/authz` is a server-side guard library and pulling it
 * into a static marketing bundle would drag its dependencies with it. A copy has one danger —
 * silent drift — so this script exists to make the copy a reviewable diff, and
 * `claims:check` fails if the JSON is missing or empty.
 *
 * The source lives in the product monorepo, which this repository does not contain, so the path
 * is given rather than assumed:
 *
 *   ALGORYQ_CATALOG=../AkechiLMS/packages/authz/src/catalog.ts pnpm sync:catalog
 *
 * The default below is the layout this site was split out of — `website/..` — and still works
 * for anyone running it from inside that monorepo.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CATALOG = process.env.ALGORYQ_CATALOG
  ? resolve(process.env.ALGORYQ_CATALOG)
  : join(process.cwd(), '..', 'packages', 'authz', 'src', 'catalog.ts');

if (!existsSync(CATALOG)) {
  throw new Error(
    `No permission catalogue at ${CATALOG}. It lives in the product monorepo — set ALGORYQ_CATALOG to its path:\n` +
      '  ALGORYQ_CATALOG=../AkechiLMS/packages/authz/src/catalog.ts pnpm sync:catalog',
  );
}
const OUT = join(process.cwd(), 'src', 'content', 'permission-catalog.json');

const source = readFileSync(CATALOG, 'utf8');

/**
 * Matches `def('module.resource.action', 'A description')`, including descriptions that
 * contain an escaped quote or a typographic apostrophe.
 */
const DEF = /def\(\s*'([a-z]+)\.([a-zA-Z-]+)\.([a-zA-Z-]+)'\s*,\s*'((?:[^'\\]|\\.)*)'/g;

const permissions: { key: string; module: string; description: string }[] = [];
let match: RegExpExecArray | null;
while ((match = DEF.exec(source)) !== null) {
  const [, module, resource, action, description] = match;
  // Every group is required by the pattern; the guard is for the type system, not for us.
  if (!module || !resource || !action || description === undefined) continue;
  permissions.push({
    key: `${module}.${resource}.${action}`,
    module,
    description: description.replace(/\\'/g, "'"),
  });
}

if (permissions.length === 0) {
  throw new Error(
    'Parsed zero permissions from the catalogue. The shape of def() has changed — fix this script rather than shipping an empty catalogue.',
  );
}

const modules = [...new Set(permissions.map((p) => p.module))].sort();

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      source: 'packages/authz/src/catalog.ts',
      syncedAt: new Date().toISOString().slice(0, 10),
      count: permissions.length,
      modules,
      permissions,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(`Wrote ${permissions.length} permissions across ${modules.length} modules to ${OUT}`);
