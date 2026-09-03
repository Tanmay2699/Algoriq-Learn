import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Badge, Card, Counter, Heading, Lead, StatBlock } from '../../../components/primitives';
import { Stagger } from '../../../components/primitives/motion';
import { clusters } from '../../../config/navigation';
import { pageMeta } from '../../../config/seo';
import { averagePercent } from '../../../content/build-status';
import { modules } from '../../../content/modules';
import { spine } from '../../../content/lifecycle';
import { breadcrumbJsonLd, itemListJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/product');

const TRAIL = [{ href: '/product', label: 'Product' }];

export default function ProductPage() {
  return (
    <>
      {jsonLd([
        breadcrumbJsonLd(TRAIL),
        itemListJsonLd(
          'Algoryq Learn product clusters',
          clusters.map((cluster) => ({ href: cluster.href, label: cluster.label })),
        ),
      ])}

      <PageHero
        eyebrow="The product"
        title="Thirty-one LMS modules. One tenant. One audit trail."
        lead="One backend, one PostgreSQL database, one frontend. What follows is all of it, grouped by the job it does rather than the team that built it."
        trail={TRAIL}
        photo={{
          src: '/images/pages/product.jpg',
          alt: 'Two people reviewing a floor-plan style architecture diagram on paper, a laptop open beside them.',
          caption: 'Representative photography.',
        }}
      />

      <Act labelledBy="spine-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="spine-heading" display="display-3">
            The spine everything hangs off
          </Heading>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {spine.map((stop, index) => (
              <li key={stop.step} className="rounded-lg border border-border bg-surface p-5">
                <p className="font-mono text-caption text-fg-muted">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-mk-subtitle font-semibold text-fg">{stop.step}</h3>
                <p className="mt-1.5 text-mk-body-sm text-fg-muted">{stop.title}</p>
                <p className="mt-3">
                  <Link href={stop.href as Route} className="text-mk-body-sm text-link underline underline-offset-4">
                    {stop.module}
                  </Link>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Act>

      <Act labelledBy="clusters-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="clusters-heading" display="display-3">
            Seven clusters
          </Heading>
          <Lead className="mt-4">Each is a job an institute has to do, not a department we happen to have.</Lead>

          <Stagger className="mt-block grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <Link
                key={cluster.key}
                href={cluster.href as Route}
                className="block h-full rounded-lg border border-border bg-surface p-6 mk-lift hover:bg-surface-muted"
              >
                <p className="text-caption font-medium uppercase tracking-wide text-fg-muted">{cluster.job}</p>
                <h3 className="mt-2 text-mk-title font-semibold text-fg">{cluster.label}</h3>
                <p className="mt-2 text-mk-body-sm text-fg-muted">{cluster.blurb}</p>
                <p className="mt-4 text-caption text-fg-muted">
                  <Counter value={cluster.modules} /> modules · <Counter value={cluster.routes} /> API routes
                </p>
              </Link>
            ))}
          </Stagger>
        </div>
      </Act>

      <Act labelledBy="modules-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="modules-heading" display="display-3">
            Every module with a page of its own
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Fourteen of them. The other seventeen are the platform underneath — identity,
            authorization, audit, tenancy, notifications, search — and they are sold at cluster
            level, because nobody shops for an audit module.
          </p>

          <ul className="mt-block grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <li key={module.slug}>
                <Link
                  href={`/product/modules/${module.slug}` as Route}
                  className="block h-full rounded-lg border border-border bg-surface p-5 mk-lift hover:bg-surface-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-mk-subtitle font-semibold text-fg">{module.title}</h3>
                    {module.completeness < 65 && (
                      <Badge tone="progress">
                        <Counter value={module.completeness} suffix="%" />
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{module.h1}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <Act labelledBy="honesty-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="honesty-heading" display="display-3">
            How complete is all this, really?
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Twenty-four modules, averaging <Counter value={averagePercent} suffix="%" /> against
            our own written specification. We publish every row, including the four below 60% —
            which is the reason the rest of this site is worth reading.
          </p>

          <Stagger className="mt-block grid gap-8 sm:grid-cols-3">
            <StatBlock evidence="permission-keys" label="permission keys, deny by default" />
            <StatBlock evidence="rls-tables" label="tables under forced row-level security" />
            <StatBlock evidence="migrations" label="committed migrations — db push is banned" />
          </Stagger>

          <div className="mt-block">
            <Card className="max-w-prose">
              <h3 className="text-mk-title font-semibold text-fg">The four we would rather you knew about</h3>
              <ul className="mt-4 space-y-2 text-mk-body-sm text-fg-muted">
                <li>
                  AI services — <Counter value={45} suffix="%" />. Drafting works; tutoring,
                  grading and transcription are not built.
                </li>
                <li>
                  The parent portal — <Counter value={40} suffix="%" />. Guardians see courses and
                  marks; there are no digests.
                </li>
                <li>
                  Certificates — <Counter value={55} suffix="%" />. Issuing and public
                  verification work; digital signatures do not.
                </li>
                <li>
                  HR — <Counter value={55} suffix="%" />. Records, leave and a register. No
                  payroll, deliberately and permanently.
                </li>
              </ul>
              <p className="mt-5">
                <Link href="/trust/build-status" className="text-mk-body text-link underline underline-offset-4">
                  All twenty-four rows
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
