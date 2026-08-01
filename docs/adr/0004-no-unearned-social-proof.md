# ADR 0004 — No unearned social proof; "Verifiable by" replaces "Trusted by"

**Date:** 2026-07-31 · **Status:** Accepted

## Context

The originating brief asks for customer logos, testimonials, awards, case studies, success metrics
and compliance badges. Akechi has **none of them**: the product is feature-complete against its
roadmap but has not been deployed to a paying customer.

The product's own first working rule is *no fabricated data, ever*, and its UI ships an honest
`ModuleStub` component rather than fake charts. A marketing site that violates that rule on the
homepage would contradict the argument the homepage is making.

## Decision

1. **No invented proof of any kind.** No placeholder logos, no representative testimonials, no
   "trusted by 10,000+ institutes", no `AggregateRating` schema, no compliance badge without a
   certificate.
2. **The proof components return `null` on empty input** — `<ProofBand>`, `<Testimonials>`,
   `<CaseStudies>`, `<Awards>`. Not a skeleton, not a placeholder, nothing.
3. **The layout must read as finished when they are empty.** This is a design requirement with a
   visual test behind it, and the empty rendering is signed off in Figma as a design in its own
   right (`15` §7).
4. **Where a logo band would go, a "Verifiable by" band goes**: six things a stranger can check in
   ninety seconds — a live sandbox, the API reference, a public certificate verifier,
   `docker compose up`, the accessibility statement, and the honest build-status page.
5. **One sentence above it, permanently:** *"We have no customer logos to show you yet. Here are six
   things you can check without asking us."*

## Why

1. **It is the only defensible position.** Enterprise buyers call references. A fabricated logo is
   discovered in the first serious conversation, and it destroys every other claim on the page —
   including the true, unusual, hard-won ones about RLS and permission enforcement.
2. **It converts the weakness.** For the two personas who kill deals in this category — the IT
   reviewer and procurement — checkable evidence is *strictly better* than logos. They cannot
   verify a logo. They can `docker compose up`.
3. **It is unfakeable.** A competitor can add logos tomorrow. They cannot publish a permission
   catalog they have not built, an RLS exemption list they cannot justify, or an accessibility
   statement with real open items.
4. **It compounds.** The design-partner offer (`10` §8) turns the "you have no customers" objection
   into a specific, reciprocal, time-boxed ask — which is a better first conversation than a logo
   would have started.

## Consequences

- `pnpm claims:check` fails the build on an unreferenced claim, so this survives launch pressure
  (`17`).
- Act XI of the homepage is shorter at launch than it will be at +90 days. Designed for both.
- When the first real case study lands, the "no logos" sentence **moves to `/trust`** rather than
  disappearing — it is a statement about how we work, not a temporary apology.
- `/customers` exists but is not in the navigation until it has a real entry.

## Alternatives considered

**"Coming soon" placeholders.** Rejected: a promise with no cost attached, and it looks like a
half-built site rather than a deliberate one.
**Logos of technologies we use (Postgres, Next.js) styled as customer logos.** Rejected: it is a
lie told with a technicality, and everyone recognises it.
**Removing the section entirely.** Rejected: the slot is where a visitor *looks* for reassurance,
and leaving it empty wastes the attention. Fill it with something better.
