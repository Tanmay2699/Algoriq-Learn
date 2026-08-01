# 16 — ANALYTICS & MEASUREMENT

What we measure, how we measure it without a third-party script or a cookie, and what we do with
the answer.

---

## 1. The stance

**Self-hosted, cookieless, aggregate-only.** No Google Analytics, no GTM, no third-party pixel, no
identifier that persists across sessions or across sites.

Three reasons, in order of weight:

1. **The CSP is `default-src 'self'`.** A third-party tag would be the first exception, and once
   there is one exception there are five. That header is a claim we make on `/security`; keeping it
   true is worth more than a funnel report.
2. **No cookies means no consent banner** — which means no 400ms overlay between a visitor and the
   headline, and a `/legal/cookies` page that is one screen and a small flex.
3. **We sell to institutions that ask about sub-processors.** An empty analytics row on
   `/trust/sub-processors` answers a procurement question before it is asked.

**Implementation:** Plausible Community Edition or Umami, self-hosted on our own subdomain and
served from our own origin so `connect-src 'self'` holds. Script ≤ 2 KB, deferred, and the site
works identically with it blocked or absent (`ANALYTICS_URL` unset ⇒ analytics disabled, honestly —
no silent no-op that looks like it is working).

---

## 2. What we can and cannot know

Stated plainly, because a measurement plan that pretends to precision it does not have produces
confident wrong decisions.

| We can know | We cannot know |
|---|---|
| Pageviews, entry and exit pages, referrers, country, device class | Who a visitor is |
| Custom events (CTA clicks, scroll milestones, form steps) | A cross-session journey |
| Session-scoped sequences within one visit | Whether the person who read `/security` is the one who booked |
| Core Web Vitals by route | Individual behaviour |
| Search Console queries → landing pages | Multi-touch attribution |

**The join we do have** is the honest one: the demo form carries `intent` and a `ref` derived from
the referring page, so the lead that lands on the product's admissions board records *which page
sent it*. That is one attribution point, it is first-party, and it is worth more than a probabilistic
model built on a cookie we refuse to set.

---

## 3. Event taxonomy

Events are declared in `src/config/analytics.ts` as a union type. `<CTA>` requires an `event` prop
(`06` §2.1), so **an unmeasured CTA does not compile.**

| Event | Props | Fires when |
|---|---|---|
| `cta_click` | `label`, `location`, `destination` | Any CTA |
| `sandbox_open` | `location` | A sandbox link is opened |
| `scroll_act` | `act` (1–12) | An act first becomes 50% visible (once per session) |
| `role_switch` | `role` | The hero switcher changes |
| `module_explore` | `cluster` | The module explorer pins a cluster |
| `catalog_open` | — | The permission catalog is loaded |
| `catalog_search` | `hasResults` | A search is run (**the term is not sent**) |
| `build_status_view` | — | `/trust/build-status` reaches 50% scroll |
| `roi_calculate` | `bucketedLearners` | The calculator produces a result (**inputs are not sent**) |
| `roi_show_maths` | — | The formula disclosure opens |
| `compare_view` | `competitor` | A comparison page reaches 50% |
| `pricing_plan_focus` | `plan` | A plan card is hovered ≥ 1s or focused |
| `faq_open` | `question` | An FAQ item opens |
| `form_start` | `intent` | The first field is focused |
| `form_error` | `field` | Validation fails |
| `form_submit` | `intent`, `ref` | Submitted successfully |
| `form_fail` | `reason` | The upstream rejected it |
| `outbound` | `host` | A link to the sandbox, app or docs |
| `web_vital` | `name`, `value`, `rating` | LCP, INP, CLS, TTFB |
| `client_error` | `message`, `route` | An uncaught error (message only, no stack, no PII) |

**Never sent:** email addresses, names, institute names, free-text, ROI inputs, search terms, IP
(the collector truncates), a persistent identifier of any kind.

---

## 4. Core Web Vitals collection

The `web-vitals` library reports LCP, INP, CLS and TTFB as `web_vital` events, bucketed by route
class. p75 by route, weekly. This is the field data that outranks Lighthouse (`13` §1).

Budget breach → an issue, automatically, with the route and the p75.

---

## 5. Dashboards

Four, reviewed on a fixed cadence so measurement does not become a thing that happens when someone
remembers.

### 5.1 Acquisition — weekly
Sessions by channel and entry page · top referrers · Search Console queries by cluster · which
`/compare/*` and `/resources/*` pages earn entry sessions, and what those sessions do next.

### 5.2 Engagement — weekly
The **act funnel**: `scroll_act` 1 → 12, as a step chart. This is the single most useful chart on
the site: it shows exactly where the story loses people, and a drop between two acts is a copy
problem with a known location.
Also: role-switch usage, module-explorer usage, catalog opens, FAQ opens.

### 5.3 Conversion — weekly
`cta_click` by label and location · `sandbox_open` · `form_start` → `form_submit` · form errors by
field · `roi_calculate` → `cta_click` rate · leads on the product board by `ref`.

### 5.4 Health — continuous
CWV p75 by route · `client_error` rate · `form_fail` rate · 404s by referrer · uptime.

---

## 6. The metrics that decide things

Vanity metrics are excluded on purpose. These six change what we build next:

| Metric | Why it decides something |
|---|---|
| **Act-4 reach** | If under half the visitors reach the product act, the first three acts are too long or the hero has not landed. It is the fastest signal we have. |
| **Sandbox → return within the session** | A visitor who opens the sandbox and comes back is qualified. If they do not come back, the sandbox is the problem. |
| **`/security` depth to `#not-yet`** | The strategy is that honesty converts. This is the measurement of that bet. |
| **Form start → submit** | Below 50% means the form is asking too much. |
| **`roi_calculate` → `cta_click`** | Below 15% means the calculator is producing numbers that do not persuade — and we would rather delete it than tune it dishonestly. |
| **Lead `ref` distribution** | Tells us which page actually sells, as opposed to which page gets traffic. |

---

## 7. Privacy commitments (published on `/legal/privacy`)

1. No cookies, except an optional theme preference set only when a visitor uses the toggle.
2. No cross-site tracking, no fingerprinting, no third-party requests of any kind.
3. IP addresses are truncated at collection and never stored.
4. Aggregate data only; no individual profile exists.
5. Analytics are self-hosted; no analytics vendor is a sub-processor.
6. Data submitted through the demo form goes to our own product database and is used to answer
   your enquiry.
7. The site works identically with analytics blocked.

Every one of these is a design constraint that is already satisfied, not a promise about future
behaviour.

---

## 8. Review cadence

| Cadence | Who | What |
|---|---|---|
| Daily, first 2 weeks | Owner | Health dashboard; errors and 404s |
| Weekly | Owner + writer | Act funnel and conversion; one hypothesis for the following week |
| Monthly | All | Acquisition and SEO; content plan; whether any experiment now has the traffic to be worth running (`10` §9) |
| Quarterly | All | Comparison-page cell re-verification (`17` §5); claim re-verification; capture freshness |

The quarterly item is the one that will get skipped. Put it in a calendar with an owner's name on
it, because a site full of dated evidence that has stopped being true is worse than one that never
claimed evidence at all.
