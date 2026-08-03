# 00 — MASTER IMPLEMENTATION PLAN · Algoryq Learn Website

**The single source of truth for building `learn.algoryq.com`.** Every other document in `docs/`
expands one section of this file.
Version 1.0 · written 2026-07-31 · Status: **specified, not built**

---

## 0. How to read this

| If you are… | Read, in order |
|---|---|
| Starting cold (human or agent) | `../CLAUDE.md` → this file → `01-PRODUCT-TRUTH.md` |
| Writing copy | `02`, `17`, `11` |
| Designing | `05`, `06`, `07`, `09`, `15` |
| Building | `14`, `06`, `13`, `12` |
| Reviewing before launch | `18`, `17`, `12`, `13` |
| Leadership | §1–§4 of this file |

**The one rule that outranks the others:** everything on this site must be true and checkable.
The product is pre-first-deployment. It has no customers, no logos, no awards and no uptime
history. A site that pretends otherwise is a site that fails its first security review. §5
explains what we use instead, and it is stronger than what we are giving up.

---

## 1. Executive summary

### What we are building

A **12-act homepage** plus **48 supporting pages** that let an institute owner, an academic head,
an IT reviewer and a procurement officer each reach a decision without speaking to sales. It is
statically rendered, has no third-party scripts, loads in under two seconds on a mid-range phone
on 4G, meets WCAG 2.2 AA with automated proof, and is built from the product's own design tokens
so that the site and the software are visibly the same object.

### Why it is different from every other LMS website

| Everyone else | Algoryq Learn |
|---|---|
| Stock photography of smiling students | The actual product, captured from a running instance, dated |
| "Trusted by 10,000+ institutions" | A **Verifiable by** band: things the visitor can check *right now* — the API reference, a live sandbox, a public certificate verifier, the accessibility statement, `docker compose up` |
| A feature list | A **lifecycle spine** — enquiry → admission → learning → assessment → certificate → placement — with the module that owns each step |
| "Enterprise-grade security" | The permission catalog (272 keys), the RLS policy set, the hash-chained audit log, and the CI gate that enforces them, each linked to a file |
| A roadmap page that is marketing | `/trust/build-status` — the real module completion matrix, including the modules at 45% |
| Screenshots of a dashboard | A hero where the visitor **switches role** and watches one product become four different products, which is the architecture claim, demonstrated |

### The three things the homepage must prove

1. **It is one system, not five.** The institute currently runs Moodle + Zoom + Google Forms +
   Excel + WhatsApp + a payment link (`docs/01-BRD.md` §1 in the product repo). Algoryq Learn is the
   system of record that replaces the set.
2. **It is safe to buy.** Tenant isolation is in the database, not in a `WHERE` clause somebody
   remembered. Authorization is deny-by-default and CI-enforced. Every mutation is audited on a
   hash chain. Accessibility is a build gate.
3. **It is finishable this term.** Content authoring is AI-assisted, migration is a CSV import,
   the whole stack boots with `docker compose up`, and there is a free tier with 100 seats.

### Timeline and shape

**8 weeks, five phases, one designer + one design engineer + one writer.** Phase W1–W3 produce
a launchable site (homepage, product, pricing, security, demo). W4–W5 are depth and scale.
Full breakdown in §6; the critical path is *content and product captures*, not code.

---

## 2. Scope

### 2.1 In scope — v1 (launch)

The homepage · 7 product-cluster pages · 14 module pages · 5 solution pages · pricing · security &
trust (4 pages) · developers/API · a demo/contact journey wired into the product's own CRM ·
resources index + first 6 articles · 4 comparison pages · legal (5) · accessibility statement ·
build-status · 404/500 · sitemap/robots/OG · the full design system in Figma and in code.

### 2.2 In scope — v1.1 (first 90 days after launch)

Case studies (**gated on a real customer agreeing**) · interactive product tour · ROI calculator
v2 with saved scenarios · Hindi locale · a changelog fed from the product tracker · a status page
fed from real telemetry once the product's observability exporter is wired.

### 2.3 Explicitly out of scope

