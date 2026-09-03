import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Card, Heading, Lead } from '../../../../components/primitives';
import { Stagger } from '../../../../components/primitives/motion';
import { dynamicMeta } from '../../../../config/seo';
import { solutionBySlug, solutionPages } from '../../../../content/solutions';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export function generateStaticParams() {
  return solutionPages.map((solution) => ({ segment: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const solution = solutionBySlug(segment);
  if (!solution) return {};
  return dynamicMeta(`/solutions/${solution.slug}`, solution.seoTitle, solution.seoDescription);
}

export default async function SolutionPage({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;
  const solution = solutionBySlug(segment);
  if (!solution) notFound();

  const trail = [
    { href: '/solutions', label: 'Solutions' },
    { href: `/solutions/${solution.slug}`, label: solution.name },
  ];

  return (
    <>
      {jsonLd([breadcrumbJsonLd(trail)])}

      <PageHero eyebrow={solution.name} title={solution.h1} lead={solution.lead} trail={trail}>
        <p className="mt-6 text-mk-body-sm text-fg-muted">
          Judged on: <span className="text-fg">{solution.judgedOn}</span>
        </p>
      </PageHero>

      <Act labelledBy="sections-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="sections-heading" display="display-3">
            What you would actually use
          </Heading>
          <Lead className="mt-4">
            In your order, using your words — {solution.vocabulary.join(', ')}.
          </Lead>

          <Stagger className="mt-block grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solution.sections.map((section) => (
              <Card key={section.title}>
                <h3 className="text-mk-subtitle font-semibold text-fg">
                  <Link href={section.href as Route} className="hover:underline">
                    {section.title}
                  </Link>
                </h3>
                <p className="mt-2 text-mk-body-sm text-fg-muted">{section.body}</p>
              </Card>
            ))}
          </Stagger>
        </div>
      </Act>

      <Act labelledBy="disqualifier-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <div className="max-w-prose rounded-lg border border-border bg-surface p-6 sm:p-8">
            <Heading level={2} id="disqualifier-heading" display="title">
              When we are the wrong choice
            </Heading>
            <p className="mt-4 text-mk-body text-fg-muted">{solution.disqualifier}</p>
            <p className="mt-5 text-mk-body-sm">
              <Link href="/trust/build-status" className="text-link underline underline-offset-4">
                Everything else that is not built
              </Link>
            </p>
          </div>
        </div>
      </Act>

      <Act labelledBy="others-heading" surface="paper" spacing="tight">
        <div className="container-mk">
          <Heading level={2} id="others-heading" display="title">
            Other kinds of institute
          </Heading>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutionPages
              .filter((other) => other.slug !== solution.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/solutions/${other.slug}` as Route}
                    className="block h-full rounded-lg border border-border bg-surface p-5 mk-lift hover:bg-surface-muted"
                  >
                    <h3 className="text-mk-subtitle font-semibold text-fg">{other.name}</h3>
                    <p className="mt-1.5 text-mk-body-sm text-fg-muted">{other.judgedOn}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
