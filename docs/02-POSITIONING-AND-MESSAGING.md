# 02 — POSITIONING & MESSAGING

Everything the site says, and why it lands. Copy in `04` and `08` is written *from* this file;
if a headline cannot be traced to a message here, it is decoration.

---

## 1. The category decision

**Do not compete as "an LMS".** The word carries a price anchor set by Moodle (free) and a mental
model set by 2009. An institute owner who hears "LMS" prices the conversation at zero and imagines
a video library.

**Compete as the institute's system of record.**

> **Category:** *Institute Operating System* — the system of record for everything an institute
> does between a first enquiry and a graduate's placement.

The category claim is defensible because it is architecturally true: one backend, one database,
one login, 31 modules that share a tenant, a permission catalog and an audit trail. Competitors in
the "LMS" box cannot make it; competitors in the "SIS" box do not do the learning.

**Consequence for the site:** the homepage opens on the *lifecycle*, not on features. The word
"LMS" appears in the `<title>`, the meta description and the SEO body copy — because that is what
people search — and almost nowhere in the visible narrative.

---

## 2. Positioning statement

> For **institutes that have outgrown a folder of spreadsheets** — schools, colleges, coaching
> centres, skilling academies and corporate L&D teams —
> **Algoryq Learn** is the **system of record for learning**
> that runs admissions, teaching, assessment, fees, staff and outcomes **in one platform**.
> Unlike **Moodle, Google Classroom or the five-tool stack most institutes actually run**,
> Algoryq Learn **carries a permission and an audit trail on every action, isolates each institute's data
> in the database itself, and ships with the accessibility and portability an enterprise
> procurement team asks for** — at a price a single campus can start on for free.

Test it: strike any clause and the sentence stops distinguishing us. Nothing in it is unfalsifiable.

---

## 3. The one-liner ladder

Use the shortest one that fits the space.

| Length | Line |
|---|---|
| 3 words | **From enquiry to outcome.** |
| 7 words | One system of record for the institute. |
| 12 words | Run admissions, teaching, assessment, fees and outcomes on one platform. |
| Tweet | Algoryq Learn is the system of record for institutes — from the first enquiry to the final certificate. One login, every role, an audit trail on every action. |
| Elevator | Most institutes run on Moodle plus Zoom plus Google Forms plus Excel plus WhatsApp plus a payment link. Nothing reconciles, and every number is a month late. Algoryq Learn is one platform for the whole lifecycle — admissions, courses, live classes, assessment, fees, staff, placement — where each institute's data is isolated in the database itself and every action carries a permission and an audit trail. Free for one campus; it self-hosts if you need it to. |

---

## 4. Ideal customer profile

### Primary (v1 go-to-market)

| Segment | Size that fits | Why they buy | Where they are today |
|---|---|---|---|
| **Coaching institutes & test-prep** | 300–5,000 learners, 1–8 branches | Admissions volume + assessment depth + fee collection are all their business | WhatsApp + Excel + a form builder |
| **Skilling academies / bootcamps** | 200–3,000 | Placement outcome is the product; they need the interview and placement module | Notion + Google Classroom + a spreadsheet |
| **Private schools (K-12) groups** | 500–8,000 across branches | Parent visibility, attendance, fees, multi-branch reporting | A legacy SIS + Google Classroom |

### Secondary (v1.1)

Colleges and universities (procurement is slower, accessibility conformance is mandatory — which is
where our accessibility statement becomes a *sales asset*) · corporate L&D (compliance training,
certificates, SCIM eventually).

### Disqualify early, on the site

Institutes that need statutory payroll filing · anyone who needs camera proctoring with automatic
verdicts · anyone who needs data residency in a specific region today · anyone who needs an online
fee checkout **today** (the billing module has no payment-gateway adapter). All four are named on
`/pricing` and `/trust/build-status`. Disqualifying badly-fitting prospects on the website is
cheaper than disqualifying them in month three.

---

## 5. Buyer personas → what each one needs the site to do

Derived from the product's own persona work (`docs/01-BRD.md` §5), extended with the two personas
who kill enterprise deals and who the BRD does not cover as *website* audiences.

