# 01 — PRODUCT TRUTH

**What Akechi actually is, extracted from the repository on 2026-07-31.**

This document is the **only permitted source for a capability claim on the website.** If a
sentence of marketing copy asserts that the product does something, that something appears here
with a file path. If it is not here, it does not go on the site. Marketing docs (`../docs/00`,
`01`, `02`) describe the product *as designed*; this file describes it *as built*, and where the
two disagree the code wins.

Re-derive this file whenever a phase of the product ships. Every count below is reproducible from
the commands in §11.

---

## 1. Shape

One backend. One database. One frontend. Many tenants.

```
Browser / PWA
   └─ Next.js 15 App Router (apps/web) ─── httpOnly session cookie
        └─ BFF proxy (/app/api/*) ─────── attaches the JWT; tokens never reach client JS
             └─ NestJS modular monolith (apps/api) ── guards: authN → tenant → authZ → rate limit
                  ├─ PostgreSQL 16 — one database, tenant_id + RLS forced on 114 tables
                  ├─ Redis (cache/queue driver; `memory` driver refused in production)
                  ├─ Object storage — port with local-disk | s3/MinIO | azure-blob drivers
                  ├─ Meilisearch or Postgres — search behind one port
                  └─ Mail — log | smtp drivers, drained from a Postgres outbox by a worker
```

**Why a modular monolith:** one product team, one database, one transaction boundary. Modules talk
over an in-process bus using the same typed contracts a broker would carry, so the extraction seam
exists without paying the distributed-systems tax. (`docs/03-ARCHITECTURE.md` §2)

**Marketing consequence:** "one system of record" is not a slogan here; it is the deployment
topology. Use it.

---

## 2. The numbers (verified 2026-07-31)

| Metric | Value | How it was counted |
|---|---:|---|
| API modules | 31 | `apps/api/src/modules/*` |
| API controllers | 53 | `find … -name '*.controller.ts'` |
| API routes | **497** | 197 GET · 176 POST · 62 DELETE · 32 PUT · 30 PATCH |
| Prisma models | 135 | `grep -c '^model ' schema.prisma` |
| Committed migrations | 61 | `ls prisma/migrations` |
| Web routes | **78** | `find apps/web/src/app -name page.tsx` |
| Permission keys | **272** | `packages/authz/src/catalog.ts` |
| Keys enforced on a route | 264 † | `pnpm authz:check` |
| System role templates | 11 | `ROLE_TEMPLATES` |
| RLS-protected tables | 114 | 121 models carry `tenantId`, minus the 7 identity-plane exemptions (§6.3); reproduce with `pnpm db:rls:check` |
| Locale tags / catalogs | 8 / 5 | `packages/contracts/src/common/locale.ts` |
| Unit tests | 1,316 | across 6 vitest projects |
| Integration suites | 54 | real Postgres, RLS on |
| Playwright specs | 52 | includes axe scans at 360px |
| Design-system components | 26 files | `packages/ui/src` |

**†** Every row above except this one and the three test counts was counted directly from the
working tree on 2026-07-31 with the commands in §11. The enforced-key count, the unit/integration/
Playwright totals and the tests are taken from the repository's own `MEMORY.md` §5 (2026-07-28)
because reproducing them needs a built API and a running Postgres. **Re-derive them before they go
on a page** — `pnpm authz:check` and `pnpm test` — and update the `verifiedAt` in `claims.ts`. A
number carried forward from a briefing file is exactly the kind of claim this document exists to
prevent.

Routes by module, largest first: `learn` 50 · `assess` 42 · `course` 38 · `crm` 32 · `auth` 30 ·
`finance` 25 · `hr` 24 · `cms` 24 · `placement` 21 · `live` 20 · `audit` 19 · `authz` 18 ·
`platform` 16 · `assign` 16 · `tenant` 15 · `media` 14 · `user` 12 · `grade` 10 · `notification` 9 ·
`cert` 9 · `analytics` 9 · `search` 7 · `insight` 7 · `data` 7 · `family` 6 · `marketplace` 5 ·
`ai` 5 · `workflow` 4 · `health` 2 · `plan` 1.

---

## 3. Feature clusters

