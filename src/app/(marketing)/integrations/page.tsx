import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading, Mono } from '../../../components/primitives';
import { pageMeta } from '../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/integrations');

const TRAIL = [{ href: '/integrations', label: 'Integrations' }];

const BUILT: { name: string; detail: string; env?: string; href?: string }[] = [
  {
    name: 'Sign in with Google, Microsoft or GitHub',
    detail: 'OAuth, with a one-time handoff code rather than tokens in a redirect URL.',
    href: '/security#identity',
  },
  { name: 'SMTP', detail: 'Any server. Mail is drained from a transactional outbox by a worker, with retries and a delivery log.', env: 'MAIL_DRIVER=smtp' },
  { name: 'S3-compatible storage', detail: 'Covers AWS S3, MinIO and Cloudflare R2.', env: 'STORAGE_DRIVER=s3' },
  { name: 'Azure Blob Storage', detail: 'The same port, a different driver.', env: 'STORAGE_DRIVER=azure-blob' },
  { name: 'Local disk', detail: 'For a single-server deployment, or a laptop.', env: 'STORAGE_DRIVER=local' },
  { name: 'Meilisearch', detail: 'Or PostgreSQL full-text, behind the same interface, kept current by incremental sync.', env: 'SEARCH_DRIVER=meilisearch' },
  { name: 'OpenAI, Azure OpenAI, Anthropic', detail: 'Course-outline and lesson drafting. Default is disabled, and when disabled the feature is hidden rather than broken.', env: 'AI_PROVIDER=disabled' },
  { name: 'Webhooks', detail: 'HMAC-signed, retried, with an inspectable and replayable delivery log.', href: '/developers/webhooks' },
  { name: 'API keys', detail: 'Hashed at rest, revealed once, rotate and revoke.', href: '/developers' },
  { name: 'CSV import and export', detail: 'People and courses in, everything out, with a per-row error report.', href: '/resources/migrating-from-spreadsheets' },
  { name: 'Redis', detail: 'Shared cache for rate limiting, permission grants and tenant resolution. Production refuses the in-memory driver.', env: 'CACHE_DRIVER=redis' },
];

const NOT_BUILT: { name: string; detail: string }[] = [
  {
    name: 'Meeting providers',
    detail:
      'Zoom, Meet, Teams and Jitsi. There is no adapter — you paste the link onto the session. Attendance is recorded in Akechi, not synced from the provider.',
  },
  {
    name: 'Payment gateways',
    detail:
      'You can raise, discount, track and reconcile an invoice, and record a payment. You cannot take a card inside the product.',
  },
  { name: 'SMS and WhatsApp', detail: 'Notifications go to the in-app inbox and to email. Nothing else.' },
  { name: 'SAML and OIDC', detail: 'Enterprise single sign-on is not built. The three OAuth providers above are.' },
  { name: 'SCIM', detail: 'No automatic user provisioning from your identity provider. People are added by invitation or CSV import.' },
  { name: 'Video transcoding', detail: 'The storage port and the player are built; the transcoding worker is not. Upload what the browser can play.' },
  { name: 'Plagiarism detection', detail: 'Assignments have rubrics and criterion marks. No similarity checking.' },
  { name: 'Proctoring services', detail: 'Deliberately. Integrity is signals shown to a human, never an automatic verdict.' },
  { name: 'Accounting systems', detail: 'No Tally, Xero or QuickBooks sync. Finance data exports as CSV.' },
];

export default function IntegrationsPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Integrations"
        title="Eleven that work, and nine that do not"
        lead="No logo wall. A logo grid implies partnerships we do not have, and it is always missing the second column — the one you actually need before you commit."
        trail={TRAIL}
      />

      <Act labelledBy="built-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="built-heading" display="display-3">
            Built
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Most of these are <strong className="text-fg">ports with drivers</strong> rather than
            integrations in the usual sense: one interface, several implementations, chosen by an
            environment variable. No cloud-provider SDK is imported in feature code, which is why
            swapping one is a connection string rather than a project.
          </p>

          <ul className="mt-block divide-y divide-border rounded-lg border border-border bg-surface">
            {BUILT.map((item) => (
              <li key={item.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-5">
                <h3 className="w-full text-mk-subtitle font-semibold text-fg sm:w-72">
                  {item.href ? (
                    <Link href={item.href as Route} className="hover:underline">
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </h3>
                <p className="flex-1 text-mk-body-sm text-fg-muted">{item.detail}</p>
                {item.env && <Mono className="text-fg-muted">{item.env}</Mono>}
              </li>
            ))}
          </ul>
        </div>
      </Act>

      <Act labelledBy="not-built-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="not-built-heading" display="display-3">
            A port with no driver yet
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Printing this column is the whole point of the page. One of these is probably a
            dealbreaker for somebody reading, and it is cheaper for both of us if they find out
            here.
          </p>

          <ul className="mt-block grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {NOT_BUILT.map((item) => (
              <li key={item.name} className="rounded-lg border border-border bg-surface p-5">
                <h3 className="text-mk-subtitle font-semibold text-fg">{item.name}</h3>
                <p className="mt-2 text-mk-body-sm text-fg-muted">{item.detail}</p>
              </li>
            ))}
          </ul>

          <p className="mt-block max-w-measure text-mk-body text-fg-muted">
            We would rather list eleven real integrations than sixty logos we have a screenshot
            of.{' '}
            <Link href="/trust/build-status" className="text-link underline underline-offset-4">
              The rest of what is unfinished
            </Link>
            .
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="Nothing on that second column was a dealbreaker?"
        lead="Then the fastest next step is the sandbox, or twenty minutes with somebody who can answer follow-up questions."
        primary={{ href: '/demo', label: 'Book a walkthrough' }}
        secondary={{ href: '/developers', label: 'Read the API reference' }}
      />
    </>
  );
}
