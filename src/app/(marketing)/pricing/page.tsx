import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Stagger } from '../../../components/primitives/motion';
import { Badge, CTA, Card, Counter, Heading, Lead } from '../../../components/primitives';
import { Disclosure } from '../../../components/primitives/disclosure';
import { Table, Td, Tr } from '../../../components/primitives/table';
import { pageMeta } from '../../../config/seo';
import { formatMoney, includedEverywhere, plans, plansSource } from '../../../content/plans';
import { breadcrumbJsonLd, faqJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/pricing');

const TRAIL = [{ href: '/pricing', label: 'Pricing' }];

const FAQ = [
  {
    q: 'What counts as a seat?',
    a: 'A membership of your institute — a learner, a teacher or an administrator. Guardians linked to a learner are not seats, and somebody in two of your branches is one seat.',
  },
  {
    q: 'What happens when we hit a limit?',
    a: 'The action refuses, naming the limit. Nothing is silently truncated or deleted. The same refusal reaches a counsellor converting an application, which is why converting is two explicit steps.',
  },
  {
    q: 'Is there a contract or a minimum term?',
    a: 'No minimum on Starter, because there is nothing to sign. Growth is monthly. Enterprise is whatever we agree, in writing.',
  },
  {
    q: 'Can we pay by card?',
    a: 'Not inside the product. The billing module has no payment-gateway adapter yet, so a paid plan starts with a conversation and an invoice. The free tier needs neither.',
  },
  {
    q: 'Do you charge for the API, or for security features?',
    a: 'No. Tiering security is a dark pattern. Row-level isolation, the permission model, the audit log, the API, webhooks, exports and the right to self-host are on every plan, including the free one.',
  },
  {
    q: 'Can we self-host instead?',
    a: 'Yes. One compose file boots the whole platform with no cloud account. Self-hosted, there is nothing to pay us and no telemetry going anywhere.',
  },
];

export default function PricingPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL), faqJsonLd(FAQ)])}

      <PageHero
        eyebrow="Pricing"
        title="Free for one campus. Priced for a group."
        lead="Three plans, real numbers, no asterisk. These limits are the rows in our own plans table, not a marketing simplification."
        trail={TRAIL}
        photo={{
          src: '/images/pages/pricing.jpg',
          alt: 'A team reviewing pricing plans for Starter, Growth, and Enterprise on laptops.',
        }}
      />

      <Act labelledBy="plans-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="plans-heading" className="sr-only">
            Plans
          </h2>
          {/*
            Cheapest first, arriving in that order. The stagger is not decoration on a price
            grid: three cards appearing together are a comparison, three arriving in sequence
            are a recommendation, and the one we recommend starting on is the free one.
          */}
          <Stagger step={90} className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.key} elevation={plan.key === 'growth' ? 'e2' : 'e0'} className="flex flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-mk-title font-semibold text-fg">{plan.name}</h3>
                  {plan.key === 'starter' && <Badge tone="accent">No card</Badge>}
                  {plan.key === 'growth' && <Badge tone="brand">Most institutes</Badge>}
                </div>

                <p className="mt-4 font-display text-display-3 text-fg">
                  {plan.maxSeats === null ? 'Let’s talk' : <Counter value={plan.priceMinor / 100} prefix="₹" />}
                  {plan.maxSeats !== null && plan.priceMinor > 0 && (
                    <span className="font-sans text-mk-body text-fg-muted"> / month</span>
                  )}
                </p>
                <p className="mt-3 text-mk-body-sm text-fg-muted">{plan.description}</p>

                <dl className="mt-6 space-y-2.5 text-mk-body-sm">
                  <Limit label="Seats" value={limitNode(plan.maxSeats)} />
                  <Limit label="Courses" value={limitNode(plan.maxCourses)} />
                  <Limit label="Storage" value={bytesNode(plan.storageBytes)} />
                  <Limit
                    label="AI tokens"
                    value={
                      plan.aiTokensPerMonth === null ? (
                        'Unlimited'
                      ) : (
                        <>
                          <Counter value={plan.aiTokensPerMonth} /> / month
                        </>
                      )
                    }
                  />
                </dl>

                <div className="mt-auto pt-6">
                  <CTA href={plan.cta.href} variant={plan.key === 'growth' ? 'primary' : 'secondary'} size="lg" className="w-full">
                    {plan.cta.label}
                  </CTA>
                </div>
              </Card>
            ))}
          </Stagger>

          <p className="mt-8 max-w-prose text-mk-body text-fg-muted">
            There is no online checkout — the billing module has no payment-gateway adapter, so
            every paid plan starts with a short conversation. The free tier starts without one.
          </p>
          <p className="mt-3 max-w-prose text-mk-body-sm text-fg-muted">
            A snapshot of the product&apos;s <code className="font-mono">plans</code> table taken
            on {plansSource.capturedAt}. Once the product exposes a public plans endpoint this page
            will read it directly and cannot drift; until then this is a second copy, and saying so
            is cheaper than being caught by it.
          </p>
        </div>
      </Act>

      <Act labelledBy="included-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="included-heading" display="display-3">
            On every plan, including the free one
          </Heading>
          <Lead className="mt-4">
            Tiering security is a dark pattern. None of this is an upgrade.
          </Lead>
          <ul className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {includedEverywhere.map((item) => (
              <li key={item} className="flex gap-2.5 text-mk-body text-fg">
                <span aria-hidden="true" className="text-accent">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <Act labelledBy="compare-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="compare-heading" display="display-3">
            Side by side
          </Heading>
          <div className="mt-8">
            <Table caption="The three plans compared on limits" head={['', ...plans.map((p) => p.name)]}>
              <Tr>
                <Td header>Price</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>
                    {plan.maxSeats === null
                      ? 'Negotiated'
                      : plan.priceMinor === 0
                        ? 'Free'
                        : `${formatMoney(plan.priceMinor, plan.currency)} / month`}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td header>Seats</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>{limitNode(plan.maxSeats)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td header>Courses</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>{limitNode(plan.maxCourses)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td header>Storage</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>{bytesNode(plan.storageBytes)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td header>AI budget</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>{limitNode(plan.aiTokensPerMonth)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td header>Branches</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>Unlimited</Td>
                ))}
              </Tr>
              <Tr>
                <Td header>Security, audit, API, self-hosting</Td>
                {plans.map((plan) => (
                  <Td key={plan.key}>Included</Td>
                ))}
              </Tr>
            </Table>
          </div>
        </div>
      </Act>

      <Act labelledBy="pricing-faq-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="pricing-faq-heading" display="display-3">
            Pricing questions
          </Heading>
          <div className="mt-8 max-w-prose">
            {FAQ.map((item) => (
              <Disclosure key={item.q} summary={item.q}>
                {item.a}
              </Disclosure>
            ))}
          </div>
          <p className="mt-8 text-mk-body-sm">
            <Link href="/security" className="text-link underline underline-offset-4">
              The security questions are answered on their own page
            </Link>
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="Start on the free tier."
        lead="A hundred seats, twenty-five courses, no card, no call. Bring your spreadsheet."
        primary={{ href: '/demo?intent=starter', label: 'Start free' }}
        secondary={{ href: '/demo', label: 'Book a 20-minute walkthrough' }}
      />
    </>
  );
}

function Limit({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="font-medium tabular-nums text-fg">{value}</dd>
    </div>
  );
}

/** `null` means unlimited/negotiated — the only case with nothing to count up to. */
function limitNode(value: number | null): React.ReactNode {
  return value === null ? 'Unlimited' : <Counter value={value} />;
}

function bytesNode(bytes: number | null): React.ReactNode {
  if (bytes === null) return 'Unlimited';
  return <Counter value={Math.round(bytes / 1024 ** 3)} suffix=" GiB" />;
}
