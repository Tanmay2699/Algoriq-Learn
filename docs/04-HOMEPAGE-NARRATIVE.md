# 04 — HOMEPAGE NARRATIVE

The scroll, act by act. Copy is final-draft, not placeholder — edit it here, not in the component.

---

## 1. The shape of the page

Twelve acts. Roughly 9,400px on desktop, 14,600px on a 390px phone. Reading time if every word is
read: 4 minutes 10 seconds. Time to the three core answers (what / who / is it safe): **38 seconds
of scrolling**, measured at a natural rate.

**The rhythm.** Acts alternate between two surfaces so the page breathes:

```
I    Arrival        ▓▓▓ ink (dark)          hero
II   Problem        ░░░ paper
III  Thesis         ▓▓▓ ink                 the turn
IV   Product        ░░░ paper               the big one — interactive
V    Automation     ░░░ paper (muted)
VI   Lifecycle      ▓▓▓ ink                 the spine — the page's centre of gravity
VII  Intelligence   ░░░ paper
VIII Everywhere     ░░░ paper (muted)
IX   Trust          ▓▓▓ ink                 the reviewer's act
X    Extend         ░░░ paper
XI   Value          ░░░ paper (muted)       arithmetic + comparison
XII  Decision       ▓▓▓ ink                 pricing, FAQ, close
```

Five dark bands, seven light. Dark is used for **assertion** (arrival, thesis, spine, trust,
close); light for **explanation**. Never two dark acts adjacent.

**One idea per act.** If an act needs two headlines it is two acts. If it needs a paragraph of
qualifiers, the qualifiers live on a linked page.

---

## 2. The 37-beat coverage map

The brief specified 37 sections. All 37 are delivered; they are grouped so that each *act* carries
one idea, which is the same brief's other requirement. Nothing was dropped or merged away — a beat
that needs room appears compressed here and in full on the linked page.

| # | Brief beat | Act | Treatment on the homepage | Full treatment |
|---:|---|:--:|---|---|
| 1 | Hero | I | Full | — |
| 2 | Trusted by | I | **Verifiable by** band — 6 checkable proofs (§4.6) | `/trust` |
| 3 | Pain points | II | Full | `/why-algoryq-learn` |
| 4 | Why current CRMs/LMSs fail | II | Full | `/compare/*` |
| 5 | Why our product exists | III | Full | `/about` |
| 6 | Product introduction | III | Full | `/product` |
| 7 | Interactive overview | IV | Full — the module explorer | `/product` |
| 8 | Key modules | IV | 7 clusters, 14 modules named | `/product/*` |
| 9 | Smart automation | V | Full | `/product/platform-and-trust` |
| 10 | AI features | V | Full, with the honest boundary | `/product/modules/ai-assistance` |
| 11 | Lead management | VI | Spine stop 1 | `/product/modules/admissions-crm` |
| 12 | Sales pipeline | VI | Spine stop 2 | `/product/modules/admissions-crm` |
| 13 | Customer management | VI | Spine stop 3 — *learner records* | `/product/modules/learning-delivery` |
| 14 | Team collaboration | VI | Spine stop 6 — staff, roles, approvals | `/product/modules/staff-and-hr` |
| 15 | Analytics | VII | Full | `/product/intelligence` |
| 16 | Reports | VII | Compressed — report builder + exports | `/product/intelligence` |
| 17 | Mobile app | VIII | Full — PWA, 360px, offline | `/product/modules/learning-delivery` |
| 18 | Workflow builder | V | **Honest**: approval chains + rules exist; a visual builder does not | `/trust/build-status` |
| 19 | Integrations | X | Logo-free grid of what is real | `/integrations` |
| 20 | API | X | Compressed — a real request/response | `/developers` |
| 21 | Security | IX | Full | `/security` |
| 22 | Permissions | IX | Full — the catalog, live | `/security#authorization` |
| 23 | Multi-role support | IX + I | The hero *is* this beat; restated with the role matrix | `/security#roles` |
| 24 | Performance | VIII | Compressed — budgets, and the site itself as proof | `/security#scale` |
| 25 | Cloud infrastructure | VIII | Compressed — ports, drivers, `docker compose up` | `/security#portability` |
| 26 | Customization | X | Full — branding, custom fields, roles, flags | `/product/platform-and-trust` |
| 27 | Industry solutions | X | 5 cards | `/solutions/*` |
| 28 | Case studies | XI | **Slot, empty at launch** — renders nothing | `/customers` |
| 29 | Success stories | XI | Same slot | `/customers` |
| 30 | Testimonials | XI | **Slot, empty at launch** — renders nothing | — |
| 31 | ROI calculator | XI | Full, interactive, formula visible | `/why-algoryq-learn#roi` |
| 32 | Before vs after | XI | Full — the real tool-stack table | `/why-algoryq-learn` |
| 33 | Feature comparison | XI | Compressed — 6 rows | `/compare/*` |
| 34 | Pricing preview | XII | Full — 3 real plans | `/pricing` |
| 35 | FAQ | XII | 8 questions | Everywhere |
| 36 | Final CTA | XII | Full | — |
| 37 | Footer | XII | Full (`03` §6) | — |

