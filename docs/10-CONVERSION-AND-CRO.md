# 10 — CONVERSION & CRO

The site's job is to move a stranger to one of three states: **sandbox opened**, **walkthrough
booked**, or **free tier started**. Everything below optimises for that without lying to get it.

---

## 1. The funnel

```
        Search / referral / direct
                  │
            ┌─────┴─────┐
            │  Landing  │   home · compare · resources · solutions
            └─────┬─────┘
                  │  (Q1: what is it?  Q2: is it for me?)
            ┌─────┴─────┐
            │  Explore  │   product · modules · pricing · security
            └─────┬─────┘
                  │  (Q3: is it safe?  Q4: what does it cost?)
      ┌───────────┼───────────┐
      ▼           ▼           ▼
  Sandbox     Walkthrough   Free tier          ← the three conversions
  (self)      (assisted)    (self)
      │           │           │
      └───────────┴───────────┘
                  ▼
             Product signup
```

**Three doors, deliberately.** A single "Book a demo" button loses the evaluator who will not talk
to a salesperson — which, for a technical buyer in this category, is most of them. A single
"Start free" loses the institute owner who wants to be shown. We carry both, plus the sandbox,
which is the lowest-commitment door and the one we push hardest because it converts the two others
downstream.

---

## 2. Conversion targets (to be baselined in the first 30 days)

Targets, not predictions. We have no traffic history; these are the numbers we will hold ourselves
to and revise once there is data. Publishing a fabricated benchmark here would be the same sin as
fabricating a testimonial.

| Metric | Definition | First target |
|---|---|---|
| Scroll to Act IV | % of homepage sessions reaching the product act | 55% |
| Sandbox open rate | % of sessions clicking a sandbox CTA | 8% |
| Demo form start | % of `/demo` views that focus a field | 40% |
| Demo form completion | starts → submits | 55% |
| Home → pricing | % of homepage sessions reaching `/pricing` | 22% |
| Security depth | % of `/security` sessions reaching `#not-yet` | 30% (this one matters more than it looks) |
| Bounce on `/compare/*` | single-page sessions | < 55% |

---

## 3. The CTA system

### 3.1 Hierarchy

| Rank | Label | Where | Why |
|---|---|---|---|
| P1 | **Book a 20-minute walkthrough** | Header, hero, every act close, footer | Named duration removes the "how long will this cost me" objection |
| P1-alt | **Start free — 100 seats** | Pricing, final CTA, solutions | A number, not a word |
| P2 | **Open the live sandbox** | Hero, product pages, mega-menu | Zero commitment. Opens in a new tab so we do not lose the page. |
| P3 | **Read the security notes** | Trust act, header (as a nav item) | The reviewer's door |
| P3 | **See what's built** | Anywhere honesty is the argument | Converts skeptics |

### 3.2 Rules

1. **Every act ends with a next step**, and it is never the same one twice in a row.
2. **Two CTAs maximum per view.** A third is a decision tax.
3. **The label says what happens.** Not "Get started", "Learn more", "Request a demo".
4. **Secondary CTAs are hairline, not ghost-with-no-border.** An invisible button is not humble, it
   is unusable.
5. **No CTA fires a modal.** Every CTA is a link to a page or an external tab.
6. **Microcopy under the primary CTA** removes the next objection in six words or fewer.
   Hero: *"No signup for the sandbox."* Pricing: *"No card. No call."*
7. **Sticky CTA on <420px only**, after Act IV, dismissible. On desktop the header carries it.

---

## 4. The demo form

The only form on the site. It posts to the product's real web-to-lead endpoint —
`POST /public/institutes/akechi/enquiries` — via `/api/lead`, so **the marketing site's leads land
on the product's own admissions board**. We run our funnel on our own CRM. That is both a dogfooding
discipline and the most honest possible demonstration of the module.

### 4.1 Fields

| Field | Required | Why it is there |
|---|---|---|
| Name | ✓ | |
| Work email | ✓ | Validated shape only. No "no free email providers" gate — a coaching institute owner uses Gmail. |
| Institute | ✓ | |
| Role | ✓ | Owner / academic / IT / finance / other — routes the conversation and segments the funnel |
| Learners | ✓ | A range select, not a number input. Sizes the call. |
| Phone | ○ | Optional, and saying so raises completion |
| What would you like to see? | ○ | Free text. The single most useful field for the person taking the call. |
| `intent` | hidden | `walkthrough` \| `design-partner` \| `pricing` \| `security`, from the query string |

**Seven fields, two optional.** Every additional required field costs roughly 5–8% completion; each
one above must earn it. There is no "company size in revenue", no "timeline", no "budget" — those
are questions for the call, and asking them on a form is how you get fake answers.

### 4.2 Behaviour

- Validation with a Zod schema shared between the client and `/api/lead`. Inline errors,
  `aria-describedby`, focus to the first invalid field on submit.
