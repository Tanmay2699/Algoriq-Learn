# ADR 0002 — Two-layer tokens: inherit the product's, add a marketing-only layer

**Date:** 2026-07-31 · **Status:** Accepted · **Amended by [ADR 0010](0010-algoryq-learn-brand-alignment.md) on 2026-08-01**

> **Amendment: layer 1 is no longer byte-identical to upstream, and that is a tracked debt.**
> This ADR says `tokens.product.css` is a vendored copy edited only in `packages/ui`. Four brand
> tokens — `--brand-500`, `--brand-600`, `--brand-soft` and `--accent-500` — are now authored
> *here*, because the rebrand originated on the marketing side and this repository cannot write to
> the product monorepo. Until the product carries the same values, the two render different blues.
> (The navy ink the rebrand also introduced is `--mk-ink-*`, layer 2, and carries no such debt.)
>
> The rest of the decision stands unchanged: neutrals and status tokens are still upstream's byte
> for byte, layer 2 is still `--mk-*`-only, and the direction of authority is still product → site.
> The four exceptions are listed in the header of `src/styles/tokens.product.css` and tracked in
> `19-PROGRESS-TRACKER.md` §E.

## Context

The product has a mature token system: `packages/ui/src/styles/tokens.css`, mirrored by the Figma
`Color` and `Scale` collections, with light and dark modes and a hard-won accessibility history.
A marketing site needs things an application ramp does not have — display type up to ~104px, 17px
body, section-scale spacing, dark "ink" surfaces, gradients, glass.

The default industry behaviour is for marketing to fork the palette. Six months later the website
and the product are visibly different companies.

## Decision

**Layer 1** — the product's tokens, imported and treated as immutable inside `website/`.
**Layer 2** — a marketing-only layer, every token namespaced `--mk-*`, defined in
`website/src/styles/tokens.marketing.css`, which may never appear in `apps/web`.

A lint rule fails the build if `website/` assigns any layer-1 token
(`--brand-*`, `--surface-*`, `--text-*`, `--success*`, `--warning*`, `--danger*`, `--border`,
`--radius*`).

## Why

1. **Continuity is the differentiator.** A visitor who clicks from the hero into the sandbox should
   land somewhere that looks like where they came from. That is a product claim made visually, and
   it costs nothing.
2. **The colour work is already done, and was expensive.** The status tokens carry a documented
   accessibility history — the product shipped for three days with error text at 2.1:1 because the
   fill tokens were used as text tokens. Re-deriving a palette for marketing would discard that
   knowledge and probably repeat the mistake.
3. **Namespacing makes the boundary enforceable** rather than cultural. `--mk-` is greppable, and
   the rule survives the person who wrote it leaving.
4. **It forces the right conversation.** When a designer wants a bigger heading, the answer is a
   new `--mk-*` token, not an "adjustment" to `--brand-500` that then diverges from Figma.

## Consequences

- `website` must be a pnpm workspace member to import `@akechi/ui` (ADR 0001).
- A layer-1 change in `packages/ui` propagates here automatically — which means the site's contrast
  matrix test must run on the product's token values, and it does.
- The Figma marketing file links the product file as a library rather than copying it (`15` §1).
- Any marketing need that would require changing a layer-1 token is escalated to the product
  design system, changed in `packages/ui` and Figma in the same commit, or dropped.

## Alternatives considered

**One flat token set for the site.** Rejected — it is a fork with extra steps.
**Publishing `@akechi/ui` as a versioned package the site depends on.** Rejected — it inserts a
release cycle between a token fix and the site, which is exactly the gap in which drift happens.
