# 09 — VISUAL LANGUAGE & ASSETS

What the site looks like beyond type and colour: the product imagery, the devices, the drawings,
the charts and the icons — and the rules that keep all of it honest.

---

## 1. The visual thesis

**The product is the art direction.**

This site has no stock photography, no 3D renders of abstract shapes, no illustrated characters and
no AI-generated imagery. Its visual weight comes from three things:

1. **Real product captures**, framed and dated.
2. **Hairline diagrams** — architecture, lifecycle, permission flow — drawn in one weight, one
   colour, no fills.
3. **Typography and space** doing the work that a decorative image would otherwise do badly.

The reason is not austerity. It is that the buyer we want has seen four LMS websites this week, all
with the same purple gradient and the same smiling student holding a laptop. The differentiating
visual move available to us is to show the software. Nobody else does, because their software does
not look good enough. Ours does.

**Corollary:** the product's own screens must therefore be captured properly. §2 is the most
operationally important section in this document.

---

## 2. Product captures

> **Superseded by [ADR 0008](adr/0008-dom-recreations-not-screenshots.md).** What shipped is
> DOM recreations built from the product's own tokens, with a required `provenance` prop that
> renders a caption saying where the contents came from — `seed`, `catalog` or `illustrative`.
> The reason is in the ADR and it is a data problem, not a taste one: the product's demo seed
> creates people and an institute but no figures, so a dashboard screenshot would have been
> either empty or fabricated. The rest of this section is kept because the capture pipeline
> below is what we would build if a surface ever needs a real photograph.
>
> **The rule that survived intact:** no metric, ever. No revenue, no collections, no completion
> rate, no uptime, no learner count. `src/content/demo-data.ts` contains none.

### 2.1 The manifest

Every capture is registered in `src/content/captures.json`:

```json
{
  "crm-board": {
    "path": "/product/crm-board",
    "route": "/crm",
    "role": "counsellor",
    "theme": "both",
    "widths": [1440, 768, 390],
    "alt": "The admissions board: five stages with enquiry cards, each showing owner, source and last activity.",
    "caption": "Your stage names. Our stage meaning.",
    "capturedAt": "2026-07-31",
    "appVersion": "0.1.0",
    "tenant": "sunrise",
    "notes": "Demo institute, seeded data. Two cards deliberately show a duplicate suggestion."
  }
}
```

`<ProductFrame capture="crm-board" />` is the only way a capture enters a page. A raw `<img>` to
`/product/*` fails lint.

**Staleness rule:** `capturedAt` older than **90 days** emits a build warning; older than **180
days** fails the build. A marketing site whose screenshots have drifted from the product is worse
than one with no screenshots, because the first demo call exposes it.

### 2.2 The capture procedure

```bash
docker compose up -d postgres redis minio meilisearch mailpit
pnpm db:migrate && pnpm db:rls && pnpm db:seed
pnpm --filter @akechi/api seed:demo          # Sunrise Academy
pnpm --filter @akechi/api dev &
pnpm --filter @akechi/web dev &
pnpm --filter @algoryq/learn-website captures       # Playwright: 22 screens × 2 themes × 3 widths
```

The capture script is a Playwright project that signs in as each role, navigates, waits for network
idle **and** for a `data-capture-ready` attribute the page sets when its data has resolved, hides
the scrollbar, and shoots at device-scale 2.

Rules baked into the script:
- Deterministic seed data, so re-captures diff cleanly.
- **Real data only.** No DevTools editing, no "just fix that one number in Figma".
- Personal names come from the seed (they are fictional by construction, and the seed says so).
- Dark captures are taken with `data-theme="dark"`, not by inverting.
- The 390px captures are real mobile renders, not desktop shots scaled — the product has genuinely
  different layouts at that width and showing the desktop one squeezed is a lie about the product.

### 2.3 The 22 launch captures