Three beats change name because the product is an LMS, not a CRM: **Lead → Enquiry**, **Sales
pipeline → Admissions pipeline**, **Customer → Learner**. The mechanics are identical and the
module that owns them (`crm`, 32 routes) is genuinely a CRM.

---

## 3. Global furniture

| Element | Behaviour |
|---|---|
| **Header** | See `03` §3. Translucent over Act I, solid from 64px, hides on scroll-down / returns on scroll-up below 1024px only. |
| **Section rail** | Right edge, ≥1280px only. 12 dots, current act filled, `aria-hidden` (it duplicates the page's own headings), pointer-only. Click scrolls. |
| **Sticky CTA** | Appears after Act IV, `<420px` only, bottom-pinned, dismissible for the session. Above the safe-area inset. |
| **Progress** | 2px brand line under the header, `scaleX` from scroll ratio. `prefers-reduced-motion` → still renders, no easing. |
| **Skip link** | First focusable. `#main`. |
| **Landmarks** | One `<main>`; each act is `<section aria-labelledby="act-N-heading">`. |

---

## 4. ACT I — Arrival

> **Beats 1, 2, 23 · Surface: ink · One idea: *this is one system, and it becomes whoever is
> looking at it*.**

### 4.1 The concept

Most SaaS heroes show a dashboard. Ours shows **four dashboards, and lets you switch between
them.** A segmented control — Owner · Teacher · Student · Parent — swaps the product frame beside
the headline. It is the architecture claim (*one login, role-based dashboards, permissions decide
what is inside a page, not which page you get*) performed rather than asserted, and no competitor
can copy it without actually having built it.

It is also, structurally, a tab set: real `<button role="tab">`s, arrow-key navigable, one focus
stop. The most cinematic thing on the page is also the most accessible thing on the page. That is
not a coincidence; it is the argument.

### 4.2 Layout

**≥1280px** — 12-column, content max 1280px, act min-height `min(92vh, 900px)`.

```
┌───────────────────────────────────────────────────────────────────────┐
│  ▓ ink-900 + aurora mesh (indigo→violet→teal, 8% alpha, 2 blobs)      │
│                                                                        │
│  cols 1-5                          cols 6-12                           │
│  ┌──────────────────────────┐      ┌────────────────────────────────┐  │
│  │ eyebrow                  │      │  ╭ product frame ────────────╮ │  │
│  │ H1 (display, 3 lines)    │      │  │ browser chrome, 1px       │ │  │
│  │ lead paragraph           │      │  │ hairline, radius 24, glass│ │  │
│  │ [primary] [secondary]    │      │  │                           │ │  │
│  │ microcopy                │      │  │  <role dashboard capture> │ │  │
│  │                          │      │  ╰───────────────────────────╯ │  │
│  │ ── Owner Teacher         │      │   floating: one KPI card,      │  │
│  │    Student Parent ──     │      │   one notification toast       │  │
│  └──────────────────────────┘      └────────────────────────────────┘  │
│                                                                        │
│  ─────────── Verifiable by ───────────────────────────────────────────  │
│  sandbox · API · certificate check · self-host · a11y · build status    │
└───────────────────────────────────────────────────────────────────────┘
```

**768–1279px** — stacked; frame below the text at 100% width, role switcher above the frame.
**<768px** — stacked; the frame becomes a single phone-width capture at 92vw with the role
switcher as a horizontally scrollable segmented control **with visible overflow affordance**;
floating cards are removed (they cost more than they say at that size).

### 4.3 Copy

```
eyebrow    The institute operating system

H1         From the first enquiry
           to the final certificate.

lead       Algoryq Learn is the system of record for an institute — admissions, teaching,
           assessment, fees, staff and outcomes in one platform, where every action
           carries a permission and an audit trail.

CTA-1      Open the live sandbox            → sandbox.learn.algoryq.com (new tab)
CTA-2      Book a 20-minute walkthrough     → /demo

micro      No signup for the sandbox. It is a real institute with seeded data,
           read-only, and you can see every role.

switcher   I am a…  [ Owner ] [ Teacher ] [ Student ] [ Parent ]
```

**H1 typography:** `--mk-display-1`, Space Grotesk variable, weight 400, tracking `-0.03em`,
leading `0.95`. Line breaks are hard-set at ≥1024px via `<span class="block">` so the ragging is
designed, not accidental; below that, natural wrap with `text-wrap: balance`.

### 4.4 The four role states

Each state is one capture from the running product against the seeded demo institute. Nothing is
composited or invented.

| Role | Capture | The one thing the eye should catch | Caption under the frame |
|---|---|---|---|
| **Owner** | `/dashboard` as Institute Admin | Collections + enrolments + a branch breakdown | "Today's collections, not last month's." |
| **Teacher** | `/dashboard` as Teacher | Marking queue + at-risk learners | "What needs you, in order." |
| **Student** | `/learn` | "Continue where you left off" + what's due | "Next up. Nothing else." |
| **Parent** | `/family` | One child, attendance and marks, read-only | "Read-only, by construction." |

Captions matter: they turn a screenshot into a claim.

### 4.5 Motion

| Moment | Spec |
|---|---|
| Entrance | Eyebrow, H1 lines, lead, CTAs, switcher stagger in at 60ms, `translateY(14px)` → 0, opacity 0→1, 420ms, `--mk-ease-entrance`. H1 lines stagger individually. |
| Frame | Fades and scales `0.985 → 1` over 560ms, 120ms after the H1 starts. **Never blocks the LCP element.** |
| Role switch | Cross-dissolve 220ms + `translateY(6px)`; the KPI numbers in the floating card `Counter` to their new value over 500ms. |
| Aurora | Two radial blobs drift on a 24s and 31s loop, `translate3d` only, ≤ 40px amplitude. |
| Pointer | The frame tilts ≤ 1.2° toward the pointer, damped, ≥1280px and fine pointer only. |
| Reduced motion | No stagger (all at once, opacity only 150ms), no drift, no tilt, counters render final values. **The act still works** — verified as its own Playwright test. |

### 4.6 The "Verifiable by" band (beat 2)

Where a competitor puts customer logos. Six items, horizontal, monospace labels, each a link that
opens the thing itself.

```
Verifiable by  ·  A live sandbox  ·  The full API reference  ·  A certificate you can check  ·
                  docker compose up  ·  Our accessibility statement  ·  What we haven't built
```

Above it, one line of type at `--mk-caption`: **"We have no customer logos to show you yet. Here
are six things you can check without asking us."**

That sentence is the single highest-trust asset on the page. Do not soften it, do not delete it
when the first logo arrives — move it to `/trust` instead.

### 4.7 Accessibility

`<h1>` is the only h1 · switcher is `role="tablist"` with `aria-controls` on each tab and
`role="tabpanel"` + `tabindex="0"` on the frame · arrow keys move, Home/End jump, Enter/Space
activate · the frame's `<img>` has a descriptive alt naming role and screen · the aurora is
`aria-hidden` and pointer-events-none · contrast of every text token on ink-900 is ≥ 7:1 (measured
in `12` §3).

### 4.8 Performance

LCP element is the H1 — a text node in the server-rendered HTML, styled by inlined critical CSS,
with the display font preloaded. The frame image is `priority` but `fetchpriority="low"` and sized
so it never wins LCP. Role captures 2, 3 and 4 are `loading="lazy"` and preloaded on first
interaction with the switcher. Budget for Act I: **≤ 210 KB** including the hero capture.

---

## 5. ACT II — The problem

> **Beats 3, 4 · Surface: paper · One idea: *nothing reconciles*.**

### 5.1 Copy

```
eyebrow    The stack you actually run

H2         Nothing reconciles.

lead       Most institutes run on five or six tools that have never met each other.
           Each one works. The seams are where the money and the students go missing.
```

### 5.2 The table (real, from the product's BRD §1)

Two columns, one row per job. This is not a strawman — it is the researched current state.

| The job | What you use today | What it costs you |
|---|---|---|
| Host course content | Drive, unlisted YouTube | No progress, no access control |
| Deliver live classes | Zoom, scheduled over WhatsApp | Attendance reconciled by hand |
| Assess | Google Forms, printed papers | No item analytics, manual grading |
| Attendance & marks | Excel | Error-prone, invisible to parents |
| Collect fees | A payment link + a spreadsheet | Manual reconciliation, no dunning |
| Admissions | Phone and a notebook | Enquiries leak, no attribution |
| Certificates | Canva and email | Unverifiable, forgeable |
| Report to management | Compiled by hand, monthly | Decisions run 30 days late |

**Motion:** rows reveal on a 45ms stagger as the table enters. The third column's text is
`--danger-text` — *the text token, never the fill token* (`01` §7.1).

### 5.3 The turn (beat 4)

Immediately below, three short cards. No illustration — the type carries it.

> **A course platform is not an institute.**
> Moodle, Classroom and Canvas are good at handing out coursework. None of them knows what an
> enquiry is, what a fee is, or who is about to drop out. So the other half of the institute goes
> back into the spreadsheet — and now you have two systems of record, which is none.

> **A CRM does not know what a batch is.**
> Bolt a generic CRM onto a course platform and you get a pipeline that cannot spend a seat, an
> invoice that does not know what was taught, and a certificate nobody can verify.

> **The integration is the product.**
> The value is not in any one module. It is in the enquiry that becomes an enrolment that becomes
> a progress record that becomes a mark that becomes a certificate — **in one database, with one
> permission model, in one audit trail.**

Link out: `See how we compare →` `/compare/moodle`.

---

## 6. ACT III — The thesis

> **Beats 5, 6 · Surface: ink · One idea: *one database, one login, one version of the truth*.**

The turn of the page. Short, big type, almost no chrome. This act should take 6 seconds to read.

```
eyebrow    Why we built it

H2         One database.
           One login.
           One version of the truth.

body       Algoryq Learn is a single backend, a single PostgreSQL database and a single
           frontend. Thirty-one modules share one tenant boundary, one permission
           catalog and one audit log. A learner's enquiry, enrolment, attendance,
           marks, fees and certificate are rows that can see each other.

           That is the whole idea. Everything below is a consequence of it.
```

**Visual:** an architecture line-drawing, hairline-weight, drawn once with `stroke-dasharray`
animation as it enters (720ms, single pass, never loops). Browser → BFF → API → one database, with
the 31 module names in a quiet monospace ring. Under reduced motion it renders complete.

**Below:** three stat blocks, `Counter`-animated once.
`31 modules` · `497 API routes` · `1 database` — each with its `claims.ts` evidence in the title
attribute and a footnote linking `/trust/build-status`.

---

## 7. ACT IV — The product

> **Beats 7, 8 · Surface: paper · One idea: *this is the whole thing, and you can look at it*.**

The largest act, and the one a returning visitor scrolls straight to.

### 7.1 The module explorer

A two-pane interactive. Left: the seven clusters as a vertical list of large type. Right: the
product frame showing that cluster's flagship screen. Hovering (or focusing, or tapping) a cluster
swaps the frame and reveals its module list beneath.

```
┌──────────────────────────┬───────────────────────────────────────┐
│ Admissions & Growth   ─▶ │  ╭──────────────────────────────────╮ │
│ Academics & Content      │  │  /crm — the admissions board      │ │
│ Delivery & Engagement    │  │  (real capture, dated)            │ │
│ Assessment & Outcomes    │  ╰──────────────────────────────────╯ │
│ Money & People           │  Leads · Pipelines · Applications ·   │
│ Intelligence             │  Follow-ups · Web-to-lead · Dedupe    │
│ Platform & Trust         │  32 API routes · 20 permission keys   │
└──────────────────────────┴───────────────────────────────────────┘
```

- **Interaction:** a real tab set again (vertical orientation, `aria-orientation="vertical"`).
  Hover previews on a 120ms delay; click/Enter pins. On touch, tap pins immediately.
- **Below the pane:** all 14 module names as chips, each linking its page. Every chip shows its
  cluster colour and, on the four modules under 65%, a quiet `·` marker whose tooltip and
  screen-reader text read "in progress — see build status".
- **Copy:** `H2` **This is the whole thing.** · lead: "Seven clusters, thirty-one modules, one
  tenant. Hover to look inside; every screen below is captured from a running install."
- **Mobile:** clusters become a vertical accordion; the frame renders inside the open panel.

### 7.2 The honesty line

Under the explorer, at `--mk-body-sm`, muted:

> Four of these are still being finished, and we publish exactly how far along each one is.
> **See what's built →** `/trust/build-status`

---

## 8. ACT V — Automation and AI

> **Beats 9, 10, 18 · Surface: paper-muted · One idea: *the repetitive half is done for you — and
> the AI drafts, it does not decide*.**

### 8.1 Automation (beats 9, 18)

Three columns, each a mechanism with the real behaviour named.

| **Approvals that route themselves** | **Rules that assign work** | **A queue that will not drop a message** |
|---|---|---|
| Configurable approval chains on courses, leave and applications: steps, approvers, decisions, and an audit entry for each. | Round-robin on a cursor stored on the rule — not "whoever has fewest", which two simultaneous enquiries defeat. A rule naming someone who has left leaves the enquiry **unassigned**, because an unclaimed queue is a thing somebody looks at. | Every notification is written to a transactional outbox in the same transaction as the thing that caused it, then drained by a worker with retries and a delivery log you can inspect and re-run. |

**The honest note, in the same size as the claims:**

> There is no visual workflow builder. Approval chains, assignment rules, waitlist promotion and
> scheduled jobs are configuration, not a canvas. If you need a drag-and-drop automation designer
> today, we are not there — and it is on `/trust/build-status` with everything else.

### 8.2 AI (beat 10)

```
H3     Drafts, never decisions.

body   Paste an outline, get a course structure. Ask for a lesson, get Markdown you can
       edit. Nothing an AI produces reaches a course until a human presses apply — that
       is a separate, audited action, not a setting.

       The provider is a port: OpenAI, Azure OpenAI or Anthropic, chosen by an environment
       variable. The default is `disabled`, and when it is disabled the feature is hidden
       rather than broken. Token budgets are per tenant. Generations are cached.
```

Three AI capabilities that are real, and nothing else: **course outline drafting** ·
**lesson content drafting** · **dropout-risk scoring with interventions** (plus adaptive paths and
interview practice, named). AI tutoring, AI grading, transcription and TTS are **not built** and
are named as such — the module page carries the full list.

**Visual:** a two-panel before/after of the generation screen and the apply step, with the apply
button circled in a hand-drawn-feeling annotation stroke. The annotation is a static SVG.

---

## 9. ACT VI — The lifecycle spine

> **Beats 11, 12, 13, 14 · Surface: ink · One idea: *one record travels the whole way*.**

The centre of gravity of the page. If a visitor reads one act, this is the one.

### 9.1 The device

A horizontal spine with seven stops. As the act scrolls, the spine draws and each stop's card
enters. **Not a scroll-jacked pin** — the page scrolls normally and elements reveal (see
`07` §4.4 for why we refuse scroll hijacking).

```
 Enquiry ──── Application ──── Enrolment ──── Learning ──── Assessment ──── Certificate ──── Placement
    │              │               │              │              │               │               │
  crm            crm             learn          learn          assess           cert         placement
```

### 9.2 The stops

| Stop | Headline | Body (max 240 chars) | Capture | Beat |
|---|---|---|---|---|
| **1 · Enquiry** | No enquiry goes cold. | It arrives from your website, a phone call or a walk-in and lands on a board with an owner, a timeline and a follow-up. The same person enquiring twice is *suggested* as a duplicate, never silently swallowed. | `/crm` board | 11 |
| **2 · Application** | Your stage names. Our stage meaning. | Call the first column Enquiry or Qualified — nothing in the code reads the label. Won, lost and open are the facts every funnel counts, so your conversion rate survives your vocabulary. | `/crm` pipeline settings | 12 |
| **3 · Enrolment** | One press, two honest outcomes. | Already a member? Enrolled. Not yet? Invited, and the application says so until they accept. Press it twice and nothing doubles. A seat limit refuses out loud rather than pretending. | `/crm/applications` | 12 |
| **4 · Learning** | Every learner, one record. | Courses, batches, timetable, live classes, attendance, notes, questions and progress — including progress captured on a phone with no signal and replayed in order when it comes back. | `/learn` + `/learn/courses/[id]` | 13 |
| **5 · Assessment** | Marks that stand up. | Question banks, papers with sections, attempts, an anonymised marking queue, item analysis, rubrics, grade scales, overrides — each with a reason and an audit entry. | `/assessments/[id]/analysis` | 13 |
| **6 · Certificate** | Verifiable by a stranger. | Issued from a template, revocable, and checkable by anyone holding the code at a public URL with no account. An unverifiable credential is worth less than a verifiable one. | `/verify/[code]` | 13 |
| **7 · Placement** | The outcome you are actually judged on. | Drives, openings, applications, interview panels and scorecards — with a practice interview the learner can run on their own first. | `/placements` | 14 |

### 9.3 Team collaboration (beat 14), as the spine's underline

Beneath the spine, one band:

> **And every one of those steps has a person attached.**
> Eleven role templates you can clone and reshape, scoped to a branch, a department, a course or a
> single record. Per-user overrides. Out-of-office delegation. Comments and questions on the work
> itself, not in a WhatsApp group. Nothing in the code branches on a role's name — which is why
> you can invent a role we never thought of.

### 9.4 Motion

Spine line draws left→right at 900ms as the act enters (single pass). Stop cards reveal on a 90ms
stagger tied to their own intersection, not to a master timeline — so a fast scroller never sees a
half-empty spine. Reduced motion: everything present, no draw.

**Mobile:** the spine rotates to vertical and the cards stack. The line runs down the left gutter
at 2px. This is the single most important mobile layout on the site — build it first, at 360px.

---

## 10. ACT VII — Intelligence

> **Beats 15, 16 · Surface: paper · One idea: *see it before it happens*.**

```
eyebrow    Analytics, reports and risk

H2         Who is about to fall behind.

lead       Dashboards for each role, a report builder that saves definitions and runs
           them, exports collected in one place, and a risk score per learner with
           the signals that produced it — attendance, progress, submissions, marks.
```

**Layout:** left, the risk screen capture (`/risk`); right, three stacked mini-explanations —
*Dashboards* · *Report builder + exports* · *Risk and interventions*.

**Charts on this site are the product's own chart components** (`BarChart`, `LineChart`,
`DonutChart`, `Sparkline` from `@akechi/ui` — hand-built SVG, no chart library). Any data displayed
is from the seeded demo institute and is labelled *"Demo institute — seeded data"*. Never a
plausible-looking invented curve. See `09-VISUAL-LANGUAGE-AND-ASSETS.md` §5 for the chart rules and
the dataviz colour ramp.

