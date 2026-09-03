import type { Block } from './articles';

/**
 * The legal pages. Plain, dated, and short enough to be read.
 *
 * These are honest drafts describing what the software actually does — they are not a
 * substitute for a lawyer's review before the domain goes live, and `18-LAUNCH-CHECKLIST.md`
 * lists that review as a gate.
 */

export interface LegalDoc {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  body: Block[];
}

export const legalDocs: LegalDoc[] = [
  {
    slug: 'cookies',
    title: 'Cookies',
    description:
      'This site sets no cookies, so there is no consent banner. What we store instead, why there are no third-party requests, and what the product does.',
    updatedAt: '2026-07-31',
    body: [
      { kind: 'p', text: 'This website sets no cookies. There is no consent banner because there is nothing to consent to.' },
      { kind: 'h2', text: 'The one thing we do store', id: 'theme' },
      {
        kind: 'p',
        text: 'If you use the light/dark toggle in the header, your choice is saved in your browser’s local storage under the key algoryq-learn-theme. It never leaves your device, is not a cookie, is not sent with any request, and clearing your browser data removes it. Never touch the toggle and nothing is stored at all.',
      },
      { kind: 'h2', text: 'No third parties', id: 'third-parties' },
      {
        kind: 'p',
        text: 'This page makes no request to any host but this one. No font CDN, no tag manager, no analytics vendor, no chat widget, no CAPTCHA, no embedded video. Our content-security policy is default-src ‘self’, relaxed only for the inline script and style the framework needs to boot, and a browser test fails our build if it widens.',
      },
      { kind: 'h2', text: 'Analytics', id: 'analytics' },
      {
        kind: 'p',
        text: 'When analytics are enabled they are self-hosted, cookieless and aggregate: page views, referrers, and a few named events such as “a call to action was clicked”. No identifier persists across sessions or sites, IP addresses are truncated at collection, and no individual profile exists. The site works identically with analytics blocked.',
      },
      { kind: 'h2', text: 'The product', id: 'product' },
      {
        kind: 'p',
        text: 'The product at app.learn.algoryq.com does set a session cookie, because it has to: an httpOnly cookie that keeps you signed in and is never readable by JavaScript in your browser. That is a different application from this website.',
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    description:
      'What this website collects (almost nothing), what happens to a demo request, what rights you have over it, and who the controller is in the product.',
    updatedAt: '2026-07-31',
    body: [
      { kind: 'h2', text: 'This website', id: 'website' },
      {
        kind: 'p',
        text: 'We collect nothing about you unless you send it to us. There are no cookies, no third-party requests and no cross-site tracking. When analytics are enabled they are self-hosted, cookieless and aggregate.',
      },
      { kind: 'h2', text: 'If you fill in the form', id: 'form' },
      {
        kind: 'p',
        text: 'The demo form sends your name, email, institute, role, an approximate size, an optional phone number and your message to our own instance of Algoryq Learn, where it becomes an enquiry on our admissions board. Nothing is stored on this website. We use it to answer your enquiry. We do not sell it, and we do not add you to a mailing list you did not ask for.',
      },
      { kind: 'h2', text: 'Your rights', id: 'rights' },
      {
        kind: 'ul',
        items: [
          'Ask what we hold about you, and we will export it.',
          'Ask us to correct it.',
          'Ask us to erase it — the product has a subject-request flow that does exactly this, and it tombstones rather than rewriting the audit chain that proves the erasure happened.',
          'Email the address on the contact page. We answer within five working days.',
        ],
      },
      { kind: 'h2', text: 'The product', id: 'product' },
      {
        kind: 'p',
        text: 'When an institute runs Algoryq Learn, that institute is the data controller for its learners’ data and we are a processor. If they self-host, we are neither — we never see it. The data-processing page covers this properly.',
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms',
    description:
      'The terms this website and the free tier are provided on: what the free plan includes, how paid plans start, what happens to your data, and trademarks.',
    updatedAt: '2026-07-31',
    body: [
      { kind: 'h2', text: 'This website', id: 'website' },
      {
        kind: 'p',
        text: 'Provided as-is, for information. Everything on it is intended to be accurate on the date shown; where a figure is derived from our own codebase we say which command reproduces it, and where a comparison describes another product we cite the source and the date we read it. If you find something out of date, tell us and we will correct it.',
      },
      { kind: 'h2', text: 'The free tier', id: 'free' },
      {
        kind: 'p',
        text: 'The Starter plan is free, limited to 100 seats, 25 courses and 5 GiB of storage. A real plan rather than a trial: no expiry, no card. We may change the limits with notice; we will not silently reduce them under an existing institute.',
      },
      { kind: 'h2', text: 'Paid plans', id: 'paid' },
      {
        kind: 'p',
        text: 'There is no online checkout — the product has no payment-gateway adapter — so a paid plan begins with a conversation and an invoice.',
      },
      { kind: 'h2', text: 'Your data', id: 'data' },
      {
        kind: 'p',
        text: 'It is yours. You can export all of it at any time, and you can self-host the whole platform. If you leave, we will help you take it with you.',
      },
      { kind: 'h2', text: 'Trademarks', id: 'trademarks' },
      {
        kind: 'p',
        text: 'Moodle, Google Classroom and Canvas are trademarks of their respective owners, named here only descriptively.',
      },
    ],
  },
  {
    slug: 'acceptable-use',
    title: 'Acceptable use',
    description:
      'What Algoryq Learn may not be used for — the five things we ask of every institute, including what to do if you find a way to reach somebody else’s data.',
    updatedAt: '2026-07-31',
    body: [
      { kind: 'p', text: 'Short, because it needs to be.' },
      {
        kind: 'ul',
        items: [
          'Do not use it to store data you have no lawful basis to hold.',
          'Do not use it to harass, surveil or discriminate against learners or staff.',
          'Do not attempt to reach another institute’s data. If you find a way to, tell us — the responsible-disclosure page explains how, and we will thank you properly.',
          'Do not resell access as your own product without an agreement.',
          'Do not use the public enquiry endpoint to send unsolicited messages, or to test whether an address is on file. It is built so you cannot, and trying breaches these terms as well as wasting an afternoon.',
        ],
      },
    ],
  },
  {
    slug: 'security-policy',
    title: 'Security policy',
    description:
      'The controls we operate, the ones we do not have yet, and what we commit to on a report: acknowledgement in two working days, and no lawyers.',
    updatedAt: '2026-07-31',
    body: [
      { kind: 'h2', text: 'What we do', id: 'we' },
      {
        kind: 'ul',
        items: [
          'Tenant isolation is a forced row-level security policy in PostgreSQL, on a database role that is neither the owner nor a superuser.',
          'Every API route carries a permission key or an explicit public marker, and a coverage check fails the build otherwise.',
          'Passwords are hashed with Argon2id, with lockout. Sessions rotate, and revoking one revokes its family.',
          'Every mutation is written to a hash-chained audit log with a field-level diff.',
          'Secrets fail fast in production: the environment schema throws on defaults and placeholders.',
        ],
      },
      { kind: 'h2', text: 'What we do not have yet', id: 'not-yet' },
      {
        kind: 'ul',
        items: [
          'A SOC 2 certificate. The policy set exists and the audit log produces the evidence; the audit has not happened.',
          'A published penetration-test report.',
          'SAML, OIDC or SCIM.',
          'A formal uptime SLA, because we have no telemetry to hold ourselves to one yet.',
        ],
      },
      { kind: 'h2', text: 'What we ask', id: 'you' },
      {
        kind: 'p',
        text: 'If you find something, tell us before you tell anybody else. We will acknowledge within two working days, keep you updated, fix it, and credit you if you want to be credited. We will not threaten you.',
      },
    ],
  },
];

export function legalBySlug(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
