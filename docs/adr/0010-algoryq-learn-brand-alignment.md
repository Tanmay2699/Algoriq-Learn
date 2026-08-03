# ADR 0010 — Algoryq Learn is a child brand of Algoryq Technologies, not a new one

**Date:** 2026-08-01 · **Status:** Accepted
**Supersedes:** [ADR 0003](0003-serif-display-typeface.md) (display typeface)
**Amends:** [ADR 0002](0002-two-layer-token-system.md) (layer 1 is no longer byte-identical upstream)

## Context

The product formerly called Akechi is now **Algoryq Learn**, a product of **Algoryq Technologies
Private Limited**, which already has a live public identity at `algoryq.com`: a blue "A" mark with
a gradient crossbar, Space Grotesk over Inter, and a near-black navy ground.

That identity is not a moodboard we were handed — it is a site that exists, that some visitors will
have seen first, and that a procurement reviewer will find in about four seconds of searching the
vendor's name. So the question was never "what should Algoryq Learn look like". It was: **how much
of the parent do we inherit, and where are we allowed to differ.**

## Decision

Algoryq Learn is presented as a **product of** Algoryq Technologies, sharing the parent's mark and
face, distinguished only by the wordmark and by domain.

| | Decision |
|---|---|
| **Mark** | The parent's, unmodified. Same path data, same 100×100 viewBox. |
| **Wordmark** | "Algoryq **Learn**" — "Learn" in `--brand-500`, mirroring the parent's `algoryq.tech` lockup. |
| **Display face** | **Space Grotesk** (variable, 300–700, latin), replacing Fraunces. Still ≥40px only. |
| **Text / UI face** | Inter, unchanged. |
| **Brand ramp** | Re-authored from the mark's own gradient stops: `--brand-500` `#1b5cd4`, `--brand-600` `#1450b8`, `--accent-500` `#5f76fc` (Algoryq "pulse"). |
| **Ink** | Navy (`#070c18` / `#0d1524` / `#16203a`), from the mark's plate, replacing neutral black. |
| **Neutrals & status** | **Unchanged.** Still the product's, byte for byte. |
| **Domain** | `learn.algoryq.com`; app `app.learn.algoryq.com`; sandbox `sandbox.learn.algoryq.com`. |
| **Endorsement** | Footer line + `parentOrganization` in the `Organization` JSON-LD. |

## Why

1. **A child brand that redraws the mark has to be introduced twice.** The parent has spent its
   domain trust on a specific "A". Inheriting it means a visitor arriving from `algoryq.com` never
   has to be told the two are the same company, and a reviewer checking whether the vendor is real
   lands somewhere that corroborates instead of somewhere that raises a second question.
2. **The endorsement is a procurement fact, not a badge.** "Who am I actually contracting with"
   is an early question on any institutional purchase, and this site's whole position is that
   checkable facts beat logo walls (ADR 0004). So it is stated as text next to the copyright, and
   again in markup where a crawler can join the two organisations up.
3. **Space Grotesk costs less than the face it replaces and says the right thing.** Fraunces was
   chosen to sound editorial and institutional; the parent sounds like an engineering company, and
   the child of an engineering company should not out-serif its parent. It is also **22 KB against
   Fraunces' 67 KB** — a 45 KB refund against the font budget in `13` §2.
4. **The brand ramp was measured, not sampled.** The mark's mid stop `#2E7BE8` measures **4.09:1**
   on white and was rejected: `--brand-500` is simultaneously the link colour and the primary
   button fill, so it has to clear 4.5:1 in both readings. `#1b5cd4` is the same hue two steps down
   at 5.95:1 on `--surface` and 5.5:1 on `--surface-muted`. `src/test/contrast.spec.ts` holds it.
5. **Neutrals were deliberately left alone.** They passed an accessibility pass in the product, one
   of them (`--text-muted`) was tuned to a fourth decimal place to clear 4.5:1 on the recessed
   surface, and a rebrand is a change of brand — not a licence to redraw everything a brand colour
   happens to sit next to.

## What this costs

**Layer 1 is now ahead of the product, and this is a debt.** ADR 0002 says
`src/styles/tokens.product.css` is a vendored copy edited only upstream. Four tokens in it are now
edited *here*, because the rebrand originated on the marketing side and this repository cannot
write to the product monorepo. Until `packages/ui/src/styles/tokens.css` and the Figma `Color`
collection carry the same four values, **the product and this site render two different blues.**

The debt is recorded in three places on purpose — this ADR, a table in the header of
`tokens.product.css`, and `19-PROGRESS-TRACKER.md` — because the last time this file drifted from
its source it went unnoticed for three days (`tokens.product.css`, the 2026-07-23 status-colour
incident) and the thing that failed then was that nobody had written down that it *could* drift.

**Optical sizing is gone.** Space Grotesk has no `opsz` axis, so ADR 0003's strongest argument no
longer applies: a 6.5rem headline is now a scaled 16px headline in the way that ADR objected to.
Accepted knowingly. The face's own quirks at display size — the flat-sided `o`, the squared bowls,
the single-storey `a` — do the work `opsz` used to, which is why the ≥40px floor stays: those same
quirks read as noise in a paragraph.

**Two names now exist for one thing.** The product monorepo still ships as `@akechi/*` and
`AkechiLMS`, and every reference to it in this repository is left spelled that way. Renaming them
here would invent paths into a repository this one only *references* — and every claim on this site
is supposed to resolve to a file somebody can open. They get renamed when the product renames them,
in the product's own commit, and this repository follows.

## Alternatives rejected

- **A distinct Learn mark** (the "A" with a book, a graduation cap, a distinguishing glyph). Buys
  product-level recognition Algoryq Learn has not earned yet, at the cost of the parent recognition
  it can have for free today. Revisit if and when the product is better known than the company.
- **Keeping Fraunces and taking only the colour.** Cheaper — no new font file, no ADR. But type is
  the loudest thing on a page above 40px, and a sibling site whose headlines are set in a different
  category of face does not read as a sibling; it reads as an acquisition.
- **A standalone `algoryqlearn.com`.** Starts a second domain's reputation from zero and splits the
  parent's. A subdomain inherits it on day one.
