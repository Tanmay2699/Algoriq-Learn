import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Counter, Heading } from '../../../../components/primitives';
import { Table, Td, Tr } from '../../../../components/primitives/table';
import { dynamicMeta } from '../../../../config/seo';
import { site } from '../../../../config/site';
import { comparisonBySlug, comparisons, daysSince } from '../../../../content/comparisons';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export function generateStaticParams() {
  return comparisons.map((comparison) => ({ competitor: comparison.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  const comparison = comparisonBySlug(competitor);
  if (!comparison) return {};
  return dynamicMeta(`/compare/${comparison.slug}`, comparison.seoTitle, comparison.seoDescription);
}

export default async function ComparePage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;
  const comparison = comparisonBySlug(competitor);
  if (!comparison) notFound();

  const trail = [
    { href: '/compare', label: 'Comparisons' },
    { href: `/compare/${comparison.slug}`, label: comparison.name },
  ];

  const wins = comparison.rows.filter((row) => row.verdict === 'algoryq').length;
  const losses = comparison.rows.filter((row) => row.verdict === 'them').length;
  const evens = comparison.rows.filter((row) => row.verdict === 'even').length;
  const stalest = Math.max(...comparison.rows.map((row) => daysSince(row.retrievedAt)));

  return (
    <>
      {jsonLd([breadcrumbJsonLd(trail)])}

      <PageHero eyebrow="Comparison" title={comparison.h1} lead={comparison.lead} trail={trail}>
        <p className="mt-6 text-mk-body-sm text-fg-muted">
          <Counter value={comparison.rows.length} /> rows: <Counter value={wins} /> favour Algoryq
          Learn, <Counter value={losses} /> favour {comparison.name}, <Counter value={evens} /> are
          even. Every cell about {comparison.name} carries the source we read and the date we
          read it.
        </p>
        {stalest > 180 && (
          <p className="mt-3 max-w-measure rounded-[--radius] border border-border bg-surface-muted p-3 text-mk-body-sm text-warning-text">
            Some cells here were last verified more than 180 days ago. Treat them as indicative,
            and tell us if something has changed.
          </p>
        )}
      </PageHero>

      <Act labelledBy="strength-heading" surface="ink" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="strength-heading" display="display-3" surface="ink">
            What {comparison.name} is genuinely good at
          </Heading>
          <p className="mt-6 text-mk-body text-on-ink-muted">{comparison.theirStrength}</p>
          <p className="mt-4 text-mk-body-sm text-on-ink-muted">
            This paragraph comes before the table on purpose. A comparison that gives the other
            product no wins is an advertisement, and nobody reads one twice.
          </p>
        </div>
      </Act>

      <Act labelledBy="table-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="table-heading" display="display-3">
            Side by side
          </Heading>
          <div className="mt-8">
            <Table
              caption={`Algoryq Learn and ${comparison.name} compared, capability by capability`}
              head={['Capability', 'Algoryq Learn', comparison.name]}
            >
              {comparison.rows.map((row) => (
                <Tr key={row.capability}>
                  <Td header>{row.capability}</Td>
                  <Td className={row.verdict === 'algoryq' ? 'text-fg' : ''}>{row.algoryq}</Td>
                  <Td className={row.verdict === 'them' ? 'text-fg' : ''}>
                    {row.them}
                    <span className="mt-1 block text-caption text-fg-muted">
                      {row.source.startsWith('http') ? (
                        <a
                          href={row.source}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="underline underline-offset-2"
                        >
                          Source
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        'No product source — this row describes a practice'
                      )}{' '}
                      · read {row.retrievedAt}
                    </span>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <Act labelledBy="decide-heading" surface="muted" spacing="normal">
        <div className="container-mk grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
            <Heading level={2} id="decide-heading" display="title">
              Stay where you are if…
            </Heading>
            <p className="mt-4 text-mk-body text-fg-muted">{comparison.stayIf}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
            <Heading level={2} display="title">
              People move when…
            </Heading>
            <p className="mt-4 text-mk-body text-fg-muted">{comparison.moveIf}</p>
          </div>
        </div>
      </Act>

      <Act labelledBy="correction-heading" surface="paper" spacing="tight">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="correction-heading" display="title">
            Found something out of date?
          </Heading>
          <p className="mt-4 text-mk-body text-fg-muted">
            Products change, and this page will eventually be wrong about something. Email{' '}
            <a href={`mailto:${site.contactEmail}`} className="text-link underline underline-offset-4">
              {site.contactEmail}
            </a>{' '}
            and we correct it within five working days. Every cell is re-verified quarterly: past
            180 days it shows a notice, past 270 the page comes down until it is checked.
          </p>
          <p className="mt-6 text-mk-body-sm">
            Other comparisons:{' '}
            {comparisons
              .filter((other) => other.slug !== comparison.slug)
              .map((other, index, list) => (
                <span key={other.slug}>
                  <Link href={`/compare/${other.slug}` as Route} className="text-link underline underline-offset-4">
                    {other.name}
                  </Link>
                  {index < list.length - 1 ? ' · ' : ''}
                </span>
              ))}
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="The honest way to decide is to open both."
        lead="Ours is a sandbox with seeded data and no signup. Or twenty minutes with somebody who knows it."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/trust/build-status', label: 'See what we haven’t built' }}
      />
    </>
  );
}
