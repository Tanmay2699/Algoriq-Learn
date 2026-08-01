import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { Act } from '../../../../components/layout/act';
import { PageHero } from '../../../../components/layout/page-parts';
import { Blocks } from '../../../../components/primitives/blocks';
import { dynamicMeta } from '../../../../config/seo';
import { legalBySlug, legalDocs } from '../../../../content/legal';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc: slug } = await params;
  const doc = legalBySlug(slug);
  if (!doc) return {};
  return dynamicMeta(`/legal/${doc.slug}`, doc.title, doc.description);
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc: slug } = await params;
  const doc = legalBySlug(slug);
  if (!doc) notFound();

  const trail = [
    { href: '/legal/terms', label: 'Legal' },
    { href: `/legal/${doc.slug}`, label: doc.title },
  ];

  return (
    <>
      {jsonLd([breadcrumbJsonLd(trail)])}

      <PageHero eyebrow="Legal" title={doc.title} lead={doc.description} trail={trail}>
        <p className="mt-6 text-mk-body-sm text-fg-muted">Last updated {doc.updatedAt}</p>
      </PageHero>

      <Act labelledBy="legal-body" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="legal-body" className="sr-only">
            {doc.title}
          </h2>
          <Blocks blocks={doc.body} />
        </div>
      </Act>

      <Act labelledBy="other-legal" surface="muted" spacing="tight">
        <div className="container-mk">
          <h2 id="other-legal" className="text-mk-title font-semibold text-fg">
            The other documents
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {legalDocs
              .filter((other) => other.slug !== doc.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/legal/${other.slug}` as Route}
                    className="text-mk-body text-link underline underline-offset-4"
                  >
                    {other.title}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/trust/dpa" className="text-mk-body text-link underline underline-offset-4">
                Data processing
              </Link>
            </li>
          </ul>
        </div>
      </Act>
    </>
  );
}