| Persona | Lands on | The question they arrive with | The page that answers it | The moment they convert |
|---|---|---|---|---|
| **Rajesh — Institute Owner, 48** · non-technical, decides on the demo | Home, from a search or a referral | "Will this replace the mess, and can my staff use it?" | Home Acts II–VI, `/solutions/*` | Sees the role-switcher become *his* dashboard, then the ROI number he typed himself |
| **Meera — Academic Head, 39** | `/product/academics-and-content` | "Can I stop bad courses shipping?" | Course approval + versioning + diff | Watches the version-diff capture |
| **Arjun — Teacher, 31** | A comparison page or a colleague's link | "How long until I've published a course?" | `/product/academics-and-content`, AI section | The AI drafting flow, with the *apply* step visible |
| **Sana — Student, 19** | Rarely the buyer; arrives via her institute | "Does it work on my phone, on bad 4G?" | `/product/delivery-and-engagement` | Offline sync explained in one sentence |
| **Priya — Counsellor, 26** | `/product/admissions-and-growth` | "Will a lead ever go missing again?" | Pipeline + round-robin + dedupe | Sees dedupe *suggest*, never refuse |
| **The IT / security reviewer** | `/security`, usually sent by Rajesh | "Is this safe, and can you prove it?" | `/security`, `/trust/*`, `/developers` | Reads the RLS section and finds the exemptions *published* |
| **Procurement / compliance** | `/accessibility`, `/legal/dpa` | "Does it pass our checklist?" | Conformance statement, DPA, sub-processors | Finds a real conformance statement with open items listed |

**Design consequence:** the homepage must fork cleanly. Act IX (Trust) is the reviewer's on-ramp
and must be reachable from the header in one click; Act XI (Value) is the owner's. Neither should
have to scroll past the other's content to get there — that is what the sticky section rail in
`07-MOTION-AND-INTERACTION.md` §6.3 is for.

---

## 6. Message architecture

```
                     From enquiry to outcome.
                One system of record for the institute.
                              │
      ┌───────────────────────┼───────────────────────┐
      ▼                       ▼                       ▼
 P1 · ONE SYSTEM        P2 · LESS WORK          P3 · SAFE TO STANDARDISE ON
 "Stop reconciling      "The platform does      "Permissions, isolation and
  five tools."           the repetitive half."    an audit trail, by construction."
      │                       │                       │
 ├ lifecycle spine       ├ AI drafting            ├ deny-by-default RBAC, 272 keys
 ├ one login, every role ├ approval chains         ├ RLS forced in the database
 ├ 31 modules, one DB    ├ round-robin + dedupe    ├ hash-chained audit log
 ├ per-tenant branding   ├ offline sync            ├ WCAG 2.2 AA as a build gate
 └ one number, one place └ notifications+outbox    └ ports, not vendors; docker compose up
```

Every section of every page maps to exactly one pillar. A section that serves two is two sections.

---

## 7. Voice

**We sound like a senior engineer who has run an institute.** Specific, unhurried, unembarrassed
about limits. Never breathless.

| We do | We never |
|---|---|
| Name the mechanism ("RLS forced on 114 tables") | Say "enterprise-grade", "world-class", "seamless", "robust", "cutting-edge", "revolutionise", "unlock", "empower", "supercharge" |
| Publish the number, including the unflattering one | Round up, or drop a unit |
| Use the institute's words: enquiry, batch, register, fee, marks | Use "customers", "sales pipeline", "users" for learners |
| Write short declarative sentences and let them land | Stack three adjectives before a noun |
| Say "not built yet" when it is not built | Write future tense as present tense |
| Use ₹ and Indian numbering where the audience is Indian; localise elsewhere | Show a $ figure to a rupee buyer |

**The tell:** if a sentence would survive being pasted onto a competitor's site, it is not our
sentence. Rewrite until it would be a lie for anyone else.

### Words we own
system of record · enquiry to outcome · one login, every role · permission and an audit trail ·
isolated in the database · signals, not proctoring · honest empty state.

### The tone dial by page
| Page | Register |
|---|---|
| Home | Confident, cinematic, short lines |
| Product & modules | Precise, mechanical, screenshot-led |
| Security & trust | Flat, technical, no adjectives at all |
| Pricing | Plain, complete, no asterisks |
| Solutions | Warm, sector-specific, uses their vocabulary |
| Resources | Generous, teacherly, no gating |

