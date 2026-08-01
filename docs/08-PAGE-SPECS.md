# 08 — PAGE SPECIFICATIONS

Every page that is not the homepage. Homepage is `04`. Templates are described once and referenced.

Each spec gives: **purpose · audience · sections · the one thing it must prove · CTA · metadata**.

---

## 1. Page templates

Five templates cover 48 of the 51 routes. A page that needs a sixth template needs a review.

| Template | Used by | Shape |
|---|---|---|
| **T1 · Pillar** | `/product`, `/solutions`, `/resources`, `/trust` | Hero (display-3) → intro → a grid of children → closing CTA |
| **T2 · Feature** | 7 clusters, 14 modules | Hero → capability blocks alternating text/frame → "what's not built" → related modules → CTA |
| **T3 · Long-form** | `/security`, `/accessibility`, `/why-akechi`, `/compare/*`, articles | Sticky table of contents ≥1024px → `<Prose>` with `<Act>`-level anchors → CTA |
| **T4 · Utility** | `/pricing`, `/demo`, `/contact`, legal | Focused, single-column, no decoration |
| **T5 · State** | 404, 500, empty `/customers` | Centred, short, link-rich |

All five share the header, footer, breadcrumbs (except `/` and `/demo`) and the closing CTA band.

---

## 2. `/product` — the overview (T1)

**Purpose:** be the page a returning visitor lands on when someone says "look at this".
**Must prove:** the seven clusters are one system, not a suite.

| Section | Content |
|---|---|
| Hero | `H1` **Thirty-one modules. One tenant. One audit trail.** Lead: the lifecycle sentence. |
| Spine | `<LifecycleSpine>` reused from Act VI, compressed to headings + one line each. |
| Clusters | Seven `<Card interactive>`s: name, one-line job, module count, route count, flagship capture thumbnail. |
| Modules | The full 14-item list with cluster colour and `progress` chips where <65%. |
| Build status | A 6-row `<BuildStatusTable>` summary + link. |
| CTA | Sandbox + walkthrough. |

---

## 3. Cluster and module pages (T2)

### 3.1 Cluster page shape

```
Hero          eyebrow = cluster name · H1 = the job in the institute's words
              lead = 2 sentences · one hero capture
Why it exists 1 short paragraph. The problem in this cluster before software.
Capabilities  3–6 alternating blocks. Each: H2, 2–3 sentences, one <ProductFrame>,
              and a "how it actually works" detail that only someone who built it would know.
Modules       Cards linking each module page in this cluster.
Not built     A plain list. Named, not buried.
Roles         Which of the 11 templates live here, and what each may do.
Related       Two other clusters.
CTA
```

### 3.2 The seven cluster pages

| Page | H1 | The detail that proves we built it |
|---|---|---|
| `/product/admissions-and-growth` | **No enquiry goes cold.** | Round-robin is a cursor stored on the rule, not "fewest leads" — two enquiries a second apart cannot land on the same counsellor by accident. A rule naming someone who has left leaves the enquiry unassigned. |
| `/product/academics-and-content` | **Build what you teach.** | Publishing snapshots a version; restoring rebuilds lessons *from the snapshot*, so a field omitted from the snapshot is erased — which is why the lesson body is carried through publish → restore → diff. |
| `/product/delivery-and-engagement` | **Run the term.** | Offline progress is queued in IndexedDB and replayed **in order, idempotently, last-write-wins** — a double replay changes nothing. |
| `/product/assessment-and-outcomes` | **Marks that stand up.** | The marking queue is anonymised and drops anything already marked. Integrity is signals shown to a human, disclosed to the candidate, never an automatic verdict. |
| `/product/money-and-people` | **Run the business.** | Money is integer minor units plus an ISO 4217 code, everywhere. An invoice line **copies** its description at issue rather than reading through to a course, so renaming a course does not rewrite last year's invoice. |
| `/product/intelligence` | **See it before it happens.** | Search results are permission-trimmed at query time; a saved search stores the *query*, never the results, which is why sharing one is safe. |
| `/product/platform-and-trust` | **Standardise safely.** | One build serves every tenant: branding is injected into the server-rendered shell at request time, not compiled per tenant. |

