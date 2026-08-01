# 14 — TECHNICAL ARCHITECTURE

How the site is built, wired and shipped.

---

## 1. Principles

1. **Static unless proven otherwise.** 48 of 51 routes are HTML on a CDN.
2. **Server Components by default.** Client JavaScript is an exception with a written reason.
3. **One origin.** No request leaves `akechi.com` at runtime. CSP `default-src 'self'`.
4. **Inherit, do not fork.** Tokens, charts, form controls and icons come from the product.
5. **No state.** No session, no auth, no database, no cookie except an optional theme preference.
6. **Fail the build, not the visitor.** Missing metadata, an unregistered claim, a stale capture,
   a widened CSP, an over-budget bundle — all are build failures.

---

## 2. Workspace integration

`website/` is a sibling of `apps/` and `packages/`, not inside them, because it is not part of the
product and should not be swept up by `turbo run build` for the product's pipeline by accident.

**Step W1.1** adds it to the workspace:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'website'          # ← the marketing site; consumes @akechi/ui only
```

```json
// website/package.json
{
  "name": "@akechi/website",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001 --turbopack",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "claims:check": "tsx scripts/claims-check.ts",
    "links:check": "tsx scripts/links-check.ts",
    "captures": "playwright test --config=playwright.captures.ts",
    "lh": "lhci autorun"
  },
  "dependencies": {
    "@akechi/ui": "workspace:*",
    "next": "^15.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-intl": "^4.13.3",
    "lucide-react": "^0.454.0",
    "zod": "^3.23.8"
  }
}
```

**Only `@akechi/ui` is imported.** Not `@akechi/sdk` (it assumes a session), not `@akechi/authz`
(it is a server-side guard library — the permission *catalog* is copied as build-time JSON instead,
by a script, so a change to the catalog shows up as a diff rather than as silent drift), not
`@akechi/contracts` except the one Zod schema for the lead payload, which is imported by
`/api/lead` and pinned by a test.

Port **3001**. The product's web app owns 3000. Never run a production build of one while the
other's dev server is live — the product's own memory notes record this corrupting a shared
`.next` cache.

---

## 3. Folder structure

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  root: <html lang dir>, theme no-flash script, fonts
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx              header + footer + skip link
│   │   │   ├── page.tsx                the 12 acts
│   │   │   ├── product/…               overview, 7 clusters, [module]
│   │   │   ├── solutions/[segment]/
│   │   │   ├── pricing/
│   │   │   ├── security/
│   │   │   ├── trust/…
│   │   │   ├── developers/…
│   │   │   ├── integrations/
│   │   │   ├── compare/[competitor]/
│   │   │   ├── why-akechi/
│   │   │   ├── customers/
│   │   │   ├── resources/[slug]/
│   │   │   ├── accessibility/
│   │   │   ├── about/  contact/  demo/
│   │   │   └── legal/[doc]/
│   │   ├── api/
│   │   │   ├── lead/route.ts           POST → product web-to-lead
│   │   │   ├── plans/route.ts          GET  → product public plans, cached 1h
│   │   │   └── og/[...slug]/route.tsx  Satori
│   │   ├── sitemap.ts  robots.ts  not-found.tsx  error.tsx
│   ├── components/
│   │   ├── primitives/                 06 §2
│   │   ├── layout/                     06 §3
│   │   ├── product/                    06 §4
│   │   ├── interactive/                06 §5
│   │   └── sections/                   one per act / page section
│   ├── content/
│   │   ├── modules/*.mdx               14
│   │   ├── articles/*.mdx              6 at launch
│   │   ├── legal/*.mdx                 5
│   │   ├── comparisons/*.json          sourced cells
│   │   ├── captures.json               the capture manifest
│   │   └── build-status.json           mirrored from the product tracker
│   ├── config/
│   │   ├── navigation.ts  seo.ts  proof.ts  plans.ts  icons.ts  analytics.ts
│   ├── lib/
│   │   ├── claims.ts                   every claim + its evidence
│   │   ├── mdx.ts  format.ts  analytics.ts  motion.ts
│   ├── styles/
│   │   ├── tokens.marketing.css        layer 2 only
│   │   └── globals.css                 imports @akechi/ui/tokens.css first
│   ├── i18n/                           messages/en-IN.json, request.ts
│   └── test/                           vitest + playwright specs
├── public/
│   ├── fonts/*.woff2                   3 files, self-hosted
│   ├── product/**                      captures, AVIF + WebP
│   ├── diagrams/*.svg
│   └── icon.svg  favicon.ico  apple-touch-icon.png
├── scripts/
│   ├── claims-check.ts  links-check.ts  sync-catalog.ts  sync-build-status.ts
│   └── image-pipeline.ts
├── next.config.ts  tailwind.config.ts  tsconfig.json
├── playwright.config.ts  playwright.captures.ts  lighthouserc.json
└── vitest.config.ts
```

