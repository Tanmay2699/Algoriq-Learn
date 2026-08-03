# ADR 0007 — Zero third-party origins, and cookieless self-hosted analytics

**Date:** 2026-07-31 · **Status:** Accepted

## Context

A normal marketing site loads: a font CDN, an analytics tag, a tag manager, a chat widget, a
CAPTCHA, an error-tracking SDK, a calendar embed and a video player. That is typically 180–400 KB
of third-party JavaScript, four DNS lookups, several long tasks, a cookie-consent obligation and
between six and nine sub-processors.

Algoryq Learn sells to institutions that ask about sub-processors, and its own security posture — no cloud
SDK in feature code, ports not vendors, `docker compose up` as an exit strategy — is a headline
argument on `/security`.

## Decision

**No request may leave `learn.algoryq.com` at runtime.** The CSP is
`default-src 'self'` and a Playwright test fails the build on any request to another host.

Concretely: fonts self-hosted · analytics self-hosted and cookieless (Plausible CE or Umami on our
own subdomain) · no tag manager · no chat widget · no CAPTCHA · no error-tracking SDK · no video
embed · no calendar embed · no map · no social widget.

## Why

1. **The header is a claim we make.** `/security` argues that the product has no cloud lock-in and
   no vendor SDKs in feature code. A marketing site that loads nine third parties while making that
   argument is not credible.
2. **It is the cheapest performance decision available.** It is what makes the budgets in `13` §2
   reachable at all, and it is a five-line CI assertion rather than an ongoing optimisation effort.
3. **No cookies means no consent banner** — no 400ms overlay between a visitor and the headline, no
   consent library, and `/legal/cookies` is one screen.
4. **An empty analytics row on `/trust/sub-processors`** answers a procurement question before it
   is asked.
5. **The CAPTCHA case is a good illustration.** A CAPTCHA would be a third-party origin, a
   cognitive-function test that engages WCAG 2.2 SC 3.3.8, and a conversion cost — to defend a form
   that already has a honeypot, a timing floor and the API's own per-tenant rate limit.

## Consequences

- We lose GA's demographic reports, cross-session attribution and multi-touch modelling. Accepted,
  and stated plainly in `16` §2 rather than pretended around. The one attribution point we keep —
  `ref` on the lead — is first-party and real.
- We must operate an analytics instance. Small, and it is a container.
- The site works identically with analytics blocked or absent; `ANALYTICS_URL` unset disables it
  honestly rather than as a silent no-op.
- A future video needs self-hosting with captions and a transcript, not a YouTube embed.
- Scheduling a demo is a human sending a link, not an embedded calendar.
- **The exception process:** widening the CSP requires an ADR superseding this one. The
  `security-headers.spec.ts` snapshot makes the change visible in a diff; it cannot happen quietly.

## Alternatives considered

**GA4 + a consent banner.** Rejected on all five points.
**A "privacy-friendly" hosted analytics vendor (Plausible Cloud, Fathom).** Closer, and still a
third-party origin and a sub-processor row. Self-hosting the same software costs one container.
**No analytics at all.** Tempting, and rejected: the act funnel (`16` §5.2) is the single most
useful thing we can learn, and a cookieless aggregate count is a proportionate way to learn it.