- Success: the form is replaced by a confirmation naming **what happens next and by when** ("a real
  person, within one working day, from an @akechi.com address"). Plus the sandbox link, because the
  best thing a waiting prospect can do is look at the product.
- Failure: values preserved, the reason stated, a `mailto:` fallback offered. Never a silent retry.
- Anti-spam: honeypot + time-to-submit floor + the API's per-tenant rate limit. **No CAPTCHA** — a
  third-party CAPTCHA would break the no-third-party-origin rule, and the product has none.
- Nothing is stored on this site. The lead exists in the product's database and nowhere else.

### 4.3 What the endpoint already guarantees (and why that is a selling point)

The product's public capture forces `source=WEB`, has no way to set stage, owner or pipeline
(those fields are *absent from the schema*, not validated away), returns a fixed acknowledgement so
it cannot be used to ask "is this email on file?", and answers identically for an unknown or a
suspended institute so it cannot enumerate tenants. We can describe our own contact form's threat
model on `/developers`. Nobody else can.

---

## 5. Friction audit

Removed on purpose:

| Common friction | Our answer |
|---|---|
| Cookie consent banner | We set no cookies except an optional theme preference. `/legal/cookies` is one screen. |
| Email gate on content | Nothing is gated. Not the guides, not the security notes, not the API reference. |
| "Contact sales to see pricing" | Real prices, on the page, from the database. |
| Chat widget | None. An unstaffed widget is a broken promise; a staffed one we cannot afford yet. |
| Newsletter modal | None. A footer field, at most, in v1.1. |
| Free-trial credit card | The free tier needs no card because it needs no payment gateway (which we do not have — see §7). |
| Multi-step form | One step. Seven fields. |
| "Book a demo" calendar embed | A third-party origin. The form routes to a human who sends a link. |

---

## 6. The ROI calculator

The brief asks for one. Most are lie-generators: pre-filled with flattering defaults, computing a
"revenue uplift" from a made-up conversion improvement. Ours is arithmetic on the visitor's own
numbers, with the formula printed.

### 6.1 Inputs (all the visitor's)

`learners` · `staff` · `branches` · `monthly spend on tools you would retire (₹)` ·
`hours per week spent reconciling between tools` · `loaded hourly cost of the person doing it (₹)`

Defaults are **empty**, not flattering. If a default is needed for a slider, it sits at the
conservative end of the plausible range and is labelled *assumption*.

### 6.2 Outputs (only what the inputs support)

```
Tools replaced            = monthlyToolSpend × 12
Reconciliation time       = hoursPerWeek × 52
Reconciliation cost       = hoursPerWeek × 52 × hourlyCost
Akechi at your size       = plan(learners).annualPrice        ← from /api/plans
Net first-year difference = (toolsReplaced + reconciliationCost) − akechiAnnual
```

### 6.3 What we refuse to compute

No "revenue increase from higher conversion". No "completion-rate uplift". No "hours saved per
teacher" multiplied by a number we invented. We have no data for any of them, and a calculator that
manufactures a benefit is a calculator a CFO discards along with the vendor.

### 6.4 Presentation

The result is one sentence and one number, with a `<Disclosure>` labelled **"Show the maths"** that
expands to the line-by-line arithmetic and the formula in monospace. Under it, in `--mk-body-sm`:

> This is arithmetic on the numbers you typed, not a study. We have not measured a customer's
> savings, because we do not have a customer yet.

That sentence will convert better than the calculator.

---

## 7. Honest conversion constraints

Three things we cannot do yet, and how the site handles each rather than papering over it.

| Constraint | Handling |
|---|---|
| **No payment gateway adapter** in the product's billing module | `/pricing` says paid plans start with a conversation; the free tier needs none. No fake checkout. |
| **No SSO** | Named on `/security#identity`, `/integrations` and `/solutions/corporate-l-and-d`. Losing an enterprise lead at the website is cheaper than losing it in week six of a pilot. |
| **No customers** | The design-partner offer (§8) turns the weakness into a specific, time-boxed ask. |

---

## 8. The design-partner offer

The site's most important conversion path for the first ninety days.

> **Three design partners.** The Growth plan free for twelve months, direct access to the people
> who built it, weekly calls, and a named case study at ninety days — yours to approve, or to
> refuse. In exchange: your real workload, your real complaints, and permission to fix things
> in front of you.

It appears in Act XI, on `/customers`, on `/why-akechi` and as `?intent=design-partner` on `/demo`.
It is specific (three, twelve months, ninety days), it is reciprocal, and it converts the "you have
no customers" objection into an invitation.

---

## 9. Experiment programme

No experiment runs until there is enough traffic to reach significance in under three weeks —
running an underpowered A/B test is worse than shipping the better-reasoned variant, because it
produces a confident wrong answer.

| # | Test | Metric | Ship threshold |
|---|---|---|---|
| E1 | Hero headline A (lifecycle) vs D (honesty) | Scroll-to-Act-IV | +6% relative |
| E2 | Primary CTA: "Book a 20-minute walkthrough" vs "Talk to the people who built it" | CTA click rate | +8% |
| E3 | Sandbox-first vs walkthrough-first CTA order in the hero | Combined conversion | +5% |
| E4 | Verifiable-by band above vs below the fold | Scroll depth + security-page visits | +10% on the second |
| E5 | Serif display vs Inter Display (ADR 0003 kill criterion) | Scroll-to-Act-IV | −8% triggers the swap |
| E6 | Pricing: plans first vs "what's included everywhere" first | Pricing → demo | +6% |

Implementation: a build-time variant flag with a cookieless split (a hashed, non-persistent bucket
derived from the request, no user identifier), and **both variants shipped in the HTML with one
hidden** is *not* acceptable — it doubles the DOM. Two static builds behind an edge split instead.

---

## 10. Objection-to-page routing

Every objection from `02` §8 must be reachable in one click from the act that raises it. The audit
in W4: walk the homepage as each of the seven personas and confirm that the question they are
holding at each act has a visible answer or a visible door to one. An objection with no door is
where the funnel leaks.

---

## 11. Anti-patterns, banned

Exit-intent popups · countdown timers · "12 people are viewing this" · fake urgency of any kind ·
pre-checked consent · a "no thanks, I don't want to grow my institute" decline link · autoplaying
audio · chat that opens itself · a form that asks for a phone number and then calls within a minute
· any copy that implies customers we do not have.

Every one of these raises a short-term number and costs the exact buyer we want.
