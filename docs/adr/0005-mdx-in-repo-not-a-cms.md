# ADR 0005 — Content is MDX in the repository, not a headless CMS

**Date:** 2026-07-31 · **Status:** Accepted

## Context

The site has two content types (`module` pages and `article`s) across 51 routes. The reflexive
choice is a headless CMS — Sanity, Contentful, Payload — so that non-engineers can edit.

## Decision

Content lives in `website/src/content/**` as MDX with typed front-matter, versioned in git.
No headless CMS in v1.

## Why

1. **The editors are the engineers.** For the foreseeable future, the people writing this copy are
   the people who can open a pull request. A CMS optimises for a workflow we do not have.
2. **Copy changes are claim changes.** Nearly every sentence on this site carries a capability
   claim that must be checked against `01-PRODUCT-TRUTH.md` and registered in `claims.ts`
   (`17` §4). In git, that check is a required review on a diff. In a CMS, it is a convention that
   somebody will bypass at 6pm before a launch — and the whole strategy depends on it not being
   bypassed.
3. **A CMS is a third-party origin and a build coupling.** It breaks the `default-src 'self'` claim
   at build time if content is fetched at runtime, and it makes the site un-buildable when the
   vendor has an outage. For 51 pages, that is a large amount of fragility purchased for very
   little.
4. **Review, history and rollback are free.** Who changed a price, when, and why is `git log`.
5. **MDX composes with the component library.** A module page is front-matter plus prose slotted
   into a shared template, so fourteen pages cannot drift into fourteen layouts.

## Consequences

- A non-technical editor cannot change copy alone. Accepted for v1; revisit when there is a
  marketing hire whose job it is.
- Content and code deploy together. For a static site this is a feature — a copy change and the
  component it renders in are always in sync.
- The revisit trigger is explicit: **more than 30 articles, or a non-engineer owning copy.** At that
  point the candidate is a git-backed editor (something that writes MDX back to the repo), not a
  database-backed CMS, so the claim-checking gate survives.

## Alternatives considered

**Sanity / Contentful.** Rejected on points 2–3.
**A Notion database as the source.** Rejected: no types, no review, and an external dependency at
build time.
**Hardcoded JSX.** Rejected: prose in components is unreviewable and unlocalisable, and it violates
the project's own rule that copy lives in content, not components.
