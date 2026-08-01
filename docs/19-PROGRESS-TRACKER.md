# 19 — PROGRESS TRACKER

**Living document. Update it every session.** It is authoritative over every other doc's
description of *state* (the other docs are authoritative over *intent*).

Last updated: **2026-07-31** · Phase: **built and verified; not deployed**

---

## A. Status at a glance

| | |
|---|---|
| **Phase** | W1–W4 complete. W5 (launch) is the remaining phase. |
| **Site source** | Built. 51 public pages, 66 routes in the build output. |
| **Docs** | 20 documents + 9 ADRs, reconciled against what was actually built. |
| **Gates** | typecheck ✅ · unit **63** ✅ · browser **300** ✅ · claims ✅ · links ✅ · build ✅ |
| **Figma** | Not created. The design exists as code; the file is handover work, not a prerequisite. |
| **Product changes needed** | 1 remaining — `GET /public/plans` (W2.6). The workspace change is done. |
| **Blockers to launch** | Legal review · a real `SITE_URL` and DNS · the sandbox tenant · the analytics host · the manual screen-reader pass |
| **Next action** | `18-LAUNCH-CHECKLIST.md` §2 (manual accessibility passes) and §9 (legal review) |

---

## B. What was built

### Foundation
- `@akechi/website` in the pnpm workspace. Next 15 App Router, TypeScript strict, port 3001.
- Two-layer tokens: `@akechi/ui/tokens.css` inherited untouched, plus the `--mk-*` marketing
  layer. A lint-level rule is not needed yet because nothing redeclares a product token.
- Self-hosted Inter + Fraunces, 115 KB, metric-matched fallbacks via `next/font/local`.
  No third font file, no CDN, no third-party origin anywhere.
- 20 components across primitives, layout, motion, product renderings and interactive.
- `src/lib/cn.ts` — a local class merger that knows the custom font scale (see §D.1).

### Content and data
- 14 module pages · 7 clusters · 5 solutions · 4 comparisons · 6 guides · 5 legal documents.
- The permission catalogue synced to JSON from `packages/authz` — **272 keys**, parsed by
  `scripts/sync-catalog.ts` rather than transcribed, so a change arrives as a diff.
- The build-status matrix: 24 modules with their real percentages, including the four below 60.
- Plans taken from the product's own migration, as integer minor units with an ISO currency.

### Pages (51 public)
Homepage (12 acts) · `/product` + 7 clusters + 14 modules · `/solutions` + 5 · `/pricing` ·
`/security` · `/trust` + 4 · `/accessibility` · `/developers` + webhooks · `/integrations` ·
`/compare` + 4 · `/why-akechi` · `/customers` · `/resources` + 6 · `/about` · `/contact` ·
`/demo` · `/legal` × 5 · 404 · sitemap · robots.

### Server
One route: `POST /api/lead` → the product's `POST /public/institutes/:slug/enquiries`. Nothing
is stored on the site. `src/config/server.ts` throws if it is ever imported into client code,
and a browser test asserts the API host and tenant slug never reach the bundle.

### Gates
| Gate | Result |
|---|---|
| `tsc --noEmit` | clean |
| `vitest` | 63 tests across 5 files |
| `playwright` | **300** tests — desktop 1440 and mobile 360 |
| axe | every route, light and dark: zero violations |
| `claims:check` | 31 claims, all evidenced |
| `links:check` | 66 routes, no orphans, nothing broken |
| `next build` | 67 pages generated |

---

## C. Not built, and why

| Item | Why |
|---|---|
| `GET /api/plans` | The product has no public plans endpoint yet. `/pricing` renders a dated snapshot and says so **on the page**. |
| `/api/og` images | Open Graph metadata is complete on every route; the generated image is deferred. |
| Analytics | The collector is not hosted yet. `ANALYTICS_URL` unset disables it honestly rather than as a silent no-op. |
| The Figma file | The design exists as code and as `05`/`06`. Worth building for handover; not a prerequisite for the site to exist. |
| Product screenshots | Superseded by ADR 0008 — DOM recreations, because the demo seed has people but no figures to photograph. |
| `/changelog`, `/status`, `/careers` | Deferred with reasons in `03` §2. |