Seven clusters. This grouping is the site's product navigation (`03-INFORMATION-ARCHITECTURE.md`
§3) and the basis for the mega-menu. It is derived from the 31 API modules and the product's own
navigation registry (`apps/web/src/config/navigation.ts`), not invented.

### C1 · Admissions & Growth — *fill the seats*
`crm` · `cms` · `marketplace`

Enquiries that arrive from a web form, a phone call or a walk-in; a pipeline whose stage *names*
belong to the institute and whose stage *meaning* belongs to the code; applications; conversion
into a real enrolment. Plus the institute's own public website and blog, and a marketplace of
courses other institutes have shared.

**Business value:** the leak between "someone was interested" and "someone is enrolled" is where
an institute loses its marketing budget. This closes it and attributes it.

### C2 · Academics & Content — *build what you teach*
`course` · `media` · `ai`

Program → Course → Module → Unit → Lesson. Versioning with publish, restore and a visual diff.
Duplication. Approval before publish. Media with signed-URL playback, chapters and captions.
AI-assisted outline and lesson drafting that **never writes to a course directly** — generated
text reaches a course only through an explicit apply action.

**Business value:** the product-time bet. Course production drops from days to an afternoon, and
the academic head keeps the veto.

### C3 · Delivery & Engagement — *run the term*
`learn` · `live` · `family`

The player, progress, notes, Q&A, batches, timetables, waitlists, invite codes. Live classes and
the attendance register that reconciles to them, with regularisation requests. A parent portal
that is read-only by construction. Offline-tolerant progress: an IndexedDB queue that replays in
order, idempotently, last-write-wins.

**Business value:** patchy 4G is the real deployment environment for most learners in the target
market. A player that loses a lesson's progress loses the learner.

### C4 · Assessment & Outcomes — *prove it happened*
`assess` · `assign` · `grade` · `cert`

Question banks, papers with sections and blueprints, attempts, marking queues, item analysis.
Assignments with rubrics. Grade categories, scales, bands, overrides. Certificates with **public
verification** — an employer pastes a code at `/verify/[code]` and needs no account.

**Integrity is signals, not proctoring** — no camera, no automatic verdict. What a cooperating
browser reported, shown to a human marker with the caveat on screen, and disclosed to the
candidate while it happens.

**Business value:** the output of an institute is a credential. An unverifiable credential is
worth less; a verifiable one is a marketing asset for the institute itself.

### C5 · Money & People — *run the business*
`finance` · `hr` · `placement` · `interview`

Fee plans, invoices, lines, tax rates, coupons, scholarships, discounts, payments, credit notes —
all money as **integer minor units + ISO 4217**, never a float. Staff profiles, leave types,
balances, requests, the staff register, holidays. Placement drives, job posts, applications,
interview panels and scorecards.

**Business value:** the owner persona's entire dashboard. Collections visible today, not on the
5th of next month.

### C6 · Intelligence — *see it before it happens*
`analytics` · `insight` · `search` · `data`

Dashboards, a report builder with definitions and runs, exports collected in one place, global
**permission-trimmed** search with typeahead and saved searches, dropout-risk scoring with
interventions, adaptive learning paths, interview practice.

**Business value:** "who is about to drop out" is the single most valuable question an institute
can answer, and nobody in this market can answer it today.

### C7 · Platform & Trust — *why it is safe to standardise on*
`auth` · `user` · `authz` · `tenant` · `audit` · `notification` · `platform` · `workflow` · `attachment` · `plan` · `health`

Identity (password with Argon2id and lockout, OAuth ×3, MFA/TOTP with recovery codes, invitations,
sessions, impersonation with dual audit attribution). Deny-by-default RBAC with 272 keys, scopes,
per-user overrides and delegation. A hash-chained audit log with retention, legal holds and GDPR
subject requests. Notifications across in-app and email with per-user preferences and a delivery
log. Feature flags, API keys, webhooks, custom fields, approval chains, exports, PWA.

**Business value:** this is the cluster that wins the security review, and the security review is
what kills LMS deals.

---

## 4. Module inventory

