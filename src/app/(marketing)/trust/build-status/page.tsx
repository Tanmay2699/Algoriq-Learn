import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Counter, Heading, PercentBar } from '../../../../components/primitives';
import { Table, Td, Tr } from '../../../../components/primitives/table';
import { pageMeta } from '../../../../config/seo';
import { averagePercent, buildStatus, buildStatusUpdated, notBuiltAtAll } from '../../../../content/build-status';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/trust/build-status');

const TRAIL = [
  { href: '/trust', label: 'Trust' },
  { href: '/trust/build-status', label: 'Build status' },
];

export default function BuildStatusPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Build status"
        title="What is finished, and what is not."
        lead={
          <>
            Twenty-four modules, averaging <Counter value={averagePercent} suffix="%" /> against
            our own written specification. The real matrix from our tracker, published unedited —
            including the rows we would rather not show.
          </>
        }
        trail={TRAIL}
      >
        <p className="mt-6 text-mk-body-sm text-fg-muted">
          Updated {buildStatusUpdated}. The percentage is functional completeness against the
          specification, not effort spent.
        </p>
      </PageHero>

      <Act labelledBy="matrix-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="matrix-heading" className="sr-only">
            The module completion matrix
          </h2>
          <Table
            caption="Every module, its completeness against our specification, what exists and what does not"
            captionVisible
            head={['Module', '%', 'What is real', 'What is not']}
          >
            {buildStatus.map((row) => (
              <Tr key={row.module}>
                <Td header>
                  {row.module}
                  <span className="mt-0.5 block text-caption font-normal text-fg-muted">{row.cluster}</span>
                </Td>
                <Td>
                  <PercentBar value={row.percent} />
                </Td>
                <Td>{row.real}</Td>
                <Td className={row.gap === '—' ? '' : 'text-warning-text'}>{row.gap}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      </Act>

      <Act labelledBy="never-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="never-heading" display="display-3">
            Not built at all
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Some are on the way. Some are decisions we do not intend to reverse, and say so.
          </p>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {notBuiltAtAll.map((item) => (
              <li key={item.thing} className="rounded-lg border border-border bg-surface p-5">
                <h3 className="text-mk-subtitle font-semibold text-fg">{item.thing}</h3>
                <p className="mt-1.5 text-mk-body-sm text-fg-muted">{item.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <Act labelledBy="why-heading" surface="ink" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="why-heading" display="display-3" surface="ink">
            Why publish this
          </Heading>
          <div className="mt-6 space-y-4 text-mk-body text-on-ink-muted">
            <p>
              Because you will find out anyway, and the only question is whether that happens
              before or after you have committed a term to us.
            </p>
            <p>
              Because a vendor who publishes their weak modules is one whose strong claims are
              worth reading. Everything else here is more believable because this page exists.
            </p>
            <p>
              And because the product follows the same rule: an unbuilt surface renders an honest
              &ldquo;not built yet&rdquo; component rather than a fake chart. We did not invent
              that rule for the website.
            </p>
          </div>
          <p className="mt-8 text-mk-body-sm">
            <Link href="/security" className="text-on-ink underline underline-offset-4">
              The security notes carry their own version of this list
            </Link>
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="If none of that was a dealbreaker, look at the software."
        lead="The sandbox is a real institute with seeded data, read-only, and every role visible."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/product', label: 'Read about the modules' }}
      />
    </>
  );
}