### 3.3 Module page template

Fourteen pages, one MDX file each with front-matter driving the template:

```yaml
slug: admissions-crm
cluster: admissions-and-growth
title: Admissions CRM
h1: Every enquiry, on one board
apiModule: crm
routes: 32
permissionKeys: 20
completeness: 72
captures: [crm-board, crm-lead-detail, crm-applications, crm-pipeline-settings]
notBuilt: [Campaign attribution, Email sequences, SMS and WhatsApp channels]
roles: [counsellor, institute-admin]
related: [institute-website, batches-and-enrollment]
```

The template renders: hero · what it does (3–5 capability blocks with captures) · **how it works**
(one mechanism explained properly — this is the section that separates us from a feature list) ·
the permission keys this module adds, in mono · what is not built · which roles hold it · related
modules · CTA.

`completeness` below 65 renders a `<Badge tone="progress">` beside the H1 and a line above the fold
naming the gap. This is not hedging; it is the differentiator (`02` §8, objection 13).

---

## 4. `/solutions/*` (T2 variant)

Five pages. **Same product, different vocabulary and different order.** A solutions page that is a
feature list with the segment's name pasted on top is worthless; each of these leads with the one
number that segment is judged on.

| Page | Leads with | Vocabulary | Sections in order |
|---|---|---|---|
| `/solutions/coaching-institutes` | Admissions conversion + test analytics | enquiry, batch, mock test, rank, fee instalment | Admissions → assessment depth → batches & timetable → fees → parent visibility → outcomes |
| `/solutions/schools` | Parents, attendance and fees | class, section, register, guardian, term | Register & attendance → parent portal → fees → gradebook → staff → website |
| `/solutions/universities` | Programme structure + **accessibility conformance** | programme, semester, credit, transcript | Curriculum & approval → assessment integrity → **accessibility statement** → roles & scopes → data governance → self-hosting |
| `/solutions/skilling-academies` | Placement rate | cohort, capstone, drive, offer | Placement & interviews → outcomes → assessment → certificates → CRM |
| `/solutions/corporate-l-and-d` | Compliance certificates | learner, compliance, renewal, audit | Certificates & verification → audit trail → roles → reporting → **SSO (named as not built)** |

Every solutions page ends with the honest disqualifier for that segment (`02` §4) — for
universities, "multi-region residency is designed and not built"; for corporate L&D, "SAML/OIDC and
SCIM are not built".

---

## 5. `/pricing` (T4)

**Must prove:** there is nothing hidden.

| Section | Content |
|---|---|
| Hero | `H1` **Free for one campus. Priced for a group.** No "starting at". |
| Plans | Three real plans from `/api/plans` (ISR 1h). Seats · courses · storage · AI budget · what's included. `Enterprise` shows "negotiated" not a fake number. |
| The honest line | "There is no online checkout yet — the billing module has no payment-gateway adapter, so every paid plan starts with a short conversation. The free tier starts without one." |
| What counts as a seat | A definition, precisely. Seats are memberships, not logins. Parents linked as guardians are **not** seats. |
| Quotas | What happens at the limit: a clear refusal, not a silent truncation. Storage, courses, AI tokens each explained. |
| Everything included | The list that is *not* tiered: RBAC, audit, RLS isolation, branding, custom domain, API, webhooks, exports, accessibility, self-host rights. Tiering security is a dark pattern; we do not. |
| Comparison table | Feature × plan. |
| Self-host | Yes, and here is the compose file. |
| FAQ | 6 pricing-specific questions. |
| CTA | Start free · Book a walkthrough |

JSON-LD: `Product` + `Offer` per plan, `priceCurrency: INR`.

---

## 6. `/security` and `/trust/*` (T3)

### 6.1 `/security` — the reviewer's page
The most important non-home page on the site. **No adjectives, no illustration, no gradient.** A
sticky table of contents and long, precise prose. Written to be *skimmed by someone with a
checklist and then read by someone who is suspicious.*