| Key | Route | Role | Used by |
|---|---|---|---|
| `dash-owner` | `/dashboard` | institute-admin | Hero, `/solutions/*` |
| `dash-teacher` | `/dashboard` | teacher | Hero |
| `learn-home` | `/learn` | student | Hero, C3 |
| `family-child` | `/family/[id]` | parent | Hero, `/solutions/schools` |
| `crm-board` | `/crm` | counsellor | Act VI, C1 |
| `crm-lead` | `/crm/leads/[id]` | counsellor | C1 |
| `crm-applications` | `/crm/applications` | counsellor | Act VI |
| `crm-pipeline` | `/crm/settings` | institute-admin | Act VI |
| `course-builder` | `/admin/courses/[id]` | academic-head | C2 |
| `course-diff` | course version diff | academic-head | C2 — the killer capture |
| `lesson-player` | `/learn/courses/[id]` | student | C3 |
| `live-sessions` | `/live` | teacher | C3 |
| `attendance` | `/attendance` | teacher | C3 |
| `assessment-builder` | `/assessments/[id]` | teacher | C4 |
| `attempt-runtime` | `/learn/attempts/[id]` | student | C4 |
| `marking-queue` | `/assessments/[id]/marking` | teacher | C4 |
| `item-analysis` | `/assessments/[id]/analysis` | teacher | C4, Act VII |
| `gradebook` | `/gradebook` | teacher | C4 |
| `verify-cert` | `/verify/[code]` | **signed out** | Act VI, `/security` |
| `finance-invoices` | `/finance` | finance-officer | C5 |
| `risk` | `/risk` | teacher | Act VII |
| `roles-matrix` | `/admin/roles/[id]` | institute-admin | Act IX, `/security` |

Two of these do disproportionate work: **`course-diff`** (nobody in this category shows a version
diff, because nobody has one) and **`verify-cert`** (a signed-out page, which proves the claim by
being reachable).

### 2.4 Framing

| Chrome | Use | Spec |
|---|---|---|
| `browser` | Default for desktop captures | 24px radius, 1px hairline, a 32px bar with three 8px dots at 12% opacity and a pill-shaped URL field showing the real path. No fake favicon, no fake tabs. |
| `laptop` | Act VIII device cluster | Simplified outline, no brand logo, no photorealistic bezel |
| `tablet` / `phone` | Act VIII, mobile captures | Rounded rect, 1px hairline, correct aspect ratio, no notch drawing |
| `none` | Inline detail crops | A hairline and a radius, nothing else |

**Never** a photorealistic MacBook-on-a-desk render. It dates the page, weighs 400 KB, and says
"we bought a mockup pack".

**Crops are allowed; composites are not.** A crop showing one panel of a screen is honest. Pasting
a chart from one screen next to a table from another is a fabrication, even if both are real.

---

## 3. Diagrams

Five, all hairline SVG, all authored by hand, all in one visual grammar: 1.5px strokes, `--border`
for structure, `--brand-500` for the subject, `--accent-500` for a verified/positive terminus, no
fills except 8% brand tints, labels in `--mk-mono` at 13px.

| Diagram | Where | Shows |
|---|---|---|
| **Architecture** | Act III, `/security` | Browser → BFF → API → one database, with the module ring |
| **Lifecycle spine** | Act VI, `/product` | Enquiry → … → Placement, with the owning module under each stop |
| **Permission flow** | `/security#authorization` | Request → authN → tenant bind → `@RequirePermission` → RLS → row |
| **Tenant isolation** | `/security#tenancy` | Two tenants, one table, the policy between them and the role that cannot bypass it |
| **Ports and drivers** | Act VIII, `/security#portability` | Five ports, their drivers, and the env var that selects each |

Every diagram: `role="img"` with an `aria-label`, a `<title>` and a `<desc>`, plus a text
equivalent in the DOM below it on the long-form pages. Under 12 KB each. They animate once
(`07` §4.4) and render complete under reduced motion.

