import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading, Prose, StatBlock } from '../../../components/primitives';
import { pageMeta } from '../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/about');

const TRAIL = [{ href: '/about', label: 'About' }];

export default function AboutPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="About"
        title="Built for the institute, not for the course"
        lead="Algoryq Learn exists because the software an institute actually runs on is five products that have never met each other, and nobody was building the sixth one — the one that joins them."
        trail={TRAIL}
      />

      <Act labelledBy="why-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Prose>
            <h2 id="why-heading">Why this and not another course platform</h2>
            <p>
              Course platforms are a solved problem. Moodle has been solving it for twenty years,
              Classroom solves it for free, and Canvas solves it at scale. What none of them
              solves is the other half of an institute: the enquiry that never got a call back,
              the fee that was reconciled by hand, the attendance register that lives in a book,
              the certificate somebody made in Canva.
            </p>
            <p>
              Those things are not adjacent to learning. They <em>are</em> the institute. And
              because they live in different tools, the join between them is a person with a
              spreadsheet — which is why the monthly numbers arrive on the fifth, and why one
              enquiry in five goes cold.
            </p>

            <h2 id="how">How we decided to build it</h2>
            <p>
              One backend, one database, one frontend. Thirty-one modules that share a tenant
              boundary, a permission catalogue and an audit log. Not microservices — one product
              team should not pay a distributed-systems tax before it has the traffic that
              justifies one, and the seam is there if a module ever needs to leave.
            </p>
            <p>
              Deny by default, everywhere. Isolation in the database rather than in application
              code that remembered. Migrations only. Money as integers. Accessibility as a build
              gate. None of those are marketing positions; they are the reason the product can be
              changed quickly without breaking quietly.
            </p>

            <h2 id="honest">The rule that shaped everything, including this website</h2>
            <p>
              <strong>No fabricated data.</strong> In the product, an unbuilt surface renders an
              honest &ldquo;not built yet&rdquo; component rather than a fake chart. On this
              website, the components that would render customer logos and testimonials return
              nothing at all, and there is a page listing every module&apos;s real completeness —{' '}
              <Link href="/trust/build-status">including the ones at 45 per cent</Link>.
            </p>
            <p>
              That is not modesty. It is the only position that survives a reference call, and it
              is what makes the strong claims — forced row-level isolation, 272 permission keys,
              a hash-chained audit log — worth reading.
            </p>

            <h2 id="not">What we will not build</h2>
            <ul>
              <li>Statutory payroll filing. HR holds records; it will never file your taxes.</li>
              <li>
                Camera proctoring with automatic verdicts. Integrity is signals shown to a human,
                disclosed to the candidate.
              </li>
              <li>Our own video conferencing, or our own transcoding cluster.</li>
              <li>A public course marketplace. Every institute is private by default.</li>
              <li>Native iOS and Android apps. It is an installable PWA, designed at 360 pixels first.</li>
            </ul>

            <h2 id="where">Where we are</h2>
            <p>
              Feature-complete against our own roadmap and preparing for a first deployment. No
              paying customers yet, which is why{' '}
              <Link href="/customers">the customers page says so</Link> and why the design-partner
              offer is the most useful thing on it.
            </p>
          </Prose>
        </div>
      </Act>

      <Act labelledBy="numbers-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="numbers-heading" display="display-3">
            What has been built
          </Heading>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatBlock evidence="api-routes" label="API routes, every one permission-checked" />
            <StatBlock evidence="prisma-models" label="database models" />
            <StatBlock evidence="migrations" label="committed migrations" />
            <StatBlock evidence="unit-tests" label="unit tests" />
          </div>
          <p className="mt-8 max-w-measure text-mk-body-sm text-fg-muted">
            Each of these is reproducible with a command, and the commands are published.
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="The quickest way to judge any of this"
        lead="Open the sandbox and look at the software, or read the build-status page and see what we are still finishing."
        primary={{ href: '/trust/build-status', label: 'See what’s built' }}
        secondary={{ href: '/demo', label: 'Talk to whoever built it' }}
      />
    </>
  );
}