**Honest note:** scheduled report delivery and pivot tables are not built (65%).

---

## 11. ACT VIII — Everywhere

> **Beats 17, 24, 25 · Surface: paper-muted · One idea: *it runs where your learners are, and where
> your data has to be*.**

### 11.1 Devices (beat 17)

A device cluster — desktop, tablet, phone — each showing a real capture at that breakpoint, not one
image scaled three ways. Under it:

> **Installable, not downloadable.** Algoryq Learn is a PWA: it installs to a home screen without an app
> store, updates without a review queue, and is designed at 360 pixels first. Progress captured
> without a connection is queued on the device and replayed in order when the signal returns —
> idempotently, so a double-replay changes nothing.
>
> There is no native iOS or Android app, and for this audience that is the right trade.
> `Why → /resources/why-a-pwa`

### 11.2 Performance (beat 24)

Four numbers, and one sentence that lands harder than any of them:

> This page is the proof. No third-party script, no CDN font, no analytics on the critical path.
> Check the network tab.

Product-side: horizontally scalable API (shared cache; no per-process state), permission grants
cached and version-busted, rate limiting before the guards, cursor-friendly list endpoints.
**Honest:** the background worker is deliberately a single process today — its jobs claim no rows,
so a second copy would double-send. Named here, not hidden.

