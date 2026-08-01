/**
 * The price list.
 *
 * These values are the rows the product's own migration inserts into `plans`
 * (`apps/api/prisma/migrations/20260726160000_plans_and_tenant_settings/migration.sql`) —
 * not numbers a marketing page decided on. Money is integer minor units plus an ISO 4217
 * code, exactly as the product stores it, because a float here would be the one place in the
 * whole system where money is a float.
 *
 * `/api/plans` will serve these from the product once `GET /public/plans` exists (task W2.6).
 * Until then the pricing page renders this snapshot and says so — a page that silently holds
 * a second copy of a price is a page that will eventually disagree with the database.
 */

export interface Plan {
  key: string;
  name: string;
  description: string;
  priceMinor: number;
  currency: 'INR';
  interval: 'MONTHLY' | 'YEARLY';
  /** null = unlimited, negotiated. */
  maxSeats: number | null;
  maxCourses: number | null;
  storageBytes: number | null;
  aiTokensPerMonth: number | null;
  isPublic: boolean;
  sortOrder: number;
  /** How to start. There is no checkout, and the page says so rather than implying one. */
  cta: { label: string; href: string };
}

export const plansSource = {
  kind: 'snapshot' as const,
  file: 'apps/api/prisma/migrations/20260726160000_plans_and_tenant_settings/migration.sql',
  capturedAt: '2026-07-31',
};

export const plans: Plan[] = [
  {
    key: 'starter',
    name: 'Starter',
    description: 'For a single campus getting started.',
    priceMinor: 0,
    currency: 'INR',
    interval: 'MONTHLY',
    maxSeats: 100,
    maxCourses: 25,
    storageBytes: 5_368_709_120,
    aiTokensPerMonth: 200_000,
    isPublic: true,
    sortOrder: 1,
    cta: { label: 'Start free', href: '/demo?intent=starter' },
  },
  {
    key: 'growth',
    name: 'Growth',
    description: 'For a growing institute with several branches.',
    priceMinor: 1_499_900,
    currency: 'INR',
    interval: 'MONTHLY',
    maxSeats: 1_000,
    maxCourses: 250,
    storageBytes: 107_374_182_400,
    aiTokensPerMonth: 2_000_000,
    isPublic: true,
    sortOrder: 2,
    cta: { label: 'Talk to us', href: '/demo?intent=growth' },
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    description: 'Unlimited scale, negotiated commercially.',
    priceMinor: 0,
    currency: 'INR',
    interval: 'YEARLY',
    maxSeats: null,
    maxCourses: null,
    storageBytes: null,
    aiTokensPerMonth: null,
    isPublic: true,
    sortOrder: 3,
    cta: { label: 'Talk to us', href: '/demo?intent=enterprise' },
  },
];

/** Integer minor units → a rupee string. Never a float, anywhere. */
export function formatMoney(minor: number, currency: 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

export function formatBytes(bytes: number | null): string {
  if (bytes === null) return 'Unlimited';
  const gib = bytes / 1024 ** 3;
  return `${gib >= 100 ? Math.round(gib) : gib.toFixed(0)} GiB`;
}

export function formatLimit(value: number | null): string {
  return value === null ? 'Unlimited' : value.toLocaleString('en-IN');
}

/** What every plan includes. Tiering security is a dark pattern; we do not. */
export const includedEverywhere: string[] = [
  'Row-level tenant isolation in the database',
  'The full permission model — roles, scopes, per-user overrides, delegation',
  'The hash-chained audit log, with retention, legal holds and subject requests',
  'Your own branding and your own domain',
  'The API, webhooks and API keys',
  'CSV import and export of everything',
  'WCAG 2.2 AA, and the conformance statement behind it',
  'The right to self-host — the compose file boots the whole stack',
];
