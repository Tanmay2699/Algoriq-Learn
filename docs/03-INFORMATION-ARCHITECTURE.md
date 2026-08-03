# 03 — INFORMATION ARCHITECTURE

Every URL, the navigation that reaches it, and the crawl graph that ranks it.

---

## 1. Domains

| Host | What it serves | Owned by |
|---|---|---|
| `learn.algoryq.com` | **This site.** Marketing, docs, trust, pricing. | `website/` |
| `www.learn.algoryq.com` | 301 → apex | DNS |
| `app.learn.algoryq.com` | The product. Sign-in and everything behind it. | `apps/web` |
| `<slug>.learn.algoryq.com` | A tenant's product instance (resolution order: custom domain → subdomain → JWT claim) | `apps/web` |
| `api.learn.algoryq.com` | The API. | `apps/api` |
| `sandbox.learn.algoryq.com` | The public read-only demo institute | `apps/web`, seeded tenant |
| `<institute-domain>` | A tenant's own public CMS site (`/s/[slug]`) | `apps/web` |

**Never blur these.** The most common IA mistake on a multi-tenant product's site is a marketing
page that looks like it is inside the app. Marketing pages carry the marketing shell; the sandbox
opens in a new tab and looks like the product, because it *is* the product.

---

## 2. Sitemap

51 routes at launch. `SSG` unless noted.

```
/                                        Home — the 12 acts
/product                                 Overview: the lifecycle spine + 7 clusters
  /product/admissions-and-growth         C1
  /product/academics-and-content         C2
  /product/delivery-and-engagement       C3
  /product/assessment-and-outcomes       C4
  /product/money-and-people              C5
  /product/intelligence                  C6
  /product/platform-and-trust            C7
  /product/modules/[slug]                14 module pages (§4)
/solutions
  /solutions/coaching-institutes
  /solutions/schools
  /solutions/universities
  /solutions/skilling-academies
  /solutions/corporate-l-and-d
/pricing                                 ISR 1h — sourced from GET /public/plans
/security                                The reviewer's page
/trust                                   Index: what we can prove today
  /trust/build-status                    The real module completion matrix
  /trust/sub-processors
  /trust/dpa
  /trust/responsible-disclosure
/accessibility                           Conformance statement (EN 301 549 / 508 shape)
/developers                              API reference, webhooks, SDK, API keys
  /developers/api                        Embedded OpenAPI reference
  /developers/webhooks
/integrations                            What is built · what is a port with no driver
/compare
  /compare/moodle
  /compare/google-classroom
  /compare/canvas
  /compare/spreadsheets-and-whatsapp
/why-algoryq-learn                              Before / after, the tool-stack table, ROI
/customers                               Renders "no case studies yet" until there are. Not linked in nav until non-empty.
/resources                               Index
  /resources/[slug]                      6 articles at launch
/changelog                               v1.1 — fed from the product tracker
/about
/contact
/demo                                    The only form. Dynamic (POSTs to the product CRM).
/legal/terms
/legal/privacy
/legal/cookies                           "We don't set any." A one-screen page, and a flex.
/legal/acceptable-use
/legal/security-policy
/404  /500  /sitemap.xml  /robots.txt  /opensearch.xml
/api/lead      (POST, node runtime)      → POST /public/institutes/algoryq-learn/enquiries
/api/plans     (GET, cached 1h)          → GET  /public/plans
/api/og/[...]  (GET, edge)               dynamic Open Graph images
```

### Built, and where it differs from this spec

**Built:** all of the above, plus `/solutions` and `/compare` index pages that were not in the
original list — the breadcrumb on a child page needs a parent that exists, and pointing
"Solutions ›" at one of the five children was the wrong answer.

**Not built:** `/api/plans` (the product has no public plans endpoint yet, so `/pricing` renders
a dated snapshot and says so) and `/api/og` (Open Graph images are metadata-only for now). One
server route exists, `/api/lead`. Everything else is static: 66 routes in the build output,
`pnpm links:check` green with no orphans.