---

## D. What we got wrong

Every project has three. All of these were found by tests rather than by reading, which is
the argument for the browser suite existing at all.

### D.1 Every font size on the site was being deleted from the markup
`cn` from `@akechi/ui` is `twMerge(clsx(…))`. tailwind-merge has never heard of
`text-display-2` or `text-mk-body`, so it files them under *text colour* — and drops the size
whenever a colour is set on the same element, which is every heading and every paragraph on the
site. The rule was in the stylesheet; the class was not in the HTML. Nothing warned, and the
page renders perfectly well at the inherited size, which is why reading would never have caught
it. Found by a browser test that looked at served markup. Fixed by `src/lib/cn.ts`, with
`src/test/cn.spec.ts` asserting the scale list stays in step with `tailwind.config.ts`.

### D.2 A strict `script-src 'self'` white-screened every page
The App Router streams its render payload through inline scripts. Every route returned 200 and
rendered nothing at all. The product's own config carries a comment warning about precisely this
— *"a wrong CSP is indistinguishable from a broken application"* — and it was written here
anyway. ADR 0009 records the policy that shipped, and why a nonce was the wrong trade for a
static site.

### D.3 Four accessibility defects that only exist in a browser
Product-frame captions at 1.13:1 on ink · the accent badge at 3.07:1 · links at 4.21:1 in dark
mode on the recessed surface · a scrollable list with no keyboard route into it. Plus an
89-pixel horizontal overflow at 360px caused by grid children defaulting to `min-width: auto`.
All five are fixed structurally rather than per-instance: an `.on-ink` variant so captions
follow whatever surface they land on, `--mk-accent-text` and `--mk-link` tokens with contrast
tests behind them, a `CodeBlock` that is a labelled focusable region, and a `min-width: 0` rule
on container children.

### D.4 A translucent header
It looked good over the hero and then crossed a dark act with its own dark text at 3.7:1.
Removed rather than patched: a contrast failure that appears only at certain scroll positions is
the hardest kind to notice and the easiest kind to avoid.

---

## E. Claims and evidence

| | Count |
|---|---:|
| Claims registered in `claims.ts` | 31 |
| With a verified evidence pointer | 31 |
| Second-hand, flagged by `claims:check` | 4 — the enforced-key count and three test totals, taken from the product's `MEMORY.md` because reproducing them needs a running Postgres |
| Comparison cells with a source and a date | every one |
| **Proof slots filled** | **0 of 7 — correct, and asserted by `content.spec.ts`** |

---

## F. Before the domain points here

1. **Legal review** of the five `/legal` documents and `/trust/dpa`. They are honest drafts
   written from what the software does; they are not a lawyer's work.
2. `SITE_URL`, `APP_URL`, `SANDBOX_URL` and `API_URL` set for production. The build refuses a
   localhost `SITE_URL` when `DEPLOY_ENV=production`.
3. The **sandbox tenant**, seeded and read-only. Six calls to action point at it.
4. **Our own product tenant**, so `/api/lead` has somewhere to post. Verify that a submitted
   form appears on the admissions board.
5. The self-hosted analytics instance — or leave `ANALYTICS_URL` unset, which is a valid state.
6. **Manual passes**: keyboard-only, VoiceOver with Safari, NVDA with Firefox, 400% zoom,
   Windows forced-colours.
7. Lighthouse against the deployed origin rather than localhost.
8. `18-LAUNCH-CHECKLIST.md`, all of it.

---

## G. Session log

| Date | Who | What happened |
|---|---|---|
| 2026-07-31 | Claude | **Specification written.** Codebase and Figma analysed; `website/` created with `CLAUDE.md`, 20 documents and 7 ADRs. |
| 2026-07-31 | Claude | **Built and verified.** 51 pages, 20 components, 63 unit tests, 300 browser tests, four CI gates. Four classes of defect found by the browser suite and fixed structurally (§D). Docs reconciled against what shipped; ADRs 0008 and 0009 added for the two decisions that changed during the build. |
