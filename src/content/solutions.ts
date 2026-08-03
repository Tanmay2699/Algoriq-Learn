/**
 * The five solution pages. Same product, different vocabulary and different order.
 *
 * Each one leads with the number that segment is judged on, uses its words, and ends with the
 * honest disqualifier for that segment — losing a badly-fitting prospect on the website is
 * cheaper for both sides than losing them in month three.
 */

export interface Solution {
  slug: string;
  name: string;
  h1: string;
  lead: string;
  /** The one thing this segment is measured on. */
  judgedOn: string;
  /** Their words, which the page then uses throughout. */
  vocabulary: string[];
  sections: { title: string; body: string; href: string }[];
  disqualifier: string;
}

export const solutionPages: Solution[] = [
  {
    slug: 'coaching-institutes',
    name: 'Coaching institutes',
    h1: 'Admissions volume and assessment depth, in one place',
    lead:
      'A coaching institute lives on two numbers: how many enquiries convert, and how well the mock tests predict the real thing. Both are modules here, not spreadsheets.',
    judgedOn: 'Conversion, and results',
    vocabulary: ['enquiry', 'batch', 'mock test', 'rank', 'fee instalment'],
    sections: [
      {
        title: 'Every enquiry, with an owner and a follow-up',
        body:
          'A board with stages you name, round-robin assignment that cannot collide, duplicate suggestions that never swallow the second enquiry, and a reason recorded on every loss.',
        href: '/product/modules/admissions-crm',
      },
      {
        title: 'Mock tests that tell you which question was wrong',
        body:
          'Question banks reused across terms, papers with sections, attempts, an anonymised marking queue, and item analysis showing which questions actually separated the cohort.',
        href: '/product/modules/assessments',
      },
      {
        title: 'Batches, timetables and a waitlist that moves',
        body:
          'Seat limits that refuse out loud, a waitlist that promotes somebody when a seat opens, and transfers that keep a learner’s progress.',
        href: '/product/modules/batches-and-enrollment',
      },
      {
        title: 'Fee instalments, and who has not paid',
        body:
          'Fee plans, invoices, discounts, scholarships, payments and an aging report. Money is integer minor units with a currency, never a float.',
        href: '/product/modules/fees-and-finance',
      },
      {
        title: 'Parents who can see, without another login to lose',
        body: 'A guardian link gives a parent their own child’s attendance and marks, read-only by construction.',
        href: '/product/modules/batches-and-enrollment',
      },
      {
        title: 'Who is about to drop out',
        body:
          'A risk score per learner with the signals that produced it — attendance, progress, missed submissions — and a record of the intervention.',
        href: '/product/intelligence',
      },
    ],
    disqualifier:
      'If you need to take fee payments by card inside the product today, we are not there — there is no payment-gateway adapter yet. You can raise, discount, track and reconcile invoices.',
  },
  {
    slug: 'schools',
    name: 'Schools',
    h1: 'The register, the marks and the fees — where parents can see them',
    lead:
      'A school’s software problem is rarely the coursework. It is that attendance lives in one book, marks in a spreadsheet, fees in a payment link, and parents in a group chat.',
    judgedOn: 'Parent confidence, and collections',
    vocabulary: ['class', 'section', 'register', 'guardian', 'term'],
    sections: [
      {
        title: 'A register that reconciles to the class',
        body:
          'Sessions on a timetable, an attendance register with rules the school defines, and a regularisation request for the day the register was wrong.',
        href: '/product/modules/live-classes-and-attendance',
      },
      {
        title: 'A parent portal that is read-only by construction',
        body:
          'Not a learner account with fewer buttons — a different relationship in the data model. A guardian sees their own children and nothing else.',
        href: '/product/modules/batches-and-enrollment',
      },
      {
        title: 'Fees, instalments and what is outstanding',
        body: 'Invoices, payments, credit notes and an aging report, per branch.',
        href: '/product/modules/fees-and-finance',
      },
      {
        title: 'A gradebook whose scale belongs to the school',
        body:
          'Grade categories, scales and bands are the school’s statement of what an A means — so they sit behind a permission teachers deliberately do not hold.',
        href: '/product/modules/assignments-and-grading',
      },
      {
        title: 'Several campuses, one set of numbers',
        body: 'Branches are first-class. A role can be scoped to one of them, and the owner still sees both.',
        href: '/product/platform-and-trust',
      },
      {
        title: 'Your own website, authored by you',
        body: 'Pages, posts, events and a gallery on your own domain, with enquiries landing straight on the admissions board.',
        href: '/product/modules/institute-website',
      },
    ],
    disqualifier:
      'There is no transport, hostel or library module, and no biometric-device integration. If those are the reason you are switching, we are the wrong system today.',
  },
  {
    slug: 'universities',
    name: 'Universities',
    h1: 'Programme structure, and a conformance statement you can hand to procurement',
    lead:
      'A university evaluation is two evaluations: does it fit the academic structure, and does it survive the security and accessibility review. We publish enough to let you answer the second one without a call.',
    judgedOn: 'Procurement, and academic governance',
    vocabulary: ['programme', 'semester', 'credit', 'transcript'],
    sections: [
      {
        title: 'Curriculum that cannot ship without approval',
        body:
          'Courses are versioned, submitted, reviewed and published. Restoring a version rebuilds from the snapshot and shows you the diff first.',
        href: '/product/modules/courses-and-curriculum',
      },
      {
        title: 'Assessment integrity without a camera',
        body:
          'Signals from a cooperating browser, shown to a human marker with the caveat on the screen, disclosed to the candidate while it happens. No automatic verdicts, ever.',
        href: '/product/modules/assessments',
      },
      {
        title: 'An accessibility conformance statement with its open items listed',
        body:
          'WCAG 2.2 AA, automated checks that fail the build, and a published list of what still does not pass. Procurement teams have read a hundred statements claiming full conformance.',
        href: '/accessibility',
      },
      {
        title: 'Roles and scopes that match a faculty structure',
        body:
          'Eleven templates, cloneable, scoped to a branch, a department, a course or a single record, with per-user overrides and out-of-office delegation.',
        href: '/security',
      },
      {
        title: 'Data governance you can inspect',
        body:
          'Row-level security forced in the database, a hash-chained audit log, retention policies, legal holds and subject-access requests.',
        href: '/security',
      },
      {
        title: 'Self-hosting, if that is the requirement',
        body: 'The whole platform boots from one compose file with no cloud account. The exit is documented before the entrance.',
        href: '/resources/self-hosting-algoryq-learn',
      },
    ],
    disqualifier:
      'Multi-region data residency is designed and deliberately not built. If your requirement is that data stays in a named region enforced by the platform, we cannot honestly claim that yet. Nor do we have SAML, OIDC or SCIM.',
  },
  {
    slug: 'skilling-academies',
    name: 'Skilling academies',
    h1: 'Placement is the product, so it is a module',
    lead:
      'A bootcamp is judged on offers, not on lesson completion. The placement cell, the interview panel and the practice loop are part of the platform rather than a spreadsheet next to it.',
    judgedOn: 'Placement rate',
    vocabulary: ['cohort', 'capstone', 'drive', 'offer'],
    sections: [
      {
        title: 'Drives, openings and candidates',
        body: 'Job posts, applications from your own learners, and a pipeline that shows you where the funnel narrows.',
        href: '/product/modules/placement-and-interviews',
      },
      {
        title: 'Interview panels with scorecards',
        body: 'Structured ratings rather than a remembered impression, and a practice interview the learner runs privately first.',
        href: '/product/modules/placement-and-interviews',
      },
      {
        title: 'Verifiable certificates',
        body: 'An employer pastes a code and gets an answer, with no account. An unverifiable credential is worth less.',
        href: '/product/modules/certificates',
      },
      {
        title: 'Cohorts that move together',
        body: 'Batches, timetables, waitlists and transfers, with progress that survives a move.',
        href: '/product/modules/batches-and-enrollment',
      },
      {
        title: 'Who is falling behind, early enough to matter',
        body: 'Risk scoring with its signals, and a record of the intervention.',
        href: '/product/intelligence',
      },
      {
        title: 'Admissions that attribute themselves',
        body: 'A public enquiry endpoint your landing pages post to, with a board and follow-ups behind it.',
        href: '/product/modules/admissions-crm',
      },
    ],
    disqualifier:
      'There is no recruiter portal — companies cannot log in and browse your candidates. Placement is run by your team, from inside the product.',
  },
  {
    slug: 'corporate-l-and-d',
    name: 'Corporate L&D',
    h1: 'Compliance training, and a certificate anyone can verify',
    lead:
      'For an L&D team the question is rarely whether people can watch a video. It is whether you can prove, two years later, who completed what and when.',
    judgedOn: 'Audit, and completion evidence',
    vocabulary: ['learner', 'compliance', 'renewal', 'audit'],
    sections: [
      {
        title: 'Certificates with public verification',
        body: 'Issued from a template, revocable, checkable by anyone holding the code with no account.',
        href: '/product/modules/certificates',
      },
      {
        title: 'An audit trail that is a hash chain',
        body:
          'Every mutation with a field-level diff, chained to the entry before it. Erasure tombstones the record rather than rewriting the chain that proves it.',
        href: '/security',
      },
      {
        title: 'Roles that match an org chart',
        body: 'Scoped to a department or a single record, with per-user overrides and delegation for when somebody is away.',
        href: '/security',
      },
      {
        title: 'Reporting and exports',
        body: 'Dashboards, saved report definitions, and exports collected in one place.',
        href: '/product/intelligence',
      },
      {
        title: 'Assessments with item analysis',
        body: 'Not just a pass mark — which question was ambiguous, and which one separated people who knew it from people who did not.',
        href: '/product/modules/assessments',
      },
      {
        title: 'Your branding, your domain',
        body: 'One build serves every tenant; branding is injected into the server-rendered shell rather than compiled.',
        href: '/product/platform-and-trust',
      },
    ],
    disqualifier:
      'There is no SAML, OIDC or SCIM yet. If your requirement is that people sign in with your corporate identity provider and are provisioned automatically, that is not built — Google, Microsoft and GitHub sign-in is.',
  },
];

export function solutionBySlug(slug: string): Solution | undefined {
  return solutionPages.find((s) => s.slug === slug);
}
