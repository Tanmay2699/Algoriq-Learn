import type { Metadata } from 'next';
import { site } from './site';

/**
 * One metadata entry per route.
 *
 * `pageMeta()` throws on an unregistered path, so a page cannot ship without a title, a
 * description and a canonical. Metadata is not something to remember at the end.
 *
 * Two length budgets, checked by `src/test/content.spec.ts` rather than by good intentions: a
 * rendered title — the page title plus the ` · Algoryq Learn` template, except on `/`, whose
 * title is absolute — stays under 60 characters, and a description stays under 158. Past
 * either, a search engine truncates mid-sentence and the sentence we wrote is not the one
 * anybody reads. Each entry also owns one primary query, so no two pages compete for it.
 */

export interface SeoEntry {
  title: string;
  description: string;
  /** Defaults to indexable. `/demo` is the exception. */
  noindex?: boolean;
}

/** The template appended to every title except the homepage's. */
export const TITLE_TEMPLATE_SUFFIX = ' · Algoryq Learn';
export const MAX_TITLE_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 158;

const entries: Record<string, SeoEntry> = {
  '/': {
    title: 'Algoryq Learn — Multi-Tenant LMS for Institutes',
    description:
      'One LMS for admissions, courses, live classes, exams, fees and certificates. Built for schools, colleges and coaching institutes. Free for 100 seats.',
  },
  '/product': {
    title: 'Features — 31 LMS Modules, One Database',
    description:
      'Seven clusters and 31 LMS modules on one tenant boundary: admissions, courses, delivery, assessment, fees, analytics and the platform beneath them.',
  },
  '/solutions': {
    title: 'LMS for Schools, Coaching and Universities',
    description:
      'Coaching institutes, schools, universities, skilling academies and corporate L&D — one LMS, five vocabularies, and an honest disqualifier for each.',
  },
  '/compare': {
    title: 'Moodle and Google Classroom Alternatives',
    description:
      'Algoryq Learn compared with Moodle, Canvas, Google Classroom and the spreadsheet stack. Every cell sourced and dated, including the rows they win.',
  },
  '/pricing': {
    title: 'LMS Pricing — Free for One Campus',
    description:
      'Starter is free for 100 seats. Growth is ₹14,999 a month for 1,000. Security, permissions, audit, the API and self-hosting are on every plan.',
  },
  '/security': {
    title: 'LMS Security — Isolation You Can Inspect',
    description:
      'Row-level security forced on 114 tables, deny-by-default authorization across 272 permission keys, a hash-chained audit log, and what we have not built.',
  },
  '/trust': {
    title: 'Trust — What We Can Prove Today',
    description:
      'No customer logos yet. Check these instead: a live sandbox, the API, a certificate verifier, the compose file, and our real build status.',
  },
  '/trust/build-status': {
    title: 'Build Status — Finished and Unfinished',
    description:
      'The real module completion matrix, all twenty-four rows, including the modules at 45 per cent. Published unedited from our own tracker.',
  },
  '/trust/sub-processors': {
    title: 'Sub-Processors',
    description:
      'Every third party that processes data on our behalf. The list is short because storage, mail, search and AI are ports — and if you self-host, it is empty.',
  },
  '/trust/dpa': {
    title: 'Data Processing Agreement (DPA)',
    description:
      'How Algoryq Learn processes personal data, who is controller and who is processor, and what happens to subject requests, retention and legal holds.',
  },
  '/trust/responsible-disclosure': {
    title: 'Responsible Disclosure Policy',
    description:
      'How to report a security vulnerability, what is in scope, and what we commit to: acknowledgement in two working days, updates while we fix, no lawyers.',
  },
  '/accessibility': {
    title: 'Accessibility Statement — WCAG 2.2 AA',
    description:
      'A WCAG 2.2 level AA conformance statement with the exceptions listed: how we test, what still fails, and how to report anything we missed.',
  },
  '/developers': {
    title: 'LMS API, Webhooks and Self-Hosting',
    description:
      'A versioned REST API where every route carries a permission key, HMAC-signed webhooks with a delivery log, API keys hashed at rest, and a compose file.',
  },
  '/developers/webhooks': {
    title: 'Webhooks — Signatures and Retries',
    description:
      'Endpoints, HMAC-SHA256 signatures, retries with backoff, and a delivery log you can inspect and replay — plus every event Algoryq Learn emits today.',
  },
  '/integrations': {
    title: 'Integrations — 11 Built, 9 Not Built',
    description:
      'Eleven working integrations and nine honest gaps. We would rather list what actually connects than show sixty logos we only have a screenshot of.',
  },
  '/why-algoryq-learn': {
    title: 'Why an All-in-One LMS Beats Five Tools',
    description:
      'The five-tool institute stack, what its seams cost, and the arithmetic on your own numbers — plus the case against us and the design-partner offer.',
  },
  '/customers': {
    title: 'Customers and the Design-Partner Offer',
    description:
      'No case studies yet, because no paying customers yet. Here is the design-partner offer instead, and four things you can verify without asking us.',
  },
  '/resources': {
    title: 'Guides for Choosing an LMS',
    description:
      'Migration, permissions, assessment integrity, accessible procurement, self-hosting, and why we built a PWA. No gating and no email wall.',
  },
  '/about': {
    title: 'About — Built for the Institute',
    description:
      'What Algoryq Learn is, who it is for, why it was built as one system rather than another course platform, and the five things it will never do.',
  },
  '/contact': {
    title: 'Contact Algoryq Learn',
    description:
      'Three addresses — product, security and accessibility — a real person behind each, and a written commitment on how quickly we reply to which.',
  },
  '/demo': {
    title: 'Book an LMS Demo — 20 Minutes',
    description:
      'Twenty minutes, a real person, and your own questions. Or skip the call and open the read-only sandbox: seeded data, every role, no signup.',
    noindex: true,
  },
};

export function pageMeta(path: string, overrides?: Partial<Metadata>): Metadata {
  const entry = entries[path];
  if (!entry) {
    throw new Error(
      `No SEO entry for "${path}". Add one to src/config/seo.ts — a page without a title and a canonical is a page nobody finds.`,
    );
  }

  return {
    title: path === '/' ? { absolute: entry.title } : entry.title,
    description: entry.description,
    alternates: { canonical: `${site.url}${path === '/' ? '' : path}` },
    robots: entry.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: `${site.url}${path === '/' ? '' : path}`,
      type: 'website',
    },
    ...overrides,
  };
}

/** For the dynamic routes, whose entries are derived from content rather than listed above. */
export function dynamicMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${site.url}${path}` },
    openGraph: { title, description, url: `${site.url}${path}`, type: 'article' },
  };
}

export const seoEntries = entries;
