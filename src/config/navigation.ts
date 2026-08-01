/**
 * The navigation registry — the single source of truth for the header, the footer, the
 * sitemap and the link checker. A page that is not reachable from here or from a parent
 * page's body is an orphan, and `pnpm links:check` fails on one.
 *
 * Mirrors the shape of the product's own `apps/web/src/config/navigation.ts`: routes live in
 * config, never inline in a component.
 */

export interface NavLink {
  href: string;
  label: string;
  /** One line, shown in the mega-menu and on hub pages. */
  blurb?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  links: NavLink[];
}

/** The seven product clusters (docs/01 §3). Order is the lifecycle, not the alphabet. */
export const clusters: (NavLink & { key: string; job: string; modules: number; routes: number })[] = [
  {
    key: 'admissions-and-growth',
    href: '/product/admissions-and-growth',
    label: 'Admissions & Growth',
    job: 'Fill your seats',
    blurb: 'Enquiries, pipelines, applications, your public site.',
    modules: 3,
    routes: 61,
  },
  {
    key: 'academics-and-content',
    href: '/product/academics-and-content',
    label: 'Academics & Content',
    job: 'Build what you teach',
    blurb: 'Courses, versions, approval, media, AI drafting.',
    modules: 3,
    routes: 57,
  },
  {
    key: 'delivery-and-engagement',
    href: '/product/delivery-and-engagement',
    label: 'Delivery & Engagement',
    job: 'Run the term',
    blurb: 'The player, batches, live classes, attendance, parents.',
    modules: 3,
    routes: 76,
  },
  {
    key: 'assessment-and-outcomes',
    href: '/product/assessment-and-outcomes',
    label: 'Assessment & Outcomes',
    job: 'Prove it happened',
    blurb: 'Question banks, marking, grades, verifiable certificates.',
    modules: 4,
    routes: 77,
  },
  {
    key: 'money-and-people',
    href: '/product/money-and-people',
    label: 'Money & People',
    job: 'Run the business',
    blurb: 'Fees, invoices, staff, leave, placement, interviews.',
    modules: 4,
    routes: 77,
  },
  {
    key: 'intelligence',
    href: '/product/intelligence',
    label: 'Intelligence',
    job: 'See it before it happens',
    blurb: 'Dashboards, reports, exports, search, dropout risk.',
    modules: 4,
    routes: 30,
  },
  {
    key: 'platform-and-trust',
    href: '/product/platform-and-trust',
    label: 'Platform & Trust',
    job: 'Standardise safely',
    blurb: 'Identity, permissions, audit, tenancy, webhooks.',
    modules: 10,
    routes: 119,
  },
];

export const solutions: NavLink[] = [
  {
    href: '/solutions/coaching-institutes',
    label: 'Coaching institutes',
    blurb: 'Admissions volume and assessment depth in one place.',
  },
  { href: '/solutions/schools', label: 'Schools', blurb: 'Parents, the register, and fees that reconcile.' },
  {
    href: '/solutions/universities',
    label: 'Universities',
    blurb: 'Programme structure, and an accessibility statement you can hand to procurement.',
  },
  {
    href: '/solutions/skilling-academies',
    label: 'Skilling academies',
    blurb: 'Placement is the product. So it is a module, not a spreadsheet.',
  },
  {
    href: '/solutions/corporate-l-and-d',
    label: 'Corporate L&D',
    blurb: 'Compliance certificates anyone can verify, and an audit trail behind them.',
  },
];

export const resources: NavLink[] = [
  { href: '/resources', label: 'Guides' },
  { href: '/compare', label: 'Comparisons' },
  { href: '/why-akechi', label: 'Why Akechi' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/** The header. Two CTAs live beside it and are not part of this list. */
export const header: { label: string; href?: string; menu?: 'product' | 'solutions' | 'resources' }[] = [
  { label: 'Product', menu: 'product' },
  { label: 'Solutions', menu: 'solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Security', href: '/security' },
  { label: 'Developers', href: '/developers' },
  { label: 'Resources', menu: 'resources' },
];

export const footer: NavGroup[] = [
  {
    key: 'product',
    label: 'Product',
    links: [
      { href: '/product', label: 'Overview' },
      { href: '/product/admissions-and-growth', label: 'Admissions & Growth' },
      { href: '/product/academics-and-content', label: 'Academics & Content' },
      { href: '/product/delivery-and-engagement', label: 'Delivery & Engagement' },
      { href: '/product/assessment-and-outcomes', label: 'Assessment & Outcomes' },
      { href: '/product/money-and-people', label: 'Money & People' },
      { href: '/product/intelligence', label: 'Intelligence' },
      { href: '/product/platform-and-trust', label: 'Platform & Trust' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    key: 'solutions',
    label: 'Solutions',
    links: [{ href: '/solutions', label: 'All solutions' }, ...solutions.map(({ href, label }) => ({ href, label }))],
  },
  {
    key: 'developers',
    label: 'Developers',
    links: [
      { href: '/developers', label: 'API reference' },
      { href: '/developers/webhooks', label: 'Webhooks' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/resources/self-hosting-akechi', label: 'Self-hosting' },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/resources', label: 'Resources' },
      { href: '/why-akechi', label: 'Why Akechi' },
      { href: '/demo', label: 'Book a walkthrough' },
    ],
  },
  {
    key: 'trust',
    label: 'Trust',
    links: [
      { href: '/security', label: 'Security' },
      { href: '/trust', label: 'What we can prove' },
      { href: '/trust/build-status', label: 'Build status' },
      { href: '/accessibility', label: 'Accessibility' },
      { href: '/trust/sub-processors', label: 'Sub-processors' },
      { href: '/trust/dpa', label: 'Data processing' },
      { href: '/trust/responsible-disclosure', label: 'Responsible disclosure' },
      { href: '/legal/terms', label: 'Terms' },
      { href: '/legal/privacy', label: 'Privacy' },
      { href: '/legal/cookies', label: 'Cookies' },
      { href: '/legal/acceptable-use', label: 'Acceptable use' },
    ],
  },
];

export const comparisons: NavLink[] = [
  { href: '/compare/moodle', label: 'Akechi vs Moodle' },
  { href: '/compare/google-classroom', label: 'Akechi vs Google Classroom' },
  { href: '/compare/canvas', label: 'Akechi vs Canvas' },
  { href: '/compare/spreadsheets-and-whatsapp', label: 'Akechi vs spreadsheets and WhatsApp' },
];
