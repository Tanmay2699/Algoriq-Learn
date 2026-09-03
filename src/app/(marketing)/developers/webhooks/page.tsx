import type { Metadata } from 'next';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Counter, Heading, Prose } from '../../../../components/primitives';
import { Table, Td, Tr } from '../../../../components/primitives/table';
import { pageMeta } from '../../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/developers/webhooks');

const TRAIL = [
  { href: '/developers', label: 'Developers' },
  { href: '/developers/webhooks', label: 'Webhooks' },
];

const EVENTS = [
  { event: 'enrollment.created', when: 'A learner is enrolled on a course', module: 'learn' },
  { event: 'enrollment.completed', when: 'A learner finishes a course', module: 'learn' },
  { event: 'lead.created', when: 'An enquiry arrives, including from web-to-lead', module: 'crm' },
  { event: 'lead.stage_changed', when: 'An enquiry moves column', module: 'crm' },
  { event: 'application.decided', when: 'An application is accepted or rejected', module: 'crm' },
  { event: 'invoice.issued', when: 'An invoice is issued to a learner', module: 'finance' },
  { event: 'payment.recorded', when: 'A payment is recorded against an invoice', module: 'finance' },
  { event: 'attempt.submitted', when: 'A learner submits an assessment attempt', module: 'assess' },
  { event: 'certificate.issued', when: 'A certificate is issued', module: 'cert' },
  { event: 'certificate.revoked', when: 'A certificate is withdrawn', module: 'cert' },
];

export default function WebhooksPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Developers"
        title="Webhooks"
        lead="Signed, retried, logged and replayable from the interface — because a webhook you cannot inspect is one you cannot debug."
        trail={TRAIL}
      />

      <Act labelledBy="verify-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Prose>
            <h2 id="verify-heading">Verify the signature before you parse</h2>
            <p>
              Every delivery carries <code>X-Algoryq-Signature</code>, an HMAC-SHA256 over the{' '}
              <strong>raw request body</strong> using the endpoint&apos;s secret. Compute it over
              the bytes you received, not a re-serialised object — a JSON round-trip can reorder
              keys and change whitespace, and then the signature never matches.
            </p>
            <p>
              Compare in constant time. A naive string comparison leaks timing information, which
              is a small thing until somebody is patient.
            </p>
            <p>
              <code>X-Algoryq-Delivery</code> is a unique id for the attempt. Store it and ignore
              a repeat: retries are at-least-once by design, so your handler must be idempotent.
            </p>

            <h2 id="retries">Retries</h2>
            <p>
              A non-2xx response or a timeout is retried with backoff. Every attempt is written to
              a delivery log with its status code and response body, visible in the product and
              replayable by hand. If your endpoint was down for an hour, you can see what was
              missed and re-send it rather than reconciling by guesswork.
            </p>

            <h2 id="ordering">Ordering</h2>
            <p>
              Not guaranteed. Events are delivered as they happen and retries can arrive out of
              order, so treat each as a fact about a point in time and re-read the resource if
              current state matters. Anything else is a race you eventually lose.
            </p>

            <h2 id="security">What we will not do</h2>
            <ul>
              <li>We do not follow redirects.</li>
              <li>We do not send to plain HTTP.</li>
              <li>
                We do not include personal data beyond identifiers and the minimum that makes the
                event useful. Fetch the resource with your key if you need the rest.
              </li>
            </ul>
          </Prose>
        </div>
      </Act>

      <Act labelledBy="events-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="events-heading" display="display-3">
            The events
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Every mutation emits a domain event internally; the audit log and the notification
            fan-out both read them. These <Counter value={EVENTS.length} /> are the ones exposed
            over webhooks today.
          </p>
          <div className="mt-8">
            <Table caption="Webhook events, when each fires, and the module that owns it" head={['Event', 'Fires when', 'Module']}>
              {EVENTS.map((row) => (
                <Tr key={row.event}>
                  <Td header>
                    <code className="font-mono">{row.event}</code>
                  </Td>
                  <Td>{row.when}</Td>
                  <Td>
                    <code className="font-mono">{row.module}</code>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <ClosingCTA
        title="The rest of the developer surface"
        lead="Authentication, the response envelope, the public endpoints and their threat model, and how to run the platform yourself."
        primary={{ href: '/developers', label: 'API overview' }}
        secondary={{ href: '/security', label: 'Security notes' }}
      />
    </>
  );
}