---

## 8. Objection map

Every objection the brief listed, plus the four that actually kill LMS deals. Each has a *location*
— an objection answered nowhere is an objection that wins.

| # | Objection | Answer (the true one) | Where |
|---|---|---|---|
| 1 | "Is it secure?" | Isolation is a database policy with `FORCE`, not a `WHERE` clause. Authorization is deny-by-default and fails CI. The audit log is a hash chain. The exemption list is published. | `/security`, Home Act IX |
| 2 | "Can my team learn it?" | One login, role-based dashboards, keyboard-first, a command palette, and honest empty states with a next action. Try the sandbox before you ask us anything. | Act IV, `/demo` |
| 3 | "Can I migrate?" | CSV import for people and courses with a per-row report; exports for everything; the whole database is yours and self-hostable. | `/resources/migrating-from-spreadsheets` |
| 4 | "Does it scale?" | The API is horizontally scalable (shared cache, no per-process state); Postgres RLS; permission grants cached and version-busted. The worker is deliberately a single process today, and we say so. | `/security#scale` |
| 5 | "Can I customise it?" | Per-tenant roles, permissions, branding, domain, custom fields (JSONB + GIN), approval chains, feature flags, webhooks. | Act X |
| 6 | "Mobile?" | Installable PWA, 360px-first, offline-tolerant progress. No native app — and here is why that is the right call for your learners. | Act VIII |
| 7 | "Integrations?" | OAuth ×3, SMTP, S3/MinIO/Azure Blob, Meilisearch, three AI providers, webhooks with delivery logs, a typed SDK and API keys. Meeting and payment adapters are **not built** — you paste a link and record a payment. | `/integrations` |
| 8 | "What's the ROI?" | You type your own numbers. We show the formula. | Act XI |
| 9 | "Can it automate?" | Approval chains, assignment rules, waitlist promotion, notification fan-out, scheduled jobs, an outbox that retries. Not a visual workflow builder — that is named as not built. | Act V |
| 10 | "Where is my data?" | Your Postgres. Ours, yours, or a laptop. `docker compose up` boots everything with zero cloud dependency. No provider SDK is imported in feature code. | `/security#portability`, `/trust/sub-processors` |
| 11 | "How fast is onboarding?" | Seed a tenant, import a CSV, invite by email. The free tier is 100 seats and needs no conversation. | `/pricing` |
| 12 | "Will my sales/admissions team use it?" | The board is keyboard- and phone-operable *by design* — no drag-and-drop that dies on touch. | `/product/admissions-and-growth` |
| **13** | **"You have no customers."** | Correct. Here is the sandbox, the API, the source-shaped truth of what is built, and a design-partner offer. | `/trust/build-status`, Act II sub-note, `/demo` |
| **14** | **"Are you SOC 2 / ISO certified?"** | No. We have the policy set and an evidence pack the audit log produces automatically, and the readiness engagement is scheduled. We will not put a badge up before it is earned. | `/trust` |
| **15** | **"Is it accessible? We're a public institution."** | WCAG 2.2 AA with axe failing the build, a published conformance statement listing what still fails, and no drag-and-drop without a keyboard path. | `/accessibility` |
| **16** | **"What happens if you disappear?"** | Open ports, standard Postgres, `docker compose up`, full export. The exit is documented before the entrance. | `/security#portability` |

Objections 13–16 are the ones our competitors cannot answer and we can. Give them room.

---

## 9. Competitive frame

Never name a competitor in a headline. Name them on `/compare/*`, factually, with a source and a
date per cell (`17-EVIDENCE-AND-CLAIMS-POLICY.md` §5).

| Against | Their strength | Our line |
|---|---|---|
| **Moodle** | Free, ubiquitous, enormous plugin ecosystem | "Moodle is a course platform you then staff. Algoryq Learn is the institute's system of record — admissions, fees, staff and outcomes are in the same database as the coursework." |
| **Google Classroom** | Free, zero-friction, everyone has an account | "Classroom is excellent at handing out work. It has no admissions, no fees, no register, no certificate, and no permission model you can shape." |
| **Canvas / Blackboard** | Real enterprise LMS, deep integrations | "Same shape, higher floor. We add the business half — enquiries, fees, HR, placement — and publish our accessibility conformance and our build status." |
| **The five-tool stack** (Zoom + Forms + Excel + WhatsApp + a payment link) | Free-ish, familiar, already working | "It is working. It is also why the monthly numbers arrive on the 5th and why one enquiry in five never gets a call back." |
| **Regional all-in-ones** | Local sales, local price | "Ask them for their permission catalog, their tenant-isolation mechanism and their accessibility statement. We publish all three." |

