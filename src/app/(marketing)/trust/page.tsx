import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Card, Heading } from '../../../components/primitives';
import { verifiableItems } from '../../../components/sections/proof';
import { pageMeta } from '../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/trust');

const TRAIL = [{ href: '/trust', label: 'Trust' }];

const DOCS = [
  { href: '/trust/build-status', label: 'Build status', blurb: 'Every module’s real completeness, including the four below 60%.' },
  { href: '/security', label: 'Security notes', blurb: 'The mechanism behind each control, and where it lives in the code.' },
  { href: '/accessibility', label: 'Accessibility statement', blurb: 'WCAG 2.2 AA, partial conformance, with the open items listed.' },
  { href: '/trust/sub-processors', label: 'Sub-processors', blurb: 'Who processes data on our behalf. If you self-host, nobody.' },
  { href: '/trust/dpa', label: 'Data processing', blurb: 'Controller, processor, and who is responsible for what.' },
  { href: '/trust/responsible-disclosure', label: 'Responsible disclosure', blurb: 'How to report something, and what we will do.' },
];

export default function TrustPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Trust"
        title="What we can prove today."
        lead="No customer logos, no awards, no certifications — none of them earned yet. Here is what you can check instead, none of it requiring a word with us."
        trail={TRAIL}
      />

      <Act labelledBy="verifiable-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="verifiable-heading" display="display-3">
            Six things you can check in ninety seconds
          </Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {verifiableItems.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-lg border border-border bg-surface p-6 mk-lift hover:bg-surface-muted"
                  >
                    <h3 className="font-mono text-mk-mono text-fg">
                      {item.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </h3>
                    <p className="mt-2 text-mk-body-sm text-fg-muted">{item.detail}</p>
                  </a>
                ) : (
                  <Link
                    href={item.href as Route}
                    className="block h-full rounded-lg border border-border bg-surface p-6 mk-lift hover:bg-surface-muted"
                  >
                    <h3 className="font-mono text-mk-mono text-fg">{item.label}</h3>
                    <p className="mt-2 text-mk-body-sm text-fg-muted">{item.detail}</p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <Act labelledBy="why-heading" surface="ink" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="why-heading" display="display-3" surface="ink">
            Why there are no logos on this website
          </Heading>
          <div className="mt-6 space-y-4 text-mk-body text-on-ink-muted">
            <p>
              Algoryq Learn has not shipped to a paying customer. Six grey logos, a testimonial
              from a persona, or a &ldquo;trusted by 10,000 institutes&rdquo; line would be
              discovered in the first serious conversation — buyers call references — and would
              poison every other claim here, including the true, hard-won ones about isolation and
              permissions.
            </p>
            <p>
              So the components that would render social proof return nothing until there is
              something real to put in them. No placeholder, no skeleton, no &ldquo;coming
              soon&rdquo;. The layout was designed to look finished without them.
            </p>
            <p>
              For the two people who usually decide — whoever runs IT and whoever runs
              procurement — checkable evidence beats logos anyway. You cannot verify a logo. You
              can run <code className="font-mono">docker compose up</code>.
            </p>
          </div>
        </div>
      </Act>

      <Act labelledBy="docs-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="docs-heading" display="display-3">
            The documents
          </Heading>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DOCS.map((doc) => (
              <li key={doc.href}>
                <Card as="article" className="h-full">
                  <h3 className="text-mk-subtitle font-semibold text-fg">
                    <Link href={doc.href as Route} className="hover:underline">
                      {doc.label}
                    </Link>
                  </h3>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{doc.blurb}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <ClosingCTA
        title="The fastest way to check any of this is to open it."
        lead="The sandbox is a real institute with seeded data. No form, no signup, no call."
        primary={{ href: '/trust/build-status', label: 'See what’s built' }}
        secondary={{ href: '/security', label: 'Read the security notes' }}
      />
    </>
  );
}
