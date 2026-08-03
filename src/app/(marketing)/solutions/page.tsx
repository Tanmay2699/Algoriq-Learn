import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading } from '../../../components/primitives';
import { Stagger } from '../../../components/primitives/motion';
import { pageMeta } from '../../../config/seo';
import { solutionPages } from '../../../content/solutions';
import { breadcrumbJsonLd, itemListJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/solutions');

const TRAIL = [{ href: '/solutions', label: 'Solutions' }];

export default function SolutionsPage() {
  return (
    <>
      {jsonLd([
        breadcrumbJsonLd(TRAIL),
        itemListJsonLd(
          'Algoryq Learn solutions',
          solutionPages.map((solution) => ({ href: `/solutions/${solution.slug}`, label: solution.name })),
        ),
      ])}

      <PageHero
        eyebrow="Solutions"
        title="Five kinds of institute, one product"
        lead="The same thirty-one modules in every case. What changes is the order you meet them in, the words we use, and which number you are actually judged on."
        trail={TRAIL}
      />

      <Act labelledBy="list-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="list-heading" className="sr-only">
            All solutions
          </h2>
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutionPages.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}` as Route}
                className="block rounded-lg border border-border bg-surface p-6 transition-colors duration-fast hover:bg-surface-muted"
              >
                <p className="text-caption font-medium uppercase tracking-wide text-fg-muted">
                  Judged on: {solution.judgedOn}
                </p>
                <h3 className="mt-2 text-mk-title font-semibold text-fg">{solution.name}</h3>
                <p className="mt-2 text-mk-body-sm text-fg-muted">{solution.h1}</p>
              </Link>
            ))}
          </Stagger>
        </div>
      </Act>

      <Act labelledBy="honest-heading" surface="muted" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="honest-heading" display="display-3">
            Each of these pages ends by telling you when we are wrong for you
          </Heading>
          <p className="mt-6 text-mk-body text-fg-muted">
            A university that needs enforced regional data residency, a corporate team that needs
            SCIM, a coaching institute that needs to take card payments inside the product — all
            three are named on their own page rather than discovered in month three. Losing a
            badly-fitting prospect on a website is cheaper for everybody than losing them halfway
            through a pilot.
          </p>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
