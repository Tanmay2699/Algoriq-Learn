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
  name: 'Akechi',
  legalName: 'Akechi',
  url: resolveSiteUrl(),
  /** The product. Sign-in lives here, not on this site. */
  appUrl: process.env.APP_URL ?? 'https://app.akechi.com',
  /** A real institute with seeded data, read-only, no signup. */
  sandboxUrl: process.env.SANDBOX_URL ?? 'https://sandbox.akechi.com',
  // The API host and our own tenant slug are deliberately NOT here: this module reaches the
  // browser, and those two belong to the server. See src/config/server.ts.
  contactEmail: 'hello@akechi.com',
  securityEmail: 'security@akechi.com',
  accessibilityEmail: 'accessibility@akechi.com',
  locale: 'en-IN',
  /** No profiles are claimed until they exist — an invented sameAs is a fabricated claim. */
  sameAs: [] as string[],
} as const;

export type Site = typeof site;