### Deferred, deliberately

`/careers` (no openings yet — an empty careers page reads as a dead company) · `/partners` ·
`/community` · `/status` (until the product's telemetry exporter is wired; a status page that
cannot go red is theatre) · `/blog` as distinct from `/resources` (one content type until there
are thirty).

---

## 3. Primary navigation

Sticky header, 64px desktop / 56px mobile, translucent over the hero, solid after 64px of scroll.

```
[Algoryq Learn]  Product ▾   Solutions ▾   Pricing   Security   Developers   Resources ▾
                                              [ Open sandbox ]  [ Book a walkthrough ]
```

### 3.1 Product mega-menu (2 columns + a rail)

| Column A — By cluster | Column B — By job | Rail |
|---|---|---|
| Admissions & Growth | Fill your seats | **The lifecycle spine** — a miniature of the enquiry→outcome diagram, linking `/product` |
| Academics & Content | Build what you teach | |
| Delivery & Engagement | Run the term | **Open the sandbox** → |
| Assessment & Outcomes | Prove it happened | |
| Money & People | Run the business | **See what's built** → `/trust/build-status` |
| Intelligence | See it before it happens | |
| Platform & Trust | Standardise safely | |

Each cluster row shows its module count and its two flagship modules. Keyboard: `ArrowDown` opens,
roving tabindex through items, `Escape` closes and restores focus to the trigger, `Tab` out closes.
It is a `<button aria-expanded>` + a `<div role="group">`, **not** a menu widget — these are links
to pages, and `role="menu"` would lie to a screen reader (`12-ACCESSIBILITY.md` §4.3).

### 3.2 Solutions menu (single column, 5 items + a line each)

### 3.3 Resources menu
Guides · Migration · Comparisons · Changelog *(v1.1)* · About · Contact

### 3.4 Mobile navigation
Full-screen sheet, `position: fixed`, focus-trapped, body scroll locked, `Escape` closes.
Accordion sections in the same order. The two CTAs pin to the bottom of the sheet above the safe
area inset. Never a horizontal-scrolling nav.

---

## 4. Module pages

Fourteen. One MDX file each, one `<ModulePage>` template (`08-PAGE-SPECS.md` §3.3). The slug list
is fixed by the product's module boundaries so the URL survives a re-org of the marketing copy.

| Slug | Cluster | Product module | % |
|---|---|---|---:|
| `admissions-crm` | C1 | `crm` | 72 |
| `institute-website` | C1 | `cms` | 60 |
| `courses-and-curriculum` | C2 | `course` | 72 |
| `media-and-content` | C2 | `media` | 70 |
| `ai-assistance` | C2/C6 | `ai` | 45 |
| `learning-delivery` | C3 | `learn` | 80 |
| `live-classes-and-attendance` | C3 | `live` | 72 |
| `batches-and-enrollment` | C3 | `learn` (batch surfaces) | 72 |
| `assessments` | C4 | `assess` | 76 |
| `assignments-and-grading` | C4 | `assign` + `grade` | 68 / 80 |
| `certificates` | C4 | `cert` | 55 |
| `fees-and-finance` | C5 | `finance` | 62 |
| `staff-and-hr` | C5 | `hr` | 55 |
| `placement-and-interviews` | C5 | `placement` + `interview` | 60 |

Intelligence (`analytics`, `insight`, `search`, `data`) and Platform & Trust (`authz`, `audit`,
`tenant`, `platform`, `auth`) are sold at cluster level, not module level — a buyer does not shop
for "the audit module". Their detail lives on `/product/intelligence`, `/product/platform-and-trust`
and `/security`.

**Marketplace** and **Parent portal** are sections inside `learning-delivery` and
`batches-and-enrollment` respectively until they clear 60%.

---

## 5. URL rules

