import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading, Lead } from '../../../components/primitives';
import { Table, Td, Tr } from '../../../components/primitives/table';
import { DesignPartnerOffer } from '../../../components/sections/proof';
import { RoiCalculator } from '../../../components/sections/roi-calculator';
import { pageMeta } from '../../../config/seo';
import { quickComparison, toolStack } from '../../../content/lifecycle';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/why-algoryq-learn');

const TRAIL = [{ href: '/why-algoryq-learn', label: 'Why Algoryq Learn' }];

export default function WhyPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="The case"
        title="Nothing reconciles. That is what you are actually buying a fix for."
        lead="Five tools that have never met each other, each of them working, and every seam between them leaking money, students or a month of reporting time."
        trail={TRAIL}
      />

      <Act labelledBy="before-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="before-heading" display="display-3">
            Before
          </Heading>
          <Lead className="mt-4">
            This table is not a strawman. It is the researched current state of institutes in
            this market, from our own requirements work.
          </Lead>
          <div className="mt-8">
            <Table
              caption="What an institute uses today for each job, and what the gap costs"
              head={['The job', 'What you use today', 'What it costs you']}
            >
              {toolStack.map((row) => (
                <Tr key={row.job}>
                  <Td header>{row.job}</Td>
                  <Td>{row.today}</Td>
                  <Td className="text-danger-text">{row.cost}</Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <Act labelledBy="after-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="after-heading" display="display-3">
            After
          </Heading>
          <Lead className="mt-4">
            Same rows, same order. Only the right-hand column changes — which is the argument.
          </Lead>
          <div className="mt-8">
            <Table
              caption="Each job an institute does, and where it lives with Algoryq Learn"
              head={['The job', 'Today', 'With Algoryq Learn']}
            >
              {toolStack.map((row) => (
                <Tr key={row.job}>
                  <Td header>{row.job}</Td>
                  <Td>{row.today}</Td>
                  <Td>
                    <Link href={row.href as Route} className="text-link underline underline-offset-4">
                      {row.withAlgoryq}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <Act id="roi" labelledBy="roi-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="roi-heading" display="display-3">
            Do the arithmetic yourself
          </Heading>
          <Lead className="mt-4">
            Nothing is pre-filled, we compute only what your inputs support, and the formula is
            printed under the result. We do not show a &ldquo;revenue increase&rdquo; because we
            have no data for one, and a calculator that manufactures a benefit is a calculator a
            finance director discards along with the vendor.
          </Lead>
          <div className="mt-block">
            <RoiCalculator />
          </div>
        </div>
      </Act>

      <Act labelledBy="compare-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="compare-heading" display="display-3">
            Against what you might be considering
          </Heading>
          <div className="mt-8">
            <Table
              caption="Algoryq Learn compared with Moodle and Google Classroom on six capabilities"
              head={['Capability', 'Algoryq Learn', 'Moodle', 'Google Classroom']}
            >
              {quickComparison.map((row) => (
                <Tr key={row.capability}>
                  <Td header>{row.capability}</Td>
                  <Td className="text-fg">{row.algoryq}</Td>
                  <Td>{row.moodle}</Td>
                  <Td>{row.classroom}</Td>
                </Tr>
              ))}
            </Table>
          </div>
          <p className="mt-6 text-mk-body-sm">
            <Link href="/compare/moodle" className="text-link underline underline-offset-4">
              The full comparisons, with a source and a date on every cell
            </Link>
          </p>
        </div>
      </Act>

      <Act labelledBy="honest-heading" surface="ink" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="honest-heading" display="display-3" surface="ink">
            And the case against
          </Heading>
          <div className="mt-6 max-w-prose space-y-4 text-mk-body text-on-ink-muted">
            <p>
              We have no customers, no operational history and no certifications. There is no
              payment gateway, no enterprise single sign-on, no meeting-provider adapter and no
              transcoding. Four modules are under 60 per cent complete and we publish which.
            </p>
            <p>
              If any of that is load-bearing for you, the honest answer is that you should wait
              or choose something else — and we would rather write that here than discover it
              together in month three.
            </p>
            <p>
              If none of it is, the offer below is the most useful thing on this page.
            </p>
          </div>
          <div className="mt-block">
            <DesignPartnerOffer surface="ink" />
          </div>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
