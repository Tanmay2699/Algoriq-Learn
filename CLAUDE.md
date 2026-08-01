# CLAUDE.md — Akechi Website

Instructions for any AI agent (or new engineer) working in this repository.
**Read `docs/00-MASTER-IMPLEMENTATION-PLAN.md` first**, then this file for working rules.

> ⚠️ **Scope boundary.** This repository is the **public marketing website** for the Akechi
> product (`akechi.com`). It is *not* the product (`apps/web` in the product monorepo,
> `app.akechi.com`) and *not* a tenant's own public site (`/s/[slug]`, the CMS module E21).
> Three different things that all render HTML. Know which one you are in before you touch a file.
>
> **It is also a split-out of a folder that used to live inside the product monorepo**, at
> `website/`. Two files are vendored copies of product source and must not be authored here —
> `src/styles/tokens.product.css` and `src/styles/tailwind-preset.ts` (see rule 5). Everything
> else is this repository's own. Documentation still refers to product paths such as
> `apps/api/src/modules/crm` and `packages/authz`; those are references *into the product repo*,
> which is deliberate — every claim this site makes is traceable to a file over there.

---

## The site in one paragraph

A statically-rendered Next.js 15 marketing site that sells **Akechi** — a multi-tenant,
AI-first enterprise Learning Management System — to institute owners, academic heads, IT/security
reviewers and procurement, without a sales call. It is built from the *same design tokens as the
product*, so what a visitor sees is what they get. Every claim on it is traceable to a file in
this repository; nothing on it is invented. Target: a decision-maker understands what Akechi is,
whether it fits, whether it is safe, and what it costs — in one scroll.

**A note on the brief.** The originating brief was written for a CRM. Akechi is an LMS that
*contains* a CRM & Admissions module (`apps/api/src/modules/crm`, 32 routes, 20 permission keys).
Every requirement in that brief has been mapped onto the real product — see
[`docs/04-HOMEPAGE-NARRATIVE.md` §2](docs/04-HOMEPAGE-NARRATIVE.md) for the 37-beat coverage
table. Nothing was dropped; "Lead Management / Sales Pipeline / Customer Management" became
"Admissions Enquiries / Admissions Pipeline / Learner Records", which is what the code calls them.

---

## Stack (do not substitute without an ADR)

**Framework** Next.js 15 App Router · TypeScript (strict) · React 19
**Styling** Tailwind extending `@akechi/ui/tailwind-preset` + a marketing-only token layer.
Class composition uses `src/lib/cn.ts`, **not** `cn` from `@akechi/ui` — tailwind-merge does not
know the custom font scale and silently deletes it (see `docs/19` §D.1).
**Content** MDX in-repo (`src/content/**`) — no headless CMS in v1 (ADR 0005)
**i18n** next-intl, `en-IN` default, RTL-ready (the product ships 8 locale tags; the site ships 1)
**Motion** CSS + the Web Animations API + IntersectionObserver. No animation library in v1.
**Analytics** self-hosted, cookieless (ADR 0007) — no third-party script anywhere
**Quality** Vitest (unit) · Playwright + axe (e2e + a11y) · Lighthouse CI · ESLint + Prettier
**Hosting** Vercel (the org already has `akechi-lms`); Azure Static Web Apps is the documented swap

Explicitly **not** used: Framer Motion, GSAP, three.js, Lottie runtime, any CDN-hosted font or
script, any CSS-in-JS runtime. Each has an entry in `docs/13-PERFORMANCE.md` §7 explaining what
it would cost and what replaces it.

---

## Repository layout

```
website/
├── CLAUDE.md                 ← you are here
├── README.md                 ← how to run it
├── docs/                     ← every specification (see 00-MASTER-IMPLEMENTATION-PLAN.md)
│   └── adr/                  ← decisions that would otherwise surprise a new engineer
├── src/
│   ├── app/
│   │   ├── (marketing)/      ← every public page
│   │   ├── api/              ← the ONLY server routes: lead capture, plans, og images
│   │   └── layout.tsx
│   ├── components/
│   │   ├── primitives/       ← Button, Eyebrow, Prose, Reveal… (marketing design system)
│   │   ├── sections/         ← one component per homepage act / page section
│   │   └── product/          ← the honest product renderings (ProductFrame, RoleSwitcher…)
│   ├── content/              ← MDX: modules, solutions, comparisons, posts, legal
│   ├── lib/                  ← claims registry, evidence links, formatters, analytics
│   ├── styles/               ← tokens.marketing.css (layer 2 only — layer 1 is imported)
│   └── config/               ← navigation.ts, proof.ts, seo.ts, plans.ts
└── public/                   ← fonts (self-hosted), images (AVIF/WebP), og, icons
```

---

## Working rules (enforced, not suggestions)

### Truth
1. **No fabricated data. Ever.** Inherited verbatim from the product (root rule 16) and it is the
   hardest rule on this site. No invented customer logos, testimonials, awards, case studies,
   uptime figures, seat counts, "10,000+ institutes", G2 badges or certification marks. Not even
   as a placeholder that "we'll swap before launch" — placeholders ship.
2. **Every claim resolves to evidence.** A number or capability statement in copy must have an
   entry in `src/lib/claims.ts` pointing at a file path, a doc section, or a public URL a visitor
   could check. `pnpm claims:check` fails CI on an unreferenced claim. See
   `docs/17-EVIDENCE-AND-CLAIMS-POLICY.md`.
