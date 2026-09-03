# 19 — PROGRESS TRACKER

**Living document. Update it every session.** It is authoritative over every other doc's
description of *state* (the other docs are authoritative over *intent*).

Last updated: **2026-09-03** · Phase: **built and verified; rebranded to Algoryq Learn; not deployed**

---

## A. Status at a glance

| | |
|---|---|
| **Phase** | W1–W4 complete. W5 (launch) is the remaining phase. |
| **Site source** | Built. 51 public pages, 66 routes in the build output. |
| **Docs** | 20 documents + 10 ADRs, reconciled against what was actually built. |
| **Gates** | typecheck ✅ · unit **63** ✅ · browser **300** ✅ · claims ✅ · links ✅ · build ✅ |
| **Figma** | Not created. The design exists as code; the file is handover work, not a prerequisite. |
| **Product changes needed** | 1 remaining — `GET /public/plans` (W2.6). The workspace change is done. |
| **Blockers to launch** | Legal review · a real `SITE_URL` and DNS · the sandbox tenant · the analytics host · the manual screen-reader pass |
| **Next action** | `18-LAUNCH-CHECKLIST.md` §2 (manual accessibility passes) and §9 (legal review) |

---

## B. What was built

### Foundation
- `@algoryq/learn-website` in the pnpm workspace. Next 15 App Router, TypeScript strict, port 3001.
- Two-layer tokens: `@akechi/ui/tokens.css` inherited, plus the `--mk-*` marketing layer. Since
  the rebrand, four brand tokens in layer 1 are authored here rather than upstream — see §E.1.
  Everything else in layer 1 is untouched and nothing else redeclares a product token.
- Self-hosted Inter + Space Grotesk, **70 KB**, metric-matched fallbacks via `next/font/local`.
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
`/compare` + 4 · `/why-algoryq-learn` · `/customers` · `/resources` + 6 · `/about` · `/contact` ·
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
| Product screenshots | Superseded by ADR 0008 (DOM recreations), because the demo seed has people but no figures to photograph. |
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

## E. Carried debt

Things that are correct here and not yet correct somewhere else. Each one is a divergence that
will not announce itself. This section exists because the last silent divergence in a vendored
file — the 2026-07-23 status-colour drift, recorded in the header of `tokens.product.css` — went
unnoticed for three days, and what failed then was that nobody had written down that it *could*
drift.

### E.1 Layer 1 is ahead of the product on four brand tokens

The 2026-08-01 rebrand (ADR 0010) re-authored four tokens in `src/styles/tokens.product.css`,
which ADR 0002 defines as a vendored copy edited only upstream:

| token | was (Akechi) | now (Algoryq Learn) | source |
|---|---|---|---|
| `--brand-500` | `#5b5bd6` | `#1b5cd4` | logo gradient, mid stop, darkened to clear 4.5:1 |
| `--brand-600` | `#4a4ac4` | `#1450b8` | logo gradient, dark stop |
| `--brand-soft` | `#eef0fe` | `#e8f0fd` | 10% tint of `--brand-500` |
| `--accent-500` | `#12a594` | `#5f76fc` | Algoryq "pulse" |

**Until `packages/ui/src/styles/tokens.css` and the Figma `Color` collection carry these four
values, the product and this site render two different blues.** Neutrals, status colours and radii
were deliberately left untouched, so the blast radius is four lines.

*Closes when:* the product monorepo takes the same four values in one commit with its Figma
update, and this file is re-copied from upstream whole.

### E.2 The product still ships as `@akechi/*`

The monorepo is `AkechiLMS` and its packages are `@akechi/ui`, `@akechi/api`, `@akechi/authz`.
Every reference to them in this repository is left spelled that way deliberately (ADR 0010): they
are paths into a repository this one only references, and inventing renamed ones would break the
rule that every claim resolves to a file somebody can open.

*Closes when:* the product renames itself, in the product's own commit. This repository follows.

---

## F. Claims and evidence

| | Count |
|---|---:|
| Claims registered in `claims.ts` | 31 |
| With a verified evidence pointer | 31 |
| Second-hand, flagged by `claims:check` | 4 — the enforced-key count and three test totals, taken from the product's `MEMORY.md` because reproducing them needs a running Postgres |
| Comparison cells with a source and a date | every one |
| **Proof slots filled** | **0 of 7 — correct, and asserted by `content.spec.ts`** |

---

## G. Before the domain points here

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

## H. Session log

