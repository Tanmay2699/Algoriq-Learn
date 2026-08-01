/**
 * The module completion matrix, mirrored from the product's own tracker
 * (`docs/12-PROGRESS-TRACKER.md` §D) on 2026-07-31.
 *
 * `percent` is functional completeness against the product's SRS, not effort spent. This is
 * published at /trust/build-status, unedited, including the rows we would rather not show.
 * It is the single most unusual thing on this website and the reason the rest of it is believed.
 */

export interface BuildStatusRow {
  module: string;
  cluster: string;
  percent: number;
  real: string;
  gap: string;
}

export const buildStatusUpdated = '2026-07-31';

export const buildStatus: BuildStatusRow[] = [
  {
    module: 'Search',
    cluster: 'Intelligence',
    percent: 88,
    real: 'Global permission-trimmed search, typeahead, saved searches, Postgres or Meilisearch behind one port, kept current by incremental sync.',
    gap: '—',
  },
  {
    module: 'Audit & Compliance',
    cluster: 'Platform & Trust',
    percent: 85,
    real: 'Hash-chained immutable log, field diffs, CSV export, retention, legal holds, GDPR subject requests, restore from diff, SOC 2 evidence pack.',
    gap: 'A SOC 2 certificate. We have the machinery, not the badge.',
  },
  {
    module: 'Identity & Access',
    cluster: 'Platform & Trust',
    percent: 84,
    real: 'Argon2id with lockout, JWT plus rotating refresh with family revocation, MFA/TOTP with recovery codes, OAuth ×3, invitations, sessions, impersonation with dual audit attribution.',
    gap: 'SAML, OIDC, SCIM, phone OTP.',
  },
  {
    module: 'Learning Delivery',
    cluster: 'Delivery & Engagement',
    percent: 80,
    real: 'Player, progress, resume, notes, questions with moderation, offline sync.',
    gap: 'Downloadable offline media.',
  },
  {
    module: 'Attendance & Gradebook',
    cluster: 'Assessment & Outcomes',
    percent: 80,
    real: 'Registers, records, grade categories, scales, bands, overrides with reasons.',
    gap: 'Transcripts.',
  },
  {
    module: 'Notifications',
    cluster: 'Platform & Trust',
    percent: 80,
    real: 'In-app inbox, email through a transactional outbox drained by a worker, templates rendered per locale, per-user channel preferences, a delivery log with retry.',
    gap: 'SMS, WhatsApp, push, digests.',
  },
  {
    module: 'Tenancy & Org',
    cluster: 'Platform & Trust',
    percent: 78,
    real: 'Tenants, branches, domains, branding, plans, quotas, suspension enforced at session establishment.',
    gap: 'Multi-region residency — designed and deliberately not built.',
  },
  {
    module: 'Authorization',
    cluster: 'Platform & Trust',
    percent: 78,
    real: '272 keys, roles and templates, scopes, per-user overrides, delegation, a role editor with a diff before save, access review.',
    gap: 'Access requests, cross-tenant provisioning.',
  },
  {
    module: 'Assessment Engine',
    cluster: 'Assessment & Outcomes',
    percent: 76,
    real: 'Banks, questions, papers, sections, targets, attempts, anonymised marking queue, item analysis, integrity signals.',
    gap: 'Third-party proctoring; not all eleven designed question types.',
  },
  {
    module: 'Catalog & Courses',
    cluster: 'Academics & Content',
    percent: 72,
    real: 'Hierarchy, versions, publish, restore and diff, duplication, approval, categories, Markdown lesson bodies.',
    gap: 'SCORM and xAPI.',
  },
  {
    module: 'Enrollment & Batches',
    cluster: 'Delivery & Engagement',
    percent: 72,
    real: 'Enrolments, batches, members, waitlists with promotion, timetables, invite codes, seat quotas.',
    gap: 'Prerequisite graphs.',
  },
  {
    module: 'Live Classes',
    cluster: 'Delivery & Engagement',
    percent: 72,
    real: 'Sessions, joining, attendance rules, records, regularisation.',
    gap: 'A meeting-provider adapter — you paste the link.',
  },
  {
    module: 'CRM & Admissions',
    cluster: 'Admissions & Growth',
    percent: 72,
    real: 'Pipelines, stages, leads, timeline, follow-ups, round-robin rules, dedupe and merge, applications, conversion, public web-to-lead.',
    gap: 'Campaign attribution, email sequences.',
  },
  {
    module: 'Content & Media',
    cluster: 'Academics & Content',
    percent: 70,
    real: 'Upload, signed-URL playback, chapters, captions, a storage port with local, S3 and Azure Blob drivers.',
    gap: 'Transcoding and HLS — the port exists, the worker does not.',
  },
  {
    module: 'Assignments',
    cluster: 'Assessment & Outcomes',
    percent: 68,
    real: 'Assignments, rubrics with criteria and levels, submissions, criterion marks.',
    gap: 'Plagiarism detection.',
  },
  {
    module: 'Analytics & Reports',
    cluster: 'Intelligence',
    percent: 65,
    real: 'Dashboards, report definitions and runs, exports.',
    gap: 'Scheduled delivery, pivot tables.',
  },
  {
    module: 'Finance & Billing',
    cluster: 'Money & People',
    percent: 62,
    real: 'Fee plans, invoices, lines, tax, coupons, scholarships, discounts, payments, credit notes, pricing, reports.',
    gap: 'A payment gateway. No online checkout.',
  },
  {
    module: 'CMS & Marketing site',
    cluster: 'Admissions & Growth',
    percent: 60,
    real: 'Per-tenant public site, pages, posts, events, gallery, sitemap, safe Markdown rendering.',
    gap: 'Forms builder, SEO editor.',
  },
  {
    module: 'Interview & Placement',
    cluster: 'Money & People',
    percent: 60,
    real: 'Drives, job posts, applications, interviews, scorecards, ratings.',
    gap: 'A recruiter portal.',
  },
  {
    module: 'Certificates',
    cluster: 'Assessment & Outcomes',
    percent: 55,
    real: 'Templates, issuance, revocation, public verification with no account.',
    gap: 'Digital signatures, bulk issuance from the interface.',
  },
  {
    module: 'HR',
    cluster: 'Money & People',
    percent: 55,
    real: 'Staff profiles, leave types, balances, requests, register, holidays, settings.',
    gap: 'Payroll — records only, by design, permanently.',
  },
  {
    module: 'Platform Ops',
    cluster: 'Platform & Trust',
    percent: 55,
    real: 'Feature flags and overrides, API keys, webhooks with delivery logs, saved views, export jobs, custom fields, approval chains, health, PWA.',
    gap: 'A job console, a storage console.',
  },
  {
    module: 'AI Services',
    cluster: 'Academics & Content',
    percent: 45,
    real: 'A provider port defaulting to disabled, token budgets, generation cache, course-outline and lesson drafting, dropout risk, adaptive paths, interview practice.',
    gap: 'Tutor chat, AI grading, transcription, text to speech.',
  },
  {
    module: 'Parent portal',
    cluster: 'Delivery & Engagement',
    percent: 40,
    real: 'Guardian links, a per-child view of courses and marks, read-only by construction.',
    gap: 'Digests, paying a fee from the portal.',
  },
];

