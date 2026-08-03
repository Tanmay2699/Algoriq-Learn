/**
 * The comparison pages.
 *
 * Rules, which are not negotiable (docs/17 §5):
 *  1. Every competitor cell carries a source URL and the date we read it.
 *  2. Where they are better, the table says so. A comparison one column wins outright is an
 *     advertisement, and nobody believes it twice.
 *  3. Only official sources — the competitor's own documentation. Never a review site, never
 *     "in our testing".
 *  4. No trademarks, logos or brand styling. No pejoratives. Their users are our prospects.
 *  5. A cell older than 180 days renders a "last verified" notice; older than 270, the page
 *     comes down until it is checked.
 */

export type Verdict = 'algoryq' | 'them' | 'even';

export interface ComparisonRow {
  capability: string;
  algoryq: string;
  them: string;
  /** Who this row favours. Used for the honest summary, not for a tick-and-cross graphic. */
  verdict: Verdict;
  source: string;
  retrievedAt: string;
}

export interface Comparison {
  slug: string;
  name: string;
  h1: string;
  lead: string;
  /** What they are genuinely good at. This paragraph comes first, before any row. */
  theirStrength: string;
  /** When somebody should stay where they are. */
  stayIf: string;
  /** When people move. */
  moveIf: string;
  rows: ComparisonRow[];
}

const MOODLE_DOCS = 'https://docs.moodle.org/';
const CLASSROOM_HELP = 'https://support.google.com/edu/classroom/';
const CANVAS_DOCS = 'https://community.canvaslms.com/t5/Canvas-Basics-Guide/tkb-p/basics';
const READ = '2026-07-31';

