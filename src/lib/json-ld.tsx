import { site } from '../config/site';
import { plans } from '../content/plans';

/**
 * Structured data.
 *
 * Two types are deliberately never emitted: `AggregateRating` and `Review`. We have no
 * reviews, a fabricated rating is both a lie and a manual-action risk, and the whole
 * position of this site is that we do not manufacture proof (docs/11 §3).
 *
 * `WebSite` also omits `potentialAction: SearchAction` — we have no site search, and
 * declaring one we do not have is a bad-faith signal to a crawler that will check.
 */

type Json = Record<string, unknown>;

export function organizationJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    email: site.contactEmail,
    // sameAs is omitted entirely rather than emitted empty: an invented profile is a claim.
    ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
  };
}

export function softwareJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Akechi',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: site.url,
    description:
      'A multi-tenant learning management system for schools, colleges and coaching institutes: admissions, courses, live classes, assessments, fees, staff and outcomes in one platform.',
    offers: plans
      .filter((plan) => plan.isPublic && plan.maxSeats !== null)
      .map((plan) => ({
        '@type': 'Offer',
        name: plan.name,
        price: (plan.priceMinor / 100).toFixed(0),
        priceCurrency: plan.currency,
        description: plan.description,
      })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { href: string; label: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ href: '/', label: 'Home' }, ...trail].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${site.url}${crumb.href === '/' ? '' : crumb.href}`,
    })),
  };
}

export function itemListJsonLd(name: string, items: { href: string; label: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${site.url}${item.href}`,
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  href: string;
  publishedAt: string;
  updatedAt?: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    url: `${site.url}${article.href}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
  };
}

/**
 * Renders one or more blocks. Server-rendered, so it is in the HTML a crawler receives
 * rather than something a headless browser has to execute JavaScript to find.
 */
export function jsonLd(blocks: Json[]) {
  return (
    <script
      type="application/ld+json"
      // The content is our own, built from typed objects, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blocks.length === 1 ? blocks[0] : blocks) }}
    />
  );
}
