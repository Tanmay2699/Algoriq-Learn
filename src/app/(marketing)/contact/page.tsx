import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Card } from '../../../components/primitives';
import { pageMeta } from '../../../config/seo';
import { site } from '../../../config/site';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/contact');

const TRAIL = [{ href: '/contact', label: 'Contact' }];

const ROUTES = [
  {
    title: 'Anything about the product',
    email: site.contactEmail,
    detail: 'Questions, a demo, pricing, a pilot. One working day, from a person.',
  },
  {
    title: 'Security',
    email: site.securityEmail,
    detail:
      'Acknowledged within two working days. We will not threaten you; the disclosure policy says so in writing.',
    href: '/trust/responsible-disclosure',
    hrefLabel: 'Responsible disclosure',
  },
  {
    title: 'Accessibility',
    email: site.accessibilityEmail,
    detail:
      'Something not working with a keyboard or a screen reader? Five working days, and we tell you what we will do about it.',
    href: '/accessibility',
    hrefLabel: 'Conformance statement',
  },
];

export default function ContactPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Contact"
        title="Three addresses, and a real person behind each"
        lead="No contact form on this page. The site has one form — the demo request — and a second would split the trail for no gain."
        trail={TRAIL}
      />

      <Act labelledBy="routes-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="routes-heading" className="sr-only">
            How to reach us
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {ROUTES.map((route) => (
              <Card key={route.email} as="article">
                <h3 className="text-mk-subtitle font-semibold text-fg">{route.title}</h3>
                <p className="mt-3">
                  <a
                    href={`mailto:${route.email}`}
                    className="font-mono text-mk-mono text-link underline underline-offset-4"
                  >
                    {route.email}
                  </a>
                </p>
                <p className="mt-3 text-mk-body-sm text-fg-muted">{route.detail}</p>
                {route.href && (
                  <p className="mt-4">
                    <Link
                      href={route.href as '/accessibility' | '/trust/responsible-disclosure'}
                      className="text-mk-body-sm text-link underline underline-offset-4"
                    >
                      {route.hrefLabel}
                    </Link>
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Act>

      <Act labelledBy="expect-heading" surface="muted" spacing="normal">
        <div className="container-mk max-w-prose">
          <h2 id="expect-heading" className="font-display text-display-3 font-normal text-fg">
            What to expect
          </h2>
          <ul className="mt-6 space-y-3 text-mk-body text-fg-muted">
            <li>A reply from a person, not a sequence.</li>
            <li>No call unless you ask for one. No call within a minute of a form, ever.</li>
            <li>If we cannot do what you need, we say so — and where possible, who can.</li>
            <li>Send a correction about anything on this site and we fix it within five working days, and note it.</li>
          </ul>
        </div>
      </Act>

      <ClosingCTA
        title="Or just book the twenty minutes."
        lead="A real person, your questions, and the parts of the product you care about."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/trust', label: 'What we can prove today' }}
      />
    </>
  );
}
