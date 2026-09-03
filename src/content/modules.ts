/**
 * The fourteen module pages.
 *
 * Every `does` and `notBuilt` entry traces to docs/01-PRODUCT-TRUTH.md §4, which was derived
 * from the working tree — not from the product's design docs, which describe it as intended.
 * `completeness` is the product's own honest figure against its SRS; a module under 65 renders
 * its gap above the fold, and copy may never describe a module as more complete than its number.
 *
 * Copy length is a constraint, not an accident. A `lead` is one sentence, a `does` body is one
 * or two, and a `mechanism` body is the one place a paragraph is allowed — because it is the
 * section that separates this from a feature list. Anything longer belongs in a guide.
 */

export interface ModuleDoc {
  slug: string;
  cluster: string;
  title: string;
  h1: string;
  lead: string;
  /** The search title. `title — h1` overran 60 characters on ten of the fourteen. */
  seoTitle: string;
  seoDescription: string;
  apiModule: string;
  routes: number;
  completeness: number;
  /** What it does. Each entry is a capability that exists in the code today. */
  does: { title: string; body: string }[];
  /** One mechanism explained properly — the section that separates this from a feature list. */
  mechanism: { title: string; body: string };
  /** Permission keys this module contributes, as a sample. */
  keys: string[];
  notBuilt: string[];
  roles: string[];
  related: string[];
  /**
   * Representative photography for the page hero (ADR 0012, extending ADR 0011 from the five
   * solution pages to a defensible subset of the site). Atmosphere, not a claim — never wired
   * through `claims.ts`. Present on the eight modules where a real-world activity connects to
   * what the module does; absent on the rest rather than forced.
   */
  photo?: { src: string; alt: string; caption?: string };
}

