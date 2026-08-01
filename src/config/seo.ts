import type { Metadata } from 'next';
import { site } from './site';

/**
 * One metadata entry per route.
 *
 * `pageMeta()` throws on an unregistered path, so a page cannot ship without a title, a
 * description and a canonical. Metadata is not something to remember at the end.
 */

export interface SeoEntry {
  title: string;
  description: string;
  /** Defaults to indexable. `/demo` is the exception. */
  noindex?: boolean;
}

const entries: Record<string, SeoEntry> = {
  '/': {
    title: 'Akechi — the multi-tenant LMS for institutes',
    description:
      'One system of record for schools, colleges and coaching institutes: admissions, courses, live classes, assessments, fees, staff and outcomes. Free for 100 seats.',
  },
  '/product': {
    title: 'The product — 31 modules, one database',
    description:
      'Seven clusters, thirty-one modules and one tenant boundary: admissions, courses, delivery, assessment, money, intelligence and the platform underneath.',
  },
  '/solutions': {
    title: 'Solutions — five kinds of institute, one product',
    description:
      'Coaching institutes, schools, universities, skilling academies and corporate L&D. Same product, different vocabulary, different order — and an honest disqualifier for each.',
  },
  '/compare': {
    title: 'Comparisons — Akechi against the alternatives',
    description:
      'Akechi compared with Moodle, Google Classroom, Canvas and the spreadsheet-and-WhatsApp stack. Every cell sourced and dated, including the rows they win.',
  },
  '/pricing': {
    title: 'Pricing — free for one campus',
    description:
      'Starter is free for 100 seats. Growth is ₹14,999 a month for 1,000. Security, permissions, audit, the API and the right to self-host are on every plan.',
  },
  '/security': {
    title: 'Security — isolation you can inspect',
    description:
      'Row-level security forced on 114 tables, deny-by-default authorization across 272 permission keys, a hash-chained audit log, and the list of what we have not built.',
  },
  '/trust': {
    title: 'What we can prove today',
    description:
      'We have no customer logos. Here is what you can check instead: a sandbox, the API, a certificate verifier, the compose file, the accessibility statement and our real build status.',
  },
  '/trust/build-status': {
    title: 'Build status — what is finished and what is not',
    description:
      'The real module completion matrix, all twenty-four rows, including the modules at 45 per cent. Published unedited from our own tracker.',
  },
  '/trust/sub-processors': {
    title: 'Sub-processors',
    description:
      'Who processes data on our behalf. The list is short, and if you self-host it is empty.',
  },
  '/trust/dpa': {
    title: 'Data processing',
    description: 'How Akechi processes personal data, what we are responsible for, and what you are.',
  },
  '/trust/responsible-disclosure': {
    title: 'Responsible disclosure',
    description:
      'How to report a security issue, what is in scope, and what we commit to: an acknowledgement in two working days, updates while we fix it, and no lawyers.',
  },
  '/accessibility': {
    title: 'Accessibility conformance statement',
    description:
      'WCAG 2.2 level AA, partially conformant, with the exceptions listed. How we test, what still fails, and how to tell us about something we missed.',
  },
  '/developers': {
    title: 'Developers — the API, webhooks and self-hosting',
    description:
      'A versioned REST API where every route carries a permission key, HMAC-signed webhooks with a delivery log, API keys hashed at rest, and a compose file that boots the lot.',
  },
  '/developers/webhooks': {
    title: 'Webhooks',
    description: 'Endpoints, HMAC signatures, retries and a delivery log you can inspect and replay.',
  },
  '/integrations': {
    title: 'Integrations — what is built, and what is a port with no driver',
    description:
      'Nine real integrations and eight honest gaps. We would rather list what works than show sixty logos we have a screenshot of.',
  },
  '/why-akechi': {
    title: 'Why Akechi',
    description:
      'The five-tool stack, what its seams cost, and the arithmetic on your own numbers. Plus the design-partner offer.',
  },
  '/customers': {
    title: 'Customers',
    description:
      'We have no case studies yet, because we have no customers yet. Here is the design-partner offer instead.',
  },
  '/resources': {
    title: 'Guides',
    description:
      'Migration, permissions, assessment integrity, accessible procurement, self-hosting, and why we built a PWA. No gating, no email wall.',
  },
  '/about': {
    title: 'About',
    description:
      'What Akechi is, who it is for, why it was built as one system rather than another course platform, and the five things it deliberately will never do.',
  },
  '/contact': {
    title: 'Contact',
    description:
      'Three addresses — product, security and accessibility — a real person behind each, and a written commitment about how quickly we reply to which.',
  },
  '/demo': {
    title: 'Book a walkthrough',
    description: 'Twenty minutes, a real person, and your own questions. Or open the sandbox instead.',
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