---

## 4. Styling

```css
/* src/styles/globals.css */
@import '@akechi/ui/tokens.css';        /* layer 1 — inherited, never redeclared */
@import './tokens.marketing.css';       /* layer 2 — --mk-* only                 */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// tailwind.config.ts
import preset from '@akechi/ui/tailwind-preset';

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx,mdx}', '../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['var(--font-display)', 'Georgia', 'serif'] },
      fontSize: {
        'display-1': ['var(--mk-display-1)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        // … the rest of 05 §3.2
      },
      spacing: { act: 'var(--mk-space-act)', block: 'var(--mk-space-block)' },
      maxWidth: { content: '80rem', wide: '90rem', prose: '68ch' },
    },
  },
} satisfies Config;
```

A lint rule (`no-product-token-redeclaration`) fails the build if `--brand-*`, `--surface-*`,
`--text-*`, `--success*`, `--warning*`, `--danger*`, `--border` or `--radius*` is assigned anywhere
in `website/`.

---

## 5. The three server routes

### 5.1 `POST /api/lead`
The only write on the site. Validates with the shared Zod schema, applies a honeypot and a
time-to-submit floor, then forwards to the product:

```
POST {API_URL}/public/institutes/{AKECHI_TENANT_SLUG}/enquiries
```

- Nothing is stored here. The lead lives in the product's database and nowhere else.
- The upstream forces `source=WEB` and has no field for stage, owner or pipeline — so there is
  nothing for this route to sanitise beyond shape.
- The upstream returns a **fixed acknowledgement** regardless of outcome, so this route cannot leak
  whether an email is on file, and must not add information the upstream deliberately withholds.
- On upstream failure: a 502 with a generic message; the client preserves the form and offers a
  `mailto:` fallback. **No retry queue** — a marketing form that silently retries can double-create
  a lead, and a duplicate on the counsellor's board is worse than a visible failure.
- Runtime: Node. Timeout 8s.

### 5.2 `GET /api/plans` — **not built**

The product has no public plans endpoint yet (task W2.6), so rather than ship a proxy to
something that does not exist, `/pricing` renders a dated snapshot from
`src/content/plans.ts` and **says so on the page**: "These figures are a snapshot of the
product's plans table taken on 2026-07-31." The moment the endpoint lands, this route replaces
the snapshot and that paragraph comes out.

### 5.2a The original specification
Proxies `GET {API_URL}/public/plans`, filters to `isPublic`, converts minor units to a display
shape, caches for an hour (`s-maxage=3600, stale-while-revalidate=86400`).

**This endpoint does not exist in the product yet.** Task W2.6 adds it: `@Public()`, `is_public`
only, behind the existing `RateLimitMiddleware`. Until then this route reads a checked-in
`plans.json` snapshot **and renders a build warning**, so the temporary state is loud.

The alternative — hardcoding the price list in the website — was rejected: the product's own
`PlanController` comment anticipates a marketing site publishing plans, `is_public` exists on the
model for exactly this, and two copies of a price always end up disagreeing.

### 5.3 `GET /api/og/[...slug]` — **not built**

Open Graph metadata is emitted on every page; the generated *image* is not. It is the one item
on this list that is purely deferred rather than blocked, and it is in `19` §B.

### 5.3a The original specification
Satori + the self-hosted woff2 files read from disk. Four variants (`09` §8). Cached immutably by
URL.

---

## 6. What the site does *not* have

