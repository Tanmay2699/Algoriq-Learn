/**
 * The launch article set.
 *
 * Six, each chosen because it ranks for a real query *and* answers a real objection. Every one
 * is written from something we actually built — an article we cannot back with a file is an
 * article we do not publish.
 *
 * Body is structured rather than MDX so that it typechecks, renders through the same
 * primitives as the rest of the site, and cannot contain markup an author did not intend.
 */

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string; id: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'code'; text: string }
  | { kind: 'note'; text: string };

export interface Article {
  slug: string;
  title: string;
  description: string;
  /** Only where the on-page title is too long to be a search title. */
  seoTitle?: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  objection: string;
  body: Block[];
}

export const articles: Article[] = [
  {
    slug: 'migrating-from-spreadsheets',
    title: 'How to migrate an institute off spreadsheets',
    description:
      'An LMS migration plan in four steps: what to move first, what to leave behind, and why the order matters more than the tooling.',
    tags: ['migration', 'operations'],
    publishedAt: '2026-07-31',
    readingMinutes: 7,
    objection: 'Can I migrate?',
    body: [
      {
        kind: 'p',
        text: 'Most migrations fail the same way: somebody moves everything at once, finds four columns nobody can explain, and stops. Move what is already structured, and leave the archaeology for later — or forever.',
      },
      { kind: 'h2', text: 'Move people first, and only people', id: 'people' },
      {
        kind: 'p',
        text: 'People are the only thing everything else references, so import them before courses, before fees, before anything. Algoryq Learn imports people from CSV with a per-row error report rather than an all-or-nothing failure, so a bad phone number in row 400 does not cost you the other 399.',
      },
      {
        kind: 'p',
        text: 'One decision before you start: people are added by invitation. No route lets an administrator set somebody else’s password, deliberately — so an import creates invitations, and accounts exist once people accept them.',
      },
      { kind: 'h2', text: 'Then courses, then the current term', id: 'courses' },
      {
        kind: 'ul',
        items: [
          'Import the course catalogue. Titles, categories and structure — not content.',
          'Create the batches that are running now. Not last year’s.',
          'Enrol the learners who are actually attending.',
          'Stop. Run one term. Then decide what else is worth moving.',
        ],
      },
      { kind: 'h2', text: 'What to leave behind', id: 'leave' },
      {
        kind: 'p',
        text: 'Historic attendance, closed enquiries from two years ago, the fee ledger from before your current pricing. Keep the spreadsheet read-only in a folder. The cost of importing data nobody will query again is not the import — it is that every report afterwards has to explain a discontinuity.',
      },
      { kind: 'h2', text: 'The fees exception', id: 'fees' },
      {
        kind: 'p',
        text: 'Outstanding invoices are the one historic thing worth carrying, because somebody will chase them. Import them as issued invoices with their real dates, not as new ones — an invoice line copies its description at issue precisely so last year’s invoice still says what was sold.',
      },
      {
        kind: 'note',
        text: 'There is no payment-gateway adapter yet, so an imported outstanding invoice is one you chase and then record a payment against. If your plan depended on learners paying online during migration, that is not available today.',
      },
    ],
  },
  {
    slug: 'rbac-for-schools',
    title: 'RBAC for schools: roles, permissions and scopes',
    seoTitle: 'RBAC for Schools, Explained',
    description:
      'Role-based access control for an institute, explained without jargon — and why a role name should never appear anywhere in the code.',
    tags: ['security', 'operations'],
    publishedAt: '2026-07-31',
    readingMinutes: 9,
    objection: 'Can I control who sees what?',
    body: [
      {
        kind: 'p',
        text: 'Most software gives you three roles and hopes your institute is shaped like the one the developers imagined. It never is. The fix is not more roles; it is separating the two things that get conflated.',
      },
      { kind: 'h2', text: 'A permission is an act, not a person', id: 'permission' },
      {
        kind: 'p',
        text: 'A permission is a key like course.course.publish or finance.invoice.refund: module, resource, action. There are 272, each described for a school administrator rather than an engineer, because the person choosing them is not a developer.',
      },
      { kind: 'h2', text: 'A role is a named bundle of keys', id: 'role' },
      {
        kind: 'p',
        text: 'Teacher, Academic Head, Finance Officer. Eleven editable templates ship, and each institute gets its own copies rather than sharing ours. The important part: nothing in the code reads a role’s name. A guard asks "does this person hold finance.invoice.refund?", never "is this person a Finance Officer?".',
      },
      {
        kind: 'p',
        text: 'That is what lets you invent a role we never thought of — a Vice Principal who approves courses but not fees, a part-time counsellor who can add enquiries but not spend a seat — without waiting for us.',
      },
      { kind: 'h2', text: 'A scope is how far it reaches', id: 'scope' },
      {
        kind: 'ul',
        items: [
          'GLOBAL — the platform operator.',
          'TENANT — the whole institute.',
          'BRANCH or DEPARTMENT — one campus, one faculty.',
          'COURSE or BATCH — what they teach.',
          'RECORD — their own row, which is what a learner and a parent hold.',
        ],
      },
      { kind: 'h2', text: 'Why the frontend gating is not the security', id: 'gating' },
      {
        kind: 'p',
        text: 'Hiding a button is a courtesy, not a boundary. Every server route carries its own permission check or an explicit public marker, and a coverage check fails the build otherwise. If the interface hid a button and the server did not check, anybody with a browser console would find it in an afternoon.',
      },
      {
        kind: 'note',
        text: 'You can see the whole catalogue on the security page — all 272 keys, filterable, with the description each one carries.',
      },
    ],
  },
  {
    slug: 'assessment-integrity-without-a-camera',
    title: 'Assessment integrity without a camera',
    description:
      'Online exam integrity without proctoring software: what a browser can honestly report, what it cannot, and what actually reduces cheating.',
    tags: ['assessment', 'ethics'],
    publishedAt: '2026-07-31',
    readingMinutes: 8,
    objection: 'How do you stop cheating?',
    body: [
      {
        kind: 'p',
        text: 'The obvious answer is a camera and an algorithm. We think it is the wrong answer, and this is the argument.',
      },
      { kind: 'h2', text: 'What a browser can honestly report', id: 'signals' },
      {
        kind: 'p',
        text: 'A cooperating browser can report that a tab lost focus, a window was resized, a paste happened. Each has an innocent explanation — a notification, a screen reader, a phone call — and none is evidence of anything alone.',
      },
      { kind: 'h2', text: 'What we do with them', id: 'what' },
      {
        kind: 'ul',
        items: [
          'The candidate is told, while it is happening, that the signals are being recorded.',
          'A human marker sees them, with the caveat printed on the same screen.',
          'Nothing is automatic. No score is adjusted, no attempt is voided, no verdict is produced.',
        ],
      },
      { kind: 'h2', text: 'Why not a camera', id: 'camera' },
      {
        kind: 'p',
        text: 'Camera proctoring asks a learner to install surveillance on a device they own, in a room they live in, and to accept a false-accusation rate from a model that has never met them. The literature on differential false-positive rates by skin tone and disability is not comforting. Meanwhile the cheating it catches is the naive kind, which item analysis catches anyway.',
      },
      { kind: 'h2', text: 'What actually raises integrity', id: 'better' },
      {
        kind: 'ul',
        items: [
          'Question banks large enough that two learners see different papers.',
          'Item analysis, so a question everybody answered correctly gets retired.',
          'Anonymised marking, so the marker does not know whose paper it is.',
          'Rubrics, so two markers agree.',
          'An audit trail on every grade override, with a reason.',
        ],
      },
      {
        kind: 'note',
        text: 'If your accreditation requires camera proctoring, we do not have it and are not planning it. That is a real disqualifier, and better known now.',
      },
    ],
  },
  {
    slug: 'buying-accessible-software',
    title: 'Buying accessible software: 9 questions to ask',
    seoTitle: 'Accessible Software: 9 Questions to Ask',
    description:
      'Nine WCAG procurement questions that separate a real accessibility programme from a paragraph in a sales deck — with our own answers.',
    tags: ['accessibility', 'procurement'],
    publishedAt: '2026-07-31',
    readingMinutes: 6,
    objection: 'Will this pass our procurement review?',
    body: [
      {
        kind: 'p',
        text: 'Every vendor says their product is accessible. These questions tell you whether it is, in the order that gets you there quickest.',
      },
      { kind: 'h2', text: 'The nine questions', id: 'questions' },
      {
        kind: 'ul',
        items: [
          '1. Which WCAG version and level, and is the claim full or partial conformance? (Anybody claiming full conformance for a large product is either mistaken or has not looked.)',
          '2. Can I see the conformance statement, and does it list known issues with dates?',
          '3. Do automated accessibility checks fail your build, or are they a report somebody reads?',
          '4. At what viewport widths do those checks run? (If the answer does not include a phone width, the mobile experience has never been checked.)',
          '5. Which manual testing do you do, with which screen readers, and how often?',
          '6. Is there any drag-and-drop, and if so what is the keyboard path?',
          '7. What happens at 400 per cent zoom?',
          '8. How do you handle reduced-motion preferences?',
          '9. Who can I email about an accessibility problem, and what is the response commitment?',
        ],
      },
      { kind: 'h2', text: 'Our answers', id: 'ours' },
      {
        kind: 'p',
        text: 'WCAG 2.2 level AA, partial conformance with the exceptions listed. Automated checks fail the build, in the component library and the browser suite, at 360 pixels among other widths. Manual keyboard and screen-reader passes before a release. No drag-and-drop without a keyboard and a touch path — the admissions board uses a select and arrow buttons for that reason. Reduced motion is a designed rendering, not a stripped one.',
      },
      {
        kind: 'note',
        text: 'The full statement, including what still fails, is on the accessibility page. Four dated open items are more useful to you than a claim of perfection.',
      },
    ],
  },
  {
    slug: 'self-hosting-algoryq-learn',
    title: 'Self-hosting Algoryq Learn in an afternoon',
    description:
      'Self-host the whole LMS with one Docker compose file and three commands, no cloud account — and what you take on by running it yourself.',
    tags: ['operations', 'security'],
    publishedAt: '2026-07-31',
    readingMinutes: 6,
    objection: 'Where is my data?',
    body: [
      {
        kind: 'p',
        text: 'The whole platform boots from one compose file: API, worker, PostgreSQL, Redis, object storage, search and a mail catcher. No cloud account, no licence key, no phone-home.',
      },
      { kind: 'h2', text: 'The three commands', id: 'commands' },
      {
        kind: 'code',
        text: `docker compose up -d
pnpm db:migrate && pnpm db:rls && pnpm db:seed
pnpm --filter @akechi/api worker:dev`,
      },
      {
        kind: 'p',
        text: 'The second line is three steps for a reason. Migrations create the schema. Row-level security is applied separately, from the database catalogue, so a table added later is covered automatically — a policy living in one migration is a policy somebody forgets on the next table. The seed creates the permission catalogue, the role templates and, optionally, a demo institute.',
      },
      { kind: 'h2', text: 'The third line matters more than it looks', id: 'worker' },
      {
        kind: 'p',
        text: 'Email is written to a transactional outbox in the same transaction as the thing that caused it, then drained by a worker. Without the worker nothing is lost, but nothing is sent either. Run exactly one copy: its jobs claim no rows, so a second double-sends.',
      },
      { kind: 'h2', text: 'What you take on', id: 'responsibility' },
      {
        kind: 'ul',
        items: [
          'Backups, and — more importantly — a restore you have actually tested.',
          'TLS, and keeping it renewed.',
          'The database role split: the application connects as a role that is not the owner and holds no BYPASSRLS. Do not run it as the owner to make a problem go away; that is the problem.',
          'Upgrades, which are migrations you run.',
        ],
      },
      {
        kind: 'note',
        text: 'Every external dependency is a port with drivers: storage is local disk, S3-compatible or Azure Blob; mail is SMTP; search is Postgres or Meilisearch; AI is one of three providers, or off. No feature code imports a cloud SDK, which is what makes "move it" a connection-string change.',
      },
    ],
  },
  {
    slug: 'why-a-pwa',
    title: 'PWA vs native app for an LMS: the honest trade',
    seoTitle: 'PWA vs Native App for an LMS',
    description:
      'Why the LMS is an installable PWA rather than two native apps: what you lose, what you gain, and why the connection beats the app store.',
    tags: ['mobile', 'engineering'],
    publishedAt: '2026-07-31',
    readingMinutes: 5,
    objection: 'Do you have a mobile app?',
    body: [
      {
        kind: 'p',
        text: 'No — Algoryq Learn installs to a home screen as a progressive web app. That is a trade, and here are both sides of it.',
      },
      { kind: 'h2', text: 'What we give up', id: 'lose' },
      {
        kind: 'ul',
        items: [
          'A listing in the app stores, which some institutes want for legitimacy.',
          'Native push notifications on iOS beyond what the platform allows a web app.',
          'Background download of video for offline viewing.',
          'The particular feel of a platform-native navigation stack.',
        ],
      },
      { kind: 'h2', text: 'What we get', id: 'gain' },
      {
        kind: 'ul',
        items: [
          'One codebase, so a fix reaches every learner the same afternoon rather than after a review queue.',
          'No install friction for the learner who will not spend 80 MB of a 2 GB plan on your app.',
          'A 360-pixel-first design that is the same product an administrator uses on a laptop.',
          'Progress that survives no signal at all — queued on the device, replayed in order, idempotently.',
        ],
      },
      { kind: 'h2', text: 'The argument that decided it', id: 'decision' },
      {
        kind: 'p',
        text: 'For learners in this market the binding constraint is the connection, not the app store. A native app on a bad connection is a native app that spins. What actually improves their experience is the offline queue and the weight of the first paint — the same work either way.',
      },
      {
        kind: 'note',
        text: 'The service worker caches the offline page and nothing else. An API response is scoped to one person in one institute and a cache is shared by the device, so caching one would be a data leak wearing a performance improvement’s clothes.',
      },
    ],
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export const articleTags = [...new Set(articles.flatMap((a) => a.tags))].sort();
