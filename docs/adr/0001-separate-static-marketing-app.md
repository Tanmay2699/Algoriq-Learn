# ADR 0001 — The marketing site is a separate static app, not a route group in `apps/web`

**Date:** 2026-07-31 · **Status:** Accepted

## Context

Algoryq Learn already has a Next.js 15 app (`apps/web`) that serves the product, the auth pages and each
tenant's public CMS site at `/s/[slug]`. Adding a marketing site there would mean one deployment,
one build and shared components.

## Decision

Build the marketing site as a **separate Next.js application** at `website/`, a sibling of `apps/`
and `packages/`, deployed independently to its own domain.

## Why

1. **Different threat surface.** `apps/web` holds session cookies, a BFF that attaches JWTs, and
   the `Sec-Fetch-Site` cross-site-write rejection. A marketing site is anonymous, static and
   heavily linked from the open internet. Merging them means every marketing route is one
   middleware mistake away from the authenticated surface, and every marketing dependency is in the
   product's supply chain.
2. **Different performance shape.** The product optimises for a signed-in, warm-cache, repeat
   session. The site optimises for a cold first paint over 4G on a device that has never seen us.
   The first is a client-heavy app; the second must ship almost no JavaScript. One `next.config`
   cannot serve both without compromising one.
3. **Different release cadence.** Copy changes daily near launch; the product ships on its own
   gates. Coupling them means a typo fix waits on the product's integration suite, or the product's
   deploy is blocked by a marketing test.
4. **Different CSP.** The site can hold `default-src 'self'` absolutely, which is a claim we make
   on `/security`. The product legitimately needs `connect-src` to the API and `img-src` to a
   storage origin.
5. **Route collision.** `apps/web` already owns `/` (a redirect to `/dashboard` or `/login`), and
   `/s/[slug]` is a *tenant's* public site. Three kinds of public HTML in one app is where an IA
   goes wrong.

## Consequences

- `website` joins the pnpm workspace so it can import `@akechi/ui` — that import is the whole
  reason it stays in the monorepo rather than a separate repository (ADR 0002).
- Two deployments, two domains, two CI pipelines. Accepted; both are cheap.
- Some duplication: the site reimplements a handful of marketing-shaped components rather than
  reusing app components that assume a session. Also accepted — the alternative is app components
  growing marketing branches.
- The site must never import `@akechi/sdk` or `@akechi/authz`; the permission catalog is copied in
  as build-time JSON by a script so drift shows up as a diff.

## Alternatives considered

**A route group in `apps/web`.** Rejected on the five points above.
**A separate repository.** Rejected: it would force the token system to be published as a package
and versioned, and the whole design strategy is that the site and the product share tokens
*without* a release cycle in between.