export const comparisons: Comparison[] = [
  {
    slug: 'moodle',
    name: 'Moodle',
    h1: 'Algoryq Learn and Moodle',
    lead:
      'Moodle is the most widely deployed learning platform in the world, it is free, and its plugin ecosystem is two decades deep. Most of what follows is about scope rather than quality.',
    theirStrength:
      'Moodle is genuinely excellent at what it is: a course platform with an enormous plugin ecosystem, no licence cost, an active community, and two decades of institutional trust. If your problem is delivering and assessing coursework and you have somebody who can maintain it, Moodle solves that problem and asks for no money.',
    stayIf:
      'You are happy with Moodle, you have somebody who maintains it, and the admissions, fees and staff side of the institute is not where your pain is.',
    moveIf:
      'The pain has moved out of the coursework and into the seams — enquiries in a notebook, fees in a spreadsheet, marks copied by hand, and a monthly report somebody compiles on a Sunday.',
    rows: [
      {
        capability: 'Course delivery and assessment',
        algoryq: 'Built in',
        them: 'Built in, and more mature — twenty years of question types and plugins',
        verdict: 'them',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Plugin ecosystem',
        algoryq: 'None. Webhooks and a REST API instead.',
        them: 'Very large, and the main reason Moodle fits so many institutions',
        verdict: 'them',
        source: 'https://moodle.org/plugins/',
        retrievedAt: READ,
      },
      {
        capability: 'Licence cost',
        algoryq: 'Free tier to 100 seats, then paid',
        them: 'Free, open source (GPL)',
        verdict: 'them',
        source: 'https://moodle.org/',
        retrievedAt: READ,
      },
      {
        capability: 'Admissions and enquiries',
        algoryq: 'A CRM module in the same database — pipelines, follow-ups, applications, conversion',
        them: 'Not part of core',
        verdict: 'algoryq',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Fees and invoicing',
        algoryq: 'Fee plans, invoices, tax, coupons, scholarships, payments, credit notes (no card payments yet)',
        them: 'Enrolment payment plugins; not an invoicing or receivables system',
        verdict: 'algoryq',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'HR and staff records',
        algoryq: 'Staff profiles, leave, register, holidays',
        them: 'Not part of core',
        verdict: 'algoryq',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Multi-tenancy',
        algoryq: 'One deployment, many institutes, isolated by a forced row-level security policy',
        them: 'Usually one instance per organisation; multi-tenancy via separate installs or Workplace',
        verdict: 'algoryq',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Self-hosting',
        algoryq: 'Yes — one compose file, no cloud account',
        them: 'Yes, and the most commonly self-hosted platform in the category',
        verdict: 'even',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Accessibility conformance published',
        algoryq: 'Yes, with open items listed',
        them: 'Yes',
        verdict: 'even',
        source: 'https://docs.moodle.org/en/Accessibility',
        retrievedAt: READ,
      },
      {
        capability: 'Single sign-on',
        algoryq: 'Google, Microsoft, GitHub. No SAML, OIDC or SCIM yet.',
        them: 'SAML2, OAuth2, LDAP, CAS and more',
        verdict: 'them',
        source: MOODLE_DOCS,
        retrievedAt: READ,
      },
    ],
  },
  {
    slug: 'google-classroom',
    name: 'Google Classroom',
    h1: 'Algoryq Learn and Google Classroom',
    lead:
      'Classroom is free, everybody already has an account, and it takes about four minutes to start using. It is also not a system of record, and it does not claim to be.',
    theirStrength:
      'Zero friction. Everybody in the building already has a Google account, teachers need no training, and the whole thing works on the first day. For handing out and collecting work, nothing is faster to adopt.',
    stayIf:
      'What you need is to hand out work, collect it, and give feedback — and the rest of the institute is genuinely fine as it is.',
    moveIf:
      'You need a record that outlives a term: enquiries, fees, attendance a parent can see, a certificate an employer can verify, and an audit trail.',
    rows: [
      {
        capability: 'Time to first use',
        algoryq: 'Seed an institute, invite people. Longer.',
        them: 'Minutes. Everyone already has an account.',
        verdict: 'them',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'Cost',
        algoryq: 'Free to 100 seats, then paid',
        them: 'Free with Workspace for Education',
        verdict: 'them',
        source: 'https://edu.google.com/workspace-for-education/editions/',
        retrievedAt: READ,
      },
      {
        capability: 'Handing out and collecting work',
        algoryq: 'Assignments with rubrics and criterion marks',
        them: 'Excellent, and deeply integrated with Docs and Drive',
        verdict: 'them',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'Admissions and enquiries',
        algoryq: 'A CRM module with pipelines, follow-ups and conversion',
        them: 'No',
        verdict: 'algoryq',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'Fees',
        algoryq: 'Fee plans, invoices, payments, aging',
        them: 'No',
        verdict: 'algoryq',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'Attendance register',
        algoryq: 'Per session and per course, with rules and regularisation',
        them: 'No native register',
        verdict: 'algoryq',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'Certificates with public verification',
        algoryq: 'Yes — a code anybody can check with no account',
        them: 'No',
        verdict: 'algoryq',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'A permission model you can reshape',
        algoryq: '272 keys, 11 editable role templates, scopes and overrides',
        them: 'Fixed roles — teacher, student, guardian',
        verdict: 'algoryq',
        source: CLASSROOM_HELP,
        retrievedAt: READ,
      },
      {
        capability: 'Where the data lives',
        algoryq: 'A PostgreSQL database you can point at, or self-host entirely',
        them: 'Google-managed',
        verdict: 'algoryq',
        source: 'https://edu.google.com/workspace-for-education/',
        retrievedAt: READ,
      },
    ],
  },
  {
    slug: 'canvas',
    name: 'Canvas',
    h1: 'Algoryq Learn and Canvas',
    lead:
      'Canvas is a real enterprise LMS with a deep integration ecosystem and a long track record in higher education. The comparison is about the business half of an institute, not about the coursework.',
    theirStrength:
      'Canvas is mature, well supported, deeply integrated through LTI, and trusted by large universities. Its assessment and course-delivery feature set is broader than ours, its ecosystem is far larger, and it has an operational history we do not.',
    stayIf:
      'You are a large institution with an LTI ecosystem, a support contract you value, and a separate student information system that already handles admissions and fees.',
    moveIf:
      'You do not want to run two systems. Or the SIS you would need alongside it costs more than the LMS.',
    rows: [
      {
        capability: 'Course delivery breadth',
        algoryq: 'Solid, and narrower',
        them: 'Broader, and more mature',
        verdict: 'them',
        source: CANVAS_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Integration ecosystem',
        algoryq: 'REST API, webhooks, API keys. No LTI.',
        them: 'Extensive LTI ecosystem',
        verdict: 'them',
        source: CANVAS_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Operational track record',
        algoryq: 'None. This is our first deployment.',
        them: 'Years of large-scale production use',
        verdict: 'them',
        source: CANVAS_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Admissions, fees and HR',
        algoryq: 'In the same database as the coursework',
        them: 'Not the product’s scope — handled by an SIS',
        verdict: 'algoryq',
        source: CANVAS_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Published build status',
        algoryq: 'Yes — every module’s completeness, including the weak ones',
        them: 'Roadmap and release notes',
        verdict: 'algoryq',
        source: CANVAS_DOCS,
        retrievedAt: READ,
      },
      {
        capability: 'Accessibility conformance published',
        algoryq: 'Yes, with open items listed',
        them: 'Yes — VPAT published',
        verdict: 'even',
        source: 'https://www.instructure.com/accessibility',
        retrievedAt: READ,
      },
      {
        capability: 'Self-hosting',
        algoryq: 'Yes — one compose file',
        them: 'Open-source edition exists',
        verdict: 'even',
        source: 'https://github.com/instructure/canvas-lms',
        retrievedAt: READ,
      },
    ],
  },
  {
    slug: 'spreadsheets-and-whatsapp',
    name: 'Spreadsheets and WhatsApp',
    h1: 'Algoryq Learn and the stack you already run',
    lead:
      'The most common competitor in this category is not software. It is a spreadsheet, a group chat, a payment link and somebody who remembers everything.',
    theirStrength:
      'It is free, everybody already knows how to use it, it needed no procurement, and it is working — which is more than can be said for a lot of software. Underestimating this is how vendors lose deals they thought they had won.',
    stayIf:
      'One campus, one person who knows everything, and nothing has gone wrong yet that you noticed.',
    moveIf:
      'A second branch opened. Or the person who remembers everything took a holiday. Or a parent asked a question you could not answer in the meeting.',
    rows: [
      {
        capability: 'Cost',
        algoryq: 'Free to 100 seats, then paid',
        them: 'Effectively free',
        verdict: 'them',
        source: 'n/a — this row describes a practice, not a product',
        retrievedAt: READ,
      },
      {
        capability: 'Training required',
        algoryq: 'Real, though the interface is designed for it',
        them: 'None',
        verdict: 'them',
        source: 'n/a',
        retrievedAt: READ,
      },
      {
        capability: 'One record that travels',
        algoryq: 'Enquiry → enrolment → progress → marks → certificate, in one row’s history',
        them: 'Each stage is a different file, keyed by a name spelled three ways',
        verdict: 'algoryq',
        source: 'n/a',
        retrievedAt: READ,
      },
      {
        capability: 'Numbers that are current',
        algoryq: 'Dashboards read the same database the work happens in',
        them: 'Compiled by hand, monthly',
        verdict: 'algoryq',
        source: 'n/a',
        retrievedAt: READ,
      },
      {
        capability: 'Who changed what',
        algoryq: 'A hash-chained audit log with field-level diffs',
        them: 'Version history, if somebody used Sheets rather than Excel',
        verdict: 'algoryq',
        source: 'n/a',
        retrievedAt: READ,
      },
      {
        capability: 'Access control',
        algoryq: '272 permission keys, roles and scopes, enforced by the server',
        them: 'Whoever has the file',
        verdict: 'algoryq',
        source: 'n/a',
        retrievedAt: READ,
      },
      {
        capability: 'What happens when somebody leaves',
        algoryq: 'Their access is revoked; the records stay',
        them: 'The records leave with the phone',
        verdict: 'algoryq',
        source: 'n/a',
        retrievedAt: READ,
      },
    ],
  },
];

export function comparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

/** Days since a cell was verified. Drives the staleness notice. */
export function daysSince(date: string, now = new Date('2026-07-31')): number {
  const then = new Date(date);
  return Math.floor((now.getTime() - then.getTime()) / 86_400_000);
}
