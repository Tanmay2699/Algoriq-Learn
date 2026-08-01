/** The lifecycle spine — the page's centre of gravity, and the product's actual shape. */

export interface SpineStop {
  step: string;
  title: string;
  body: string;
  module: string;
  href: string;
}

export const spine: SpineStop[] = [
  {
    step: 'Enquiry',
    title: 'No enquiry goes cold.',
    body:
      'It arrives from your website, a phone call or a walk-in and lands on a board with an owner, a timeline and a follow-up. The same person enquiring twice is suggested as a duplicate, never silently swallowed.',
    module: 'Admissions CRM',
    href: '/product/modules/admissions-crm',
  },
  {
    step: 'Application',
    title: 'Your stage names. Our stage meaning.',
    body:
      'Call the first column Enquiry or Qualified — nothing in the code reads the label. Won, lost and open are the facts every funnel counts, so your conversion rate survives your vocabulary.',
    module: 'Admissions CRM',
    href: '/product/modules/admissions-crm',
  },
  {
    step: 'Enrolment',
    title: 'One press, two honest outcomes.',
    body:
      'Already a member? Enrolled. Not yet? Invited — and the application says so until they accept. Press it twice and nothing doubles. A seat limit refuses out loud rather than pretending.',
    module: 'Batches & enrolment',
    href: '/product/modules/batches-and-enrollment',
  },
  {
    step: 'Learning',
    title: 'Every learner, one record.',
    body:
      'Courses, batches, timetable, live classes, attendance, notes, questions and progress — including progress captured on a phone with no signal and replayed in order when it comes back.',
    module: 'Learning delivery',
    href: '/product/modules/learning-delivery',
  },
  {
    step: 'Assessment',
    title: 'Marks that stand up.',
    body:
      'Question banks, papers with sections, attempts, an anonymised marking queue, item analysis, rubrics, grade scales and overrides — each with a reason and an audit entry.',
    module: 'Assessments',
    href: '/product/modules/assessments',
  },
  {
    step: 'Certificate',
    title: 'Verifiable by a stranger.',
    body:
      'Issued from a template, revocable, and checkable by anyone holding the code at a public URL with no account. An unverifiable credential is worth less than a verifiable one.',
    module: 'Certificates',
    href: '/product/modules/certificates',
  },
  {
    step: 'Placement',
    title: 'The outcome you are judged on.',
    body:
      'Drives, openings, applications, interview panels and scorecards — with a practice interview the learner can run on their own first.',
    module: 'Placement & interviews',
    href: '/product/modules/placement-and-interviews',
  },
];

/**
 * The current-state table, from the product's own business-requirements research
 * (`docs/01-BRD.md` §1). It is not a strawman — it is what institutes in this market
 * actually run today.
 */
export const toolStack: { job: string; today: string; cost: string; withAkechi: string; href: string }[] = [
  {
    job: 'Host course content',
    today: 'Drive, unlisted YouTube',
    cost: 'No progress, no access control',
    withAkechi: 'Courses & media, with signed playback',
    href: '/product/modules/media-and-content',
  },
  {
    job: 'Deliver live classes',
    today: 'Zoom, scheduled over WhatsApp',
    cost: 'Attendance reconciled by hand',
    withAkechi: 'Sessions on the timetable, with a register',
    href: '/product/modules/live-classes-and-attendance',
  },
  {
    job: 'Assess',
    today: 'Google Forms, printed papers',
    cost: 'No item analytics, manual grading',
    withAkechi: 'Question banks, marking queue, item analysis',
    href: '/product/modules/assessments',
  },
  {
    job: 'Attendance and marks',
    today: 'Excel',
    cost: 'Error-prone, invisible to parents',
    withAkechi: 'Register and gradebook, visible to guardians',
    href: '/product/modules/assignments-and-grading',
  },
  {
    job: 'Collect fees',
    today: 'A payment link and a spreadsheet',
    cost: 'Manual reconciliation, no chasing',
    withAkechi: 'Fee plans, invoices, payments, aging',
    href: '/product/modules/fees-and-finance',
  },
  {
    job: 'Admissions',
    today: 'Phone and a notebook',
    cost: 'Enquiries leak, no attribution',
    withAkechi: 'A board with owners and follow-ups',
    href: '/product/modules/admissions-crm',
  },
  {
    job: 'Certificates',
    today: 'Canva and email',
    cost: 'Unverifiable, forgeable',
    withAkechi: 'Issued, revocable, publicly verifiable',
    href: '/product/modules/certificates',
  },
  {
    job: 'Report to management',
    today: 'Compiled by hand, monthly',
    cost: 'Decisions run 30 days late',
    withAkechi: 'Dashboards and a report builder',
    href: '/product/intelligence',
  },
];

/** Six rows on the homepage; the rest live on the comparison pages. */
export const quickComparison: { capability: string; akechi: string; moodle: string; classroom: string }[] = [
  {
    capability: 'Admissions and enquiries',
    akechi: 'Built in, same database',
    moodle: 'No',
    classroom: 'No',
  },
  { capability: 'Fees and invoices', akechi: 'Built in (no card payments yet)', moodle: 'Plugin', classroom: 'No' },
  {
    capability: 'Permission model you can reshape',
    akechi: '272 keys, 11 editable role templates',
    moodle: 'Roles and capabilities — yes',
    classroom: 'Fixed roles',
  },
  {
    capability: 'Tenant isolation you can inspect',
    akechi: 'Postgres row-level security, forced',
    moodle: 'Separate instance per tenant',
    classroom: 'Google-managed',
  },
  {
    capability: 'Accessibility conformance published',
    akechi: 'Yes, with open items listed',
    moodle: 'Yes',
    classroom: 'Yes',
  },
  { capability: 'Self-hostable', akechi: 'Yes — docker compose up', moodle: 'Yes', classroom: 'No' },
];