| Anchor | Content |
|---|---|
| `#summary` | A 10-row table: control · how it is implemented · where it lives. Above the fold. |
| `#tenancy` | Shared schema + `tenant_id` + RLS with `ENABLE` **and** `FORCE`; the app role is not the owner and holds no `BYPASSRLS`; policies derived from `information_schema` so a new table is covered automatically; 114 tables; **the 13 exemptions listed and reasoned.** |
| `#authorization` | Deny-by-default; every route carries a key or `@Public()`; lint + coverage check fail the build; 272 keys, 264 enforced; the live `<PermissionCatalog>`; roles, scopes, overrides, delegation. |
| `#roles` | The 11 templates × 7 lifecycle stages matrix. |
| `#identity` | Argon2id + lockout, JWT 15m + rotating refresh with family revocation, MFA/TOTP + recovery codes, OAuth ×3, invitations only (no admin-sets-your-password route exists, deliberately), sessions list/revoke, impersonation with dual audit attribution. **Not built: SAML/OIDC, SCIM, phone OTP.** |
| `#audit` | Hash chain, field diffs, retention, legal hold, DSR; hold beats retention beats erasure; erasure tombstones and never rewrites the chain. |
| `#data` | Encryption in transit; at rest per your host; backups are your Postgres backups; exports; the GDPR erasure job. |
| `#scale` | Horizontally scalable API, shared cache, rate limiting before guards, `TRUST_PROXY_HOPS` defaulting to 0. **Honest: the worker is one process today and why.** |
| `#portability` | Ports and drivers; no cloud SDK in feature code; `docker compose up`; the exit path. |
| `#accessibility` | Summary + link to the statement. |
| `#disclosure` | How to report something, and what we will do. |
| `#not-yet` | The unflinching list: no SOC 2 certificate, no SSO, no penetration-test report yet, no formal SLA, no multi-region. |

`#not-yet` is why the rest of the page is believed.

### 6.2 `/trust` (T1)
Index: what we can prove today, in six cards mirroring the Verifiable-by band, plus links to
build-status, sub-processors, DPA and disclosure.

### 6.3 `/trust/build-status` (T3)
The full `<BuildStatusTable>`: 24 rows, module · cluster · % · what's real · what isn't. Header
explains the number is functional completeness against the SRS, not effort. Dated. Regenerated from
a checked-in JSON mirror of `docs/12-PROGRESS-TRACKER.md` §D on each release.

### 6.4 `/trust/sub-processors`
A table with a real answer, which today is short: whoever hosts your instance. If we host it, the
list is our infrastructure providers; if you self-host, the list is empty and we say so. Includes
the mail, storage, search and AI provider slots with "configured by you" as the honest value.

### 6.5 `/trust/dpa` and `/trust/responsible-disclosure`
Plain documents. The DPA is downloadable and its version is dated.

---

## 7. `/developers` (T3)

**Purpose:** convince a technical evaluator in ninety seconds.

Hero → auth model (API key, hashed at rest, revealed once, rotate/revoke) → the standard response
envelope and correlation IDs → pagination → errors (problem+json — and a note that the *title* is
where the message lives, learned the hard way) → rate limits → **the embedded OpenAPI reference**
(`/developers/api`, rendered statically from the exported spec, not an iframe to a third-party
viewer) → webhooks with HMAC signing and a delivery log (`/developers/webhooks`) → the typed SDK →
self-hosting quickstart → what is not built (SSO, SCIM, GraphQL, a public sandbox key).

---

## 8. `/integrations`

Two columns and no logos (`04` §13.2). **Built:** Google / Microsoft / GitHub sign-in · SMTP ·
S3-compatible, MinIO, Azure Blob, local disk · Meilisearch or Postgres search · OpenAI, Azure
OpenAI, Anthropic, or disabled · Webhooks with HMAC + delivery log · API keys · CSV import/export ·
PWA install. **A port with no driver yet:** meeting providers, payment gateways, SMS, WhatsApp,
SCIM, SAML/OIDC, transcoding, plagiarism, proctoring.

Each "built" row links the module page; each "not yet" row links `/trust/build-status`.

Closing line: *"We would rather list nine real integrations than sixty logos we have a screenshot
of."*

---

## 9. `/compare/*` (T3)

