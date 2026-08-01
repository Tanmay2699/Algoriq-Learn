# ADR 0009 — The CSP allows inline script, and says so

**Date:** 2026-07-31 · **Status:** Accepted · **Amends:** ADR 0007

## Context

ADR 0007 committed the site to zero third-party origins with an enforced
`Content-Security-Policy`. The first implementation wrote the strictest thing that looked
right:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; …
```

It shipped a **white screen on every page**. The App Router streams its render payload through
inline `<script>` tags; the browser blocked all of them, and the served HTML had a `<title>`, a
`<body>` and nothing rendered inside it. Every route returned 200. Every route was blank.

The product's own `next.config.mjs` carries a comment warning about precisely this — *"a wrong
CSP is indistinguishable from a broken application"* — and it was written into this repository
anyway. It was caught by a browser test that loads the built site and counts the `<h1>`s, not by
anybody reading the config.

## Decision

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self';
frame-src 'none'; frame-ancestors 'none'; object-src 'none';
base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```

Enforced, snapshotted by `e2e/headers-and-motion.spec.ts`, and described **accurately** on
`/legal/cookies` and `/trust/sub-processors` — "the only relaxation is inline script and style,
which the framework needs for its own bootstrap" — rather than as a stricter policy than we run.

## Why not a nonce

Next supports a per-request nonce, and it is the correct answer for an application. It requires
**dynamic rendering on every page that uses it**. This site is 48 static files on a CDN; trading
that away would cost far more than the directive buys here, because the threat it defends
against is not present: there is no user-generated content, no authentication, no session, no
cookie and no third-party origin. Nothing but us can put script on this page, and `'self'` still
blocks *loading* one from anywhere else — which is the attack that actually happens to marketing
sites.

If the site ever renders content somebody else authored, this ADR is superseded and the nonce
(with its rendering cost) is the answer.

## Consequences

- The claim on `/security` and `/legal/cookies` is worded precisely. We do not say "strict CSP".
- The snapshot test means widening it further is a failing build and a conversation.
- The lesson is recorded in `13-PERFORMANCE.md` §6 and in the config comment: a security header
  that has never been loaded in a browser is a guess.

## The wider point

Three of the four most serious defects found while building this site were invisible to reading
and obvious to a browser: this one, a `tailwind-merge` configuration that silently deleted every
font-size class from the markup, and a set of contrast failures that only exist at particular
scroll positions. The browser suite is not a formality at the end of the project. It is the
thing that found them.