3. **Proof slots render nothing when empty.** The `<ProofBand>`, `<Testimonials>`, `<CaseStudies>`
   and `<Awards>` components return `null` on an empty source. The layout is designed to look
   finished without them — that is a design requirement, not a fallback.
4. **Completeness is published, not hidden.** `/trust/build-status` mirrors the module completion
   matrix from `docs/12-PROGRESS-TRACKER.md`. A module below 70% is described as what it is. We
   sell what is built.

### Design
5. **Layer 1 tokens are inherited and immutable.** Colour, radius and the product type ramp come
   from `src/styles/tokens.product.css` and `src/styles/tailwind-preset.ts` — vendored copies of
   `packages/ui/src/styles/tokens.css` and `packages/ui/src/tailwind-preset.ts` in the product
   monorepo, which is where they are authored. Never redeclare `--brand-500` or any product token
   here, and never edit the copies in place: if a product token is wrong, fix it in `packages/ui`
   and in Figma — both, same commit (that pairing is the product's own definition of done, and it
   has been violated once before, in the 2026-07-23 → 07-26 status-colour drift) — then bring the
   file across whole. `src/test/contrast.spec.ts` reads the copy and fails on any pair below its
   WCAG ratio, so a bad copy does not ship quietly; it cannot, however, detect a *stale* one.
6. **Layer 2 tokens are marketing-only and namespaced `--mk-*`.** Display type, section rhythm,
   gradients, glass and the wide grid live in `src/styles/tokens.marketing.css`. A `--mk-*` token
   may never leak into `apps/web`.
7. **Product renderings are real.** Any screenshot, frame or embedded UI is captured from the
   running product against the seeded demo institute (`pnpm db:seed`, "Sunrise Academy") or is a
   faithful DOM recreation using product components. No mockups of features that do not exist.
   Every product image carries its capture date in `src/content/captures.json`.
8. **Gradients never carry text.** Text sits on a solid token that has been contrast-checked.
   A gradient may sit behind a solid card; it may not sit behind a paragraph.

### Code
9. **Static by default.** A page is a Server Component with no client JS unless it has state.
   `'use client'` needs a one-line comment saying what state forced it. Three server routes exist
   and no more (lead capture, public plans, OG image generation).
10. **No third-party runtime.** Nothing may load from a host other than our own origin. The CSP in
    `next.config.ts` is `default-src 'self'` and is a test, not a header — `security-headers.spec.ts`
    fails if it widens.
11. **Permission-free.** This site has no auth, no session, no cookie except an optional
    theme preference. If you find yourself needing a user, you are in the wrong app.
12. **Copy lives in content, not components.** English strings go through i18n keys from day one
    (root rule 17). A hardcoded sentence in a `.tsx` file fails lint.

### UX
13. **WCAG 2.2 AA is the floor, AAA where it is free.** axe in Playwright and in Storybook fails
    CI. Every interactive thing has a keyboard path. Reduced motion is a first-class rendering,
    not a stripped one.
14. **Mobile-first, verified at 360px.** Design at 360 → 1440. Nothing horizontally scrolls except
    a deliberate `overflow-x: auto` container with a visible affordance.
15. **Performance budgets are CI gates, not aspirations.** See `docs/13-PERFORMANCE.md` §2. A PR
    that pushes the homepage over 90 KB of first-load JS fails.
16. **One idea per section.** If a section needs two headlines, it is two sections. If it needs a
    paragraph of qualifiers, it belongs on a deeper page.

---

## Definition of Done — one page or section

Design approved against `docs/05-DESIGN-SYSTEM.md` · built from primitives (no bespoke one-offs
without a component entry) · copy in MDX/i18n with every claim in `claims.ts` · responsive at
360 / 768 / 1024 / 1440 / 1920 · keyboard path verified · axe clean · reduced-motion rendering
verified · metadata + OG image + JSON-LD · Lighthouse within budget · Playwright path ·
`docs/19-PROGRESS-TRACKER.md` updated.

---

## Commands

```bash
pnpm install
pnpm dev            # localhost:3001 (3000 is the product, when it is running locally)
pnpm build
pnpm test           # vitest
pnpm test:e2e       # playwright + axe, against a production build
pnpm claims:check   # every claim has evidence
pnpm links:check    # no internal link 404s, run after a build
pnpm verify         # typecheck → test → claims → build → lint → links, in that order
```

**Lint runs after the build, deliberately.** `typedRoutes` generates `.next/types/routes.d.ts`,
and until it exists `Route` is a plain `string` alias — so every `href={x as Route}` looks
redundant and `no-unnecessary-type-assertion` fails on a clean clone, then passes once something
has been built. Building first makes the run mean the same thing every time.

`pnpm sync:catalog` re-copies the product's permission catalogue into
`src/content/permission-catalog.json`. It reads the product monorepo, which is not part of this
repository, so point it at a checkout: `AKECHI_CATALOG=../AkechiLMS/packages/authz/src/catalog.ts
pnpm sync:catalog`. The committed JSON is what the site renders; the script only refreshes it.

---

## Before you write code

1. Find the section's spec. Homepage → `docs/04`. Any other page → `docs/08`. A component →
   `docs/06`. If there is no spec, write it first — this site has no "just try something" mode.
2. Check `docs/19-PROGRESS-TRACKER.md` for what is in flight.
3. Check `docs/17-EVIDENCE-AND-CLAIMS-POLICY.md` before writing a single number.
4. When you finish, update the tracker, and record an ADR if a decision changed.