Four pages. **Rules** (also `17` §5):
1. Every competitor cell carries a source URL and a retrieval date, rendered as a footnote.
2. Where the competitor is better, the table says so. A comparison with no losses is not read.
3. No mocking, no adjectives, no "legacy". Their users are our prospects.
4. Reviewed quarterly; a cell older than 180 days renders a "last verified" warning.
5. Never a competitor's logo, trademark styling, or screenshots.

| Page | Their strength we lead with | Our two rows that decide it |
|---|---|---|
| `/compare/moodle` | Free, vast plugin ecosystem, decades of institutional trust | Admissions + fees in the same database; a permission model you can shape without a plugin |
| `/compare/google-classroom` | Free, zero friction, everyone has an account | It has no enquiry, no fee, no register, no certificate; and no tenant isolation to review |
| `/compare/canvas` | Genuinely enterprise, deep LTI ecosystem | The business half; and we publish our accessibility conformance and our build status |
| `/compare/spreadsheets-and-whatsapp` | Free, familiar, already working | One record that travels the lifecycle; and numbers that are current rather than monthly |

Each ends with: *"If you are happy on X, stay on X. Here is when people move."* — which converts
better than any feature table, and is true.

---

## 10. `/why-akechi`, `/resources/*`, `/customers`

- **`/why-akechi` (T3)** — the long version of Act XI: the before/after tool table, the ROI
  calculator with its full formula, the six-row comparison expanded to twenty, and the design-partner
  offer.
- **`/resources` (T1)** — tag-filtered index. Launch set of six:
  *Migrating an institute off spreadsheets* · *RBAC for schools: what a permission actually is* ·
  *Assessment integrity without a camera* · *Buying accessible software: what to ask a vendor* ·
  *Self-hosting Akechi in an afternoon* · *Why we built a PWA instead of two native apps.*
  No gating, no email wall, no "download the PDF".
- **`/customers` (T5 until non-empty)** — renders the design-partner offer and nothing else. Not
  in the navigation until it has a real entry.

---

## 11. `/demo`, `/contact`, legal (T4)

### `/demo`
The only form. `<DemoForm>` (`06` §5.5) posting to the product's real web-to-lead endpoint. Three
things beside it: what happens next and by when · the sandbox link for people who would rather not
talk · the design-partner offer. `?intent=` preselects the reason and is the only autofocus on the
site.

### `/contact`
No form — an email address, a response-time commitment we can keep, and links to `/demo` and
`/trust/responsible-disclosure`. A second form would split the lead source for no gain.

### Legal
`/legal/terms` · `/legal/privacy` · `/legal/cookies` (a one-screen page that says we set none and
explains what the theme preference is) · `/legal/acceptable-use` · `/legal/security-policy`.
All plain `<Prose>`, all dated, all with a "last updated" and a changelog line.

---

## 12. `/accessibility` (T3)

Shaped like a conformance statement so a procurement officer can lift it into a checklist.

Scope and date · conformance claim (WCAG 2.2 level AA, partially conformant, with the exceptions
listed) · how we test (axe in Storybook and Playwright, at 360px among other widths, failing the
build; manual keyboard and screen-reader passes; 400% zoom; forced-colours) · **known issues, with
dates** · the product's own accessibility properties (keyboard paths everywhere, no drag-and-drop
without keyboard and touch, focus never removed, RTL support, reduced-motion) · feedback route and
response commitment · a VPAT-shaped table for EN 301 549 / Section 508.

**Publishing known issues is the point.** Every institution's procurement team has read a hundred
statements that claim full conformance; a statement with four dated open items is the one they
believe. See `12-ACCESSIBILITY.md` §7.

---

## 13. State pages (T5)

| Page | Spec |
|---|---|
| `404` | "You're somewhere between enquiry and outcome." The lifecycle spine as navigation, seven links, plus the header. No search box, no illustration. |
| `500` | Short, honest, a mail link, and no attempt at humour. |
| `/offline` | Not applicable — this site has no service worker (`14` §6). |

---

## 14. Per-page metadata table

Every route's `<title>`, description, canonical, OG image variant and JSON-LD type live in one
file: `src/config/seo.ts`. `11-SEO-AND-CONTENT.md` §2 holds the matrix. A page whose entry is
missing fails the build — metadata is not something to remember at the end.
