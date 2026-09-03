import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { NextConfig } from 'next';

/**
 * This repository's root, which is also the app's root.
 *
 * Stated rather than inferred, for the same reason the product's config states it: Next walks
 * up looking for a lockfile, and a stray one in a home directory silently changes which files
 * are traced.
 */
const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * The Content-Security-Policy is the site's single most load-bearing header.
 *
 * `default-src 'self'` is a claim we make on /security and on /legal/cookies, and the whole
 * "zero third-party origins" decision (ADR 0007) exists to keep it true. It is ENFORCED here,
 * not report-only.
 *
 * ### Why `'unsafe-inline'` is on script-src, honestly
 *
 * The first version of this file shipped `script-src 'self'` with nothing else. It looked
 * stricter and it white-screened every page: the App Router streams its payload through inline
 * `<script>` tags, the browser blocked all of them, and the served HTML had a title, a body and
 * nothing rendered inside it. The product's own config carries a comment warning about exactly
 * this — "a wrong CSP is indistinguishable from a broken application" — and it was written
 * anyway, then caught by a browser test rather than by reading. That is the argument for the
 * browser test.
 *
 * The proper fix is a per-request nonce, which Next supports — and which requires dynamic
 * rendering on every page that uses it. This site is 48 static files on a CDN; trading that for
 * a directive would cost far more than it buys, because the threat this directive defends
 * against is not present here: there is no user-generated content, no authentication, no
 * session, no cookie, and no third-party origin. Inline script cannot be injected by anybody
 * but us, and `'self'` still blocks loading a script from anywhere else — which is the
 * attack that actually happens to marketing sites.
 *
 * So: `'unsafe-inline'` on script and style, everything else locked down, and the copy on
 * /security says precisely this rather than implying a stricter policy than we run.
 *
 * `e2e/headers-and-motion.spec.ts` snapshots this exact string. Widening it further fails a
 * test, which is the point: it cannot happen quietly.
 *
 * ### `'unsafe-eval'`, dev-only
 *
 * `next dev`'s webpack pipeline wraps every module in `eval()` for Fast Refresh. Without
 * `'unsafe-eval'` the browser blocks that eval, and React never hydrates — every button, the
 * theme toggle, the mega-menu, all of it, silently dead, with only a CSP violation in the
 * console to say why. `NODE_ENV` is `'development'` only under `next dev`; `next build` and
 * `next start` — what `e2e/headers-and-motion.spec.ts` runs against — always see `'production'`,
 * so the shipped policy is exactly the string the test snapshots, unchanged.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
  typedRoutes: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Self-hosted fonts are content-hashed by filename and never change under a given name.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