### 11.3 Infrastructure (beat 25)

> **Ports, not vendors.** Storage is `local-disk`, `s3` (which covers MinIO and R2) or
> `azure-blob`. Mail is `log` or `smtp`. Search is Postgres or Meilisearch. AI is OpenAI, Azure
> OpenAI, Anthropic or `disabled`. Cache is memory or Redis. Every one is an environment variable,
> and **no cloud-provider SDK is imported in feature code**.
>
> `docker compose up` boots the entire platform on a laptop with no cloud account at all. That is
> not a developer convenience; it is your exit strategy, documented before you sign.

---

## 12. ACT IX — Trust

> **Beats 21, 22, 23 · Surface: ink · One idea: *isolation and authorization you can inspect*.**

The reviewer's act. **No adjectives.** Every claim is a mechanism with a file behind it.

### 12.1 Copy

```
eyebrow    Security

H2         Isolation you can inspect.

lead       Not "enterprise-grade". Here is the mechanism, and here is where it lives.
```

### 12.2 The four panels

| **Tenant isolation is a database policy** | **Authorization is deny-by-default and CI-enforced** |
|---|---|
| Every tenant-owned table carries `tenant_id` and a `tenant_isolation` policy with **`ENABLE` *and* `FORCE`** — without `FORCE`, the table owner bypasses every policy. The app connects as a role that is not the owner, not a superuser, and holds no `BYPASSRLS`. The policy set is derived from `information_schema`, so a new table is covered automatically and a gap fails CI. **114 tables.** The 13 exemptions are named and reasoned — we publish them. | Every controller route carries a permission key or an explicit `@Public()`; a lint rule and a coverage check fail the build otherwise. **272 keys, 264 enforced on a route.** The rest belong to surfaces not yet built, and that number is published too. Roles are per tenant and fully customisable; nothing in the code branches on a role's name. |