`%` is the product's own honest completeness figure against its SRS
(`docs/12-PROGRESS-TRACKER.md` §D). **Website copy may not describe a module as more complete than
this number implies.** Modules below 65% get careful wording; modules below 50% are described as
what exists, with the gap named.

| Module | Cluster | % | What is real | What is not (do not imply it) |
|---|---|---:|---|---|
| Identity & Access | C7 | 84 | Password (Argon2id + lockout), JWT + rotating refresh w/ family revocation, OAuth Google/Microsoft/GitHub, MFA TOTP + recovery codes, invitations end to end, sessions list/revoke, password reset, switch tenant, impersonation | **SSO (SAML/OIDC), SCIM, phone OTP** |
| Tenancy & Org | C7 | 78 | Tenants, branches, domains, branding, plans, quotas, suspension enforced at session establishment | Multi-region residency (designed, ADR 0014, deliberately not built) |
| Authorization | C7 | 78 | 272 keys, roles + templates, scopes, overrides, delegation, role editor with a diff before save, access review | Access requests, cross-tenant provisioning |
| Audit & Compliance | C7 | 85 | Hash-chained immutable log, field diffs, CSV export, retention, legal holds, GDPR DSR, restore-from-diff, SOC 2 evidence pack | A SOC 2 **certificate**. We have the machinery, not the badge. |
| Notifications | C7 | 80 | In-app inbox, email via a transactional outbox drained by a worker, templates rendered per locale, per-user channel preferences, delivery log w/ retry | SMS, WhatsApp, push, digests |
| Catalog & Courses | C2 | 72 | Hierarchy, versions, publish/restore/diff, duplication, approval, categories, Markdown lesson bodies | SCORM/xAPI |
| Content & Media | C2 | 70 | Upload, signed-URL playback, chapters, captions, storage port (local / S3+MinIO / Azure Blob) | **Transcoding / HLS** — the port exists, the worker does not |
| Enrollment & Batches | C3 | 72 | Enrollments, batches, members, waitlists w/ promotion, timetables, invite codes, seat quotas | Prerequisite graphs |
| Learning Delivery | C3 | 80 | Player, progress, resume, notes, Q&A + moderation, **offline sync** | Downloadable offline media |
| Assessment Engine | C4 | 76 | Banks, questions, papers, sections, targets, attempts, marking queue, item analysis, integrity signals | Third-party proctoring, 11-type parity |
| Assignments | C4 | 68 | Assignments, rubrics w/ criteria and levels, submissions, criterion marks | Plagiarism detection |
| Live Classes | C3 | 72 | Sessions, join, attendance rules, records, regularisation | **A meeting-provider adapter** — you paste a Zoom/Meet link |
| Attendance & Gradebook | C4 | 80 | Registers, records, categories, scales, bands, overrides | Transcripts |
| Certificates | C4 | 55 | Templates, issuance, revocation, **public verification** | Digital signatures, bulk issuance UI |
| Interview & Placement | C5 | 60 | Drives, job posts, applications, interviews, scorecards, ratings | Recruiter portal |
| AI Services | C6/C2 | 45 | Provider port (OpenAI / Azure OpenAI / Anthropic / **disabled by default**), token budgets, generation cache, course-outline and lesson-content drafting, dropout risk, adaptive path, interview practice | Tutor chat, AI grading, transcription, TTS |
| Search | C6 | 88 | Global permission-trimmed search, typeahead, saved searches, driver-complete port (Postgres or Meilisearch), incremental sync | — |
| Analytics & Reports | C6 | 65 | Dashboards, report definitions + runs, exports | Scheduled delivery, pivot |
| Finance & Billing | C5 | 62 | Fee plans, invoices, lines, tax, coupons, scholarships, discounts, payments, credit notes, pricing, reports | **A payment gateway adapter.** No online checkout. |
| CRM & Admissions | C1 | 72 | Pipelines, stages, leads, timeline, follow-ups, round-robin assignment rules, dedupe + merge, applications, conversion, **public web-to-lead** | Campaign attribution, email sequences |
| HR | C5 | 55 | Staff profiles, leave types/balances/requests, register, holidays, settings | Payroll (records only by design; no statutory filing, ever) |
| CMS & Marketing site | C1 | 60 | Per-tenant public site, pages, posts, events, gallery, sitemap, safe Markdown rendering | Forms builder, SEO editor |
| Platform Ops | C7 | 55 | Feature flags + overrides, API keys, webhooks + deliveries, saved views, export jobs, custom fields, approval chains, health, PWA | Job console, storage console |
| Parent portal | C3 | 40 | Guardian links, per-child view of courses and marks | Digests, pay-from-portal |

