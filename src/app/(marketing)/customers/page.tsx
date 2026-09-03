import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading } from '../../../components/primitives';
import { CaseStudies, DesignPartnerOffer, Testimonials, caseStudies, testimonials } from '../../../components/sections/proof';
import { pageMeta } from '../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/customers');

const TRAIL = [{ href: '/customers', label: 'Customers' }];

/**
 * This page renders the design-partner offer and nothing else, because both proof sources are
 * empty. It is deliberately not linked from the navigation until one of them is not.
 *
 * The components below return `null` on an empty array — they are rendered here anyway so that
 * the day a real case study is approved, this page fills in without a code change.
 */
export default function CustomersPage() {
  const hasProof = caseStudies.length > 0 || testimonials.length > 0;

  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Customers"
        title="We have none yet."
        lead="Algoryq Learn is feature-complete against its roadmap and has not shipped to a paying customer. This page fills in when there is something real to put on it, and not before."
        trail={TRAIL}
      />

      {hasProof && (
        <Act labelledBy="proof-heading" surface="paper" spacing="normal">
          <div className="container-mk">
            <Heading level={2} id="proof-heading" display="display-3">
              What they said
            </Heading>
            <div className="mt-8">
              <CaseStudies />
              <Testimonials />
            </div>
          </div>
        </Act>
      )}

      <Act labelledBy="offer-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="offer-heading" className="sr-only">
            The design-partner offer
          </h2>
          <DesignPartnerOffer />
        </div>
      </Act>

      <Act labelledBy="meanwhile-heading" surface="muted" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="meanwhile-heading" display="display-3">
            In the meantime, here is what you can check
          </Heading>
          <p className="mt-6 text-mk-body text-fg-muted">
            A case study is somebody else&apos;s account of software you have not used. Useful,
            but not the only evidence. Until we have one, here is what you can verify yourself in
            ninety seconds without asking us anything.
          </p>
          <ul className="mt-6 space-y-2 text-mk-body text-fg-muted">
            <li>
              <Link href="/trust/build-status" className="text-link underline underline-offset-4">
                The real completion status of every module
              </Link>
              , including the four below 60 per cent.
            </li>
            <li>
              <Link href="/security" className="text-link underline underline-offset-4">
                The security model
              </Link>
              , with the file each control lives in, and what we have not built.
            </li>
            <li>
              <Link href="/accessibility" className="text-link underline underline-offset-4">
                The accessibility statement
              </Link>
              , with its open items dated.
            </li>
            <li>
              <Link href="/resources/self-hosting-algoryq-learn" className="text-link underline underline-offset-4">
                How to run the whole platform yourself
              </Link>
              , with no account of any kind.
            </li>
          </ul>
        </div>
      </Act>

      <ClosingCTA
        title="Be the first, on terms you set."
        lead="Three design partners: the Growth plan free for twelve months, weekly access to the people who built it, and a case study at ninety days that you approve — or refuse."
        primary={{ href: '/demo?intent=design-partner', label: 'Apply as a design partner' }}
        secondary={{ href: '/trust', label: 'What we can prove today' }}
      />
    </>
  );
}
