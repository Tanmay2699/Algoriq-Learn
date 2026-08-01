import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Heading } from '../../../../components/primitives';
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
        lead={`Twenty-four modules, averaging ${averagePercent}% against our own written specification. This is the real matrix from our tracker, published unedited — including the rows we would rather not show you.`}
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
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-muted sm:block"
                    >
                      <span
                        className="block h-full rounded-full bg-viz-1"
                        style={{ width: `${row.percent}%` }}
                      />
                    </span>
                    <span className="tabular-nums font-medium text-fg">{row.percent}%</span>
                  </span>
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
            Some of these are on the way. Some of them are decisions we do not intend to
            reverse, and they are marked as such.
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
              Because you will find out anyway, and the only question is whether you find out
              before or after you have committed a term to us.
            </p>
            <p>
              Because a vendor who publishes their weak modules is a vendor whose strong claims
              are worth reading. Everything else on this site is more believable because this
              page exists.
            </p>
            <p>
              And because it is the same rule the product itself follows: an unbuilt surface in
              Akechi renders an honest &ldquo;not built yet&rdquo; component rather than a fake
              chart. We did not invent that rule for the website.
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
        lead="The sandbox is a real institute with seeded data, read-only, and you can see every role."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/product', label: 'Read about the modules' }}
      />
    </>
  );
}
