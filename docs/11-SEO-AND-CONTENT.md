# 11 — SEO & CONTENT

Technical SEO, structured data, the metadata matrix, and the content model that feeds it.

---

## 1. The search strategy

We rank for three intents, in this order of value:

| Intent | Example queries | Landing page | Why we can win |
|---|---|---|---|
| **Comparison** | "moodle alternative for coaching institutes", "google classroom vs lms for schools" | `/compare/*` | Long tail, low competition, high commercial intent, and our comparison pages are honest — which earns links |
| **Category + qualifier** | "multi tenant lms", "lms with admissions and fees", "self hosted lms with rbac", "accessible lms wcag" | `/`, `/product/*`, `/accessibility` | Specific enough that generic LMS marketing pages do not target them |
| **Problem** | "track student fees and attendance in one place", "how to stop losing admission enquiries" | `/resources/*`, `/solutions/*` | Editorial, links from forums, feeds the funnel early |

We do **not** chase "best LMS" or "LMS software". Those are owned by review-aggregator sites and
by companies with a decade of domain authority; competing there is a budget bonfire.

**The word "LMS" appears** in every `<title>`, in the meta description, in the first paragraph of
body copy on `/`, `/product` and every module page, and in the `SoftwareApplication` schema. It
appears rarely in the visible *narrative*, because the narrative is selling a category
(`02` §1). Both things are true at once; that is what the title tag is for.

---

## 2. Metadata matrix

One file, `src/config/seo.ts`, holds an entry per route. **A route without an entry fails the
build** — metadata is not something to remember at the end.

```ts
export const seo: Record<Route, SeoEntry> = {
  '/': {
    title: 'Akechi — the multi-tenant LMS for institutes | Admissions to certificates',
    description:
      'One system of record for schools, colleges and coaching institutes: admissions, courses, '
      + 'live classes, assessments, fees, staff and outcomes. Permission-checked and audited on '
      + 'every action. Free for 100 seats.',
    og: 'default',
    jsonLd: ['Organization', 'WebSite', 'SoftwareApplication'],
  },
  …
}
```

### Rules
| Element | Rule |
|---|---|
| `<title>` | ≤ 60 chars before the brand suffix; unique on every route; the primary keyword first, the brand last |
| Description | 140–158 chars; a sentence, not a keyword list; contains the differentiator, not just the category |
| Canonical | Absolute, self-referencing, on every page; parameterised URLs canonicalise to the clean one |
| H1 | Exactly one; matches the page's promise, not necessarily the title tag |
| OG | `og:title`, `og:description`, `og:image` (1200×630 from `/api/og`), `og:type`, `og:url`, `og:locale` |
| Twitter | `summary_large_image`, same image |
| Robots | `index,follow` everywhere except `/demo` (`noindex` — a form page in the index is a waste of crawl budget and ranks for nothing) |
| hreflang | Stub now, `en-IN` self-referencing + `x-default`. Real when the second locale ships. |

---

## 3. Structured data (JSON-LD)

Emitted server-side in `<script type="application/ld+json">`. Validated in CI against
schema.org and Google's Rich Results test as a Playwright assertion, not as a manual pre-launch step.

| Type | Where | Notes |
|---|---|---|
| `Organization` | Sitewide | `name`, `url`, `logo`, `sameAs` (only real profiles — an empty `sameAs` is better than an invented one), `contactPoint` |
| `WebSite` | Home | With `potentialAction: SearchAction` **omitted** — we have no site search (`03` §9), and declaring one we do not have is a bad-faith signal |
| `SoftwareApplication` | Home, `/product` | `applicationCategory: EducationalApplication`, `operatingSystem: Web`, `offers` from the real plans. **No `aggregateRating`** — we have no reviews, and a fabricated rating is both a lie and a manual-action risk |
| `Product` + `Offer` | `/pricing` | One `Offer` per plan, `priceCurrency: INR`, `price` in major units, `availability` |
| `FAQPage` | Home Act XII, `/pricing`, `/security` | Only for questions genuinely on the page |
| `BreadcrumbList` | Every page except `/` | Mirrors the visible breadcrumb |
| `Article` | `/resources/*` | `author`, `datePublished`, `dateModified`, `headline`, `image` |
| `TechArticle` | `/security`, `/developers` | Signals depth to search engines and to LLM crawlers |
| `ItemList` | `/product`, `/solutions`, `/compare` | Hub pages listing their children |

**Never emit:** `Review`, `AggregateRating`, `Event`, `JobPosting` — we have none of them.

---

## 4. Technical SEO

