# Akechi — Website

The public marketing site for Akechi (`akechi.com`). Separate from the product
(`apps/web` → `app.akechi.com`) and from a tenant's own CMS site (`/s/[slug]`), both of which
live in the product monorepo. This repository is the site alone.

**Status: built.** 48 statically-rendered routes, a Playwright + axe suite, and a claims check
that fails the build if a marketing claim has no evidence behind it. The specification set in
`docs/` is what it was built from and is kept current;
[`docs/19-PROGRESS-TRACKER.md`](docs/19-PROGRESS-TRACKER.md) is the honest state of it.

Two files are vendored from the product's design system and are not authored here —
`src/styles/tokens.product.css` and `src/styles/tailwind-preset.ts`. Upstream is
`packages/ui` in the product monorepo; re-copy on change rather than editing them
(see [`CLAUDE.md`](CLAUDE.md) rule 5).

---

## What is here

| Path | What it is |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Working rules for anyone (human or agent) building this site |
| [`docs/`](docs/) | The full specification set — 20 documents + 7 ADRs |
| `src/` | The site. `app/` (routes), `components/`, `content/`, `config/`, `lib/`, `styles/`, `test/` |
| `e2e/` | Playwright: routes, accessibility, interaction, headers and motion |
| `scripts/` | `sync-catalog`, `claims-check`, `links-check` |

## The document set

| Doc | Answers |
|---|---|
| [00 — Master implementation plan](docs/00-MASTER-IMPLEMENTATION-PLAN.md) | What gets built, in what order, by which gate |
| [01 — Product truth](docs/01-PRODUCT-TRUTH.md) | What Akechi actually is, extracted from the code |
| [02 — Positioning & messaging](docs/02-POSITIONING-AND-MESSAGING.md) | What we say, to whom, and why it lands |
| [03 — Information architecture](docs/03-INFORMATION-ARCHITECTURE.md) | Every URL, the nav, the crawl graph |
| [04 — Homepage narrative](docs/04-HOMEPAGE-NARRATIVE.md) | The scroll, act by act, with copy |
| [05 — Design system](docs/05-DESIGN-SYSTEM.md) | Tokens, type, grid, colour, elevation |
| [06 — Component library](docs/06-COMPONENT-LIBRARY.md) | Every component, its props, states and a11y |
| [07 — Motion & interaction](docs/07-MOTION-AND-INTERACTION.md) | The motion language and its budgets |
| [08 — Page specifications](docs/08-PAGE-SPECS.md) | Every page that is not the homepage |
| [09 — Visual language & assets](docs/09-VISUAL-LANGUAGE-AND-ASSETS.md) | Screenshots, devices, illustration, icons |
| [10 — Conversion & CRO](docs/10-CONVERSION-AND-CRO.md) | The funnel, CTAs, forms, experiments |
| [11 — SEO & content](docs/11-SEO-AND-CONTENT.md) | Technical SEO, schema, the content model |
| [12 — Accessibility](docs/12-ACCESSIBILITY.md) | WCAG 2.2 AA+ spec and the conformance statement |
| [13 — Performance](docs/13-PERFORMANCE.md) | Budgets, strategy, CI gates |
| [14 — Technical architecture](docs/14-TECHNICAL-ARCHITECTURE.md) | App structure, data flow, deployment |
| [15 — Figma specification](docs/15-FIGMA-SPEC.md) | File structure, variables, components, prototype |
| [16 — Analytics & measurement](docs/16-ANALYTICS-AND-MEASUREMENT.md) | Events, KPIs, dashboards |
| [17 — Evidence & claims policy](docs/17-EVIDENCE-AND-CLAIMS-POLICY.md) | How we prove everything we say |
| [18 — Launch checklist](docs/18-LAUNCH-CHECKLIST.md) | The gates before the domain points here |
| [19 — Progress tracker](docs/19-PROGRESS-TRACKER.md) | Living state — update every session |

## Running it

```bash
pnpm install
cp .env.example .env      # SITE_URL is the only one a build insists on
pnpm dev                  # http://localhost:3001
pnpm verify               # typecheck → lint → test → claims → build → links
```

The site is fully static except three routes and needs no database, no Redis and no product
instance to build. It needs a running product only to (a) re-capture screenshots and (b) exercise
the lead form end to end — set `API_URL` to reach one.
