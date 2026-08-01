/**
 * The fourteen module pages.
 *
 * Every `does` and `notBuilt` entry traces to docs/01-PRODUCT-TRUTH.md §4, which was derived
 * from the working tree — not from the product's design docs, which describe it as intended.
 * `completeness` is the product's own honest figure against its SRS; a module under 65 renders
 * its gap above the fold, and copy may never describe a module as more complete than its number.
 */

export interface ModuleDoc {
  slug: string;
  cluster: string;
  title: string;
  h1: string;
  lead: string;
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
}

export const modules: ModuleDoc[] = [
  {
    slug: 'admissions-crm',
    cluster: 'admissions-and-growth',
    title: 'Admissions CRM',
    h1: 'Every enquiry, on one board',
    lead:
      'An enquiry arrives from your website, a phone call or a walk-in and lands on a board with an owner, a timeline and a follow-up date. Nothing goes cold because nobody remembered.',
    apiModule: 'crm',
    routes: 32,
    completeness: 72,
    does: [
      {
        title: 'A pipeline whose names are yours',
        body:
          'Call the first column Enquiry, or Qualified, or anything else. Nothing in the code reads the label — open, won and lost are the facts every funnel counts, so your conversion rate survives your vocabulary.',
      },
      {
        title: 'Duplicates suggested, never swallowed',
        body:
          'The same person really does enquire twice — a form on Monday, a call on Thursday. Matching is deliberately loose (email or phone, phone reduced to its last ten digits) and its only output is a suggestion to merge.',
      },
      {
        title: 'Assignment that cannot collide',
        body:
          'Round-robin runs off a cursor stored on the rule and incremented in the database, so two enquiries a second apart cannot land on the same counsellor. A rule naming somebody who has left leaves the enquiry unassigned.',
      },
      {
        title: 'A timeline written by the system',
        body:
          'Stage moves, assignments and calls are appended by the software, not typed from memory. A history assembled only from what somebody remembered to record is not a history.',
      },
      {
        title: 'Applications, and the two honest outcomes of accepting one',
        body:
          'Already a member? Enrolled. Not yet? Invited — and the application says so until they accept. Press it twice and nothing doubles. A seat limit refuses out loud rather than pretending.',
      },
      {
        title: 'Web-to-lead, hardened',
        body:
          'A public endpoint your own site can post to. It forces the source, has no field for stage or owner, returns a fixed acknowledgement so it cannot be asked whether an email is on file, and answers identically for an unknown institute so it cannot enumerate them.',
      },
    ],
    mechanism: {
      title: 'Why a lost enquiry needs a reason and a won one refuses to have one',
      body:
        '“Why did we not get this?” is the most useful field in an admissions system, and a reason recorded against a win means nothing. The close date is stamped on the way into a closed stage and cleared on the way back out, because a reopened enquiry that still reports a close date lies to every cycle-time report. And the conversion rate is won ÷ closed, never won ÷ everything — otherwise it falls every time marketing does its job — and it is null with nothing closed, because a rate over zero decisions is not nought per cent.',
    },
    keys: ['crm.lead.view', 'crm.lead.assign', 'crm.lead.merge', 'crm.application.decide', 'crm.pipeline.manage'],
    notBuilt: ['Campaign attribution', 'Email sequences', 'SMS and WhatsApp channels', 'Lead scoring'],
    roles: ['Admissions Counsellor', 'Institute Admin'],
    related: ['institute-website', 'batches-and-enrollment'],
  },
  {
    slug: 'institute-website',
    cluster: 'admissions-and-growth',
    title: 'Your public website',
    h1: 'A website that knows what you teach',
    lead:
      'Pages, posts, events and a gallery on your own domain, authored by the people who run the institute rather than by whoever has the FTP password.',
    apiModule: 'cms',
    routes: 24,
    completeness: 60,
    does: [
      { title: 'Pages and posts', body: 'Markdown source, published on your slug or your own domain.' },
      { title: 'Events and a gallery', body: 'What is on, and photographs with the caption the upload required.' },
      { title: 'A sitemap that is generated', body: 'Not maintained by hand, and therefore not wrong.' },
      {
        title: 'Enquiries that land in the CRM',
        body: 'Your site posts to the same public capture endpoint this site uses. One enquiry, one board.',
      },
    ],
    mechanism: {
      title: 'Author text never becomes markup',
      body:
        'The renderer takes Markdown source and emits React elements. It does not emit HTML at any point, which means nothing an author types — deliberately or by pasting from somewhere else — can become script in a visitor’s browser. That is a stronger guarantee than sanitising, because there is no sanitiser to have a gap in.',
    },
    keys: ['cms.site.view', 'cms.page.publish', 'cms.post.publish'],
    notBuilt: ['A forms builder', 'An SEO editor', 'Themes beyond your branding'],
    roles: ['Institute Admin'],
    related: ['admissions-crm', 'courses-and-curriculum'],
  },
  {
    slug: 'courses-and-curriculum',
    cluster: 'academics-and-content',
    title: 'Courses & curriculum',
    h1: 'Nothing ships until somebody says so',
    lead:
      'Programme, course, module, unit, lesson — versioned, approved before publishing, and restorable with a diff you can read.',
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
        'Restoring a version does not patch the live course — it rebuilds its lessons from the stored snapshot. That is the right behaviour, and it has a sharp edge: any field the snapshot omits is erased on restore. When written lesson bodies were added, carrying them through publish → restore → diff was the work, not adding the column.',
    },
    keys: ['course.course.view', 'course.course.publish', 'course.version.restore', 'course.category.manage'],
    notBuilt: ['SCORM and xAPI packages', 'Prerequisite graphs'],
    roles: ['Academic Head', 'Content Author', 'Teacher'],
    related: ['media-and-content', 'ai-assistance'],
  },
  {
    slug: 'media-and-content',
    cluster: 'academics-and-content',
    title: 'Media & content',
    h1: 'Video that is yours, wherever it lives',
    lead:
      'Upload, chapters, captions and signed-URL playback, over a storage port that speaks local disk, S3-compatible or Azure Blob.',
    apiModule: 'media',
    routes: 14,
    completeness: 70,
    does: [
      { title: 'Upload and playback', body: 'Signed URLs, so a link that leaks stops working.' },
      { title: 'Chapters and captions', body: 'Authored per asset; captions are a first-class record, not a sidecar file.' },
      { title: 'Three storage drivers', body: 'local-disk, s3 (which covers MinIO and R2) and azure-blob, chosen by an environment variable.' },
    ],
    mechanism: {
      title: 'The port is the point',
      body:
        'No feature module imports a cloud SDK. Storage is an interface with three implementations, selected at boot. That is what makes “move your data” a connection-string change rather than a project, and it is the same shape used for mail, search, AI and cache.',
    },
    keys: ['content.media.upload', 'content.media.view', 'content.caption.manage'],
    notBuilt: [
      'Transcoding and HLS — the port exists, the worker does not',
      'DRM',
      'Automatic transcription',
    ],
    roles: ['Content Author', 'Teacher'],
    related: ['courses-and-curriculum', 'learning-delivery'],
  },
  {
    slug: 'ai-assistance',
    cluster: 'academics-and-content',
    title: 'AI assistance',
    h1: 'Drafts, never decisions',
    lead:
      'Paste an outline, get a course structure. Ask for a lesson, get Markdown you can edit. Nothing an AI produces reaches a course until a human presses apply.',
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
        'OpenAI, Azure OpenAI, Anthropic or disabled, chosen by an environment variable. When it is disabled the feature is hidden rather than broken — a greyed-out button that cannot work is a support ticket. Token budgets are per tenant and generations are cached, so an institute cannot be surprised by a bill it did not authorise.',
    },
    keys: ['ai.generate.course', 'ai.generate.lesson', 'ai.interview.practice'],
    notBuilt: ['AI tutoring chat', 'AI grading', 'Transcription', 'Text to speech'],
    roles: ['Teacher', 'Academic Head', 'Content Author'],
    related: ['courses-and-curriculum', 'assessments'],
  },
  {
    slug: 'learning-delivery',
    cluster: 'delivery-and-engagement',
    title: 'Learning delivery',
    h1: 'Built for a bad connection',
    lead:
      'The player, progress, notes, questions — and progress captured with no signal at all, replayed in order when it comes back.',
    apiModule: 'learn',
    routes: 50,
    completeness: 80,
    does: [
      { title: 'Resume where they left off', body: 'The single most-used feature in any LMS, and it works on a phone.' },
      { title: 'Notes and questions', body: 'Against the lesson, with a moderation queue for staff.' },
      { title: 'A catalogue that respects permissions', body: 'A learner sees what they may enrol in, not everything.' },
      { title: 'Offline progress', body: 'Queued on the device, replayed in order, idempotently, last write wins.' },
      { title: 'Installable', body: 'A PWA: it goes on a home screen without an app store.' },
    ],
    mechanism: {
      title: 'Why the offline queue replays in order and why that matters',
      body:
        'Progress events are queued in IndexedDB with their original sequence and replayed through one endpoint that is idempotent. Out-of-order replay would let a stale “25% watched” overwrite a later “complete”; a non-idempotent one would double-count a retry. Neither is theoretical on a train journey through a tunnel, which is where a lot of this product’s learning happens.',
    },
    keys: ['learn.course.access', 'learn.progress.view', 'learn.qa.moderate', 'learn.enrollment.manage'],
    notBuilt: ['Downloadable offline media', 'A native app — deliberately'],
    roles: ['Student', 'Teacher', 'Parent'],
    related: ['live-classes-and-attendance', 'batches-and-enrollment'],
  },
  {
    slug: 'live-classes-and-attendance',
    cluster: 'delivery-and-engagement',
    title: 'Live classes & attendance',
    h1: 'The class, and the register that reconciles to it',
    lead:
      'Sessions on your schedule, joined from the course, with an attendance register and a regularisation request for the day the register was wrong.',
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
  },
  {
    slug: 'batches-and-enrollment',
    cluster: 'delivery-and-engagement',
    title: 'Batches & enrolment',
    h1: 'Cohorts, timetables and a waitlist that moves',
    lead:
      'A batch is a time-boxed group moving through a course together. It has members, a timetable, a seat limit and a waitlist that promotes somebody when a seat opens.',
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
        'Enrolling past a plan’s seat quota fails with a message naming the limit, rather than silently succeeding and reconciling later. The same refusal reaches the admissions counsellor converting an application — which is why converting is two acts, and why nothing is caught around the invitation step.',
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
      'Question banks, papers with sections, attempts, an anonymised marking queue, and item analysis that tells you which question was the problem.',
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
        'There is no camera, no automatic verdict and nothing that acts on its own. The browser reports what it can — focus changes, that sort of thing — the candidate is told while it is happening, and a human marker sees the signals with the caveat printed on the same screen. An automated cheating verdict from a browser event is a false accusation waiting for a lawyer, and we would rather ship the honest version.',
    },
    keys: ['assess.question.view', 'assess.assessment.publish', 'assess.attempt.evaluate', 'assess.result.view'],
    notBuilt: ['Third-party proctoring integration', 'Every one of the eleven designed question types'],
    roles: ['Teacher', 'Academic Head', 'Student'],
    related: ['assignments-and-grading', 'certificates'],
  },
  {
    slug: 'assignments-and-grading',
    cluster: 'assessment-and-outcomes',
    title: 'Assignments & grading',
    h1: 'A rubric, so two markers agree',
    lead:
      'Assignments with criteria and levels, submissions, per-criterion marks, and a gradebook with scales, bands and overrides that carry a reason.',
    apiModule: 'assign',
    routes: 16,
    completeness: 68,
    does: [
      { title: 'Rubrics', body: 'Criteria and levels, defined once, applied per submission.' },
      { title: 'Submissions', body: 'With the marks recorded against the criterion, not just a total.' },
      { title: 'Grade categories and scales', body: 'What an A means is the institute’s statement, so it is the institute’s setting.' },
      { title: 'Overrides with a reason', body: 'And an audit entry, because a changed grade is the one thing somebody will ask about.' },
    ],
    mechanism: {
      title: 'A grade scale belongs to the institute, not to the teacher',
      body:
        'Grade scales sit behind a permission that teachers and academic heads deliberately do not hold. A scale applies to courses they do not teach, so letting one teacher redefine an A would silently re-grade another department. It is a small decision that only shows up in the second year of use.',
    },
    keys: ['assign.assignment.view', 'assign.submission.grade', 'grade.grade.update', 'grade.grade.manage'],
    notBuilt: ['Plagiarism detection', 'Transcripts'],
    roles: ['Teacher', 'Academic Head'],
    related: ['assessments', 'certificates'],
  },
  {
    slug: 'certificates',
    cluster: 'assessment-and-outcomes',
    title: 'Certificates',
    h1: 'Verifiable by a stranger',
    lead:
      'Issued from a template, revocable, and checkable by anyone holding the code at a public URL with no account at all.',
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
        'An employer checking a code needs to know which one they are looking at. A single “invalid” for both would let a real, revoked credential read as a typo — and would let a forged one read the same as a withdrawn one. The page renders exactly what the API returns, and deliberately nothing else.',
    },
    keys: ['cert.template.manage', 'cert.certificate.issue', 'cert.certificate.own'],
    notBuilt: ['Digital signatures', 'Bulk issuance from the interface'],
    roles: ['Institute Admin', 'Student'],
    related: ['assessments', 'placement-and-interviews'],
  },
  {
    slug: 'fees-and-finance',
    cluster: 'money-and-people',
    title: 'Fees & finance',
    h1: 'Today’s collections, not last month’s',
    lead:
      'Fee plans, invoices, tax, coupons, scholarships, payments and credit notes — every amount an integer in minor units with an explicit currency.',
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
        'It does not read through to the course. Rename a course next term and last year’s invoice still says what was actually sold. The same rule governs certificate wording and application details: a document that re-renders from live data is a document that quietly rewrites history.',
    },
    keys: ['finance.invoice.issue', 'finance.invoice.refund', 'finance.payment.record', 'finance.pricing.manage'],
    notBuilt: [
      'A payment-gateway adapter — you can raise and reconcile an invoice, not take a card',
      'Dunning',
      'Multi-currency conversion',
    ],
    roles: ['Finance Officer', 'Institute Admin', 'Student'],
    related: ['batches-and-enrollment', 'staff-and-hr'],
  },
  {
    slug: 'staff-and-hr',
    cluster: 'money-and-people',
    title: 'Staff & HR',
    h1: 'The people who run the institute',
    lead: 'Staff profiles, leave types and balances, requests and approvals, the staff register, and holidays.',
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
        'It is gated on holding your own leave, not on being able to approve one. The approval queue on it is simply empty for anybody who cannot decide. A separate manager screen would mean two places for the same fact to disagree.',
    },
    keys: ['hr.staff.view', 'hr.leave.own', 'hr.leave.decide', 'hr.attendance.view'],
    notBuilt: ['Payroll processing', 'Statutory filing — deliberately, and permanently'],
    roles: ['HR Manager', 'Institute Admin', 'Teacher'],
    related: ['fees-and-finance', 'placement-and-interviews'],
  },
  {
    slug: 'placement-and-interviews',
    cluster: 'money-and-people',
    title: 'Placement & interviews',
    h1: 'The outcome you are actually judged on',
    lead:
      'Drives, openings, applications, interview panels and scorecards — with a practice interview the learner can run on their own first.',
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
        'Not every opening. A list of roles you are not eligible for is not an opportunity, it is a rejection with extra steps — so eligibility is applied at the query, the same way search results are permission-trimmed.',
    },
    keys: ['placement.job.view', 'placement.drive.manage', 'interview.interview.view', 'interview.scorecard.submit'],
    notBuilt: ['A recruiter portal', 'Offer letters'],
    roles: ['Placement Officer', 'Student'],
    related: ['certificates', 'staff-and-hr'],
  },
];

export function moduleBySlug(slug: string): ModuleDoc | undefined {
  return modules.find((m) => m.slug === slug);
}

export function modulesByCluster(cluster: string): ModuleDoc[] {
  return modules.filter((m) => m.cluster === cluster);
}