| Absent | Why |
|---|---|
| A service worker | The product is the PWA. A marketing site with a service worker serves a stale hero to a returning visitor and gains nothing — everything here is already CDN-cached and immutable. |
| A database | There is no state to keep. |
| Authentication | If a page needs a user, it belongs in `apps/web`. |
| Cookies | Except an optional `theme` preference, which is a preference and not a tracker. Hence no consent banner (`10` §5). |
| A CMS | ADR 0005. |
| An error-tracking SDK | It is a third-party origin. Server errors are logged by the host; client errors surface in the self-hosted analytics' error event. |

---

## 7. Security

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `X-Frame-Options` | `DENY` (belt and braces with `frame-ancestors`) |

`'unsafe-inline'` on `style-src` is the one concession — Next injects inline styles for critical
CSS. It is scoped to styles only and is recorded here so nobody quietly widens `script-src` to
match. `security-headers.spec.ts` snapshots the whole policy and **fails on any change**, so
widening it is a deliberate, reviewed act.

No secrets in the client bundle. `API_URL` and `AKECHI_TENANT_SLUG` are server-only; a test asserts
that neither string appears in the built client output.

---

## 8. Environment

| Variable | Used by | Default |
|---|---|---|
| `API_URL` | `/api/lead`, `/api/plans` | `http://127.0.0.1:4000` in dev |
| `AKECHI_TENANT_SLUG` | `/api/lead` | `akechi` |
| `SITE_URL` | metadata, sitemap, canonicals, OG | `http://localhost:3001` |
| `SANDBOX_URL` | CTAs | `https://sandbox.akechi.com` |
| `APP_URL` | "Sign in" | `https://app.akechi.com` |
| `ANALYTICS_URL` | the self-hosted collector | unset ⇒ analytics disabled, honestly |

Use `127.0.0.1`, not `localhost`, for anything reaching a container — the product's own notes
record IPv6 resolution breaking exactly this.

Production refuses to build if `SITE_URL` is still a localhost value: a canonical tag pointing at
`localhost` is a silent, total SEO failure and it has happened to better teams than ours.

---

## 9. Testing

| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | Formatters, the ROI arithmetic, the claims registry, MDX front-matter parsing, the lead schema |
| Component | Vitest + Testing Library | Tabs keyboard model, form validation, proof components returning `null` |
| Storybook | axe addon | Every component, every state, dark, 360px |
| E2E | Playwright | Every route: renders, axe, no third-party requests, metadata present, no console errors |
| Contract | Playwright, nightly | `/api/lead` against a real product instance — a lead appears on the board |
| Visual | Playwright snapshots | The homepage at 3 widths, light and dark, plus the empty-proof rendering |
| Performance | Lighthouse CI | 10 routes, median of 5 |
| Link integrity | `links:check` | No orphans, no broken internal links, no `http://` |
| Claims | `claims:check` | Every claim has evidence; every capture is fresh |

---

## 10. Deployment

**Primary: Vercel.** The organisation already has a project (`akechi-lms`); the site becomes a
second project pointed at `website/`. It is static, so hosting is a commodity and this is not a
lock-in decision.

**Documented swap: Azure Static Web Apps** (consistent with the product's Azure-first,
free-fallback policy), and beyond that any static host plus a small Node function for the three
routes. Because the site is 48 static files plus three handlers, migrating is an afternoon — which
is what "no lock-in" means when we say it on `/security`.

| Environment | Branch | URL |
|---|---|---|
| Production | `main` | `akechi.com` |
| Preview | every PR | `*.vercel.app`, `noindex` enforced by a header |
| Local | — | `localhost:3001` |

**Deploy gates:** lint · typecheck · unit · Storybook axe · Playwright + axe · Lighthouse ·
`claims:check` · `links:check` · bundle budget · security-headers snapshot. All ten green, or no
deploy.

DNS: apex `A`/`ALIAS` to the host, `www` 301 to apex, `sandbox` and `app` untouched (they belong to
the product). HSTS preload submitted only after two weeks of clean production HTTPS — preload is
effectively irreversible.

---

## 11. Rollback

Static site, immutable deploys: rollback is repointing an alias, under a minute. The one stateful
dependency is `/api/lead`'s upstream; if the product's endpoint changes shape, the nightly contract
test catches it before a visitor does, and the form's failure path already offers a `mailto:`
fallback rather than losing the lead.
