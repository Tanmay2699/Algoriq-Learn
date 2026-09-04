import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Counter, Heading } from '../../../components/primitives';
import { Stagger } from '../../../components/primitives/motion';
import { pageMeta } from '../../../config/seo';
import { site } from '../../../config/site';
import { comparisons } from '../../../content/comparisons';
import { breadcrumbJsonLd, itemListJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/compare');

const TRAIL = [{ href: '/compare', label: 'Comparisons' }];

export default function ComparisonsPage() {
  return (
    <>
      {jsonLd([
        breadcrumbJsonLd(TRAIL),
        itemListJsonLd(
          'Algoryq Learn comparisons',
          comparisons.map((comparison) => ({ href: `/compare/${comparison.slug}`, label: comparison.name })),
        ),
      ])}

      <PageHero
        eyebrow="Comparisons"
        title="Four honest LMS comparisons"
        lead="Every cell about another product carries the source we read and the date we read it. Where they are better, the table says so — a comparison one column wins outright is an advertisement."
        trail={TRAIL}
        photo={{
          src: '/images/pages/compare.jpg',
          alt: 'A team reviewing LMS comparisons across Moodle, Coursera, Udemy, and Blackboard on laptops.',
        }}
      />

      <Act labelledBy="list-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="list-heading" className="sr-only">
            All comparisons
          </h2>
          <Stagger className="grid gap-6 md:grid-cols-2">
            {comparisons.map((comparison) => {
              const wins = comparison.rows.filter((row) => row.verdict === 'algoryq').length;
              const losses = comparison.rows.filter((row) => row.verdict === 'them').length;
              const evens = comparison.rows.filter((row) => row.verdict === 'even').length;

              return (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}` as Route}
                  className="block h-full rounded-lg border border-border bg-surface p-6 mk-lift hover:bg-surface-muted"
                >
                  <h3 className="text-mk-title font-semibold text-fg">{comparison.h1}</h3>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{comparison.lead}</p>
                  <p className="mt-4 text-caption text-fg-muted">
                    <Counter value={comparison.rows.length} /> rows · <Counter value={wins} />{' '}
                    favour Algoryq Learn · <Counter value={losses} /> favour {comparison.name} ·{' '}
                    <Counter value={evens} /> even
                  </p>
                </Link>
              );
            })}
          </Stagger>
        </div>
      </Act>

      <Act labelledBy="rules-heading" surface="muted" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="rules-heading" display="display-3">
            The rules these pages follow
          </Heading>
          <ul className="mt-6 space-y-3 text-mk-body text-fg-muted">
            <li>One source URL and one retrieval date per cell, rendered as a footnote.</li>
            <li>
              Official sources only — the other product&apos;s own documentation. Never a review
              site, a forum post, or &ldquo;in our testing&rdquo;.
            </li>
            <li>Where they are better, we say so, and the summary counts those rows.</li>
            <li>
              No trademarks, logos, brand styling or pejoratives. Their users are our prospects,
              and the tone tells a reader more about us than about them.
            </li>
            <li>
              Re-verified quarterly. Past 180 days a cell shows a notice; past 270, the page comes
              down until somebody has checked it.
            </li>
            <li>
              Found something out of date? Email{' '}
              <a href={`mailto:${site.contactEmail}`} className="text-link underline underline-offset-4">
                {site.contactEmail}
              </a>{' '}
              and we fix it within five working days.
            </li>
          </ul>
        </div>
      </Act>

      <ClosingCTA
        title="The honest way to decide is to open both."
        lead="Ours is a sandbox with seeded data and no signup."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/trust/build-status', label: 'See what we haven’t built' }}
      />
    </>
  );
}
