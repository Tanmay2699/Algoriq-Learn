import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, NotBuilt, PageHero } from '../../../../components/layout/page-parts';
import { Badge, Card, Counter, Heading } from '../../../../components/primitives';
import { Stagger } from '../../../../components/primitives/motion';
import {
  AdmissionsBoard,
  CourseDiff,
  ItemAnalysis,
  PeopleList,
  RiskList,
  RoleDashboard,
  RolesMatrix,
} from '../../../../components/product/renderings';
import { clusters } from '../../../../config/navigation';
import { dynamicMeta } from '../../../../config/seo';
import { modulesByCluster } from '../../../../content/modules';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

/** The one detail per cluster that only somebody who built it would know. */
const PROOF: Record<string, { heading: string; body: string; frame: React.ReactNode }> = {
  'admissions-and-growth': {
    heading: 'Round-robin is a cursor, not a count',
    body:
      '“Whoever has fewest enquiries” sounds fairer and is unpredictable in exactly the case that matters: two enquiries a second apart, both reading the same counts, both landing on the same counsellor. The cursor lives on the rule and is incremented in the database, so that cannot happen. A rule naming somebody who has left leaves the enquiry unassigned rather than parking it with a leaver, because the unclaimed queue is a state somebody looks at.',
    frame: <AdmissionsBoard />,
  },
  'academics-and-content': {
    heading: 'Restore rebuilds from the snapshot',
    body:
      'Restoring a course version rebuilds its lessons from the stored snapshot rather than patching the live course. That is right, and it has a sharp edge: any field the snapshot omits is erased on restore. When written lesson bodies were added, carrying them through publish, restore and diff was the work; the column was the easy part.',
    frame: <CourseDiff />,
  },
  'delivery-and-engagement': {
    heading: 'The offline queue replays in order, idempotently',
    body:
      'Progress events are queued on the device in their original sequence and replayed through one endpoint that is safe to call twice. Out-of-order replay would let a stale “quarter watched” overwrite a later “complete”; a non-idempotent one would double-count a retry. Neither is theoretical on a train through a tunnel.',
    frame: <RoleDashboard role="student" />,
  },
  'assessment-and-outcomes': {
    heading: 'Signals, shown to a human — never a verdict',
    body:
      'The marking queue is anonymised and drops anything already marked, so two markers cannot collide. Integrity is what a cooperating browser reported, disclosed to the candidate while it happens and shown to a marker with the caveat on the same screen. No camera, nothing automatic: a cheating verdict derived from a focus event is a false accusation waiting for a lawyer.',
    frame: <ItemAnalysis />,
  },
  'money-and-people': {
    heading: 'An invoice line copies its description at issue',
    body:
      'It does not read through to the course. Rename a course next term and last year’s invoice still says what was sold. Certificate wording and application details follow the same rule: a document that re-renders itself from live data quietly rewrites history.',
    frame: <PeopleList />,
  },
  intelligence: {
    heading: 'A saved search stores the query, never the results',
    body:
      'Which is why sharing one is safe: whoever you share it with runs it under their own permissions and sees only what they may. Results are trimmed at query time, not filtered afterwards in the interface, so a permission change takes effect on the next search rather than the next deployment.',
    frame: <RiskList />,
  },
  'platform-and-trust': {
    heading: 'One build serves every institute',
    body:
      'Branding — logo, colours, radius — is injected into the server-rendered shell at request time, read from the institute’s own row. No per-tenant builds, no per-tenant deployments, which is what makes a custom domain a DNS record rather than a release.',
    frame: <RolesMatrix />,
  },
};

export function generateStaticParams() {
  return clusters.map((cluster) => ({ cluster: cluster.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster: key } = await params;
  const cluster = clusters.find((c) => c.key === key);
  if (!cluster) return {};
  return dynamicMeta(
    `/product/${cluster.key}`,
    `${cluster.label} — ${cluster.job}`,
    `${cluster.blurb} ${cluster.modules} modules and ${cluster.routes} API routes, in the same database as everything else.`,
  );
}

export default async function ClusterPage({ params }: { params: Promise<{ cluster: string }> }) {
  const { cluster: key } = await params;
  const cluster = clusters.find((c) => c.key === key);
  if (!cluster) notFound();

  const proof = PROOF[cluster.key];
  const clusterModules = modulesByCluster(cluster.key);
  const trail = [
    { href: '/product', label: 'Product' },
    { href: cluster.href, label: cluster.label },
  ];

  return (
    <>
      {jsonLd([breadcrumbJsonLd(trail)])}

      <PageHero
        eyebrow={cluster.job}
        title={cluster.label}
        lead={cluster.blurb}
        trail={trail}
      >
        <p className="mt-6 text-mk-body-sm text-fg-muted">
          <Counter value={cluster.modules} /> modules · <Counter value={cluster.routes} /> API
          routes · one tenant boundary
        </p>
      </PageHero>

      {proof && (
        <Act labelledBy="proof-heading" surface="paper" spacing="normal">
          <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Heading level={2} id="proof-heading" display="display-3">
                {proof.heading}
              </Heading>
              <p className="mt-5 max-w-measure text-mk-body text-fg-muted">{proof.body}</p>
            </div>
            <div className="min-w-0">{proof.frame}</div>
          </div>
        </Act>
      )}

      {clusterModules.length > 0 && (
        <Act labelledBy="modules-heading" surface="muted" spacing="normal">
          <div className="container-mk">
            <Heading level={2} id="modules-heading" display="display-3">
              What is in it
            </Heading>
            <Stagger className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clusterModules.map((module) => (
                <Link
                  key={module.slug}
                  href={`/product/modules/${module.slug}` as Route}
                  className="block h-full rounded-lg border border-border bg-surface p-6 mk-lift hover:bg-surface-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-mk-title font-semibold text-fg">{module.title}</h3>
                    {module.completeness < 65 && (
                      <Badge tone="progress">
                        <Counter value={module.completeness} suffix="%" />
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{module.lead}</p>
                </Link>
              ))}
            </Stagger>

            <div className="mt-block max-w-prose">
              <NotBuilt items={[...new Set(clusterModules.flatMap((m) => m.notBuilt))]} />
            </div>
          </div>
        </Act>
      )}

      <Act labelledBy="related-heading" surface="paper" spacing="tight">
        <div className="container-mk">
          <Heading level={2} id="related-heading" display="title">
            Where to go next
          </Heading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clusters
              .filter((c) => c.key !== cluster.key)
              .slice(0, 3)
              .map((other) => (
                <Card key={other.key} as="article">
                  <h3 className="text-mk-subtitle font-semibold text-fg">
                    <Link href={other.href as Route} className="hover:underline">
                      {other.label}
                    </Link>
                  </h3>
                  <p className="mt-2 text-mk-body-sm text-fg-muted">{other.blurb}</p>
                </Card>
              ))}
          </div>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