export const notBuiltAtAll: { thing: string; why: string }[] = [
  { thing: 'A payment gateway', why: 'You can raise, track and reconcile an invoice. You cannot take a card inside the product.' },
  { thing: 'SAML, OIDC and SCIM', why: 'Sign-in with Google, Microsoft and GitHub is built. Enterprise SSO is not.' },
  { thing: 'A meeting-provider adapter', why: 'You paste a Zoom, Meet, Teams or Jitsi link onto the session.' },
  { thing: 'Video transcoding', why: 'The storage port and player are built; the transcoding worker is not.' },
  { thing: 'A visual workflow builder', why: 'Approval chains, assignment rules and scheduled jobs are configuration, not a canvas.' },
  { thing: 'Camera proctoring', why: 'Deliberately. Integrity signals shown to a human, disclosed to the candidate, no automatic verdicts.' },
  { thing: 'Native iOS and Android apps', why: 'Deliberately. It is an installable PWA, designed at 360 pixels first.' },
  { thing: 'Statutory payroll filing', why: 'Deliberately, and permanently. HR holds records.' },
  { thing: 'Multi-region data residency', why: 'Designed and not built. A region field that does not move bytes would read as a guarantee and be false.' },
  { thing: 'A telemetry exporter', why: 'The environment variables are validated; nothing consumes them yet. So there is no status page, because a status page that cannot go red is theatre.' },
];

export const averagePercent = Math.round(
  buildStatus.reduce((sum, row) => sum + row.percent, 0) / buildStatus.length,
);