---

## 4. Illustration

**One illustration system, used sparingly:** the *institute mark* — a small family of geometric
glyphs built from the same 1.5px stroke grammar as the diagrams (a stack of pages, a chain link, a
key, a shield with a hairline chain inside it, a spine). They appear at 32–48px beside a section
heading, never larger, never in colour beyond brand and accent.

No characters, no scenes, no isometric cities, no blobs, no gradients-with-a-line-drawing-on-top.

### On AI-generated imagery
**Not used.** The site's entire argument is that we do not fabricate. Publishing a generated
"classroom" while claiming honest data is a contradiction a competitor will screenshot. If a visual
is worth having, it is worth drawing.

### On photography
None at launch. If it is ever added: real institutes, with a name and a date, with written consent,
and never as a background for text.

---

## 5. Charts and data visualisation

**Use the product's own chart components** (`BarChart`, `LineChart`, `DonutChart`, `Sparkline` from
`@akechi/ui` — hand-built SVG, no chart library). This gives the site the same visual grammar as
the product and costs zero additional bytes.

### Rules
1. **Every dataset is real** and labelled with its source: *"Demo institute — seeded data,
   captured 2026-07-31."* No plausible-looking invented curves, not even to show a chart's shape.
2. **The colour ramp is `--mk-viz-1…5`** (`05` §2.2), ordered by first use, colour-blind safe,
   distinguishable in greyscale. Series are *also* distinguished by shape or direct label, never by
   colour alone (WCAG 1.4.1).
3. **Direct labels beat legends.** A legend forces a lookup; a label at the end of the line does
   not. Legends only when there are more than four series, which on this site there never are.
4. **Axes start at zero** for bar charts. A truncated axis on a marketing site is the oldest lie in
   the category.
5. **Every chart has a table equivalent** — either visible or inside a `<Disclosure>` — and the
   chart itself carries `role="img"` with a summarising `aria-label`.
6. **No animation on entry beyond a 300ms opacity fade.** Bars that grow from zero make the reader
   wait to read a number.

Before building any new chart, read the `dataviz` skill's guidance on form selection and colour;
it and this section agree, and where they differ, this section wins because it is bound to the
product's components.

---

## 6. Iconography

**Lucide**, inherited from the product, which names Lucide icons directly in its navigation
registry. 1.5px stroke, 20px inline / 24px standalone, `currentColor`, never filled.

Rules: an icon adjacent to a label is `aria-hidden`; a standalone icon button has an accessible
name; no icon in a heading; no icon-only navigation; the same concept always takes the same icon
across the site *and the product* (the mapping lives in `src/config/icons.ts` and is checked
against `apps/web/src/config/navigation.ts`).

Icons are inlined as React components from `lucide-react` with **per-icon imports only** — a
barrel import pulls 1,400 icons into the bundle and is the single most common way a Next.js
marketing site quietly gains 200 KB.

---

## 7. Logo and brand marks

**Both are the parent company's, unmodified** ([ADR 0010](adr/0010-algoryq-learn-brand-alignment.md)).
Algoryq Learn is a product of Algoryq Technologies, not a separate identity, and a sibling brand
that redraws the mark is a brand that has to be introduced twice.