| **The audit log is a hash chain** | **Accessibility is a build gate** |
|---|---|
| Every mutation emits a domain event with a field-level diff, chained to the hash of the entry before it. Retention, legal holds and GDPR subject requests are built. **Erasure tombstones the record; it never rewrites the chain that proves it.** Hold beats retention; retention beats erasure. | WCAG 2.2 AA. axe runs in Storybook and in Playwright — at 360 pixels among other widths — and fails the build. There is no drag-and-drop anywhere without a keyboard *and* a touch path; the admissions board uses a select and arrow buttons for exactly that reason. Our conformance statement lists what still fails. |

### 12.3 The permission catalog, live (beat 22)

A searchable, real rendering of the catalog: filter by module, see every key and its
school-administrator-readable description. It is 272 rows of the actual `packages/authz` catalog,
built into the page as static JSON (≈18 KB gzipped, loaded on interaction only).

Nobody else in this category will show you their permission model. Showing ours *is* the argument.

### 12.4 The roles matrix (beat 23)

Eleven templates × the seven lifecycle stages, showing what each can do. Rendered from the real
`ROLE_TEMPLATES` grants, not hand-written.

**Close:** `Read the security notes →` `/security` · `What we haven't built →` `/trust/build-status`

---

## 13. ACT X — Extend and fit

