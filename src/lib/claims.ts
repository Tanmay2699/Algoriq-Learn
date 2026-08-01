/**
 * The claims registry — docs/17-EVIDENCE-AND-CLAIMS-POLICY.md.
 *
 * Every number and capability statement that appears on this site is registered here with a
 * pointer to something a stranger could check. `pnpm claims:check` fails the build on an
 * orphan, and `<StatBlock>` does not compile without an `evidence` key, so the policy is
 * carried by the type system rather than by whoever is reviewing at 6pm before a launch.
 *
 * `verifiedAt` is the date the evidence was last actually run or read. `reverify: 'per-release'`
 * means it must be re-derived whenever the product ships; 'quarterly' is for structural facts
 * that do not move with a release.
 */

export type EvidenceKind = 'code' | 'command' | 'doc' | 'url' | 'measurement';

export interface Evidence {
  kind: EvidenceKind;
  /** Repository-relative path. Checked for existence by `claims:check`. */
  path?: string;
  /** A command that reproduces the value. */
  command?: string;
  /** A public URL a visitor could open. */
  url?: string;
  /** How the measurement was taken, for `kind: 'measurement'`. */
  method?: string;
}

export interface Claim {
  /** The number, when there is one. Absent for capability and absence claims. */
  value?: number | string;
  /** How it reads in copy. Kept here so the same claim is worded the same everywhere. */
  statement: string;
  evidence: Evidence;
  verifiedAt: string;
  reverify: 'per-release' | 'quarterly' | 'never';
  /**
   * True when the value could not be reproduced from the working tree alone and was taken
   * from the repository's own MEMORY.md. These must be re-derived before they are trusted.
   */
  secondHand?: boolean;
}

const AUTHZ = 'packages/authz/src/catalog.ts';
const SCHEMA = 'apps/api/prisma/schema.prisma';

