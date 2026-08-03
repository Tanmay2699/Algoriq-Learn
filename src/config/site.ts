/**
 * The handful of absolute facts about where this site lives.
 */

const LOCAL_URL = 'http://localhost:3001';

/**
 * A canonical tag pointing at localhost is a total, silent SEO failure, so the site URL is
 * checked rather than assumed.
 *
 * The check keys on the *deployment* being production, not on `NODE_ENV` — a local
 * `next build` also runs with `NODE_ENV=production`, and failing there would mean nobody
 * could build the site without a deploy environment. `DEPLOY_ENV=production` is set by the
 * production pipeline (and `VERCEL_ENV` by Vercel); anywhere else, a missing value falls back
 * to localhost with a warning on stderr so it is visible without being fatal.
 */
function resolveSiteUrl(): string {
  const value = process.env.SITE_URL?.trim();
  const isProdDeploy =
    process.env.DEPLOY_ENV === 'production' || process.env.VERCEL_ENV === 'production';

  if (!value || value.startsWith('http://localhost')) {
    if (isProdDeploy) {
      throw new Error(
        `SITE_URL must be an absolute public URL in a production deployment (got: ${String(value)})`,
      );
    }
    if (!value && typeof console !== 'undefined') {
      console.warn('[website] SITE_URL is unset — canonicals and OG URLs will point at localhost.');
    }
    return value || LOCAL_URL;
  }
  return value.replace(/\/$/, '');
}

export const site = {
  name: 'Algoryq Learn',
  /**
   * The product is Algoryq Learn; the legal entity behind it is not. Keeping the two apart
   * matters in exactly the places a name is load-bearing — the DPA, the sub-processor list
   * and the `Organization` block a crawler reads — where naming a product as the contracting
   * party is wrong on a document somebody may one day rely on.
   */
  legalName: 'Algoryq Technologies Private Limited',
  /** The parent company. Its own site, its own mark; this product carries both. */
  parent: {
    name: 'Algoryq Technologies',
    shortName: 'Algoryq',
    url: 'https://algoryq.com',
    /** The domain the parent's own wordmark advertises. */
    domain: 'algoryq.tech',
  },
  url: resolveSiteUrl(),
  /** The product. Sign-in lives here, not on this site. */
  appUrl: process.env.APP_URL ?? 'https://app.learn.algoryq.com',
  /** A real institute with seeded data, read-only, no signup. */
  sandboxUrl: process.env.SANDBOX_URL ?? 'https://sandbox.learn.algoryq.com',
  // The API host and our own tenant slug are deliberately NOT here: this module reaches the
  // browser, and those two belong to the server. See src/config/server.ts.
  // Product-scoped inbox on the parent's domain: one company, one mail estate, and an
  // address that says which product an enquiry is about without a second domain to run.
  contactEmail: 'learn@algoryq.com',
  securityEmail: 'security@algoryq.com',
  accessibilityEmail: 'accessibility@algoryq.com',
  locale: 'en-IN',
  /** No profiles are claimed until they exist — an invented sameAs is a fabricated claim. */
  sameAs: [] as string[],
} as const;

export type Site = typeof site;