A headless CMS (ADR 0005) · user accounts or gated content · a community forum · a job board ·
live chat with a human (an unstaffed chat widget is worse than none) · e-commerce checkout (the
product's billing module has no payment gateway adapter yet — `MEMORY.md` §5) · any page whose
content does not exist yet.

### 2.4 The 37-beat brief, honoured

The originating brief specified 37 homepage sections. Thirty-seven sections on one page is
information overload, which the same brief prohibits. The resolution: **all 37 beats are
delivered, grouped into 12 acts**, each act carrying one idea. Beats that need room (case
studies, comparison, integrations) appear compressed on the homepage and in full on a dedicated
page reached from that act. The complete mapping — beat → act → page → status — is
`04-HOMEPAGE-NARRATIVE.md` §2. Nothing was dropped.

---

## 3. The product, in one table

Extracted from the codebase on 2026-07-31. Full detail in `01-PRODUCT-TRUTH.md`.

| Dimension | Reality |
|---|---|
| Shape | One NestJS modular monolith · one PostgreSQL 16 database · one Next.js 15 frontend |
| Backend | 31 modules · 53 controllers · **497 routes** · 135 Prisma models · 61 migrations |
| Frontend | **78 routes**, one app, role-based dashboards after a single login |
| Authorization | **272 permission keys**, 264 enforced on a route, deny-by-default, CI-gated |
| Tenancy | Shared schema, `tenant_id` + **Postgres RLS forced on 114 tables**, app role is not superuser |
| Roles | 11 system role templates, fully customisable per tenant; nothing branches on a role name |
| Design system | Inter, brand `#5b5bd6`, accent `#12a594`, radius 6/10/16, light + dark, Figma-synced |
| Locales | 8 tags across 5 catalogs (en-IN/GB/US, hi-IN, ar-AE/SA/EG, ja-JP), **RTL supported** |
| Accessibility | WCAG 2.2 AA, axe in Storybook and Playwright, 360px-first, no drag-without-keyboard |
| Tests | 1,316 unit · 54 integration suites on real Postgres · 52 Playwright specs |
| Portability | Storage / mail / search / AI / cache are ports with multiple drivers; `docker compose up` boots everything |
| Plans (real, seeded) | Starter ₹0 (100 seats) · Growth ₹14,999/mo (1,000 seats) · Enterprise (negotiated) |

---

## 4. Architecture of the site

```
learn.algoryq.com  ──────────────────────────────────────────────┐
  Next.js 15 App Router · TypeScript strict · Tailwind    │
  Static (SSG) for 48 of 51 routes                        │
                                                          │
  ├─ /                 the 12-act homepage                 │
  ├─ /product/*        7 clusters + 14 modules             │
  ├─ /solutions/*      5 institution types                 │
  ├─ /pricing          real plans, fetched at build        │──► GET /public/plans   (to build*)
  ├─ /security /trust/* evidence, sub-processors, DPA      │
  ├─ /developers       the OpenAPI reference               │──► apps/api OpenAPI export
  ├─ /compare/*        sourced, dated, factual             │
  ├─ /resources/*      MDX articles                        │
  └─ /demo             the only form on the site           │──► POST /public/institutes/
                                                          │      algoryq-learn/enquiries  (exists)
  3 server routes: /api/lead · /api/plans · /api/og        │
  0 third-party origins. CSP: default-src 'self'.          │
└──────────────────────────────────────────────────────────┘
```

`* GET /public/plans` does not exist yet. `GET /plans` is behind `tenant.usage.view` and its own
source comment says "the marketing site can publish whatever it chooses to"
(`apps/api/src/modules/plan/controller/plan.controller.ts`). Task **W2.6** adds a `@Public()`
route filtered to `is_public = true` so the pricing page has one source of truth rather than a
second copy of the numbers. It is the only change this project asks of the product repo.

Full detail: `14-TECHNICAL-ARCHITECTURE.md`.

---

## 5. The proof problem, and the answer

The brief asks for customer logos, testimonials, awards, case studies, success metrics, ISO and
SOC 2 badges. **We have none of them.** The product has not been deployed to a paying customer.
Fabricating any of them violates the product's own first rule and, more practically, gets caught:
enterprise buyers call references.

### What we do instead

**Replace *social* proof with *verifiable* proof.** Where a competitor puts six grey logos, we put
six things a stranger can check in ninety seconds without talking to us:

| Slot | What goes there at launch | Where it comes from |
|---|---|---|
| 1 | **Open the sandbox** — a live demo institute, no signup | `pnpm db:seed` "Sunrise Academy", read-only tenant |
| 2 | **Read the API** — the full OpenAPI reference | exported from the running NestJS app |
| 3 | **Verify a certificate** — paste a code, no login | `/verify/[code]`, already public in the product |
| 4 | **Run it yourself** — `docker compose up` | `docker-compose.yml` boots the entire stack |
| 5 | **Accessibility conformance** — the statement, with the failures listed | `12-ACCESSIBILITY.md` |
| 6 | **Build status** — the honest module matrix, including 45% | `docs/12-PROGRESS-TRACKER.md` §D |

This is not a consolation prize. For the two personas who kill deals — the IT reviewer and
procurement — it is strictly better than logos. And it is *unfakeable*, which is the point.

### The rules that keep it honest

1. `<ProofBand>`, `<Testimonials>`, `<CaseStudies>`, `<Awards>` return `null` on empty input.
   Designed so the page reads as finished without them (`06-COMPONENT-LIBRARY.md` §4.2).
2. A compliance badge appears only after the certificate exists. The product has a **SOC 2 policy
   set and an evidence pack** (`docs/15-SOC2-POLICY-SET.md`, E28) — that is "we have built the
   evidence machinery", not "we are certified", and the copy says exactly that.
3. Every claim is registered in `src/lib/claims.ts` with an evidence pointer. `pnpm claims:check`
   fails CI on an orphan. See `17-EVIDENCE-AND-CLAIMS-POLICY.md`.
4. A **proof acquisition plan** runs in parallel with the build (§8) so the slots fill with real
   things in the first ninety days.

---

## 6. Phases

Five phases. Each ends at a gate that can be failed. Effort assumes one design engineer building,
one designer in Figma one phase ahead, and one writer one phase ahead of the designer.

### Phase W1 — Foundation (Week 1–2)

The system everything else is assembled from. No marketing pages ship in W1 and that is correct;
the reason most SaaS sites drift is that page 3 invents a card style.

| # | Task | Output | Doc |
|---|---|---|---|
| W1.1 | Add `- 'website'` to `pnpm-workspace.yaml`; scaffold `@algoryq/learn-website` | app boots on :3001, imports `@akechi/ui` | 14 §2 |
| W1.2 | Token layer 2 (`--mk-*`): display type, section rhythm, gradients, glass, wide grid | `tokens.marketing.css` + Tailwind extension | 05 §2–4 |
| W1.3 | Self-host and subset fonts (Inter var, Space Grotesk var display) | 2 woff2, 70 KB total, both preloaded | 05 §3, 13 §4 |
| W1.4 | Primitives: Button, Link, Eyebrow, Heading, Prose, Card, Badge, Reveal, Marquee, Tabs, Accordion, Dialog, Field, Table | 14 components, Storybook, axe-clean | 06 §2 |
| W1.5 | Layout shell: header + mega-menu, footer, skip link, theme toggle, sticky CTA | shell renders at 360→1920 | 06 §3 |
| W1.6 | Motion primitives: `Reveal`, `Stagger`, `Parallax`, `Counter`, `useReducedMotion` | all four have a reduced-motion rendering | 07 |
| W1.7 | `claims.ts` + `claims:check` script; `captures.json` | CI gate green on an empty registry | 17 |
| W1.8 | CI: lint, typecheck, unit, Playwright+axe, Lighthouse budget, security-headers spec | 6 checks on every PR | 13 §6, 18 |
| W1.9 | Figma: pages 00–03 (cover, foundations, primitives, layout) with variables + auto-layout | published library | 15 §2–4 |

**Gate W1:** a page composed only of primitives scores 100 a11y / ≥98 perf, has zero third-party
requests, renders identically in light and dark, and looks intentional at 360px. Storybook axe
green. The Figma library is published and its variables match `tokens.marketing.css` exactly.

### Phase W2 — The homepage and the money pages (Week 3–4)

| # | Task | Output | Doc |
|---|---|---|---|
| W2.1 | Product captures: 22 screens from a running stack against the demo institute, light + dark, 3 widths | `public/product/**` + `captures.json` | 09 §2 |
| W2.2 | The hero — role-switching product frame (Owner/Teacher/Student/Parent) | Act I, keyboard-operable, LCP ≤ 1.8s | 04 §4, 07 §5 |
| W2.3 | Acts II–VI (problem, thesis, product, automation+AI, lifecycle spine) | 5 acts | 04 §5–9 |
| W2.4 | Acts VII–XII (analytics, everywhere, trust, extend, value, decision) | 6 acts | 04 §10–15 |
| W2.5 | `/pricing` — real plans, the comparison table, quota explainer, FAQ | page + JSON-LD | 08 §5 |
| W2.6 | Product repo: `GET /public/plans` (`@Public()`, `is_public` only, rate-limited) | one PR to `apps/api` | 14 §5 |
| W2.7 | `/demo` — the only form, posting to the product's real web-to-lead endpoint | lead lands in the CRM board | 10 §4 |
| W2.8 | `/security` + `/trust/{build-status,sub-processors,dpa}` | 4 pages | 08 §6 |
| W2.9 | OG image route, metadata, JSON-LD (Organization, SoftwareApplication, FAQ) | rich results valid | 11 §3–4 |

**Gate W2:** a cold visitor on a mid-range Android on throttled 4G reaches "what it is, who it's
for, why it's safe, what it costs" without a horizontal scroll or a layout shift. Every number on
the homepage resolves in `claims.ts`. A submitted demo request appears on the CRM board in the
product. Lighthouse ≥98/100/100/100 on `/`, `/pricing`, `/security`.

### Phase W3 — Depth: product, solutions, developers (Week 5–6)

| # | Task | Output | Doc |
|---|---|---|---|
| W3.1 | 7 cluster pages (Admissions & Growth, Academics & Content, Delivery & Engagement, Assessment & Outcomes, Money & People, Intelligence, Platform & Trust) | 7 pages from one template | 08 §3 |
| W3.2 | 14 module pages from MDX + a shared `<ModulePage>` | 14 pages | 08 §3.3 |
| W3.3 | 5 solution pages (K-12 schools · universities · coaching institutes · skilling academies · corporate L&D) | 5 pages | 08 §4 |
| W3.4 | `/developers` — OpenAPI reference, webhooks, API keys, SDK | page + embedded reference | 08 §7 |
| W3.5 | `/integrations` — honest: what is built (OAuth ×3, SMTP, S3/Azure/local, Meilisearch, AI providers, webhooks) and what is a port with no driver | page | 08 §8 |
| W3.6 | 4 comparison pages (Moodle · Google Classroom · Canvas · spreadsheets-and-WhatsApp) | 4 pages, every cell sourced + dated | 08 §9, 17 §5 |
| W3.7 | `/accessibility` conformance statement (EN 301 549 / Section 508 shape) | page + VPAT-style table | 12 §7 |
| W3.8 | Figma: pages 04–07 (homepage, page templates, mobile, prototype) | prototype wired | 15 §5 |

**Gate W3:** every module in the product's navigation registry has a page or a deliberate,
documented absence. No page contains a capability claim the code does not support — verified by
walking `01-PRODUCT-TRUTH.md` §4 against the copy. Every comparison cell has a source URL and a
date.

### Phase W4 — Persuasion and polish (Week 7)

| # | Task | Output | Doc |
|---|---|---|---|
| W4.1 | ROI calculator — visitor's own inputs, every assumption visible and editable, formula shown | interactive, no defaults that flatter | 10 §6 |
| W4.2 | Before/After — the real tool-stack table from the product BRD | section + `/why-algoryq-learn` | 04 §14 |
| W4.3 | `/resources` + first 6 articles (migration, RBAC for schools, assessment integrity, accessibility procurement, self-hosting, admissions funnel) | index + 6 MDX | 11 §6 |
| W4.4 | Motion pass: scroll choreography, section transitions, sticky CTA, progress rail | within motion budget | 07 §6 |
| W4.5 | Dark mode pass across every page | parity, contrast re-measured | 05 §5 |
| W4.6 | Copy edit — one voice, every page, read aloud | 17 §3, 02 §7 |
| W4.7 | Legal: terms, privacy, cookies (there are none), DPA, sub-processors | 5 pages | 08 §11 |

**Gate W4:** the full site read end to end sounds like one writer. Reduced-motion rendering
communicates everything the animated one does. The ROI calculator cannot be made to produce a
flattering number by leaving the defaults alone.

### Phase W5 — Launch (Week 8)

| # | Task |
|---|---|
| W5.1 | Cross-browser + device matrix (`18` §3): Safari 17+, Chrome, Firefox, Edge; iPhone SE→15 Pro Max, Pixel, iPad, foldable |
| W5.2 | Full a11y audit: keyboard-only pass, VoiceOver + NVDA pass, 400% zoom, forced-colours mode |
| W5.3 | Performance: real-device 4G measurement, not just lab; CWV field-proxy check |
| W5.4 | SEO: sitemap, robots, canonicals, hreflang stub, Search Console, rich-results validation |
| W5.5 | Analytics: self-hosted, cookieless, event map verified end to end |
| W5.6 | Security: CSP, HSTS, headers spec, dependency audit, no secrets in the bundle |
| W5.7 | DNS cutover, redirects, 404/500, uptime check |
| W5.8 | Post-launch watch: 72-hour CWV + funnel review, then weekly |

**Gate W5 (launch):** every item in `18-LAUNCH-CHECKLIST.md`. Any red item blocks the DNS change.

---

## 7. Workstream dependencies

```
Writer      ──▶ messaging ──▶ homepage copy ──▶ module copy ──▶ articles
                    │              │                 │
Designer    ──▶ foundations ──▶ homepage ──▶ templates ──▶ mobile ──▶ prototype
                    │              │            │
Engineer    ──▶ scaffold+tokens ──▶ primitives ──▶ homepage ──▶ pages ──▶ polish ──▶ launch
                                        ▲
Product     ──▶ demo institute seeded ──┘ ──▶ captures ──▶ GET /public/plans
```

**The critical path is captures.** Twenty-two product screens, light and dark, three widths, is
132 images that must come from a *running* stack with seeded data. Stand the stack up in W1, not
W2. `docker compose up` + `pnpm db:seed` + `pnpm --filter @akechi/api seed:demo`.

---

## 8. Proof acquisition plan (runs in parallel, owned by whoever owns revenue)

| Week | Action | Fills |
|---|---|---|
| 1 | Stand up the public read-only sandbox tenant | Verifiable-by slot 1 |
| 1 | Export and host the OpenAPI reference | Slot 2 |
| 2 | Publish the accessibility conformance statement with its open items | Slot 5 |
| 3 | Recruit 3 design partners (free Growth plan for 12 months in exchange for a named case study at 90 days) | Case studies, testimonials |
| 4 | Book an independent accessibility audit (VPAT) | A badge that is real |
| 6 | Start the SOC 2 Type I readiness engagement using the existing evidence pack | A badge that is real, later |
| 12 | First case study, with the customer's numbers, approved in writing | `/customers` |

Nothing on the site changes to accommodate these; the slots are already there and already empty.

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pressure to add fake logos "just for the launch" | High | Fatal to credibility | The components cannot render them; `claims:check` fails CI; this is written down here so the decision is visible |
| Captures go stale as the product ships | High | Medium | `captures.json` carries a date; a capture older than 90 days fails `claims:check` with a warning, 180 days with an error |
| The hero role-switcher becomes the LCP element | Medium | High | The headline is the LCP element by construction; the frame is `content-visibility: auto` and loads after first paint (`07` §5) |
| Display face reads as generic against competitors also set in a grotesque | Medium | Low | Retired as a risk by ADR 0010: the face is the parent brand's, so matching the category matters less than matching `algoryq.com`. Display stays ≥40px only, where Space Grotesk's own quirks separate it from a neutral sans |
| Fluid type breaks at 320px or at 4K | Medium | Medium | Every clamp has tested bounds; the device matrix includes 320 and 2560 |
| Copy over-claims because the writer read the design docs, not the code | High | High | `01-PRODUCT-TRUTH.md` is the only permitted source for capability claims; `17` §2 makes it a review step |
| Product changes `POST /public/institutes/:slug/enquiries` | Low | High | The contract is in `@akechi/contracts`; the site's e2e hits the real endpoint nightly |

---

## 10. Definition of Done — the site

The site is done when **all** of these are true:

Every page in `03-INFORMATION-ARCHITECTURE.md` exists or is explicitly deferred in `19` · every
component in `06` is in Storybook with an axe test · every claim resolves in `claims.ts` · every
product image has a capture date under 90 days · Lighthouse ≥98/100/100/100 on the ten highest-
traffic routes · axe clean on every route in Playwright at 360 and 1440 · keyboard-only path
through the homepage and the demo form · reduced-motion rendering verified · dark mode verified ·
sitemap + robots + canonical + OG + JSON-LD on every route · CSP `default-src 'self'` with zero
console violations · the demo form creates a real lead · `18-LAUNCH-CHECKLIST.md` fully green ·
`19-PROGRESS-TRACKER.md` updated.

---

## 11. What changes in the product repo

Exactly two things, both small and both justified on their own merits:

1. **`GET /public/plans`** — `@Public()`, returns `is_public = true` plans only, rate-limited by
   the existing `RateLimitMiddleware`. Without it the pricing page holds a second copy of the
   price list, and the two will disagree. (W2.6)
2. **`pnpm-workspace.yaml`** gains `- 'website'`. Without it, rule 5 — inherit the product's
   tokens — is unbuildable, and the site's colours become a fork on day one. (W1.1)

Everything else the site needs already exists: the web-to-lead endpoint, the public certificate
verifier, the demo seed, the design tokens, the OpenAPI export.