> **Beats 19, 20, 26, 27 · Surface: paper · One idea: *shape it without us*.**

### 13.1 Customisation (beat 26)
Per-tenant branding pushed live (logo, colours, radius — the product ships **one** build for every
tenant; branding is injected into the server-rendered shell, not compiled) · custom domains ·
custom fields as JSONB with GIN indexes on every major entity, designed in from day one rather
than retrofitted · roles and permissions · feature flags with per-tenant overrides · approval
chains · saved views.

### 13.2 Integrations (beat 19)
**A grid with no logos** — because a logo grid implies partnerships we do not have. Instead, a
plain two-column list: **built** (Google / Microsoft / GitHub sign-in · SMTP · S3, MinIO and Azure
Blob · Meilisearch · OpenAI, Azure OpenAI, Anthropic · webhooks with HMAC and a delivery log · API
keys · CSV import and export) and **a port with no driver yet** (meeting providers — you paste a
link; payment gateways — you record a payment; SMS and WhatsApp; SCIM; SAML/OIDC).

Printing the second column is the whole point.

### 13.3 API (beat 20)
One real request and its real response, in a code block, using the public web-to-lead endpoint —
the same one this site's own demo form uses.

```http
POST /public/institutes/{slug}/enquiries
Content-Type: application/json

{ "name": "Anita Rao", "email": "anita@example.com", "phone": "+91 98765 43210",
  "message": "Interested in the data-science evening batch" }
```

