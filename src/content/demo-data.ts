/**
 * The data behind every product rendering on this site.
 *
 * Two kinds, and the distinction is the whole point (ADR 0008):
 *
 *  - **seeded** — copied verbatim from the product's own demo seed
 *    (`apps/api/src/scripts/seed-demo-tenant.ts` and `apps/api/prisma/seed/index.ts`). These
 *    people and this institute exist in any checkout that has run `pnpm db:seed`. They are
 *    fictional by construction and they are checked in.
 *
 *  - **illustrative** — example rows in a real layout, so that a board looks like a board.
 *    Every frame that uses them says so, in the caption, every time.
 *
 * What is NOT here, and never will be: a metric. No revenue, no collections, no completion
 * rate, no uptime, no learner count. Those are the numbers a marketing site is tempted to
 * invent, and inventing one would cost us the only argument this site actually has.
 */

export const seededTenant = {
  name: 'Sunrise Academy',
  slug: 'sunrise',
  plan: 'growth',
  branches: ['Main campus', 'North centre'],
} as const;

/** The six personas the demo seed creates, with the roles it assigns them. */
export const seededPeople = [
  { name: 'Divya Menon', role: 'Super Admin', scope: 'GLOBAL' },
  { name: 'Rajesh Kumar', role: 'Institute Admin', scope: 'TENANT' },
  { name: 'Meera Iyer', role: 'Academic Head', scope: 'TENANT' },
  { name: 'Arjun Nair', role: 'Teacher', scope: 'TENANT' },
  { name: 'Sana Khan', role: 'Student', scope: 'RECORD' },
  { name: 'Vikram Rao', role: 'Parent', scope: 'RECORD' },
] as const;

export type Provenance = 'seed' | 'catalog' | 'illustrative';

export const provenanceNote: Record<Provenance, string> = {
  seed: 'Demo institute — the people and the institute are the product’s own seed data.',
  catalog: 'Rendered from the product’s real permission catalog and role templates.',
  illustrative:
    'The layout is the product’s. The rows are illustrative examples — we do not publish another institute’s data, and we do not invent numbers.',
};

/* ------------------------------------------------------- Admissions board */

export const pipelineStages = ['Enquiry', 'Contacted', 'Counselled', 'Application', 'Enrolled'] as const;

export const boardCards: {
  stage: (typeof pipelineStages)[number];
  name: string;
  source: string;
  owner: string;
  note?: string;
}[] = [
  { stage: 'Enquiry', name: 'Ananya Deshmukh', source: 'Web form', owner: 'Priya' },
  { stage: 'Enquiry', name: 'Faizan Qureshi', source: 'Walk-in', owner: 'Unassigned', note: 'Possible duplicate' },
  { stage: 'Contacted', name: 'Ritu Bansal', source: 'Phone', owner: 'Priya' },
  { stage: 'Counselled', name: 'Joseph Mathew', source: 'Referral', owner: 'Priya' },
  { stage: 'Application', name: 'Neha Pillai', source: 'Web form', owner: 'Priya' },
  { stage: 'Enrolled', name: 'Sana Khan', source: 'Walk-in', owner: 'Priya' },
];

/* --------------------------------------------------------- Role dashboards */

export interface DashboardPanel {
  label: string;
  lines: { text: string; meta?: string; tone?: 'default' | 'accent' | 'warning' }[];
}

/**
 * A role's dashboard, described as the *work* it surfaces rather than as figures. Every line
 * is a task or a state that the product genuinely puts on that role's dashboard; none of them
 * is a number we would have had to make up.
 */
export const roleDashboards: Record<
  'owner' | 'teacher' | 'student' | 'parent',
  { person: string; role: string; caption: string; panels: DashboardPanel[] }
