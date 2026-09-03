import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Badge, Card } from '../../../../components/primitives';
import { Blocks, TableOfContents } from '../../../../components/primitives/blocks';
import { dynamicMeta } from '../../../../config/seo';
import { articleBySlug, articles } from '../../../../content/articles';
import { articleJsonLd, breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return dynamicMeta(
    `/resources/${article.slug}`,
    article.seoTitle ?? article.title,
    article.description,
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const trail = [
    { href: '/resources', label: 'Resources' },
    { href: `/resources/${article.slug}`, label: article.title },
  ];
  const others = articles.filter((other) => other.slug !== article.slug).slice(0, 3);

  return (
    <>
      {jsonLd([
        breadcrumbJsonLd(trail),
        articleJsonLd({
          title: article.title,
          description: article.description,
          href: `/resources/${article.slug}`,
          publishedAt: article.publishedAt,
        }),
      ])}

      <PageHero
        eyebrow="Guide"
        title={article.title}
        lead={article.description}
        trail={trail}
        photo={article.photo}
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {article.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          <span className="text-mk-body-sm text-fg-muted">
            {article.readingMinutes} min · published {article.publishedAt}
          </span>
        </div>
      </PageHero>

      <Act labelledBy="body-heading" surface="paper" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-14">
          <div>
            <h2 id="body-heading" className="sr-only">
              {article.title}
            </h2>
            <Blocks blocks={article.body} />
          </div>
          <aside className="order-first lg:order-last">
            <TableOfContents blocks={article.body} />
          </aside>
        </div>
      </Act>

      <Act labelledBy="more-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <h2 id="more-heading" className="text-mk-title font-semibold text-fg">
            More guides
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Card as="article" className="h-full">
                  <h3 className="text-mk-subtitle font-semibold text-fg">
                    <Link href={`/resources/${other.slug}` as Route} className="hover:underline">
                      {other.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{other.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
