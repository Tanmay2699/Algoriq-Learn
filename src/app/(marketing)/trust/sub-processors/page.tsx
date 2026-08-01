import type { Metadata } from 'next';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Heading } from '../../../../components/primitives';
import { Table, Td, Tr } from '../../../../components/primitives/table';
import { pageMeta } from '../../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/trust/sub-processors');

const TRAIL = [
  { href: '/trust', label: 'Trust' },
  { href: '/trust/sub-processors', label: 'Sub-processors' },
];

const ROWS = [
  {
    purpose: 'Application and database hosting',
    who: 'Whoever hosts your instance',
    note: 'If we host it for you, our infrastructure provider. If you self-host, yours — and we are not a processor at all.',
  },
  {
    purpose: 'Object storage (uploads, media)',
    who: 'Configured by you',
    note: 'Local disk, any S3-compatible service, or Azure Blob. Chosen by an environment variable.',
  },
  {
    purpose: 'Email delivery',
    who: 'Configured by you',
    note: 'Any SMTP server. We do not require or bundle a particular provider.',
  },
  {
    purpose: 'Search',
    who: 'None, or Meilisearch',
    note: 'PostgreSQL by default — in which case there is no separate service at all.',
  },
  {
    purpose: 'AI generation',
    who: 'Configured by you, or nobody',
    note: 'OpenAI, Azure OpenAI or Anthropic. The default is disabled, and when it is disabled no text leaves your instance.',
  },
  {
    purpose: 'Website analytics',
    who: 'Nobody',
    note: 'Self-hosted, cookieless and aggregate. No analytics vendor receives anything.',
  },
];

export default function SubProcessorsPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Trust"
        title="Sub-processors"
        lead="Shorter than you are used to, because most of these are ports rather than vendors — and if you self-host, the list is empty."
        trail={TRAIL}
      />

      <Act labelledBy="table-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <h2 id="table-heading" className="sr-only">
            The list
          </h2>
          <Table
            caption="What each external dependency is for, and who provides it"
            head={['Purpose', 'Provider', 'Notes']}
          >
            {ROWS.map((row) => (
              <Tr key={row.purpose}>
                <Td header>{row.purpose}</Td>
                <Td>{row.who}</Td>
                <Td>{row.note}</Td>
              </Tr>
            ))}
          </Table>

          <div className="mt-block max-w-prose space-y-4 text-mk-body text-fg-muted">
            <p>
              This list is short for a structural reason rather than a marketing one: storage,
              mail, search, AI and cache are <strong className="text-fg">ports with drivers</strong>,
              selected by an environment variable, and no cloud-provider SDK is imported in
              feature code. There is nothing in the product that assumes a particular vendor,
              which is why there is nothing on this page that assumes one either.
            </p>
            <p>
              We will update this page before adding a sub-processor, not afterwards. If you are
              on a paid plan we will tell you directly.
            </p>
          </div>
        </div>
      </Act>

      <Act labelledBy="website-heading" surface="muted" spacing="tight">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="website-heading" display="title">
            And this website
          </Heading>
          <p className="mt-4 text-mk-body text-fg-muted">
            Makes no request to any host other than itself. No font CDN, no tag manager, no chat
            widget, no CAPTCHA, no embedded video. The content-security policy is{' '}
            <code className="font-mono">default-src &apos;self&apos;</code>; the only relaxation
            is inline script and style, which the framework needs for its own bootstrap. A
            browser test fails our build if it widens any further. You can verify all of it in
            your own network tab, which is rather the point.
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="The rest of the trust documents"
        lead="Data processing, responsible disclosure, the accessibility statement and the honest build status."
        primary={{ href: '/trust', label: 'What we can prove' }}
        secondary={{ href: '/security', label: 'Security notes' }}
      />
    </>
  );
}