export const modules: ModuleDoc[] = [
  {
    slug: 'admissions-crm',
    cluster: 'admissions-and-growth',
    title: 'Admissions CRM',
    h1: 'Every enquiry, on one board',
    lead:
      'Enquiries from your website, a phone call or a walk-in land on one admissions board with an owner, a timeline and a follow-up date.',
    seoTitle: 'Admissions CRM for Institutes',
    seoDescription:
      'An enquiry board with owners, follow-ups and a timeline the system writes: pipelines you name, duplicate suggestions, and collision-free assignment.',
    apiModule: 'crm',
    routes: 32,
    completeness: 72,
    does: [
      {
        title: 'A pipeline whose names are yours',
        body:
          'Call the first column Enquiry or Qualified. Nothing in the code reads the label — open, won and lost are the facts every funnel counts, so your conversion rate survives your vocabulary.',
      },
      {
        title: 'Duplicates suggested, never swallowed',
        body:
          'The same person really does enquire twice — a form on Monday, a call on Thursday. Matching is deliberately loose, and its only output is a suggestion to merge.',
      },
      {
        title: 'Assignment that cannot collide',
        body:
          'Round-robin runs off a cursor incremented in the database, so two enquiries a second apart cannot land on the same counsellor. A rule naming someone who has left leaves the enquiry unassigned.',
      },
      {
        title: 'A timeline written by the system',
        body:
          'Stage moves, assignments and calls are appended by the software. A history assembled from what somebody remembered is not a history.',
      },
      {
        title: 'Applications, and two honest outcomes',
        body:
          'Already a member? Enrolled. Not yet? Invited, and the application says so until they accept. Press it twice and nothing doubles.',
      },
      {
        title: 'Web-to-lead, hardened',
        body:
          'A public endpoint your own site posts to. It forces the source, has no field for stage or owner, returns a fixed acknowledgement, and answers identically for an unknown institute so it cannot enumerate them.',
      },
    ],
    mechanism: {
      title: 'Why a lost enquiry needs a reason and a won one refuses to have one',
      body:
        '“Why did we not get this?” is the most useful field in an admissions system, and a reason recorded against a win means nothing. The close date is stamped entering a closed stage and cleared on the way out — a reopened enquiry still reporting one lies to every cycle-time report. Conversion is won ÷ closed, never won ÷ everything, or it falls every time marketing does its job.',
    },
    keys: ['crm.lead.view', 'crm.lead.assign', 'crm.lead.merge', 'crm.application.decide', 'crm.pipeline.manage'],
    notBuilt: ['Campaign attribution', 'Email sequences', 'SMS and WhatsApp channels', 'Lead scoring'],
    roles: ['Admissions Counsellor', 'Institute Admin'],
    related: ['institute-website', 'batches-and-enrollment'],
    photo: {
      src: '/images/pages/module-admissions-crm.jpg',
      alt: 'A prospective student reading an enquiry notice board while a staff member works at the reception desk behind it.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'institute-website',
    cluster: 'admissions-and-growth',
    title: 'Your public website',
    h1: 'A website that knows what you teach',
    lead:
      'Pages, posts, events and a gallery on your own domain, authored by the people who run the institute rather than by whoever has the FTP password.',
    seoTitle: 'Institute Website Builder',
    seoDescription:
      'Pages, posts, events and a gallery on your own domain, authored in Markdown that can never become script — with enquiries landing in the CRM.',
    apiModule: 'cms',
    routes: 24,
    completeness: 60,
    does: [
      { title: 'Pages and posts', body: 'Markdown source, published on your slug or your own domain.' },
      { title: 'Events and a gallery', body: 'What is on, and photographs with the caption the upload required.' },
      { title: 'A generated sitemap', body: 'Not maintained by hand, and therefore not wrong.' },
      {
        title: 'Enquiries that land in the CRM',
        body: 'Your site posts to the same capture endpoint this one does. One enquiry, one board.',
      },
    ],
    mechanism: {
      title: 'Author text never becomes markup',
      body:
        'The renderer takes Markdown and emits React elements. It never emits HTML, so nothing an author types can become script in a visitor’s browser. That is stronger than sanitising, because there is no sanitiser to have a gap in.',
    },
    keys: ['cms.site.view', 'cms.page.publish', 'cms.post.publish'],
    notBuilt: ['A forms builder', 'An SEO editor', 'Themes beyond your branding'],
    roles: ['Institute Admin'],
    related: ['admissions-crm', 'courses-and-curriculum'],
    photo: {
      src: '/images/pages/module-institute-website.jpg',
      alt: 'A person building a website in a page-builder interface on a laptop, in a cafe.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'courses-and-curriculum',
    cluster: 'academics-and-content',
    title: 'Courses & curriculum',
    h1: 'Nothing ships until somebody says so',
    lead:
      'Programme, course, module, unit, lesson — versioned, approved before publishing, and restorable with a diff you can read.',
    seoTitle: 'Course and Curriculum Management',
    seoDescription:
      'Programme, course, module, unit and lesson — versioned, approved before publishing, and restorable with a diff you can actually read.',
    apiModule: 'course',
    routes: 38,
    completeness: 72,
    does: [
      { title: 'A real hierarchy', body: 'Course → module → unit → lesson, each lesson holding one primary item.' },
      { title: 'Versions with a visible diff', body: 'Publish snapshots a version. Compare two and read what changed.' },
      { title: 'Approval before publish', body: 'An author submits; a reviewer decides. Both acts are audited.' },
      { title: 'Duplication', body: 'Clone a course for the next term without copying its enrolments.' },
      { title: 'Categories', body: 'The institute’s own taxonomy, not ours.' },
      { title: 'Written lessons', body: 'Markdown source, rendered by the same safe-subset renderer as the public site.' },
    ],
    mechanism: {
      title: 'Restore rebuilds from the snapshot, which is why the snapshot must be complete',
      body:
        'Restoring a version rebuilds a course’s lessons from the stored snapshot rather than patching the live one. That is right, and it has a sharp edge: any field the snapshot omits is erased on restore. When written lesson bodies were added, carrying them through publish → restore → diff was the work, not adding the column.',
    },
    keys: ['course.course.view', 'course.course.publish', 'course.version.restore', 'course.category.manage'],
    notBuilt: ['SCORM and xAPI packages', 'Prerequisite graphs'],
    roles: ['Academic Head', 'Content Author', 'Teacher'],
    related: ['media-and-content', 'ai-assistance'],
    photo: {
      src: '/images/pages/module-courses-and-curriculum.jpg',
      alt: 'A student working through notes at a university library table lined with bookshelves.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'media-and-content',
    cluster: 'academics-and-content',
    title: 'Media & content',
    h1: 'Video that is yours, wherever it lives',
    lead:
      'Upload, chapters, captions and signed-URL playback over a storage port that speaks local disk, S3-compatible or Azure Blob.',
    seoTitle: 'Course Video Hosting and Media',
    seoDescription:
      'Upload, chapters, captions and signed-URL playback over a storage port that speaks local disk, S3-compatible object storage or Azure Blob.',
    apiModule: 'media',
    routes: 14,
    completeness: 70,
    does: [
      { title: 'Upload and playback', body: 'Signed URLs, so a link that leaks stops working.' },
      { title: 'Chapters and captions', body: 'Authored per asset; captions are a first-class record, not a sidecar file.' },
      { title: 'Three storage drivers', body: 'local-disk, s3 (covering MinIO and R2) and azure-blob, chosen by an environment variable.' },
    ],
    mechanism: {
      title: 'The port is the point',
      body:
        'No feature module imports a cloud SDK. Storage is an interface with three implementations, selected at boot — which makes “move your data” a connection-string change rather than a project. Mail, search, AI and cache have the same shape.',
    },
    keys: ['content.media.upload', 'content.media.view', 'content.caption.manage'],
    notBuilt: [
      'Transcoding and HLS — the port exists, the worker does not',
      'DRM',
      'Automatic transcription',
    ],
    roles: ['Content Author', 'Teacher'],
    related: ['courses-and-curriculum', 'learning-delivery'],
    photo: {
      src: '/images/pages/module-media-and-content.jpg',
      alt: 'A content creator with headphones and a microphone recording video on a laptop.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'ai-assistance',
    cluster: 'academics-and-content',
    title: 'AI assistance',
    h1: 'Drafts, never decisions',
    lead:
      'Paste an outline, get a course structure. Ask for a lesson, get Markdown you can edit. Nothing reaches a course until a human presses apply.',
    seoTitle: 'AI Course and Lesson Drafting',
    seoDescription:
      'Draft a course outline or a lesson in Markdown, then edit it. Nothing an AI produces reaches a course until a human presses apply. Off by default.',
    apiModule: 'ai',
    routes: 5,
    completeness: 45,
    does: [
      { title: 'Course outline drafting', body: 'A structure you can accept, edit or throw away.' },
      { title: 'Lesson content drafting', body: 'Markdown, into the editor, not into the course.' },
      { title: 'Dropout-risk scoring', body: 'With the signals that produced it, and an intervention you can record.' },
      { title: 'Adaptive paths and interview practice', body: 'The learner’s own, private by construction.' },
    ],
    mechanism: {
      title: 'The provider is a port, and its default is off',
      body:
        'OpenAI, Azure OpenAI, Anthropic or disabled, chosen by an environment variable. When disabled the feature is hidden rather than broken — a greyed-out button that cannot work is a support ticket. Token budgets are per tenant and generations cached, so no institute meets a bill it did not authorise.',
    },
    keys: ['ai.generate.course', 'ai.generate.lesson', 'ai.interview.practice'],
    notBuilt: ['AI tutoring chat', 'AI grading', 'Transcription', 'Text to speech'],
    roles: ['Teacher', 'Academic Head', 'Content Author'],
    related: ['courses-and-curriculum', 'assessments'],
    photo: {
      src: '/images/pages/module-ai-assistance.jpg',
      alt: 'A person using a chat-style AI tool on a laptop in a cafe.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'learning-delivery',
    cluster: 'delivery-and-engagement',
    title: 'Learning delivery',
    h1: 'Built for a bad connection',
    lead:
      'The player, progress, notes and questions — including progress captured with no signal and replayed in order when it returns.',
    seoTitle: 'Learning Delivery and Offline Progress',
    seoDescription:
      'The player, progress, resume, notes and questions — with progress captured on no signal at all and replayed in order, idempotently, when it returns.',
    apiModule: 'learn',
    routes: 50,
    completeness: 80,
    does: [
      { title: 'Resume where they left off', body: 'The most-used feature in any LMS, and it works on a phone.' },
      { title: 'Notes and questions', body: 'Against the lesson, with a moderation queue for staff.' },
      { title: 'A catalogue that respects permissions', body: 'A learner sees what they may enrol in, not everything.' },
      { title: 'Offline progress', body: 'Queued on the device, replayed in order, idempotently, last write wins.' },
      { title: 'Installable', body: 'A PWA: it goes on a home screen without an app store.' },
    ],
    mechanism: {
      title: 'Why the offline queue replays in order',
      body:
        'Progress events are queued in IndexedDB in their original sequence and replayed through one idempotent endpoint. Out-of-order replay would let a stale “25% watched” overwrite a later “complete”; a non-idempotent one would double-count a retry. Neither is theoretical on a train through a tunnel.',
    },
    keys: ['learn.course.access', 'learn.progress.view', 'learn.qa.moderate', 'learn.enrollment.manage'],
    notBuilt: ['Downloadable offline media', 'A native app — deliberately'],
    roles: ['Student', 'Teacher', 'Parent'],
    related: ['live-classes-and-attendance', 'batches-and-enrollment'],
    photo: {
      src: '/images/pages/module-learning-delivery.jpg',
      alt: 'A student sitting on a campus bench checking her phone with earbuds in.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'live-classes-and-attendance',
    cluster: 'delivery-and-engagement',
    title: 'Live classes & attendance',
    h1: 'The class, and the register that reconciles to it',
    lead:
      'Live sessions on your timetable, joined from the course, with an attendance register and a regularisation request for the day it was wrong.',
    seoTitle: 'Live Classes and Attendance',
    seoDescription:
      'Live sessions on your timetable, joined from the course, with an attendance register whose rules you define and a regularisation request behind it.',
    apiModule: 'live',
    routes: 20,
    completeness: 72,
    does: [
      { title: 'Sessions and joining', body: 'On the timetable, in the course, in the learner’s own list.' },
      { title: 'An attendance register', body: 'Per session and per course, with rules that define what counts.' },
      { title: 'Regularisation', body: 'A learner disputes a mark; somebody with the authority decides; both are recorded.' },
    ],
    mechanism: {
      title: 'Attendance rules are data, not code',
      body:
        'What counts as present — minutes attended, joined-by time, whether a late join is partial — is configuration per institute. A hard-coded threshold is the fastest way to make a product unusable for the second customer.',
    },
    keys: ['live.session.view', 'live.session.join', 'live.attendance.view', 'live.regularization.decide'],
    notBuilt: [
      'A meeting-provider adapter — you paste a Zoom, Meet, Teams or Jitsi link',
      'Recording ingestion',
      'In-class polls',
    ],
    roles: ['Teacher', 'Student', 'Institute Admin'],
    related: ['learning-delivery', 'batches-and-enrollment'],
    photo: {
      src: '/images/pages/module-live-classes-and-attendance.jpg',
      alt: 'Two staff members comparing a printed timetable pinned to a corridor notice board.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'batches-and-enrollment',
    cluster: 'delivery-and-engagement',
    title: 'Batches & enrolment',
    h1: 'Cohorts, timetables and a waitlist that moves',
    lead:
      'A time-boxed group moving through a course together: members, a timetable, a seat limit, and a waitlist that promotes somebody when a seat opens.',
    seoTitle: 'Batches, Timetables and Enrolment',
    seoDescription:
      'Cohorts moving through a course together: members, timetables, seat limits that refuse out loud, a waitlist that promotes, and a guardian view.',
    apiModule: 'learn',
    routes: 50,
    completeness: 72,
    does: [
      { title: 'Batches and members', body: 'With a transfer that moves a learner without losing their progress.' },
      { title: 'Timetables', body: 'What happens when, visible to everybody who needs it.' },
      { title: 'Waitlists', body: 'A seat opens, somebody is promoted, and both of them are told.' },
      { title: 'Invite codes', body: 'For the cohort that arrives all at once.' },
      { title: 'A guardian view', body: 'A parent sees their own children’s courses and marks, read-only by construction.' },
    ],
    mechanism: {
      title: 'A seat limit that refuses out loud',
      body:
        'Enrolling past a plan’s seat quota fails with a message naming the limit, rather than succeeding quietly and reconciling later. The same refusal reaches the counsellor converting an application — which is why converting is two acts.',
    },
    keys: ['learn.batch.view', 'learn.enrollment.manage', 'learn.invite.create', 'identity.guardian.manage'],
    notBuilt: ['Prerequisite enforcement', 'Self-service transfer'],
    roles: ['Institute Admin', 'Teacher', 'Parent'],
    related: ['learning-delivery', 'admissions-crm'],
  },
  {
    slug: 'assessments',
    cluster: 'assessment-and-outcomes',
    title: 'Assessments',
    h1: 'Marks that stand up',
    lead:
      'Online exams from a question bank: papers with sections, attempts, an anonymised marking queue, and item analysis that names the problem question.',
    seoTitle: 'Online Exams and Assessments',
    seoDescription:
      'Question banks, papers with sections, attempts, an anonymised marking queue, and item analysis that names the question that was the problem.',
    apiModule: 'assess',
    routes: 42,
    completeness: 76,
    does: [
      { title: 'Question banks', body: 'Reused across papers and terms, which is the whole reason to have one.' },
      { title: 'Papers with sections and targets', body: 'Set to a course, a batch or a person.' },
      { title: 'Attempts', body: 'One learner run, with its own state machine and its own audit trail.' },
      { title: 'An anonymised marking queue', body: 'It drops anything already marked, so two markers cannot collide.' },
      { title: 'Item analysis', body: 'Which questions discriminated and which were noise.' },
      { title: 'Integrity signals', body: 'What a cooperating browser reported, shown to a human.' },
    ],
    mechanism: {
      title: 'Signals, not proctoring',
      body:
        'No camera, no automatic verdict, nothing that acts on its own. The browser reports what it can, the candidate is told while it happens, and a human marker sees the signals with the caveat on the same screen. An automated cheating verdict from a browser event is a false accusation waiting for a lawyer.',
    },
    keys: ['assess.question.view', 'assess.assessment.publish', 'assess.attempt.evaluate', 'assess.result.view'],
    notBuilt: ['Third-party proctoring integration', 'Every one of the eleven designed question types'],
    roles: ['Teacher', 'Academic Head', 'Student'],
    related: ['assignments-and-grading', 'certificates'],
    photo: {
      src: '/images/pages/module-assessments.jpg',
      alt: 'Rows of empty exam desks, a single desk in the foreground holding an answer sheet and a pencil.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'assignments-and-grading',
    cluster: 'assessment-and-outcomes',
    title: 'Assignments & grading',
    h1: 'A rubric, so two markers agree',
    lead:
      'Assignments with criteria and levels, submissions, per-criterion marks, and a gradebook with scales, bands and overrides that carry a reason.',
    seoTitle: 'Assignments, Rubrics and Grading',
    seoDescription:
      'Rubrics with criteria and levels, per-criterion marks, and a gradebook with scales, bands and overrides that each carry a reason and an audit entry.',
    apiModule: 'assign',
    routes: 16,
    completeness: 68,
    does: [
      { title: 'Rubrics', body: 'Criteria and levels, defined once, applied per submission.' },
      { title: 'Submissions', body: 'With marks recorded against the criterion, not just a total.' },
      { title: 'Grade categories and scales', body: 'What an A means is the institute’s statement, so it is the institute’s setting.' },
      { title: 'Overrides with a reason', body: 'With an audit entry, because a changed grade is the thing somebody will ask about.' },
    ],
    mechanism: {
      title: 'A grade scale belongs to the institute, not to the teacher',
      body:
        'Grade scales sit behind a permission teachers and academic heads deliberately do not hold. A scale applies to courses they do not teach, so letting one redefine an A would silently re-grade another department — a small decision that only shows up in the second year.',
    },
    keys: ['assign.assignment.view', 'assign.submission.grade', 'grade.grade.update', 'grade.grade.manage'],
    notBuilt: ['Plagiarism detection', 'Transcripts'],
    roles: ['Teacher', 'Academic Head'],
    related: ['assessments', 'certificates'],
    photo: {
      src: '/images/pages/module-assignments-and-grading.jpg',
      alt: 'A student writing in a notebook at a wooden desk.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'certificates',
    cluster: 'assessment-and-outcomes',
    title: 'Certificates',
    h1: 'Verifiable by a stranger',
    lead:
      'Issued from a template, revocable, and checkable by anyone holding the code at a public URL with no account at all.',
    seoTitle: 'Verifiable Digital Certificates',
    seoDescription:
      'Issued from a template, revocable, and checkable by anyone holding the code at a public URL with no account — with different words for unknown and revoked.',
    apiModule: 'cert',
    routes: 9,
    completeness: 55,
    does: [
      { title: 'Templates', body: 'Your wording, your marks, your signatures block.' },
      { title: 'Issuance and revocation', body: 'Both audited; a revoked certificate says so rather than vanishing.' },
      { title: 'Public verification', body: 'One URL, no login, and a different answer for “not found” and “withdrawn”.' },
    ],
    mechanism: {
      title: 'Not found and withdrawn are different words on purpose',
      body:
        'An employer checking a code needs to know which one they have. A single “invalid” would let a revoked credential read as a typo, and a forged one read as withdrawn. The page renders exactly what the API returns, and nothing else.',
    },
    keys: ['cert.template.manage', 'cert.certificate.issue', 'cert.certificate.own'],
    notBuilt: ['Digital signatures', 'Bulk issuance from the interface'],
    roles: ['Institute Admin', 'Student'],
    related: ['assessments', 'placement-and-interviews'],
    photo: {
      src: '/images/pages/module-certificates.jpg',
      alt: 'A staff member handing a certificate to a student at a small ceremony.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'fees-and-finance',
    cluster: 'money-and-people',
    title: 'Fees & finance',
    h1: 'Today’s collections, not last month’s',
    lead:
      'Fee management for an institute: plans, invoices, tax, coupons, scholarships, payments and credit notes — every amount an integer in minor units.',
    seoTitle: 'Fee Management and Invoicing',
    seoDescription:
      'Fee plans, invoices, tax, coupons, scholarships, payments and credit notes, with an aging report — every amount an integer in minor units.',
    apiModule: 'finance',
    routes: 25,
    completeness: 62,
    does: [
      { title: 'Fee plans and pricing', body: 'What is charged, by whom, and on what schedule.' },
      { title: 'Invoices with lines', body: 'Issued, voided, refunded — each act recorded, none of them silent.' },
      { title: 'Coupons, scholarships and discounts', body: 'Applied to a line, visible on the invoice.' },
      { title: 'Payments and credit notes', body: 'Recorded against the invoice they settle.' },
      { title: 'Reports', body: 'Collections, outstanding, and the aging that tells you which is which.' },
    ],
    mechanism: {
      title: 'An invoice line copies its description at issue',
      body:
        'It does not read through to the course. Rename a course next term and last year’s invoice still says what was sold. Certificate wording and application details follow the same rule: a document that re-renders from live data quietly rewrites history.',
    },
    keys: ['finance.invoice.issue', 'finance.invoice.refund', 'finance.payment.record', 'finance.pricing.manage'],
    notBuilt: [
      'A payment-gateway adapter — you can raise and reconcile an invoice, not take a card',
      'Dunning',
      'Multi-currency conversion',
    ],
    roles: ['Finance Officer', 'Institute Admin', 'Student'],
    related: ['batches-and-enrollment', 'staff-and-hr'],
    photo: {
      src: '/images/pages/module-fees-and-finance.jpg',
      alt: 'A ledger-style spreadsheet printout on a wooden desk beside a closed laptop.',
      caption: 'Representative photography — not a captured screen, not a real institute’s data.',
    },
  },
  {
    slug: 'staff-and-hr',
    cluster: 'money-and-people',
    title: 'Staff & HR',
    h1: 'The people who run the institute',
    lead: 'Staff profiles, leave types and balances, requests and approvals, the staff register, and holidays.',
    seoTitle: 'Staff Records and Leave Management',
    seoDescription:
      'Staff profiles, leave types and balances, requests and approvals, a staff register and holiday calendars. Records, not payroll — deliberately.',
    apiModule: 'hr',
    routes: 24,
    completeness: 55,
    does: [
      { title: 'Staff profiles', body: 'Records, not payroll.' },
      { title: 'Leave', body: 'Types, balances, requests, approvals — everybody sees their own.' },
      { title: 'A staff register', body: 'Attendance for the people who teach, not only for the people who learn.' },
      { title: 'Holiday calendars', body: 'Which the leave balance actually reads.' },
    ],
    mechanism: {
      title: 'Everybody’s leave screen is the same screen',
      body:
        'It is gated on holding your own leave, not on being able to approve one; the approval queue is simply empty for anybody who cannot decide. A separate manager screen would mean two places for the same fact to disagree.',
    },
    keys: ['hr.staff.view', 'hr.leave.own', 'hr.leave.decide', 'hr.attendance.view'],
    notBuilt: ['Payroll processing', 'Statutory filing — deliberately, and permanently'],
    roles: ['HR Manager', 'Institute Admin', 'Teacher'],
    related: ['fees-and-finance', 'placement-and-interviews'],
    photo: {
      src: '/images/pages/module-staff-and-hr.jpg',
      alt: 'A facilitator leading a small group training session around a table.',
      caption: 'Representative photography.',
    },
  },
  {
    slug: 'placement-and-interviews',
    cluster: 'money-and-people',
    title: 'Placement & interviews',
    h1: 'The outcome you are actually judged on',
    lead:
      'Placement drives, openings, applications, interview panels and scorecards — with a practice interview the learner runs on their own first.',
    seoTitle: 'Placement and Interview Management',
    seoDescription:
      'Drives, openings, applications, interview panels and scorecards — with a practice interview the learner runs privately before any of it counts.',
    apiModule: 'placement',
    routes: 21,
    completeness: 60,
    does: [
      { title: 'Drives and job posts', body: 'Who is hiring, for what, and by when.' },
      { title: 'Applications', body: 'From your own learners, against your own criteria.' },
      { title: 'Interview panels and scorecards', body: 'Structured ratings rather than a remembered impression.' },
      { title: 'Practice interviews', body: 'Private rehearsal, with no staff-facing twin, deliberately.' },
    ],
    mechanism: {
      title: 'A learner sees the openings they can apply for',
      body:
        'Not every opening. A list of roles you cannot apply for is a rejection with extra steps, so eligibility is applied at the query — the same way search results are permission-trimmed.',
    },
    keys: ['placement.job.view', 'placement.drive.manage', 'interview.interview.view', 'interview.scorecard.submit'],
    notBuilt: ['A recruiter portal', 'Offer letters'],
    roles: ['Placement Officer', 'Student'],
    related: ['certificates', 'staff-and-hr'],
    photo: {
      src: '/images/pages/module-placement-and-interviews.jpg',
      alt: 'Two young adults working through an exercise together at a shared desk.',
      caption: 'Representative photography.',
    },
  },
];

export function moduleBySlug(slug: string): ModuleDoc | undefined {
  return modules.find((m) => m.slug === slug);
}

export function modulesByCluster(cluster: string): ModuleDoc[] {
  return modules.filter((m) => m.cluster === cluster);
}