1. Lowercase, hyphenated, no trailing slash, no file extensions, no dates in paths.
2. A page's slug never encodes its marketing position (`/product/modules/admissions-crm`, never
   `/best-lms-for-admissions`). Search intent is served by `<title>`, H1 and body — not by URL
   stuffing, which ages badly and looks cheap to the exact buyer we want.
3. No `/index`, no `?utm` in internal links, no query-string routing.
4. Redirects live in one place (`next.config.ts` → `redirects()`), each with a comment saying what
   it replaced and when it can be deleted.
5. Every page is reachable from the header, the footer, or a parent page's body — **no orphans.**
   `pnpm links:check` walks the rendered graph and fails on an unreachable route.

---

## 6. Footer

Five columns + a base bar. The footer is the second navigation and carries everything the header
cannot.

| Product | Solutions | Developers | Company | Trust |
|---|---|---|---|---|
| Overview | Coaching institutes | API reference | About | Security |
| The 7 clusters | Schools | Webhooks | Contact | Build status |
| All modules | Universities | SDK | Changelog | Accessibility |
| Pricing | Skilling academies | Self-hosting | Resources | Sub-processors |
| Comparisons | Corporate L&D | Status *(v1.1)* | | DPA · Terms · Privacy |

Base bar: wordmark · "© 2026 Algoryq Learn" · locale switcher (disabled with a tooltip until the second
locale ships — a switcher with one option is a lie) · theme toggle · "This site sets no cookies"
linking `/legal/cookies`.

---

## 7. The crawl and authority graph

```
                 /  (home)
                 ├──────────────► /product ──► 7 clusters ──► 14 modules
                 ├──────────────► /solutions ──► 5 pages ──┐
                 ├──────────────► /pricing ◄───────────────┤ (every page links pricing)
                 ├──────────────► /security ──► /trust/* ──┤
                 ├──────────────► /developers ─────────────┤
                 └──────────────► /resources ──► articles ─┘
                                       │
        /compare/* ────────────────────┘   (entry points from search; each links
                                            its 2 most relevant module pages + pricing)
```

- **Hubs:** `/`, `/product`, `/solutions`, `/resources`. Each links every child; each child links
  back to exactly one hub via a breadcrumb.
- **Money pages:** `/pricing` and `/demo` are linked from every page (header CTA + closing CTA).
- **Entry pages:** `/compare/*` and `/resources/*` are where organic search lands. Each carries a
  contextual next step, never a bare "Learn more".
- **Depth:** nothing is more than 3 clicks from `/`. Module pages are at depth 3 and are the
  deepest thing on the site.

---

## 8. Breadcrumbs

Rendered on every page except `/` and `/demo`. Semantic `<nav aria-label="Breadcrumb"><ol>`, plus
`BreadcrumbList` JSON-LD (`11-SEO-AND-CONTENT.md` §4). Uses the same visual language as the
product's `Breadcrumbs` component so the two surfaces feel continuous.

`Home › Product › Assessment & Outcomes › Assessments`

---

## 9. Search on the site

**Not in v1.** A site with 51 pages and a good IA does not need search; a search box that returns
nothing useful erodes trust more than its absence. Ship `/resources` filtering by tag instead.
Revisit at 40 articles. (Ironic given the product's search module is its most complete at 88% —
say so on that module's page, do not build a bad one here to prove a point.)

---

## 10. State pages

| Page | Content |
|---|---|
| `404` | The lifecycle spine as a navigation device — "you're somewhere between enquiry and outcome; here are the seven places you might have meant." Search-free, link-rich. |
| `500` | Honest, short, no illustration, a mail link, and the status of the last deploy. |
| Empty `/customers` | "We have no case studies yet, because we have no customers yet. Here is the design-partner offer and here is what is built." Do not link this from nav until it is non-empty. |
| `/resources` empty tag | Never rendered — tags are derived from existing articles. |