| Item | Implementation |
|---|---|
| Rendering | Static HTML for 48 of 51 routes. Content is in the initial response — no client-side rendering of anything a crawler needs. |
| `sitemap.xml` | Generated from the route manifest at build; `lastmod` from git, `changefreq` and `priority` set honestly (weekly for `/`, `/pricing`; monthly for modules; yearly for legal) |
| `robots.txt` | Allows everything except `/api/`, `/demo`. Names the sitemap. Explicitly allows the major LLM crawlers — our content is our argument and we want it read. |
| Redirects | One `redirects()` block; each entry commented with what it replaced and when it can go |
| Trailing slash | Off, enforced by a 308 |
| 404 | Real 404 status with a useful page. Never a soft 404 or a redirect to home. |
| Internal linking | Every page links at least two siblings and one parent. `pnpm links:check` fails on an orphan (`03` §5). |
| Anchors | Every `h2`/`h3` on long-form pages has a stable, human-readable `id` and a hover-visible permalink |
| Pagination | Not needed at 51 routes; `/resources` will use it at 25 articles |
| i18n readiness | All copy behind i18n keys from day one; the routing shape (`/[locale]/…`) is decided now even though only one locale ships, so the second one is not a URL migration |
| Core Web Vitals | See `13`. CWV is a ranking input and, more importantly, a bounce input. |
| Crawl budget | 51 pages. Not a concern. Do not build a faceted URL space to create some. |

---

## 5. Content model

Two content types. Two is enough; three is where a marketing site starts needing a CMS it should
not have (ADR 0005).

### 5.1 `module` — the 14 module pages
Front-matter as specified in `08` §3.3. The MDX body supplies only the prose blocks; the template
supplies structure, so the fourteen pages cannot drift into fourteen layouts.

### 5.2 `article` — `/resources/*`

```yaml
title: Migrating an institute off spreadsheets
description: …
publishedAt: 2026-08-12
updatedAt: 2026-08-12
author: { name: …, role: … }        # a real person, or no author block at all
tags: [migration, operations]
readingTime: auto
related: [rbac-for-schools]
```

Rules: no author block unless a real person wrote it. No "by the Akechi team" byline on a piece
someone specific wrote. `updatedAt` renders on the page when it differs from `publishedAt`.

### 5.3 Data files (not content types)

`captures.json` (`09` §2.1) · `claims.ts` (`17`) · `build-status.json` (mirrored from the product
tracker) · `plans` (fetched, not stored) · `comparisons/*.json` (each cell with `source` and
`retrievedAt`).

---

## 6. The launch article set

Six, chosen because each ranks for a real query *and* answers a real objection. Every one is
written from something we actually built — an article we cannot back with a file is an article we
do not publish.

| Article | Query it targets | Objection it kills |
|---|---|---|
| **Migrating an institute off spreadsheets** | "move student data from excel to lms" | "Can I migrate?" |
| **RBAC for schools: what a permission actually is** | "role based access control school software" | "Can I control who sees what?" |
| **Assessment integrity without a camera** | "online exam proctoring alternative" | "How do you stop cheating?" — and our answer is unusual enough to earn links |
| **Buying accessible software: what to ask a vendor** | "wcag 2.2 vpat education procurement" | The procurement gate, and it ranks for a query with almost no good content behind it |
| **Self-hosting Akechi in an afternoon** | "self hosted lms docker" | "Where is my data?" |
| **Why we built a PWA instead of two native apps** | "lms mobile app vs pwa" | "Do you have a mobile app?" |

Length: 1,200–2,200 words. Real code, real screenshots, real numbers. No listicles, no "10 best",
no AI-drafted filler — the site's whole position is that we do not manufacture content, and search
engines have gotten good at noticing when a site does.

---

## 7. Copy rules that are also SEO rules

1. The first 100 words of every page contain the page's primary term, naturally.
2. Headings are a real outline. `h2`/`h3` describe content; they are not decoration.
3. Links use descriptive text. Never "click here", never a bare URL, never "read more" as the whole
   anchor.
4. Images have descriptive alt text from the manifest — alt text is accessibility first and image
   search second, in that order.
5. Tables have captions and real `<th scope>` — this helps both a screen reader and a snippet.
6. **Never write for a crawler at a reader's expense.** A keyword-stuffed sentence loses the CTO
   who was going to buy, and modern ranking does not need it.

---

## 8. Measurement

Search Console from day one (property verified via DNS, before launch). Weekly: impressions,
average position and CTR by query cluster; index coverage; CWV field data once there is enough
traffic. Monthly: which `/compare/*` and `/resources/*` pages earn entry sessions, and what those
sessions do next.

**The one SEO metric that matters more than rank:** entry sessions from `/compare/*` and
`/resources/*` that reach `/pricing` or `/security`. Rank without that is vanity.

---

## 9. Anti-patterns, banned

Keyword-stuffed URLs · doorway pages per city · "best LMS in [city]" spam · an FAQ block written
only to win a snippet · `AggregateRating` without reviews · hidden text · link exchanges ·
AI-generated article volume · a blog that posts weekly with nothing to say · thin location pages ·
`noindex` on something we want found because it was easier than fixing duplication.