---

## 5. Roles

Eleven system templates, cloned per tenant and fully editable. **Nothing in the code branches on
a role name** — only on permission keys — which is why a tenant can rename or reshape any of them.

| Template | Default scope | One-line truth |
|---|---|---|
| Super Admin | GLOBAL | Platform operator. Every action audited. |
| Institute Admin | TENANT | Runs one institute end to end. |
| Academic Head | TENANT | Owns curriculum quality and course approvals. |
| Teacher | TENANT | Teaches and authors within their own courses and batches. |
| Content Author | TENANT | Writes and structures courses, submits for approval. |
| Student | TENANT | Learns. Scoped to their own records only. |
| Parent | TENANT | Read-only visibility of their own children's courses and marks. |
| Admissions Counsellor | TENANT | Works enquiries and applications through to enrolment. |
| Finance Officer | TENANT | Raises and settles invoices; sets fee plans and pricing. |
| HR Manager | TENANT | Staff records, the leave policy, the register. |
| Placement Officer | TENANT | Openings, drives, candidates, interview panels. |

Scopes available on an assignment: `GLOBAL · ORG · TENANT · BRANCH · DEPARTMENT · COURSE · BATCH ·
RECORD`.

**Marketing consequence:** the honest headline is *"one login, every role"* — and the honest
sub-claim is *"and you can invent a role we never thought of, without us"*. Both are true and
both are demonstrable in the sandbox.

---

## 6. Security and tenancy — the claims that win the review

Each of these is a link on `/security`, and each resolves to a file.

### 6.1 Authorization is deny-by-default and CI-enforced
Every controller route carries `@RequirePermission('module.resource.action')` or an explicit
`@Public()`. A lint rule and `pnpm authz:check` fail the build otherwise. 272 keys, 264 enforced
on a route; the unenforced remainder are P4/P5 keys for surfaces not yet built, and the count is
published, not hidden.
*Evidence:* `packages/authz/src/catalog.ts`, `apps/api/src/common/decorators/permissions.decorator.ts`.

### 6.2 Tenant isolation is in the database
Every tenant-owned table carries `tenant_id` and a `tenant_isolation` RLS policy with **both
`ENABLE` and `FORCE`** — without `FORCE` the table owner bypasses every policy. The application
connects as `akechi_app`, a role that is neither the owner nor a superuser and does not hold
`BYPASSRLS`; the owner role is reserved for migrations on a separate connection string. The policy
set is *derived from `information_schema`*, so a new table with a `tenant_id` is covered
automatically and `db:rls:check` fails CI if one is not.
*Evidence:* `apps/api/prisma/rls.ts`.

### 6.3 The exemptions are named and reasoned
Thirteen tables are exempt, in two groups: tables with no `tenant_id` at all (users, credentials,
permissions — a user is a global principal and the *membership* is what is scoped), and the
identity plane (sessions, permission versions, memberships, invitations) which must be read *in
order to determine* the tenant, before a binding can exist. Every access to those is keyed by an
unguessable id. Publishing this list is more persuasive than claiming there are none.

### 6.4 The audit log is a hash chain
Every mutation emits a domain event that lands in `audit_logs` with a field-level diff and a hash
of the previous entry. GDPR erasure **never rewrites the chain that proves it** — the record is
tombstoned, the chain stands. Legal hold beats retention; retention beats erasure.
*Evidence:* `apps/api/src/modules/audit/service/audit.service.ts`, `__tests__/audit-hash-chain.spec.ts`.

### 6.5 Tokens never reach client JavaScript
The browser holds an httpOnly session cookie. The Next.js BFF attaches the JWT server-side.
Cross-site writes are rejected on `Sec-Fetch-Site`.

### 6.6 Secrets fail fast
The production env schema throws on defaults and placeholders. The cache driver refuses `memory`
in production. Mail drivers that are not implemented fail loudly rather than silently discarding.

