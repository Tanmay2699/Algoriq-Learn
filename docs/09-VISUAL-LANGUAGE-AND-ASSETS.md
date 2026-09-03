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

> **Photography is no longer "none," but it is still bounded, and the bound is written down.** The
> homepage hero (§10), the five `/solutions/[segment]` pages ([ADR 0011](adr/0011-solutions-segment-photography.md))
> and fourteen further pages ([ADR 0012](adr/0012-site-wide-photography-rollout.md)) carry
> photography/footage under the same three conditions: real or representative rather than
> fabricated, atmosphere rather than a claim, disclosed honestly. ADR 0012 also lists the pages
> that do **not** get a photo, and why — a fabricated-looking match (`/customers`, whose own copy
> says there are no customers yet) is rejected even when a leftover file exists, and a genuine
> materials gap (no relevant still, no way to generate one in this environment) is stated rather
> than papered over with a mismatched image.

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
None at launch. Since then: the homepage hero video (§10, shipped 2026-09-01), the five
`/solutions/[segment]` pages ([ADR 0011](adr/0011-solutions-segment-photography.md), shipped
2026-09-03), and fourteen more pages judged individually against the same bar
([ADR 0012](adr/0012-site-wide-photography-rollout.md), shipped the same day) — representative
rather than a real named institute, disclosed as such in a caption, never a background for text.
Forty-two pages still carry none, either because no photograph fits what the page is about or
because the fit would contradict the page's own copy (`/customers`, most notably — see ADR 0012).
A photograph proposed for any of those pages earns its own decision against that same bar; the
existence of fourteen approved pages is not itself the argument for a fifteenth.

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

**The homepage hero, shipped 2026-09-01.** This section originally read "none at launch," with
the rule for whenever it happened: self-hosted, `preload="none"` behind a poster, captions
required, transcript on the page, **no autoplay, no background video behind text**. The hero that
shipped breaks the last two of those on purpose, and this entry exists to say exactly what
replaced them and why, rather than leave the old rule standing next to a page that no longer
follows it.

**Why the exception.** The brief asked for a looping background video behind the header text,
specifically. "No autoplay, no background video behind text" was written as a blanket rule
because both are usually accessibility and performance liabilities with no real payoff — this is
the one page on the site where a stakeholder decision took that trade-off deliberately, and the
mitigations below are what earned it rather than what excused it.

**The footage.** `people-entering-coaching-institute` (stock), trimmed to five unbroken shots —
arrival, the reception desk, a class, an exam, a certificate handed over — 18.29s total, looped.

  - **Re-cut 2026-09-03** from the 3840×2160 / 26.5s master, replacing an earlier encode taken
    from a 1080p / 25s copy of the same source. Same shots, same cut policy, more resolution to
    downscale from; the source timestamps below are the master's and are ~0.3s later than the
    ones this entry carried before, because the two copies do not share a zero.
  - Cut list (source timestamps): `0.00–7.60` · `12.30–16.80` · `19.40–25.60`.
  - What was cut, and why it had to be: three segments of the source (`7.60–12.30`,
    `16.80–19.40`, and `25.60–26.50`) show a tablet, a laptop, and a phone each running a
    fabricated "SCHOOL PORTAL" interface — a screenshot of software that does not exist, styled
    as an admissions/enquiry flow with invented data ("Kavya, Grade 5", enquiry timestamps). That
    is exactly what rule 7 (product renderings are real) and rule 1 (no fabricated data) exist
    to prevent, and it would have shipped on the single most prominent pixel on the site,
    autoplaying, on loop, had it not been caught and cut before encoding. **Re-derive these
    boundaries against the file in hand before any future re-encode** — they are properties of
    one copy of the footage, not of the footage.
  - Encodes: `hero-desktop.{mp4,webm}` (1600×900, 3.30 / 2.96 MB) and `hero-mobile.{mp4,webm}`
    (960×540, 1.52 / 1.59 MB), no audio track, served via `<source media>`. Poster:
    `hero-poster.jpg` (960w, ~46 KB), the clip's own first frame — no pop-in between poster and
    playback.
  - **The supplier's four-point sparkle watermark is removed**, low-right, and the frame is
    otherwise untouched — no crop, no zoom, no reframing; the encodes are the same 1600×900
    and 960×540 they were. It is not painted over. The mark is a static alpha composite, so
    for each pixel under it the relationship `observed = slope × background + intercept` was
    fitted by least squares across the frames whose local background is flat, then inverted
    to recover the original pixels. Fitted off-mark as a control, slope came out 1.002 and
    intercept 0.83 — i.e. the estimator leaves untouched background untouched — and the
    overlay resolves to ~24% covered at the widest point in a colour of ~242, not pure white,
    which is why a white-alpha assumption over-subtracts. Residual after inversion is
    2–4/255 against a 2.6/255 measurement floor. A faint outline is still findable on a
    paused still if you know where to look; in motion, behind the scrim, it is gone. `delogo`
    was tried first and rejected: it interpolates from the box edge, which smears the desk
    edge and the skirting line straight through two of the five shots.
  - Nobody is Sunrise Academy in this footage and nothing on screen is captured from the running
    product; it is atmosphere, not a claim, and carries no entry in `claims.ts` for the same
    reason the aurora gradient does not.