| Asset | Spec |
|---|---|
| Mark | The Algoryq "A" — an apex, a descending stroke, a brand-coloured crossbar and a detached foot. Same path data and same 100×100 viewBox as `algoryq.com` serves. Implemented as live SVG in `src/components/layout/wordmark.tsx`, not an image. |
| Wordmark | "Algoryq **Learn**" — the mark, then the name in Space Grotesk 600 at 1.375rem, tracking −0.02em, with "Learn" in `--brand-500`. The same construction the parent uses for `algoryq.tech`, so the two lockups read as one family. Live text in the header, so it scales with the user's font size and is selectable. |
| The colour split | Decoration only, never the sole carrier of meaning (WCAG 1.4.1): the two words are also separated by a space, and the accessible name of the enclosing link is the full product name. |
| Gradient | The parent's three-stop crossbar gradient survives only where it can be seen — `public/icon.svg` at 100×100, and `--mk-grad-brand` for rules. At 24px it spans about twelve pixels and resolves to one colour anyway, and an SVG gradient needs an `id`, which duplicates in a component rendered twice per page. |
| Hairlines | `paint-order: stroke` with a stroke of the same paint as the fill, which is how the parent stops the thin wedges from dropping a two-pixel edge at small sizes. |
| Clear space | 0.5× the mark's height on all sides. |
| Minimum size | Wordmark 96px wide; mark 16px. |
| Colour | `--text-primary` on paper, `--mk-on-ink` on ink. **Never** on a gradient, never with a shadow, never rotated. |
| Favicon | The mark, 3 sizes + `icon.svg` + `apple-touch-icon`. |
| Endorsement | "A product of Algoryq Technologies — algoryq.tech", set as text beside the copyright at legal-copy size, plus `parentOrganization` in the `Organization` JSON-LD. A procurement fact, not a badge — see ADR 0010 §Why 2. |

---

## 8. Open Graph and social

> **Deferred, and this section is intent rather than state.** OG *metadata* is complete on every
> route (`src/config/seo.ts` throws on a page without it). The generated *image* is not built —
> see `19` §C. What follows is the spec for when it is.

To be generated at request time by `/api/og/[...]` (Satori) so a new page cannot ship without one.

Layout: 1200×630, ink-900 background with a single aurora blob, the page title in Space Grotesk at
64px (2 lines max, auto-shrinking to 52), an eyebrow in Inter caps, the wordmark bottom-left, and a
1px brand rule. Four variants: `default`, `product`, `security`, `article`. No screenshots in OG
images — they are unreadable at thumbnail size.

Fonts for Satori are the same self-hosted woff2 files, read from disk at build.

---

## 9. Image pipeline

| Rule | Value |
|---|---|
| Formats | AVIF → WebP → PNG fallback, via `<picture>` |
| Widths | 390 / 768 / 1024 / 1440 / 1920, `sizes` set per usage |
| Density | 2× for captures, 1× for diagrams (they are vector anyway) |
| Budget | Hero capture ≤ 180 KB (AVIF, 1440w); any other capture ≤ 120 KB; total per page ≤ 900 KB |
| Loading | One `priority` image per page maximum, and only if it is not the LCP element; everything else lazy with explicit `width`/`height` |
| CLS | Every image has intrinsic dimensions. Target 0.00, budget 0.02. |
| Alt text | From the manifest. Descriptive of *what the screen shows*, not "screenshot of dashboard". Decorative diagrams get `alt=""` plus an adjacent text equivalent. |
| Compression | `sharp` at build; AVIF quality 62, WebP 78, verified visually at 2× on a retina display |

---

## 10. Video

**None at launch.** A 40-second product film is the highest-leverage asset we do not yet have, and
a bad one is worse than none. When it happens (v1.1): self-hosted, no YouTube embed (third-party
origin, banned), `<video>` with `preload="none"` behind a poster frame, captions **required**,
transcript on the page, no autoplay, no background video behind text.

---

## 11. The asset checklist for any new page

- [ ] Every image is a registered capture or a hand-drawn diagram
- [ ] Alt text from the manifest, not invented at the call site
- [ ] Capture date under 90 days
- [ ] AVIF + WebP generated, dimensions set, under budget
- [ ] Dark-mode variant exists and was captured, not inverted
- [ ] 390px variant is a real mobile render
- [ ] Diagrams have `role="img"`, a label and a text equivalent
- [ ] Charts have real data, a source line and a table equivalent
- [ ] OG image renders and is legible at 300px wide
- [ ] Nothing in the page is a composite of two real things
