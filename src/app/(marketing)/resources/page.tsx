import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Badge, Card } from '../../../components/primitives';
import { pageMeta } from '../../../config/seo';
import { articles } from '../../../content/articles';
import { breadcrumbJsonLd, itemListJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/resources');

const TRAIL = [{ href: '/resources', label: 'Resources' }];

export default function ResourcesPage() {
  return (
    <>
      {jsonLd([
        breadcrumbJsonLd(TRAIL),
        itemListJsonLd(
          'Algoryq Learn guides',
          articles.map((article) => ({ href: `/resources/${article.slug}`, label: article.title })),
        ),
      ])}

      <PageHero
        eyebrow="Guides"
        title="Six things worth reading before you choose anything"
        lead="Each one is written from something we actually built, and each one answers a question people ask us. Nothing is gated, and there is no email wall."
        trail={TRAIL}
      />

      <Act labelledBy="list-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="list-heading" className="sr-only">
            All guides
          </h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <Card as="article" className="flex h-full flex-col">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="mt-4 text-mk-title font-semibold text-fg">
                    <Link href={`/resources/${article.slug}` as Route} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{article.description}</p>
                  <p className="mt-auto pt-5 text-caption text-fg-muted">
                    {article.readingMinutes} min · answers &ldquo;{article.objection}&rdquo;
                  </p>
                </Card>
              </li>
            ))}
          </ul>

          <p className="mt-block max-w-prose text-mk-body-sm text-fg-muted">
            There is no search box on this site. With fifty-one pages and a navigation that
            works, a search box that returns nothing useful erodes more trust than its absence —
            which is a slightly awkward thing to say given that search is the most complete
            module in the product, at 88 per cent. We will add one at forty articles.
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="Or skip the reading."
        lead="The sandbox is a real institute with seeded data, and you can see every role in it without giving us anything."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/product', label: 'Read about the modules' }}
      />
    </>
  );
}