### 6.7 Accessibility is a build gate
WCAG 2.2 AA. axe runs in Storybook and in Playwright, at 360px among other widths, and fails CI.
There is no drag-and-drop anywhere without a keyboard *and* touch path — the admissions board uses
a "move to" select and arrow buttons precisely for this reason.

### 6.8 No cloud lock-in
Storage, mail, search, AI and cache are ports with multiple drivers selected by environment
variable. No cloud-provider SDK is imported in feature code. `docker compose up` boots the entire
stack with no cloud dependency at all.

---

## 7. Design system (what the website inherits)

Source: `packages/ui/src/styles/tokens.css`, `packages/ui/src/tailwind-preset.ts`, and the Figma
`Color` and `Scale` variable collections (file `VYhP6sBZKcJkjJvtMuvNAQ`).

### 7.1 Colour — light / dark

| Token | Light | Dark |
|---|---|---|
| `--brand-500` | `#5b5bd6` | `#7c7ce8` |
| `--brand-600` | `#4a4ac4` | `#6a6adb` |
| `--brand-soft` | `#eef0fe` | `#26263a` |
| `--accent-500` | `#12a594` | `#2cc0ae` |
| `--success` / `--success-text` | `#247a46` / `#1c6338` | `#3fbe73` / `#5ed48d` |
| `--warning` / `--warning-text` | `#8d671d` / `#74551a` | `#f0ba55` / `#ffd27a` |
| `--danger` / `--danger-text` | `#bd3333` / `#a82a2a` | `#f27777` / `#ff9d9d` |
| `--surface-bg` / `--surface` / `--surface-muted` | `#fcfcfd` / `#ffffff` / `#f5f6f8` | `#17171c` / `#1e1e25` / `#26262f` |
| `--border` | `#e4e6ea` | `#33333d` |
| `--text-primary` / `--text-muted` / `--text-inverse` | `#1a1a21` / `#646d7a` / `#ffffff` | `#f5f5f7` / `#9ca3af` / `#17171c` |

Radius: `--radius-sm 6px` · `--radius 10px` · `--radius-lg 16px`.

**Why `*-text` variants exist** — and why the website must use them for coloured words: a fill
only needs 3:1 against adjacent colour, but text needs 4.5:1 against *every* surface it can land
on, including the 10% tint the banners use. The product shipped for three days with the fill
values used as text at 2.1:1. That is the single best cautionary tale on this design system and
it belongs in the site's own design discipline.

### 7.2 Type ramp (product)

Inter. `Display 32/40 600` · `H1 24/32 600` · `H2 20/28 600` · `H3 16/24 500` · `Body 14/22 400` ·
`Body-medium 14/22 500` · `Body-small 13/20 400` · `Caption 12/16 500`.

**This ramp tops out at 32px because it is an application ramp.** A marketing page needs display
type up to ~104px and body at 16–18px. `05-DESIGN-SYSTEM.md` §3 defines a marketing-only layer on
top; it must never be pushed back into `packages/ui`.

### 7.3 Components available in `@akechi/ui`

`Button` · `Field/Input/Select/Textarea` · `Dialog` + `ConfirmDialog` + `useConfirm/usePrompt` ·
`DataTable` (sortable, selectable, a11y-audited) · `Pagination` · `Breadcrumbs` · `Toast` ·
`EmptyState` / `ErrorState` / `Skeleton` / **`ModuleStub`** · `Can` + `PermissionProvider` ·
`Markdown` (a safe-subset renderer that **never emits HTML**) · `BarChart` / `LineChart` /
`DonutChart` / `Sparkline` (hand-built SVG, no chart library).

`ModuleStub` deserves the website's attention: it is the component that renders "this is not built
yet" honestly, in-product. Screenshotting it is a *feature*, not an embarrassment.

### 7.4 Figma

File `VYhP6sBZKcJkjJvtMuvNAQ` — "AkechiLMS (Community)". Eight pages: `0:1` Foundations · `1:35`
Desktop · `1:36` Mobile · `1:37` Prototype map · `2014:2` Components · `2067:2` Design system ·
`2101:2` States · `2112:2` Accessibility. ~28 desktop screens, ~13 mobile, a wired prototype, a
12-tile state gallery, a live-computed contrast matrix, and an annotated accessibility redline.