**No captions, no transcript.** Both are required for footage that carries information —
speech, on-screen text that matters, anything a viewer would lose by not watching. This clip is
silent (no audio track at all) and decorative (`aria-hidden="true"`); there is nothing in it for
a transcript to transcribe. The rule was written for the 40-second product film this section
used to describe, which would have had both.

**Autoplay, made as safe as an autoplaying background video can be made:**

  - `preload="none"` in the server HTML, unconditionally — nobody fetches ~3 MB of video who
    is not actually going to see it move.
  - `prefers-reduced-motion: reduce` never calls `.play()`. The video sits on its poster frame,
    a perfectly ordinary static hero image, and a visible control still offers to start it —
    the setting is "don't start this on me," not "never let me choose to."
  - A visible pause control (WCAG 2.2.2): `aria-pressed`, a name for the action about to
    happen ("Pause the background video," not "Playing"), keyboard-reachable, 44×44 target.
    Icon-only since 2026-09-03 — a pause/play glyph in a translucent disc, no caption. The
    name moved to `aria-label` rather than being dropped along with the caption: an unnamed
    icon button is the commonest way a control like this becomes unusable without sight, and
    it is what `video-hero.spec.ts` locates the control by.
  - It hangs off the `<section>`, not off `container-mk`, inset by `--mk-gutter` on both axes.
    The container is capped at 80rem and centred, so a control positioned against it drifts
    inward from the footage's own corner as the viewport grows — about 344px short of the
    edge at 1920. Anchored to the section it holds a symmetric corner inset at every width:
    20px at 360, 35px at 1280, 40px at 1920.
  - Self-hosted, muted, `playsInline`, `loop` — no third-party origin, ADR 0007 intact.

**The header, over this one section only.** `SiteHeader` blends to a translucent ink tint
(`rgb(7 12 24 / 0.75)`, not full transparency) while the hero is on screen, and reverts to its
normal solid background the instant a second, independent `IntersectionObserver` reports the
reader has scrolled past it — see the long comment on `overHero` in `header.tsx`. Two things
about that number are load-bearing, not decorative:

  - It is **translucent, not transparent**, specifically because axe's `color-contrast` check
    walks the DOM ancestor chain for a declared background and cannot see the hero's own scrim
    — a sibling of the header, not an ancestor of it. A fully transparent header left on-ink
    text with nothing in its own ancestor chain to check contrast against, and axe correctly
    failed it even though a human looking at the page would have seen the (visually correct)
    video-plus-scrim behind it. `rgb(7 12 24 / 0.75)` is a real background in the text's own
    ancestor chain: composited against a worst-case pure-white backdrop it still clears ~8.5:1
    (AAA, not just the AA floor).
  - `background-color` is deliberately **not** in the header's CSS transition list. `color` has
    no transition and snaps to its final value the instant the state flips; a smoothly-easing
    background would still be mid-fade at that same instant, meaning on-ink text — already
    fully light — sitting over a background only part-way to dark. Axe caught that exact window
    directly, as a real (if sub-200ms) contrast failure. Both now switch atomically.

**Performance, honestly.** `docs/13-PERFORMANCE.md` states the homepage LCP as a text node and a
900 KB total-page-weight budget. A 1.4–3.6 MB looping video is a deliberate breach of the second
number, not an oversight — see the note added there. First-load *JS* barely moves (+4 KB, for
the autoplay/pause/sentinel logic); the cost is entirely in the video bytes, which do not count
against the JS budget but do count against total page weight and are very unlikely to leave LCP
as a text node on this one route.

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
