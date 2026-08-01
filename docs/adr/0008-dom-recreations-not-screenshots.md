# ADR 0008 — Product surfaces are DOM recreations, not screenshots

**Date:** 2026-07-31 · **Status:** Accepted · **Supersedes:** the capture-manifest approach in `09` §2

## Context

`09-VISUAL-LANGUAGE-AND-ASSETS.md` specified 22 screenshots captured from a running product,
132 image files across two themes and three widths, with a `captures.json` manifest and a
staleness rule. Building it exposed two problems.

**The data problem.** The product's demo seed creates a tenant, two branches and six named
people. It does not create collections, enrolment counts or completion rates — so a screenshot
of a dashboard would either be empty or would contain numbers somebody typed in to make the
picture look good. The second is fabrication, and it is the one thing this site may not do.

**The medium problem.** A screenshot is a 180 KB image that cannot re-theme, cannot reflow at
360px, cannot be read by a screen reader, cannot be translated, and goes stale silently.

## Decision

Product surfaces are **recreated in the DOM** using the product's own design tokens, and every
one carries its provenance in a caption that cannot be omitted.

`<ProductFrame>` requires a `provenance` prop with three permitted values:

| Value | What it means | Caption |
|---|---|---|
| `seed` | The people and institute are the product's own checked-in demo seed | "Demo institute — the people and the institute are the product's own seed data." |
| `catalog` | Rendered from the real permission catalogue and role templates | "Rendered from the product's real permission catalog and role templates." |
| `illustrative` | The layout is the product's; the rows are examples | "The layout is the product's. The rows are illustrative examples — we do not publish another institute's data, and we do not invent numbers." |

**And one absolute rule: no metric, ever.** No revenue, no collections, no completion rate, no
uptime, no learner count. Those are the numbers a marketing site is tempted to invent, and
`src/content/demo-data.ts` contains none of them — the role dashboards describe the *work* a
role is shown rather than figures it does not have.

## Why

1. **It is the only honest way to show the software.** An illustrative admissions card labelled
   as illustrative is a diagram. An invented revenue figure is a lie. The distinction is
   enforced by a required prop rather than by a reviewer's memory.
2. **It costs kilobytes, not hundreds of them.** The whole homepage, including seven product
   surfaces, is 130 KB of first-load JavaScript and no images at all.
3. **It re-themes, reflows and is readable.** Every surface passes axe in both themes at 360px
   — which a screenshot cannot do at any price.
4. **It cannot rot silently.** A recreation that references a removed token fails the build.
   A PNG of a screen that no longer exists renders perfectly forever.

## Consequences

- `captures.json`, the capture Playwright project and the 90/180-day staleness rules described
  in `09` §2 are not built. The provenance caption replaces them.
- Recreations must be kept in step with the product by a human reading it, which is weaker than
  a re-capture script. Mitigation: they are structural rather than numeric, so a layout change
  in the product does not make them wrong in the way a stale screenshot is wrong.
- A real screenshot may still be added later for a surface too complex to recreate. It would
  use the same `ProductFrame` and the same provenance contract.

## Alternatives considered

**Screenshots against the seeded demo institute.** Rejected: the seed has no figures, so the
screens would be empty or fabricated.
**Screenshots with invented data.** Rejected outright — this is the rule the whole site rests on.
**No product imagery at all.** Rejected: "show the software" is the visual thesis, and the
product is good enough to show.