> Every endpoint is documented, versioned and permission-checked. Keys are hashed at rest and
> revealed once. Webhooks are HMAC-signed with a delivery log you can replay.
> `Read the API reference →` `/developers`

### 13.4 Industries (beat 27)
Five cards → `/solutions/*`. Each card names the one thing that segment cares about most:
*coaching* → admissions volume + test analytics; *schools* → parents + attendance + fees;
*universities* → accessibility conformance + programme structure; *skilling* → placement outcomes;
*corporate L&D* → compliance certificates + SSO (named as not built).

---

## 14. ACT XI — Value

> **Beats 28–33 · Surface: paper-muted · One idea: *do the arithmetic yourself*.**

### 14.1 The proof slots (beats 28, 29, 30)

`<CaseStudies />`, `<Testimonials />` and `<Awards />` all render `null` at launch. In their place,
one honest band — **not** a "coming soon" (which is a promise), but a standing offer:

```
H3    We have no case studies yet.

body  Algoryq Learn has not shipped to a paying customer. We are taking three design
      partners: the Growth plan free for twelve months, direct access to the
      people who built it, and a named case study at ninety days — yours to
      approve, or to refuse.

CTA   Apply as a design partner  →  /demo?intent=design-partner
```

When the first real case study lands, this band moves to `/customers` and the slot fills. The
layout was designed to work either way — that is a build requirement, not an aspiration
(`06-COMPONENT-LIBRARY.md` §4.2).

### 14.2 Before / after (beat 32)

The tool-stack table from Act II, re-rendered with the right-hand column replaced: *"What it costs
you"* becomes *"Where it lives now"*, each pointing at a module. Same rows, same order — the visual
rhyme is the argument. On desktop the two states cross-fade under a two-state toggle
(`Today` / `With Algoryq Learn`); on mobile they stack as two tables.

### 14.3 ROI calculator (beat 31)