> = {
  owner: {
    person: 'Rajesh Kumar',
    role: 'Institute Admin',
    caption: 'The whole institute, in one place — including the branch you were not thinking about.',
    panels: [
      {
        label: 'Admissions',
        lines: [
          { text: 'Enquiries awaiting a first call', meta: 'Unassigned queue' },
          { text: 'Applications waiting on a decision', meta: 'Both campuses' },
        ],
      },
      {
        label: 'Money',
        lines: [
          { text: 'Invoices issued this month', meta: 'Finance' },
          { text: 'Outstanding, by age', meta: 'Aging report' },
        ],
      },
      {
        label: 'Branches',
        lines: [
          { text: 'Main campus', meta: 'Active' },
          { text: 'North centre', meta: 'Active' },
        ],
      },
      {
        label: 'Needs a decision',
        lines: [
          { text: 'Leave requests', tone: 'warning' },
          { text: 'Courses submitted for approval', tone: 'warning' },
        ],
      },
    ],
  },
  teacher: {
    person: 'Arjun Nair',
    role: 'Teacher',
    caption: 'What needs you, in the order it needs you.',
    panels: [
      {
        label: 'Marking queue',
        lines: [
          { text: 'Attempts waiting to be marked', meta: 'Anonymised' },
          { text: 'Assignments with submissions', meta: 'Rubric ready' },
        ],
      },
      {
        label: 'Today',
        lines: [
          { text: 'Live class — Data Structures', meta: 'Main campus' },
          { text: 'Register not yet taken', tone: 'warning' },
        ],
      },
      {
        label: 'Falling behind',
        lines: [
          { text: 'Learners flagged by the risk model', meta: 'With their signals' },
          { text: 'Unanswered questions on your lessons', meta: 'Q&A' },
        ],
      },
      {
        label: 'Your courses',
        lines: [{ text: 'Published', meta: 'Version history available' }],
      },
    ],
  },
  student: {
    person: 'Sana Khan',
    role: 'Student',
    caption: 'Next up. Nothing else.',
    panels: [
      {
        label: 'Continue',
        lines: [{ text: 'Resume where you left off', meta: 'Last lesson', tone: 'accent' }],
      },
      {
        label: 'Due',
        lines: [
          { text: 'Assignment — due Friday', tone: 'warning' },
          { text: 'Mock test — opens Monday' },
        ],
      },
      {
        label: 'Live',
        lines: [{ text: 'Join today’s class', meta: 'Attendance is taken automatically' }],
      },
      {
        label: 'Yours',
        lines: [
          { text: 'Marks and feedback', meta: 'Per criterion' },
          { text: 'Certificates', meta: 'Verifiable by an employer' },
        ],
      },
    ],
  },
  parent: {
    person: 'Vikram Rao',
    role: 'Parent',
    caption: 'Read-only, by construction. A guardian link is not an account with fewer buttons.',
    panels: [
      {
        label: 'Your child',
        lines: [{ text: 'Sana Khan', meta: 'Linked guardian' }],
      },
      {
        label: 'Attendance',
        lines: [{ text: 'Session by session', meta: 'With regularisations shown' }],
      },
      {
        label: 'Marks',
        lines: [{ text: 'As published by the teacher', meta: 'Never drafts' }],
      },
      {
        label: 'Fees',
        lines: [{ text: 'Invoices and what is outstanding', meta: 'Read-only' }],
      },
    ],
  },
};

/* ------------------------------------------------------ Certificate verify */

export const verifyExample = {
  code: 'AK-7F3C-90D2',
  learnerName: 'Sana Khan',
  courseTitle: 'Data Structures & Algorithms',
  issuedOn: '12 June 2026',
  institute: 'Sunrise Academy',
  valid: true,
} as const;

/* ------------------------------------------------------------ Item analysis */

/**
 * Difficulty and discrimination for six questions on one paper. Illustrative, and labelled
 * as such — the shape of an item-analysis screen is the claim, not the values.
 */
export const itemAnalysis: { q: string; correctPct: number; discrimination: number }[] = [
  { q: 'Q1', correctPct: 92, discrimination: 0.18 },
  { q: 'Q2', correctPct: 74, discrimination: 0.41 },
  { q: 'Q3', correctPct: 61, discrimination: 0.52 },
  { q: 'Q4', correctPct: 38, discrimination: 0.47 },
  { q: 'Q5', correctPct: 55, discrimination: 0.06 },
  { q: 'Q6', correctPct: 22, discrimination: 0.33 },
];

/* --------------------------------------------------------------- Risk list */

export const riskSignals: { learner: string; band: 'high' | 'medium'; signals: string[] }[] = [
  { learner: 'Ritu Bansal', band: 'high', signals: ['No login for 11 days', 'Two missed submissions', 'Attendance below the rule'] },
  { learner: 'Joseph Mathew', band: 'medium', signals: ['Progress stalled mid-module', 'One missed submission'] },
  { learner: 'Neha Pillai', band: 'medium', signals: ['Attendance below the rule'] },
];

/* -------------------------------------------------------------- Course diff */

export const courseDiff: { kind: 'added' | 'removed' | 'changed'; text: string }[] = [
  { kind: 'changed', text: 'Module 2 · renamed “Recursion” → “Recursion and induction”' },
  { kind: 'added', text: 'Module 2 · Unit 3 · new lesson “Master theorem”' },
  { kind: 'removed', text: 'Module 4 · lesson “Legacy sorting demo” removed' },
  { kind: 'changed', text: 'Course · passing band raised from 40% to 45%' },
];
