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
import { toolStack } from '../../../content/lifecycle';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/why-algoryq-learn');

const TRAIL = [{ href: '/why-algoryq-learn', label: 'Why Algoryq Learn' }];

/**
 * This page used to print the tool stack twice — once with the cost column, once with the
 * Algoryq column — and then a third table comparing us with Moodle and Classroom, which is the
 * same table the homepage and /compare both carry. Three tables, two of them the same rows in a
 * different order, and a reader had to scroll back to check. It is one table now, and the
 * comparison lives on /compare, which is the page that owns that query.
 */
export default function WhyPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="The case"
        title="Nothing reconciles. That is what an all-in-one LMS actually fixes."
        lead="Five tools that have never met each other, each working, and every seam between them leaking money, students or a month of reporting time."
        trail={TRAIL}
      />

      <Act labelledBy="seams-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="seams-heading" display="display-3">
            Before, and after, in one table
          </Heading>
          <Lead className="mt-4">
            Not a strawman — the researched current state of institutes in this market, from our
            own requirements work. Same rows throughout. The last column is the argument.
          </Lead>
          <div className="mt-8">
            <Table
              caption="Each job an institute does, what a split stack costs, and where it lives in Algoryq Learn"
              head={['The job', 'Today', 'What it costs', 'With Algoryq Learn']}
            >
              {toolStack.map((row) => (
                <Tr key={row.job}>
                  <Td header>{row.job}</Td>
                  <Td>{row.today}</Td>
                  <Td className="text-danger-text">{row.cost}</Td>
                  <Td>
                    <Link href={row.href as Route} className="text-link underline underline-offset-4">
                      {row.withAlgoryq}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
          <p className="mt-6 text-mk-body-sm">
            <Link href="/compare" className="text-link underline underline-offset-4">
              And against Moodle, Canvas and Google Classroom, with a source on every cell
            </Link>
          </p>
        </div>
      </Act>

      <Act id="roi" labelledBy="roi-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="roi-heading" display="display-3">
            Do the arithmetic yourself
          </Heading>
          <Lead className="mt-4">
            Nothing is pre-filled, we compute only what your inputs support, and the formula is
            printed under the result. There is no &ldquo;revenue increase&rdquo; line, because we
            have no data for one — and a calculator that manufactures a benefit is one a finance
            director discards along with the vendor.
          </Lead>
          <div className="mt-block">
            <RoiCalculator />
          </div>
        </div>
      </Act>

      <Act labelledBy="honest-heading" surface="ink" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="honest-heading" display="display-3" surface="ink">
            And the case against
          </Heading>
          <div className="mt-6 max-w-prose space-y-4 text-mk-body text-on-ink-muted">
            <p>
              No customers, no operational history, no certifications. No payment gateway, no
              enterprise single sign-on, no meeting-provider adapter, no transcoding. Four modules
              are under 60 per cent complete, and we publish which.
            </p>
            <p>
              If any of that is load-bearing for you, wait or choose something else — better said
              here than discovered together in month three. If none of it is, the offer below is
              the most useful thing on this page.
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
