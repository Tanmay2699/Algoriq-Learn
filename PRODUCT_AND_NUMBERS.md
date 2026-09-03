# Algoryq Learn — Product Overview & Verified Platform Numbers

**Product Name:** Algoryq Learn (formerly *Akechi LMS*)  
**Vendor:** Algoryq Technologies (`algoryq.com` / `learn.algoryq.com`)  
**Product Category:** Multi-Tenant AI-First Institute Operating System (LMS + Admissions + Assessment + Operations)  
**Website:** [https://learn.algoryq.com](https://learn.algoryq.com)  

---

## 1. What Algoryq Learn Is About

**Algoryq Learn** is a multi-tenant, AI-assisted enterprise Institute Operating System designed for educational institutions — schools, colleges, test-prep coaching institutes, skilling bootcamps, and corporate L&D teams.

### The Problem It Solves
Traditional educational institutions run on a fragmented stack of 5+ uncoordinated tools:
$$\text{Moodle / Google Classroom (Learning)} + \text{Zoom / Meet (Live Classes)} + \text{Google Forms / WhatsApp (Enquiries)} + \text{Excel (Fees \& Attendance)} + \text{Payment Gateway Links}$$

Nothing reconciles, numbers are weeks late, data leaks between tools, and student progress is lost on poor connectivity.

### The Algoryq Learn Solution
Algoryq Learn unifies the entire student lifecycle into **one continuous operational chain**:
$$\text{Web Enquiry / Lead} \longrightarrow \text{Admissions Pipeline} \longrightarrow \text{Enrolment \& Batching} \longrightarrow \text{Course Delivery \& Offline Sync} \longrightarrow \text{Assessments \& Rubrics} \longrightarrow \text{Fee Invoicing} \longrightarrow \text{Verifiable Credential / Placement}$$

Every single action operates under **database-level tenant isolation (PostgreSQL RLS)**, **deny-by-default authorization (272 permission keys)**, and **hash-chained audit logs**.

---

## 2. Verified Platform Numbers

All metrics below are verified directly from code audit, static analysis scripts, and database schema migrations (ground truth as of 2026-07-31 / 2026-08-01):

| Metric / Dimension | Verified Count | Verification Source / Method |
| :--- | :---: | :--- |
| **API Modules** | **31** | `apps/api/src/modules/*` |
| **API Controllers** | **53** | `find apps/api/src/modules -name '*.controller.ts'` |
| **API Endpoints / Routes** | **497** | 197 GET · 176 POST · 62 DELETE · 32 PUT · 30 PATCH |
| **Prisma Data Models** | **135** | `grep -c '^model ' schema.prisma` |
| **Database Migrations** | **61** | `ls apps/api/prisma/migrations` |
| **Application Web Routes** | **78** | `find apps/web/src/app -name page.tsx` |
| **Marketing Site Pages** | **67** | Build output (`next build`) across 51 public pages |
| **Permission Keys Catalog** | **272** | `packages/authz/src/catalog.ts` |
| **Route-Enforced Permission Keys** | **264** | Verified via `pnpm authz:check` |
| **System Role Templates** | **11** | `ROLE_TEMPLATES` (Super Admin, Institute Admin, Teacher, Student, Parent, etc.) |
| **RLS-Protected Database Tables** | **114** | `tenant_id` tables with Postgres `ENABLE` + `FORCE` RLS policies |
| **RLS-Exempt Identity Tables** | **13** | Explicitly audited identity-plane models (Users, Credentials, Sessions, etc.) |
| **Product Unit Tests** | **1,316** | Across 6 Vitest projects |
| **Integration Test Suites** | **54** | Executed against real PostgreSQL instance with RLS active |
| **Playwright E2E Test Specs** | **52 (App) + 300 (Web)** | Cross-device (1440px desktop / 360px mobile) + axe accessibility |
| **Design System Components** | **26 files** | `@akechi/ui` primitives & chart components (`packages/ui/src`) |
| **Core Product Clusters** | **7** | Admissions, Academics, Delivery, Assessment, Money/People, Intelligence, Platform |
| **Supported Locale Catalogs** | **8 tags / 5 catalogs** | `packages/contracts/src/common/locale.ts` |

---

## 3. Top API Modules by Endpoint Count

| Module Name | Routes | Core Functionality |
| :--- | :---: | :--- |
| `learn` | **50** | Player state, course progress, notes, Q&A, offline IndexedDB sync queue |
| `assess` | **42** | Question banks, blueprint test papers, attempts, marking queues, item analysis |
| `course` | **38** | Course hierarchy (Program → Course → Module → Unit → Lesson), publishing, version diffs |
| `crm` | **32** | Admissions pipeline, enquiry capture, round-robin rules, deduplication, lead timeline |
| `auth` | **30** | Password (Argon2id), JWT session, MFA (TOTP), OAuth (Google, MS, GitHub), impersonation |
| `finance` | **25** | Fee plans, invoices, tax lines, coupons, scholarships, credit notes (integer minor units) |
| `hr` | **24** | Staff profiles, leave types & balances, staff register, holiday calendar |
| `cms` | **24** | Per-tenant public site, pages, posts, events, gallery, Markdown rendering |
| `placement` | **21** | Recruitment drives, job postings, applications, interview panels & scorecards |
| `live` | **20** | Live session schedules, attendance rules, regularisation requests |
| `audit` | **19** | Hash-chained immutable audit logs, field diffs, legal holds, GDPR DSR requests |
| `authz` | **18** | RBAC key enforcement, per-user permission overrides, delegation, role diffing |

---

## 4. The 7 Feature Clusters

```
Algoryq Learn Platform
 ├── C1. Admissions & Growth     (CRM, Public Web-to-Lead, Custom Tenant CMS, Course Marketplace)
 ├── C2. Academics & Content     (Course Hierarchy, Version Diffs, Media Playback, Human-in-Loop AI)
 ├── C3. Delivery & Engagement   (Offline-First Player, Timetables, Live Session Attendance, Parent Portal)
 ├── C4. Assessment & Outcomes   (Question Banks, Test Papers, Rubrics, Verified Credentials /verify/:code)
 ├── C5. Money & People          (Integer-Currency Fees, Invoicing, Staff Leave & HR, Placement Drives)
 ├── C6. Intelligence            (Permission-Trimmed Search, Reports, AI Dropout-Risk Scoring)
 └── C7. Platform & Trust        (Argon2id/MFA Auth, 272-Key RBAC, Postgres RLS, Hash-Chained Audit Log)
```

---

## 5. Security, Tenancy & Compliance Proofs

1. **Deny-by-Default Authorization:** Every route requires `@RequirePermission(...)` or `@Public()`. CI fails if any route is unguarded (`pnpm authz:check`).
2. **Database-Enforced Multi-Tenancy:** PostgreSQL `ENABLE` and `FORCE` Row-Level Security on all 114 tenant tables. `akechi_app` DB user has no `BYPASSRLS` privileges.
3. **Tamper-Evident Audit Trail:** Every mutation generates a hash-chained audit log entry. GDPR erasure tombstones user records without breaking the cryptographic chain.
4. **HttpOnly BFF Token Isolation:** JWT tokens never reach client-side JavaScript. The Next.js BFF proxy attaches JWTs server-side via `httpOnly` cookies.
5. **No Cloud Lock-in:** Modular drivers for storage (Local Disk, S3/MinIO, Azure Blob), mail (SMTP, Log), search (Postgres, Meilisearch), and AI (OpenAI, Anthropic, Disabled). Boots offline using `docker compose up`.
6. **Built-in Accessibility:** Fails CI if WCAG 2.2 AA standards are violated (axe scans in Playwright at 360px & 1440px).

---

## 6. Official Pricing Plans (Ground Truth Schema)

| Plan | Price | Included Seats | Courses | Storage | Monthly AI Tokens |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Starter** | **₹0 / month** | 100 | 25 | 5 GiB | 200,000 |
| **Growth** | **₹14,999 / month** | 1,000 | 250 | 100 GiB | 2,000,000 |
| **Enterprise** | Negotiated / Annual | Unlimited | Unlimited | Unlimited | Unlimited |

*Note: All money values in the platform are stored as integer minor units with ISO 4217 currency codes (`INR`).*