export const claims = {
  'api-modules': {
    value: 31,
    statement: '31 backend modules',
    evidence: { kind: 'command', command: 'ls apps/api/src/modules | wc -l' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'api-routes': {
    value: 497,
    statement: '497 API routes',
    evidence: {
      kind: 'command',
      command:
        "grep -rhoE \"@(Get|Post|Put|Patch|Delete)\\(\" apps/api/src/modules --include=*.controller.ts | wc -l",
    },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'api-controllers': {
    value: 53,
    statement: '53 controllers',
    evidence: { kind: 'command', command: "find apps/api/src/modules -name '*.controller.ts' | wc -l" },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'prisma-models': {
    value: 135,
    statement: '135 database models',
    evidence: { kind: 'command', path: SCHEMA, command: "grep -c '^model ' apps/api/prisma/schema.prisma" },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  migrations: {
    value: 61,
    statement: '61 committed migrations',
    evidence: { kind: 'command', command: 'ls apps/api/prisma/migrations | wc -l' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'web-routes': {
    value: 78,
    statement: '78 screens',
    evidence: { kind: 'command', command: "find apps/web/src/app -name page.tsx | wc -l" },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'permission-keys': {
    value: 272,
    statement: '272 permission keys',
    evidence: { kind: 'code', path: AUTHZ, command: 'pnpm authz:check' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'permission-keys-enforced': {
    value: 264,
    statement: '264 of them enforced on a route',
    evidence: { kind: 'command', command: 'pnpm authz:check' },
    verifiedAt: '2026-07-28',
    reverify: 'per-release',
    secondHand: true,
  },
  'role-templates': {
    value: 11,
    statement: '11 role templates, all of them editable',
    evidence: { kind: 'code', path: AUTHZ },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'rls-tables': {
    value: 114,
    statement: 'row-level security forced on 114 tables',
    evidence: {
      kind: 'code',
      path: 'apps/api/prisma/rls.ts',
      command: 'pnpm --filter @akechi/api db:rls:check',
    },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'rls-exemptions': {
    value: 13,
    statement: '13 named, reasoned exemptions',
    evidence: { kind: 'code', path: 'apps/api/prisma/rls.ts' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'rls-force': {
    statement:
      'the policy is applied with both ENABLE and FORCE, and the application connects as a role that is neither the owner nor a superuser',
    evidence: { kind: 'code', path: 'apps/api/prisma/rls.ts' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'audit-hash-chain': {
    statement: 'the audit log is a hash chain, and erasure tombstones rather than rewriting it',
    evidence: { kind: 'code', path: 'apps/api/src/modules/audit/service/audit.service.ts' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'deny-by-default': {
    statement:
      'every route carries a permission key or an explicit @Public(), and a coverage check fails the build otherwise',
    evidence: { kind: 'command', command: 'pnpm authz:check' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'locales': {
    value: 8,
    statement: '8 locale tags across 5 catalogues, right-to-left included',
    evidence: { kind: 'code', path: 'packages/contracts/src/common/locale.ts' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'unit-tests': {
    value: 1316,
    statement: '1,316 unit tests',
    evidence: { kind: 'command', command: 'pnpm test' },
    verifiedAt: '2026-07-28',
    reverify: 'per-release',
    secondHand: true,
  },
  'integration-suites': {
    value: 54,
    statement: '54 integration suites against a real Postgres',
    evidence: { kind: 'command', command: 'pnpm --filter @akechi/api test:integration' },
    verifiedAt: '2026-07-28',
    reverify: 'per-release',
    secondHand: true,
  },
  'e2e-specs': {
    value: 52,
    statement: '52 browser specs, including accessibility scans at 360 pixels',
    evidence: { kind: 'command', command: 'pnpm test:e2e' },
    verifiedAt: '2026-07-28',
    reverify: 'per-release',
    secondHand: true,
  },
  'no-cloud-sdk': {
    statement: 'no cloud-provider SDK is imported in feature code — storage, mail, search, AI and cache are ports',
    evidence: { kind: 'doc', path: 'CLAUDE.md' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'docker-compose': {
    statement: 'docker compose up boots the entire platform with no cloud account',
    evidence: { kind: 'code', path: 'docker-compose.yml' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'a11y-ci': {
    statement: 'accessibility failures break the build, at 360 pixels among other widths',
    evidence: { kind: 'doc', path: 'docs/09-TESTING-QA.md' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'public-verification': {
    statement: 'a certificate can be verified by anyone holding the code, with no account',
    evidence: { kind: 'code', path: 'apps/web/src/app/verify/[code]/page.tsx' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'web-to-lead': {
    statement:
      'the only unauthenticated write in the admissions module, scoped to what a stranger may decide',
    evidence: { kind: 'code', path: 'apps/api/src/modules/crm/controller/public-lead.controller.ts' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'offline-sync': {
    statement:
      'progress captured without a connection is queued on the device and replayed in order, idempotently',
    evidence: { kind: 'code', path: 'apps/api/src/modules/learn' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'no-payment-gateway': {
    statement: 'there is no payment-gateway adapter — you can raise and reconcile invoices, not take a card',
    evidence: { kind: 'doc', path: 'MEMORY.md' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'no-sso': {
    statement: 'SAML, OIDC and SCIM are not built; sign-in with Google, Microsoft and GitHub is',
    evidence: { kind: 'doc', path: 'docs/12-PROGRESS-TRACKER.md' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'no-meeting-adapter': {
    statement: 'there is no meeting-provider adapter — you paste the link',
    evidence: { kind: 'doc', path: 'docs/12-PROGRESS-TRACKER.md' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'no-soc2': {
    statement:
      'we are not SOC 2 certified. The policy set exists and the audit log produces the evidence; the audit does not.',
    evidence: { kind: 'doc', path: 'docs/15-SOC2-POLICY-SET.md' },
    verifiedAt: '2026-07-31',
    reverify: 'quarterly',
  },
  'single-worker': {
    statement:
      'the background worker is deliberately one process — its jobs claim no rows, so a second copy would double-send',
    evidence: { kind: 'doc', path: 'MEMORY.md' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'plan-starter-seats': {
    value: 100,
    statement: '100 seats on the free tier',
    evidence: {
      kind: 'code',
      path: 'apps/api/prisma/migrations/20260726160000_plans_and_tenant_settings/migration.sql',
    },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
  'site-third-parties': {
    value: 0,
    statement: 'this page makes no request to any host but this one',
    evidence: { kind: 'measurement', method: 'src/test/e2e/no-third-party.spec.ts, every route' },
    verifiedAt: '2026-07-31',
    reverify: 'per-release',
  },
} satisfies Record<string, Claim>;

export type ClaimId = keyof typeof claims;

/**
 * `satisfies` above keeps each entry's literal type — which is what makes a typo in a
 * `verifiedAt` visible — but it also means the union has no common `value` member. This
 * widens to the interface for the accessors, deliberately and in one place.
 */
const registry = claims as Record<ClaimId, Claim>;

export function claim(id: ClaimId): Claim {
  return registry[id];
}

/** The rendered form of a countable claim, with Indian digit grouping. */
export function claimValue(id: ClaimId): string {
  const value = registry[id].value;
  if (value === undefined) return '';
  return typeof value === 'number' ? value.toLocaleString('en-IN') : value;
}