The Color collection carries Light and Dark modes on one collection, so a whole screen re-themes
by switching the mode — which is what makes the website's light/dark product captures cheap.

**Note for anyone using the MCP connector:** `get_metadata` with no `nodeId` lists only *one* page
(Foundations). That is a connector artifact, not the file. Query the page ids above directly.

---

## 8. The product's public surface (what a stranger can already reach)

Three endpoints and two pages are already public and unauthenticated. All five are load-bearing
for the website.

| Surface | Path | Use on the website |
|---|---|---|
| Certificate verification | `GET /verify/:code` (web) | Verifiable-by slot 3; a live demo on `/security` |
| Web-to-lead | `POST /public/institutes/:slug/enquiries` | **The demo form posts here.** Tenant by slug, `source=WEB` forced, no way to set stage/owner/pipeline, fixed acknowledgement so it cannot be used to ask "is this email on file?", identical answer for unknown and suspended institutes so it cannot enumerate them |
| Tenant public site | `GET /public/sites/:slug/*` (+ `/s/:slug` web) | Screenshot material for the CMS module page |
| OAuth callbacks | `/auth/*/callback` | — |
| Health | `/health` | Uptime checks |

`GET /plans` is **not** public today (`tenant.usage.view`). Task W2.6 adds a public variant; until
then the pricing page cannot claim to be live-sourced.

---

## 9. Plans (real, from migration `20260726160000_plans_and_tenant_settings`)

| Key | Name | Price | Seats | Courses | Storage | AI tokens/mo |
|---|---|---|---:|---:|---:|---:|
| `starter` | Starter | **₹0 / month** | 100 | 25 | 5 GiB | 200,000 |
| `growth` | Growth | **₹14,999 / month** | 1,000 | 250 | 100 GiB | 2,000,000 |
| `enterprise` | Enterprise | Negotiated, yearly | unlimited | unlimited | unlimited | unlimited |

Prices are integer minor units + `INR`. `is_public` already exists on the model *for this exact
purpose*. A retired plan stays in the table because tenants are still on it — so the pricing page
must filter on `is_public`, not on existence.

**Honest caveat for the pricing page:** there is no payment gateway adapter yet. Every plan change
today is a conversation. The page says "talk to us to start" rather than showing a checkout that
does not exist.

---

## 10. What the product deliberately does not do

Publishing this list on the site is a conversion asset, not a liability — it disqualifies bad-fit
prospects before they consume a sales cycle, and it makes every other claim more believable.

- **Native iOS/Android apps.** It is an installable PWA.
- **Statutory payroll.** HR holds records; it will never file your taxes.
- **Its own video conferencing.** You bring Zoom/Meet/Teams/Jitsi. (Today: you paste the link —
  the adapter is not built.)
- **Its own transcoding cluster.** Designed as a worker; not built.
- **Camera proctoring.** Integrity signals, shown to a human, disclosed to the candidate. No
  automatic verdicts, ever.
- **Being a public course marketplace.** Every tenant is private by default.
- **Multi-region data residency.** Designed and explicitly not built (ADR 0014) — a `region` field
  that does not move bytes would read as a guarantee and be false.

---

## 11. Reproducing every number in this file

```bash
# from the repository root
find apps/api/src/modules -maxdepth 1 -type d | tail -n +2 | wc -l          # modules
find apps/api/src/modules -name '*.controller.ts' | wc -l                    # controllers
grep -rhoE "@(Get|Post|Put|Patch|Delete)\(" apps/api/src/modules \
  --include=*.controller.ts | wc -l                                          # routes
grep -c '^model ' apps/api/prisma/schema.prisma                              # models
ls apps/api/prisma/migrations | wc -l                                        # migrations
find apps/web/src/app -name page.tsx | wc -l                                 # web routes
pnpm authz:check                                                             # keys / enforced
pnpm --filter @akechi/api db:rls:check                                       # RLS tables
```

Anything that cannot be reproduced by a command or a file path does not belong on the website.
