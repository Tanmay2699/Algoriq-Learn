# Architecture Decision Records — Algoryq Learn Website

Decisions that would otherwise surprise a new engineer or designer, and that someone will
otherwise re-litigate under launch pressure.

| # | Decision | Status |
|---|---|---|
| [0001](0001-separate-static-marketing-app.md) | The marketing site is a separate static app, not a route group in `apps/web` | Accepted |
| [0002](0002-two-layer-token-system.md) | Two-layer tokens: inherit the product's, add a marketing-only `--mk-*` layer | Accepted — amended by 0010 |
| [0003](0003-serif-display-typeface.md) | Fraunces for display ≥40px, Inter for everything else | **Superseded by 0010** |
| [0004](0004-no-unearned-social-proof.md) | No unearned social proof; "Verifiable by" replaces "Trusted by" | Accepted |
| [0005](0005-mdx-in-repo-not-a-cms.md) | Content is MDX in the repository, not a headless CMS | Accepted |
| [0006](0006-lead-form-posts-to-the-products-crm.md) | The demo form posts to the product's own web-to-lead endpoint | Accepted |
| [0007](0007-zero-third-party-origins.md) | Zero third-party origins; cookieless self-hosted analytics | Accepted |
| [0008](0008-dom-recreations-not-screenshots.md) | Product surfaces are DOM recreations, not screenshots | Accepted — supersedes `09` §2 |
| [0009](0009-csp-allows-inline-script.md) | The CSP allows inline script, and says so | Accepted — amends 0007 |
| [0010](0010-algoryq-learn-brand-alignment.md) | Algoryq Learn is a child brand of Algoryq Technologies: parent mark, Space Grotesk, navy ink | Accepted — supersedes 0003, amends 0002 |
| [0011](0011-solutions-segment-photography.md) | Representative photography on the five `/solutions/[segment]` pages only | Accepted — amended by 0012 |
| [0012](0012-site-wide-photography-rollout.md) | Photography extended to 14 more pages with a defensible fit; 37 pages remain text/diagram-only | Accepted — amends `09` §1, §4; amends 0011 |

## Writing a new one

Copy the shape: **Context** (what forced a decision) → **Decision** (one paragraph, imperative) →
**Why** (numbered, most important first) → **Consequences** (including what we give up) →
**Alternatives considered** (with the reason each was rejected).

Number sequentially. Never edit an accepted ADR's decision — supersede it with a new one and mark
the old one `Superseded by NNNN`. The record of *why we changed our mind* is worth more than a
tidy file.
