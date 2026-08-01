import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { Act } from '../../../../../components/layout/act';
import { ClosingCTA, NotBuilt, PageHero } from '../../../../../components/layout/page-parts';
import { Badge, Card, Heading, Mono } from '../../../../../components/primitives';
import { Stagger } from '../../../../../components/primitives/motion';
import { clusters } from '../../../../../config/navigation';
import { dynamicMeta } from '../../../../../config/seo';
import { moduleBySlug, modules } from '../../../../../content/modules';
import { breadcrumbJsonLd, jsonLd } from '../../../../../lib/json-ld';

export function generateStaticParams() {
  return modules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const module = moduleBySlug(slug);
  if (!module) return {};
  return dynamicMeta(`/product/modules/${module.slug}`, `${module.title} — ${module.h1}`, module.lead);
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = moduleBySlug(slug);
  if (!module) notFound();

  const cluster = clusters.find((c) => c.key === module.cluster);
  const trail = [
    { href: '/product', label: 'Product' },
    ...(cluster ? [{ href: cluster.href, label: cluster.label }] : []),
    { href: `/product/modules/${module.slug}`, label: module.title },
  ];

  return (
    <>
      {jsonLd([breadcrumbJsonLd(trail)])}

      <PageHero eyebrow={cluster?.label ?? 'Product'} title={module.h1} lead={module.lead} trail={trail}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-mk-body-sm text-fg-muted">
            <Mono>{module.apiModule}</Mono> · {module.routes} API routes
          </span>
          {module.completeness < 65 && (
            <Badge tone="progress">{module.completeness}% against our own specification</Badge>
          )}
        </div>
        {module.completeness < 65 && (
          <p className="mt-4 max-w-measure text-mk-body-sm text-fg-muted">
            This module is one of the four we would rather you knew about before a demo rather
            than after one. What exists is below; so is what does not.
          </p>
        )}
      </PageHero>

      <Act labelledBy="does-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="does-heading" display="display-3">
            What it does
          </Heading>
          <Stagger className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {module.does.map((item) => (
              <Card key={item.title}>
                <h3 className="text-mk-subtitle font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-mk-body-sm text-fg-muted">{item.body}</p>
              </Card>
            ))}
          </Stagger>
        </div>
      </Act>

      <Act labelledBy="mechanism-heading" surface="ink" spacing="normal">
        <div className="container-mk">
          <p className="text-mk-eyebrow font-medium uppercase text-on-ink-muted">How it actually works</p>
          <Heading level={2} id="mechanism-heading" display="display-3" surface="ink" className="mt-4">
            {module.mechanism.title}
          </Heading>
          <p className="mt-5 max-w-prose text-mk-body text-on-ink-muted">{module.mechanism.body}</p>
        </div>
      </Act>

      <Act labelledBy="keys-heading" surface="paper" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="keys-heading" display="title">
              The permission keys it adds
            </Heading>
            <p className="mt-3 max-w-measure text-mk-body-sm text-fg-muted">
              A sample. Each one is a real key in the catalogue, with a description written for a
              school administrator rather than for an engineer.
            </p>
            <ul className="mt-5 space-y-1.5">
              {module.keys.map((key) => (
                <li key={key}>
                  <Mono className="rounded-sm bg-surface-muted px-2 py-1 text-fg-muted">{key}</Mono>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-mk-body-sm">
              <Link href="/security" className="text-link underline underline-offset-4">
                All 272 keys, filterable
              </Link>
            </p>
          </div>

          <div>
            <Heading level={2} display="title">
              Who holds it
            </Heading>
            <ul className="mt-5 flex flex-wrap gap-2">
              {module.roles.map((role) => (
                <li
                  key={role}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-mk-body-sm text-fg"
                >
                  {role}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-measure text-mk-body-sm text-fg-muted">
              These are the shipped role templates that hold it by default. Every one of them is
              a copy you own and can edit — nothing in the code reads a role&apos;s name.
            </p>
          </div>
        </div>
      </Act>

      <Act labelledBy="gaps-heading" surface="muted" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="gaps-heading" display="title">
              And what it does not
            </Heading>
            <p className="mt-3 max-w-measure text-mk-body-sm text-fg-muted">
              Naming these on the website is cheaper for both of us than discovering them in
              week six of a pilot.
            </p>
          </div>
          <NotBuilt items={module.notBuilt} />
        </div>
      </Act>

      <Act labelledBy="related-heading" surface="paper" spacing="tight">
        <div className="container-mk">
          <Heading level={2} id="related-heading" display="title">
            Related
          </Heading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {module.related.map((slug) => {
              const other = moduleBySlug(slug);
              if (!other) return null;
              return (
                <Card key={slug} as="article">
                  <h3 className="text-mk-subtitle font-semibold text-fg">
                    <Link href={`/product/modules/${other.slug}` as Route} className="hover:underline">
                      {other.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{other.h1}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
