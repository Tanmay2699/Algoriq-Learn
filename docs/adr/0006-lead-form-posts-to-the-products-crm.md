# ADR 0006 — The demo form posts to the product's own web-to-lead endpoint

**Date:** 2026-07-31 · **Status:** Accepted

## Context

The site needs one form. The usual options are a form service (Formspree, HubSpot), an email
handoff, or a small database on the marketing side.

Akechi's CRM module already ships a hardened public capture endpoint:
`POST /public/institutes/:slug/enquiries` — the module's only unauthenticated write, deliberately
scoped to what a stranger may decide.

## Decision

`/api/lead` on the website forwards to that endpoint against our own tenant (`AKECHI_TENANT_SLUG`).
**Our marketing leads land on our own product's admissions board.** Nothing is stored on the
website.

## Why

1. **It is the most honest possible demonstration of the module.** We can say, on
   `/product/modules/admissions-crm`, that the form the reader just used created a lead on the
   board in the screenshot above it.
2. **Dogfooding with consequences.** If the round-robin assignment, the duplicate suggestion or the
   follow-up reminder is wrong, we feel it on our own funnel, weekly, before a customer does.
3. **The endpoint is already hardened in ways a form service is not.** It forces `source=WEB`; it
   has no field for stage, owner or pipeline (those fields are *absent from the schema*, not
   validated away, because a field that is accepted and then overridden is one somebody eventually
   forgets to override); it returns a fixed acknowledgement so it cannot be used to ask "is this
   email on file?"; it answers identically for an unknown or a suspended institute so it cannot
   enumerate tenants; it notifies nobody automatically, because an unauthenticated request that can
   put a message in a named person's inbox is a spam vector wearing a feature's clothes. We can
   publish that threat model on `/developers`. A form vendor's threat model is not ours to publish.
4. **No third-party origin**, so `default-src 'self'` holds (ADR 0007).
5. **No data on the marketing side** means no database, no retention policy, no sub-processor row,
   and nothing to breach.

## Consequences

- The site has a runtime dependency on the product API for one route. Mitigated: the form's failure
  path preserves every value, states the failure, and offers a `mailto:` fallback — it never
  silently retries, because a duplicate on a counsellor's board is worse than a visible failure.
- A nightly contract test submits a real lead against a real instance, so a shape change in the
  product is caught by us rather than by a prospect.
- We must run a production tenant for ourselves. That is a cost we were going to pay anyway, and it
  makes us our own first customer in the only sense that matters.
- The lead carries `intent` and `ref` (the referring page), which is the site's one honest
  attribution point given that we set no cookies (`16` §2).

## Alternatives considered

**A form service.** Rejected: a third-party origin, a sub-processor, and a missed opportunity.
**Email only (`mailto:`).** Rejected as the primary path — completion rates collapse — but kept as
the failure fallback.
**A database on the marketing side.** Rejected: two systems of record for a lead, which is the exact
failure mode the product exists to fix.