---

## 10. Copy bank — hero

**Primary (ship this).**
> ### From the first enquiry to the final certificate.
> Algoryq Learn is the system of record for an institute — admissions, teaching, assessment, fees, staff
> and outcomes in one platform, where every action carries a permission and an audit trail.
>
> `[ Open the live sandbox ]`  `[ Book a 20-minute walkthrough ]`
> *No signup for the sandbox. It is a real institute with real seeded data.*

**Alternates to test (`10-CONVERSION-AND-CRO.md` §8).**

| Variant | Headline | Bet |
|---|---|---|
| B — role | **One login. Every role. The whole institute.** | Leads with the demo the hero performs |
| C — consolidation | **Five tools, one system of record.** | Leads with the pain |
| D — proof | **The LMS that publishes what it hasn't built yet.** | Leads with the differentiator competitors cannot copy |

### Section headlines (reusable)

- *Problem:* **Nothing reconciles.**
- *Why LMSs fail:* **A course platform is not an institute.**
- *Thesis:* **One database. One login. One version of the truth.**
- *Product:* **This is the whole thing.**
- *Automation:* **The repetitive half, done for you.**
- *AI:* **Drafts, never decisions.**
- *Admissions:* **No enquiry goes cold.**
- *Pipeline:* **Your stage names. Our stage meaning.**
- *Learners:* **Every learner, one record.**
- *Analytics:* **Who is about to fall behind.**
- *Mobile:* **Built for a 360-pixel screen on a bad connection.**
- *Security:* **Isolation you can inspect.**
- *Permissions:* **272 keys. Deny by default. Enforced by the build.**
- *Extensibility:* **Shape it without us.**
- *Value:* **Do the arithmetic yourself.**
- *Comparison:* **What you get, side by side.**
- *Pricing:* **Free for one campus. Priced for a group.**
- *Close:* **Start on the free tier. Bring your spreadsheet.**

### CTA vocabulary

| Rank | Label | Use |
|---|---|---|
| Primary | **Book a 20-minute walkthrough** | Header, hero, every act close, footer |
| Primary-alt | **Start free — 100 seats** | Pricing, final CTA |
| Secondary | **Open the live sandbox** | Hero, product pages |
| Tertiary | **Read the security notes** | Trust act, header |
| Tertiary | **See what's built** | Anywhere honesty is the argument |

Never: "Get started" (start what?), "Learn more" (about what?), "Request a demo" (asks *them* to do
work), "Contact sales" (implies a gauntlet).

---

## 11. Proof lines that are true today

Ready-to-use, each with its evidence in `17`.

- 272 permission keys. 264 of them enforced on a route by a check that fails the build.
- Row-level security on 114 tables, `FORCE`d, on a database role that is not the owner.
- 61 committed migrations. `db push` is banned outside a scratch database.
- 1,316 unit tests, 54 integration suites against a real Postgres, 52 browser specs.
- An audit log that is a hash chain — and an erasure flow that tombstones rather than rewriting it.
- Eight locale tags, five catalogs, right-to-left supported in the shell, not bolted on.
- Storage, mail, search, AI and cache are ports with multiple drivers. No cloud SDK in feature code.
- `docker compose up` boots the entire platform with no cloud account.
- Accessibility failures break the build, at 360 pixels among other widths.
- A certificate can be verified by anyone holding the code, with no account.

---

## 12. What we will not say until it is true

Kept here so nobody has to re-derive the decision under launch pressure.

"Trusted by N institutes" · "SOC 2 certified" · "ISO 27001" · "99.9% uptime" · "10 million
learners" · "#1 LMS" · "award-winning" · any customer name, logo or quote without written consent ·
any figure from a benchmark we did not run · "GDPR compliant" as a bare adjective (we say what we
built: DSR flows, retention, legal holds, erasure).
