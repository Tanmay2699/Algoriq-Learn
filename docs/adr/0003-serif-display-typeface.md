# ADR 0003 — Fraunces for display type, Inter for everything else

**Date:** 2026-07-31 · **Status:** Accepted, with a kill criterion

## Context

The product is set entirely in Inter, and the site inherits Inter for body and UI (ADR 0002). But
the product's ramp tops out at 32px, and a marketing page needs display type up to ~104px. Inter at
104px is competent and anonymous — it is what every developer-tools company on the internet looks
like, and it will not make an institute owner stop scrolling.

The brief asks for "world-class premium typography" and "no generic fonts", and for typography that
"itself sells the product".

## Decision

**Display (≥40px only): Fraunces** — variable, axes `opsz 9–144`, `wght 300–700`, with `SOFT` and
`WONK` **pinned at 0**.
**Text and UI: Inter** variable, as the product.
**Mono: JetBrains Mono**, as the product.

Display is never used below 40px; `--mk-display-3` at 40px is the floor.

## Why

1. **The `opsz` axis is the actual argument.** Optical sizing is what makes very large type look
   *drawn* rather than *scaled* — thin strokes stay thin, joins stay open. Inter has no optical
   size axis, so a 104px Inter headline is a 16px Inter headline enlarged, and it reads that way.
2. **With `WONK: 0` Fraunces is a clean high-contrast Scotch Roman**, not the quirky face its
   specimen suggests. That register — editorial, high contrast, slightly authoritative — is exactly
   right for a buyer who runs an educational institution.
3. **It differentiates.** Every competitor in this category is set in a geometric or neo-grotesque
   sans. A serif display against Inter body is instantly distinguishable in a browser-tab-full of
   evaluations, which is the real competitive environment.
4. **It is free, self-hostable and variable**, so it costs one 42 KB subset file and no third-party
   origin (`13` §4, ADR 0007).
5. **Restricting it to ≥40px protects it.** Below 40px it loses the authority and starts to look
   like a theme. The restriction is a token boundary, not a guideline.

## Kill criterion

If the W4 hero A/B (`10` §9, E5) shows the serif variant underperforming Inter Display by **more
than 8% relative on scroll-to-Act-IV**, we swap. The swap is two token changes
(`--font-display`, the three display tracking values) plus a Figma style update — deliberately
cheap, so the decision is reversible rather than defended.

Documented alternate: **Newsreader** (same family of reasons, softer contrast, slightly warmer).

## Consequences

- Fraunces must be installed for anyone opening the Figma file, with the axes pinned in every text
  style. The file's fallback is Georgia — visibly different, so a missing font is obvious rather
  than silent (`15` §4).
- The display face is subset harder than Inter (no small caps, no alternates, display glyph set
  only) to stay inside the 118 KB font budget.
- `size-adjust` and metric overrides are measured for the fallback so the swap costs 0 CLS. A 6.5rem
  headline reflowing on font load is the single most visible performance failure available to us.