| Date | Who | What happened |
|---|---|---|
| 2026-07-31 | Claude | **Specification written.** Codebase and Figma analysed; `website/` created with `CLAUDE.md`, 20 documents and 7 ADRs. |
| 2026-07-31 | Claude | **Built and verified.** 51 pages, 20 components, 63 unit tests, 300 browser tests, four CI gates. Four classes of defect found by the browser suite and fixed structurally (§D). Docs reconciled against what shipped; ADRs 0008 and 0009 added for the two decisions that changed during the build. |
| 2026-08-01 | Claude | **Rebranded to Algoryq Learn** (ADR 0010). Akechi → Algoryq Learn across copy, routes (`/why-akechi` → `/why-algoryq-learn`), config and JSON-LD; parent mark adopted unmodified; brand ramp re-authored from the mark's gradient and held by `contrast.spec.ts`; Fraunces (67 KB) replaced by Space Grotesk (22 KB), taking the font payload to 70 KB. Layer-1 divergence recorded as debt in §E.1. Gates re-run green. |
| 2026-08-01 | Claude | **Rebrand finished.** The typeface half of the rebrand had not reached the docs: `05`, `07`, `09`, `13`, `15`, `04`, `00` and `10` still specified Fraunces and a three-file font budget. Reconciled. The new ADR had also been filed as a second `0008` — renumbered to `0010`, with 0003 marked superseded and 0002 marked amended in the index. |
| 2026-09-03 | Claude | **Hero footage re-encoded from the 4K master**, replacing the 1080p copy the first encode came from. Same cut policy — the fabricated "SCHOOL PORTAL" tablet, laptop and phone segments dropped (rules 1 and 7) — re-derived against the new file, whose timestamps differ from the old copy's; 18.29s, five shots, 1.52–3.30 MB. `docs/09` §10 and the `VideoHero` docblock updated, including a warning that the cut list belongs to one copy of the master. **Spacing audited** against the master spacing prompt: the proposed fixed `--mk-spacing-*` ladder was declined — Tailwind's default scale already is it, and a parallel vocabulary for the same numbers is a permanent two-spellings problem — and the reason is now written into `tokens.marketing.css`. Two real findings fixed: the last arbitrary spacing value in the codebase (`py-[10rem]` in `Act`) became `--mk-space-act-loose`, and `not-found.tsx` stopped hand-rolling what `<Act>` owns. |
| 2026-09-03 | Claude | **Watermark removed from the hero footage**, frame untouched — no crop, no zoom, same 1600×900 / 960×540. The mark is a static alpha composite, so `observed = slope × background + intercept` was fitted per pixel by least squares over the flat-background frames and inverted; residual 2–4/255 against a 2.6/255 floor. `delogo` was tried first and rejected (it smears the desk edge and the skirting line). Method and control numbers in `docs/09` §10. **Hero pause control is icon-only** — the caption is gone, the accessible name moved to `aria-label` rather than going with it. **Card grids render at equal height**: `Stagger` wraps each child in a `Reveal` element, which becomes the grid item and stretches while the card inside it did not, so every staggered row rendered ragged. Fixed once in `Card` (`h-full`) plus the five `Link` cards that sit in `Stagger` grids without using `Card`. |
| 2026-09-03 | Claude | **Representative photography added to the five `/solutions/[segment]` pages** ([ADR 0011](adr/0011-solutions-segment-photography.md)) — a second, equally scoped exception to `09`'s no-photography rule, following the hero video's three rules. `PageHero` (`page-parts.tsx`) took an optional `photo` prop: a two-column hero at ≥1024px (text in 5 of 12 columns, the photo right-aligned in the remaining 7, `rounded-xl` / `border-border` / `shadow-e2`), stacking full-width below that; every other `PageHero` call site is unaffected. Copy (`alt`, `caption`) lives in `src/content/solutions.ts`, not the component; captions are disclosed atmosphere, not a `claims.ts` entry, for the same reason the hero video's caption is not one. **Watermark removed from all five source stills** using the still-image method `09` §10 already names for this case (content-aware inpainting, not the multi-frame regression the video used): one mask shape, extracted from the cleanest source, reused across all five at their shared fixed corner offset; four inpainted with `cv2.inpaint`, the fifth (*universities*, which crosses a soft diagonal bokeh streak that PDE inpainting visibly kinked) reconstructed instead with a directional scanline fill. Confirmed clean at normal viewing size, dimensions unchanged from source. The *schools* chalkboard was inspected at 6× zoom and found genuinely illegible (no text fix needed); `Spreadsheet_on_wooden_desk_202609031829.jpeg`, considered for the optional `/resources` cover, was left untouched — it is not referenced by any page and wiring it in was out of this task's scope. Three off-brief generic-office generations deleted, unused. |
| 2026-09-03 | Claude | **Photography extended to 14 more pages** ([ADR 0012](adr/0012-site-wide-photography-rollout.md)), on explicit request to cover the whole site — reconciled against a hard constraint stated up front: no image-generation tool exists in this environment, so only the 24 leftover generated stills (never any new ones) could possibly be used. `/security`, `/accessibility`, `/trust`, `/product` and 8 of the 14 `/product/modules/[slug]` pages (`admissions-crm`, `assessments`, `live-classes-and-attendance`, `placement-and-interviews`, `courses-and-curriculum`, `assignments-and-grading`, `staff-and-hr`, `fees-and-finance`), `/developers` and `/integrations` got a photo each, judged individually against ADR 0011's bar rather than assigned by leftover-file convenience. **`/customers` was refused a candidate file** — its own H1 says "We have none yet," and a training-session photo above that sentence would visually contradict it regardless of caption; the file was processed, then deleted rather than placed elsewhere. `/demo` was skipped — no `PageHero`, and the site's one lead-capture page was not worth the layout risk. Forty-two of the site's 61 interior pages remain text/diagram-only, named explicitly in the ADR rather than left as a silent gap. **Watermark anchor position corrected mid-task**: it is a fixed pixel offset per output resolution, not a percentage of it — the first attempt scaled the offset with canvas size and missed the mark entirely on the 1024×1024 and 2752×1536 stills (confirmed by re-inspecting the outputs, not assumed); re-verified per resolution against clean backgrounds before re-running. `module-fees-and-finance.jpg`'s printed spreadsheet had garbled-but-legible-looking numbers (`09` §2.1's fabricated-data failure, applied to a photo rather than a chart) — fixed with a feathered, hand-traced polygon mask blurring just the printed page's bright pixels; a first, axis-aligned attempt left a visible rectangular seam and was redone. Two `.next` corruptions during verification, both traced to a stale dev server writing to the same build output concurrently with `next build`/`next start`; resolved by stopping the stale process and rebuilding clean, not by working around the symptom. All 14 new pages pass axe (both viewports) and stay under the 900 KB page-weight budget (`/security` closest, ~860 KB). |