**Rules, non-negotiable** (see `10-CONVERSION-AND-CRO.md` §6):
1. Every input is the visitor's own number. No pre-filled value that flatters us.
2. Defaults are the **conservative** end of the range, and are labelled as assumptions.
3. The formula is printed on the page, in full, in monospace.
4. Outputs that we cannot ground are not shown. We show **tool spend replaced** and **administrative
   hours**, both of which the visitor supplies. We do **not** show "revenue increase" or
   "completion-rate uplift" — we have no data for either and inventing one would poison the page.
5. A "show the maths" disclosure expands to the line-by-line arithmetic.
6. Nothing is emailed, nothing is gated, nothing is stored.

```
Inputs   learners · staff · branches · monthly spend on the tools you would retire
         · hours/week spent reconciling · loaded hourly cost of the person doing it
Output   Tools replaced: ₹X / year   ·   Reconciliation time: Y hours / year (≈ ₹Z)
         Algoryq Learn at your size: <plan> — ₹P / year
         Net: ₹(X + Z − P)
Footnote The formula, printed. And: "This is arithmetic on your numbers, not a study."
```

### 14.4 Comparison (beat 33)

Six rows only, then out to `/compare/*`: multi-tenant isolation · admissions built in · fees built
in · permission model you can shape · accessibility conformance published · self-hostable.
Every cell is factual, sourced and dated (`17` §5). Competitor columns say "yes" where the answer
is yes — a comparison table that gives the competitor no wins is one nobody believes.

---

## 15. ACT XII — Decision

> **Beats 34, 35, 36, 37 · Surface: ink · One idea: *start now, free, no conversation required*.**

### 15.1 Pricing preview (beat 34)

Three real plans from `GET /public/plans`. Seats, courses, storage and AI budget per plan, sourced
live so the page cannot drift from the database.

| Starter | Growth | Enterprise |
|---|---|---|
| **₹0** / month | **₹14,999** / month | Let's talk |
| 100 seats · 25 courses · 5 GiB · 200k AI tokens | 1,000 seats · 250 courses · 100 GiB · 2M AI tokens | Unlimited, negotiated |
| For one campus getting started | For a growing institute with several branches | For a group, or for a residency requirement |

Under it, the sentence most pricing pages omit:

> There is no online checkout yet — the billing module has no payment-gateway adapter, so every
> plan change today is a short conversation. The free tier needs no conversation at all.

### 15.2 FAQ (beat 35)

Eight, chosen because they are the eight that actually get asked. `<details>`-based accordion, all
content in the HTML for crawlers, `FAQPage` JSON-LD.

1. Can we self-host it? — Yes. `docker compose up` boots everything; no cloud account needed.
2. Where is our data? — In a PostgreSQL database you can point at. Isolation is an RLS policy, not
   application code.
3. Can we import from Excel? — CSV import for people and courses with a per-row error report.
4. Do you have SSO? — Not yet. OAuth with Google, Microsoft and GitHub is built; SAML/OIDC and SCIM
   are not. It is on the build-status page.
5. Is it accessible? — WCAG 2.2 AA with automated checks failing the build, and a conformance
   statement that lists what still fails.
6. Can parents see marks? — Yes, read-only, through guardian links.
7. Can we take fees online? — You can raise, track and reconcile invoices. You cannot yet take a
   card payment inside the product; no gateway adapter is built.
8. What happens if we outgrow you / you disappear? — Standard Postgres, open ports, full export,
   self-host. The exit is documented before the entrance.

### 15.3 Final CTA (beat 36)

```
H2      Start on the free tier. Bring your spreadsheet.

lead    A hundred seats, twenty-five courses and no conversation. If you would
        rather see it driven by someone who knows it, that takes twenty minutes.

CTA-1   Start free — 100 seats
CTA-2   Book a 20-minute walkthrough
micro   Or open the sandbox and click around first. No form.
```

### 15.4 Footer (beat 37)

Per `03` §6.

---

## 16. Section budget

| Act | Max first-load JS | Images | Notes |
|---|---:|---:|---|
| I | 14 KB | 1 eager + 3 lazy | Switcher is the only client component above the fold |
| II | 0 KB | 0 | Pure server render |
| III | 2 KB | 0 | SVG draw is CSS |
| IV | 11 KB | 1 eager + 6 lazy | Explorer tabs |
| V | 0 KB | 2 | |
| VI | 3 KB | 7 lazy | Reveal only |
| VII | 4 KB | 1 | Product chart components |
| VIII | 0 KB | 3 | |
| IX | 9 KB | 0 | Catalog JSON loads on interaction |
| X | 2 KB | 1 | |
| XI | 12 KB | 2 | Calculator |
| XII | 3 KB | 0 | `<details>` FAQ, no JS |
| **Total** | **≤ 60 KB** | | Plus 30 KB framework floor = the 90 KB budget in `13` §2 |
