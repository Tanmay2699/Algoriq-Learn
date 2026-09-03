import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Act } from '../../components/layout/act';
import { ClosingCTA } from '../../components/layout/page-parts';
import { RoleSwitcher } from '../../components/sections/hero';
import { VideoHero } from '../../components/sections/video-hero';
import { ModuleExplorer } from '../../components/sections/module-explorer';
import { DesignPartnerOffer, ProofBand } from '../../components/sections/proof';
import { RoiCalculator } from '../../components/sections/roi-calculator';
import { Badge, CTA, Card, Divider, Eyebrow, Heading, Lead, Mono, StatBlock } from '../../components/primitives';
import { CodeBlock } from '../../components/primitives/code-block';
import { Disclosure } from '../../components/primitives/disclosure';
import { Reveal, Stagger } from '../../components/primitives/motion';
import { Table, Td, Tr } from '../../components/primitives/table';
import { CourseDiff, RiskList, RolesMatrix, VerifyCertificate } from '../../components/product/renderings';
import { quickComparison, spine, toolStack } from '../../content/lifecycle';
import { averagePercent } from '../../content/build-status';
import { formatMoney, plans } from '../../content/plans';
import { faqJsonLd, jsonLd, organizationJsonLd, softwareJsonLd, websiteJsonLd } from '../../lib/json-ld';
import { pageMeta } from '../../config/seo';

export const metadata: Metadata = pageMeta('/');

const FAQ = [
  {
    q: 'Can we self-host it?',
    a: 'Yes. docker compose up boots the entire platform — API, worker, database, cache, object storage, search and a mail catcher — with no cloud account at all.',
  },
  {
    q: 'Where is our data?',
    a: 'In a PostgreSQL database you can point at. Isolation between institutes is a row-level security policy in the database itself, not application code that remembered to add a WHERE clause.',
  },
  {
    q: 'Can we import from Excel?',
    a: 'CSV import for people and courses, with a per-row error report rather than an all-or-nothing failure. Everything exports too.',
  },
  {
    q: 'Do you have single sign-on?',
    a: 'Not yet. Sign-in with Google, Microsoft and GitHub is built; SAML, OIDC and SCIM are not. It is on the build-status page with everything else that is missing.',
  },
  {
    q: 'Is it accessible?',
    a: 'WCAG 2.2 AA, with automated checks that fail the build at 360 pixels among other widths — and a published conformance statement that lists what still fails.',
  },
  {
    q: 'Can parents see marks?',
    a: 'Yes, read-only, through a guardian link. A parent account is not a learner account with fewer buttons; it is a different relationship in the data model.',
  },
  {
    q: 'Can we take fees online?',
    a: 'You can raise, track, discount and reconcile invoices. You cannot take a card payment inside the product — there is no payment-gateway adapter yet, and we would rather say so here than in week six.',
  },
  {
    q: 'What if we outgrow you, or you disappear?',
    a: 'Standard PostgreSQL, open ports for storage, mail, search and AI, a full export, and the right to self-host. The exit is documented before the entrance.',
  },
];

export default function HomePage() {
  return (
    <>
      {jsonLd([organizationJsonLd(), websiteJsonLd(), softwareJsonLd(), faqJsonLd(FAQ)])}

      {/* ───────────────────────────────── ACT I — Arrival */}
      <VideoHero />

      {/*
        What used to open Act I — the lead paragraph, the role switcher, the proof band —
        rather than duplicating the headline that now lives on the video. `VideoHero` carries
        its own `<h1>`; this act gets its own `<h2>` so it is still a landmark a screen-reader
        user can navigate to by name, not a region borrowing a heading from the section above.
      */}
      <Act labelledBy="act-1-continued" surface="ink" spacing="tight">
        <div className="container-mk">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <Reveal variant="left" className="max-w-xl">
              <Eyebrow surface="ink" className="mb-4">
                The System of Record
              </Eyebrow>
              <h2
                id="act-1-continued"
                className="font-display text-2xl sm:text-3xl lg:text-[2.125rem] font-normal leading-[1.3] tracking-[-0.02em] text-on-ink"
              >
                <span className="font-semibold text-white">Algoryq Learn</span> is the system of record for an institute —{' '}
                <span className="text-on-ink/90">
                  admissions, teaching, assessment, fees, staff and outcomes in one platform,
                </span>{' '}
                <span className="text-on-ink-muted">
                  where every action carries a permission and an audit trail.
                </span>
              </h2>
            </Reveal>

            <Reveal variant="right" className="min-w-0">
              <p className="text-mk-body-sm text-on-ink-muted">I am a…</p>
              <RoleSwitcher />
            </Reveal>
          </div>

          <Divider surface="ink" className="my-block" />
          <ProofBand />
        </div>
      </Act>

      {/* ───────────────────────────────── ACT II — The problem */}
      <Act labelledBy="act-2" surface="paper">
        <div className="container-mk">
          <Eyebrow>The stack you actually run</Eyebrow>
          <Heading level={2} id="act-2" className="mt-4">
            Nothing reconciles.
          </Heading>
          <Lead className="mt-5">
            Most institutes run on five or six tools that have never met each other. Each one
            works. The seams are where the money and the students go missing.
          </Lead>

          <Reveal className="mt-block">
            {/*
              `walkRows` on a prose table is the one place this gesture is arguable — the rows
              are sentences somebody is reading, not a picture of a screen. It is here because
              it was asked for, it uses the surface tint rather than the brand one so it reads
              as a reading cursor rather than a selection, and removing it is deleting this one
              prop.
            */}
            <Table
              caption="What an institute uses today for each job, and what the gap costs"
              head={['The job', 'What you use today', 'What it costs you']}
              walkRows={toolStack.length}
            >
              {toolStack.map((row) => (
                <Tr key={row.job}>
                  <Td header>{row.job}</Td>
                  <Td>{row.today}</Td>
                  <Td className="text-danger-text">{row.cost}</Td>
                </Tr>
              ))}
            </Table>
          </Reveal>

          <Stagger className="mt-block grid gap-6 md:grid-cols-3">
            <Card>
              <h3 className="text-mk-title font-semibold text-fg">A course platform is not an institute.</h3>
              <p className="mt-3 text-mk-body-sm text-fg-muted">
                Moodle, Classroom and Canvas are good at handing out coursework. None of them
                knows what an enquiry is, what a fee is, or who is about to drop out. So the
                other half of the institute goes back into the spreadsheet — and now you have
                two systems of record, which is none.
              </p>
            </Card>
            <Card>
              <h3 className="text-mk-title font-semibold text-fg">A CRM does not know what a batch is.</h3>
              <p className="mt-3 text-mk-body-sm text-fg-muted">
                Bolt a generic CRM onto a course platform and you get a pipeline that cannot
                spend a seat, an invoice that does not know what was taught, and a certificate
                nobody can verify.
              </p>
            </Card>
            <Card>
              <h3 className="text-mk-title font-semibold text-fg">The integration is the product.</h3>
              <p className="mt-3 text-mk-body-sm text-fg-muted">
                The value is not in any one module. It is in the enquiry that becomes an
                enrolment that becomes a progress record that becomes a mark that becomes a
                certificate — in one database, with one permission model, in one audit trail.
              </p>
            </Card>
          </Stagger>

          <p className="mt-8">
            <Link href="/compare/moodle" className="text-mk-body text-link underline underline-offset-4">
              See how we compare, factually
            </Link>
          </p>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT III — The thesis */}
      <Act labelledBy="act-3" surface="ink">
        <div className="container-mk">
          <Eyebrow surface="ink">Why we built it</Eyebrow>
          <Heading level={2} id="act-3" surface="ink" className="mt-4 max-w-[14ch]">
            One database. One login. One version of the truth.
          </Heading>
          <Lead surface="ink" className="mt-6">
            Algoryq Learn is a single backend, a single PostgreSQL database and a single frontend.
            Thirty-one modules share one tenant boundary, one permission catalogue and one
            audit log. A learner&apos;s enquiry, enrolment, attendance, marks, fees and
            certificate are rows that can see each other.
          </Lead>
          <p className="mt-4 max-w-measure text-mk-lead text-on-ink-muted">
            That is the whole idea. Everything below is a consequence of it.
          </p>

          <Stagger className="mt-block grid gap-8 sm:grid-cols-3">
            <StatBlock evidence="api-modules" label="backend modules, one deployment" surface="ink" />
            <StatBlock evidence="api-routes" label="API routes, every one permission-checked" surface="ink" />
            <StatBlock evidence="prisma-models" label="database models, one database" surface="ink" />
          </Stagger>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT IV — The product */}
      <Act labelledBy="act-4" surface="paper">
        <div className="container-mk">
          <Eyebrow>The whole product</Eyebrow>
          <Heading level={2} id="act-4" className="mt-4">
            This is the whole thing.
          </Heading>
          <Lead className="mt-5">
            Seven clusters, thirty-one modules, one tenant. Choose one to look inside — every
            surface below is built from the product&apos;s own components and tokens.
          </Lead>

          {/*
            `zoom` rather than `rise`: this is the surface the act is about, and a large frame
            that slides up from below reads as a card in a list. Settling out of a slight
            over-scale reads as a camera finding it, which is the gesture the whole section
            wants — "look inside" is the copy, so the motion should be a look, not a slide.
          */}
          <Reveal variant="zoom" className="mt-block">
            <ModuleExplorer />
          </Reveal>

          <p className="mt-block max-w-measure text-mk-body-sm text-fg-muted">
            Four of these are still being finished, and we publish exactly how far along each
            one is — the twenty-four rows average {averagePercent}% against our own
            specification.{' '}
            <Link href="/trust/build-status" className="text-link underline underline-offset-4">
              See what&apos;s built
            </Link>
            .
          </p>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT V — Automation and AI */}
      <Act labelledBy="act-5" surface="muted">
        <div className="container-mk">
          <Eyebrow>Automation</Eyebrow>
          <Heading level={2} id="act-5" className="mt-4">
            The repetitive half, done for you.
          </Heading>

          <Stagger className="mt-block grid gap-6 md:grid-cols-3">
            <Card>
              <h3 className="text-mk-title font-semibold text-fg">Approvals that route themselves</h3>
              <p className="mt-3 text-mk-body-sm text-fg-muted">
                Configurable approval chains on courses, leave and applications: steps,
                approvers, decisions, and an audit entry for each.
              </p>
            </Card>
            <Card>
              <h3 className="text-mk-title font-semibold text-fg">Rules that assign work</h3>
              <p className="mt-3 text-mk-body-sm text-fg-muted">
                Round-robin on a cursor stored on the rule — not &ldquo;whoever has fewest&rdquo;,
                which two simultaneous enquiries defeat. A rule naming someone who has left
                leaves the enquiry unassigned, because an unclaimed queue is a thing somebody
                looks at.
              </p>
            </Card>
            <Card>
              <h3 className="text-mk-title font-semibold text-fg">A queue that will not drop a message</h3>
              <p className="mt-3 text-mk-body-sm text-fg-muted">
                Every notification is written to a transactional outbox in the same transaction
                as the thing that caused it, then drained by a worker with retries and a
                delivery log you can inspect and re-run.
              </p>
            </Card>
          </Stagger>

          <div className="mt-block rounded-lg border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-mk-title font-semibold text-fg">There is no visual workflow builder.</h3>
            <p className="mt-3 max-w-measure text-mk-body-sm text-fg-muted">
              Approval chains, assignment rules, waitlist promotion and scheduled jobs are
              configuration, not a canvas. If you need a drag-and-drop automation designer
              today, we are not there — and it is on{' '}
              <Link href="/trust/build-status" className="text-link underline underline-offset-4">
                the build-status page
              </Link>{' '}
              with everything else.
            </p>
          </div>

          <Divider className="my-block" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>Artificial intelligence</Eyebrow>
              <Heading level={3} display="display-3" className="mt-4">
                Drafts, never decisions.
              </Heading>
              <p className="mt-5 max-w-measure text-mk-body text-fg-muted">
                Paste an outline, get a course structure. Ask for a lesson, get Markdown you can
                edit. Nothing an AI produces reaches a course until a human presses apply — that
                is a separate, audited action, not a setting.
              </p>
              <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
                The provider is a port: OpenAI, Azure OpenAI or Anthropic, chosen by an
                environment variable. The default is <Mono>disabled</Mono>, and when it is
                disabled the feature is hidden rather than broken. Token budgets are per
                institute. Generations are cached.
              </p>
              <p className="mt-6">
                <Link
                  href="/product/modules/ai-assistance"
                  className="text-mk-body text-link underline underline-offset-4"
                >
                  What the AI actually does, and what it does not
                </Link>
              </p>
            </div>
            <Reveal variant="zoom"><CourseDiff /></Reveal>
          </div>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT VI — The lifecycle spine */}
      <Act labelledBy="act-6" surface="ink">
        <div className="container-mk">
          <Eyebrow surface="ink">The spine</Eyebrow>
          <Heading level={2} id="act-6" surface="ink" className="mt-4">
            One record travels the whole way.
          </Heading>
          <Lead surface="ink" className="mt-5">
            Seven steps, six modules, one row that keeps its history. This is the part a
            five-tool stack cannot do at any price.
          </Lead>

          <ol className="mt-block">
            {spine.map((stop, index) => (
              <Reveal as="li" key={stop.step} delay={index * 60}>
                <div className="relative grid gap-4 border-s border-ink-border ps-6 pb-10 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <span
                    aria-hidden="true"
                    className="absolute -start-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand"
                  />
                  <p className="font-mono text-mk-mono text-on-ink-muted">
                    {String(index + 1).padStart(2, '0')} · {stop.step}
                  </p>
                  <div className="max-w-measure">
                    <h3 className="text-mk-title font-semibold text-on-ink">{stop.title}</h3>
                    <p className="mt-2 text-mk-body text-on-ink-muted">{stop.body}</p>
                    <p className="mt-3">
                      <Link
                        href={stop.href as Route}
                        className="text-mk-body-sm text-on-ink underline underline-offset-4"
                      >
                        {stop.module}
                      </Link>
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-6 rounded-lg border border-ink-border bg-ink-800 p-6 sm:p-8">
            <h3 className="text-mk-title font-semibold text-on-ink">
              And every one of those steps has a person attached.
            </h3>
            <p className="mt-3 max-w-prose text-mk-body text-on-ink-muted">
              Eleven role templates you can clone and reshape, scoped to a branch, a
              department, a course or a single record. Per-user overrides. Out-of-office
              delegation. Comments and questions on the work itself, not in a group chat.
              Nothing in the code branches on a role&apos;s name — which is why you can invent
              a role we never thought of.
            </p>
          </div>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT VII — Intelligence */}
      <Act labelledBy="act-7" surface="paper">
        <div className="container-mk">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>Analytics, reports and risk</Eyebrow>
              <Heading level={2} id="act-7" className="mt-4">
                Who is about to fall behind.
              </Heading>
              <Lead className="mt-5">
                Dashboards for each role, a report builder that saves definitions and runs them,
                exports collected in one place, and a risk score per learner with the signals
                that produced it.
              </Lead>
              <ul className="mt-8 space-y-4">
                {[
                  ['Dashboards', 'Per role, not one dashboard with things greyed out.'],
                  ['A report builder', 'Definitions you save and runs you can come back to.'],
                  ['Exports', 'Collected in one place, because a file outlives the screen that asked for it.'],
                  ['Risk and interventions', 'A score with its signals, and a record of what you did about it.'],
                ].map(([title, body]) => (
                  <li key={title}>
                    <h3 className="text-mk-subtitle font-semibold text-fg">{title}</h3>
                    <p className="mt-1 text-mk-body-sm text-fg-muted">{body}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-measure text-mk-body-sm text-fg-muted">
                Scheduled report delivery and pivot tables are not built. Reporting sits at 65%
                against our own specification, and we publish the number.
              </p>
            </div>
            <Reveal variant="zoom"><RiskList /></Reveal>
          </div>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT IX — Trust */}
      <Act labelledBy="act-9" surface="ink">
        <div className="container-mk">
          <Eyebrow surface="ink">Security</Eyebrow>
          <Heading level={2} id="act-9" surface="ink" className="mt-4">
            Isolation you can inspect.
          </Heading>
          <Lead surface="ink" className="mt-5">
            Not &ldquo;enterprise-grade&rdquo;. Here is the mechanism, and here is where it lives.
          </Lead>

          <div className="mt-block grid gap-6 md:grid-cols-2">
            <Card surface="ink">
              <h3 className="text-mk-title font-semibold text-on-ink">
                Tenant isolation is a database policy
              </h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                Every tenant-owned table carries a tenant id and a policy applied with{' '}
                <Mono>ENABLE</Mono> <em>and</em> <Mono>FORCE</Mono> — without <Mono>FORCE</Mono>,
                the table owner bypasses every policy. The application connects as a role that
                is not the owner, not a superuser and holds no <Mono>BYPASSRLS</Mono>. The
                policy set is derived from the database catalogue, so a new table is covered
                automatically and a gap fails CI. 114 tables. The 13 exemptions are named and
                reasoned — we publish them.
              </p>
            </Card>
            <Card surface="ink">
              <h3 className="text-mk-title font-semibold text-on-ink">
                Authorization is deny-by-default, and the build enforces it
              </h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                Every route carries a permission key or an explicit <Mono>@Public()</Mono>; a
                lint rule and a coverage check fail the build otherwise. 272 keys, 264 enforced
                on a route. The rest belong to surfaces not yet built, and that number is
                published too. Roles are per institute and fully customisable; nothing in the
                code branches on a role&apos;s name.
              </p>
            </Card>
            <Card surface="ink">
              <h3 className="text-mk-title font-semibold text-on-ink">The audit log is a hash chain</h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                Every mutation emits an event with a field-level diff, chained to the hash of
                the entry before it. Retention, legal holds and subject-access requests are
                built. Erasure tombstones the record; it never rewrites the chain that proves
                it. Hold beats retention; retention beats erasure.
              </p>
            </Card>
            <Card surface="ink">
              <h3 className="text-mk-title font-semibold text-on-ink">Accessibility is a build gate</h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                WCAG 2.2 AA. Automated checks run in the component library and in the browser
                suite — at 360 pixels among other widths — and fail the build. There is no
                drag-and-drop anywhere without a keyboard <em>and</em> a touch path; the
                admissions board uses a select and arrow buttons for exactly that reason.
              </p>
            </Card>
          </div>

          <div className="mt-block grid gap-8 lg:grid-cols-2 lg:gap-14">
            <Reveal variant="zoom">
              <RolesMatrix />
            </Reveal>
            <Reveal variant="zoom" delay={120}>
              <VerifyCertificate />
            </Reveal>
          </div>

          <div className="mt-block flex flex-wrap gap-3">
            <CTA href="/security" surface="ink" size="lg">
              Read the security notes
            </CTA>
            <CTA href="/trust/build-status" variant="secondary" surface="ink" size="lg">
              What we haven&apos;t built
            </CTA>
          </div>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT X — Extend and fit */}
      <Act labelledBy="act-10" surface="paper">
        <div className="container-mk">
          <Eyebrow>Customisation, integrations and the API</Eyebrow>
          <Heading level={2} id="act-10" className="mt-4">
            Shape it without us.
          </Heading>

          <div className="mt-block grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Your roles', 'Clone a template, change what it holds, scope it to a branch or a course. Nothing reads the name.'],
              ['Your fields', 'Custom fields on every major entity, stored as JSONB with an index — designed in from day one, not retrofitted.'],
              ['Your brand', 'Logo, colours, radius and your own domain. One build serves every institute; branding is injected into the server-rendered shell.'],
              ['Your flow', 'Approval chains, assignment rules, feature flags with per-institute overrides, saved views.'],
            ].map(([title, body]) => (
              <Card key={title}>
                <h3 className="text-mk-subtitle font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-mk-body-sm text-fg-muted">{body}</p>
              </Card>
            ))}
          </div>

          <div className="mt-block grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Heading level={3} display="title">
                The API is the same one this page uses
              </Heading>
              <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
                The demo form on this website posts to the product&apos;s public enquiry
                endpoint, against our own institute. Our marketing leads land on our own
                admissions board.
              </p>
              <CodeBlock label="An example request to the public enquiry endpoint" className="mt-6">
{`POST /public/institutes/{slug}/enquiries
Content-Type: application/json

{ "name": "Ananya Deshmukh",
  "email": "ananya@example.com",
  "message": "Interested in the evening batch" }`}
              </CodeBlock>
              <p className="mt-4 max-w-measure text-mk-body-sm text-fg-muted">
                It forces the source, has no field for stage or owner, returns a fixed
                acknowledgement so it cannot be asked whether an email is on file, and answers
                identically for an unknown institute so it cannot enumerate them.
              </p>
              <p className="mt-6">
                <Link href="/developers" className="text-mk-body text-link underline underline-offset-4">
                  Read the API reference
                </Link>
              </p>
            </div>

            <div>
              <Heading level={3} display="title">
                Integrations, without a logo wall
              </Heading>
              <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
                A logo grid implies partnerships we do not have. Here is the list instead — both
                columns of it.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-caption font-medium uppercase tracking-wide text-fg-muted">Built</h4>
                  <ul className="mt-3 space-y-1.5 text-mk-body-sm text-fg">
                    {[
                      'Google, Microsoft, GitHub sign-in',
                      'SMTP',
                      'S3, MinIO, Azure Blob',
                      'Meilisearch',
                      'OpenAI, Azure OpenAI, Anthropic',
                      'Webhooks with HMAC and a delivery log',
                      'API keys',
                      'CSV import and export',
                    ].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-caption font-medium uppercase tracking-wide text-fg-muted">
                    A port with no driver yet
                  </h4>
                  <ul className="mt-3 space-y-1.5 text-mk-body-sm text-fg-muted">
                    {[
                      'Meeting providers — you paste a link',
                      'Payment gateways',
                      'SMS and WhatsApp',
                      'SCIM',
                      'SAML and OIDC',
                      'Transcoding',
                      'Plagiarism',
                      'Proctoring',
                    ].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6">
                <Link href="/integrations" className="text-mk-body text-link underline underline-offset-4">
                  The full list, and what each one means
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-block">
            <Heading level={3} display="title">
              Five kinds of institute, one product
            </Heading>
            <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ['Coaching institutes', 'Admissions volume and assessment depth', '/solutions/coaching-institutes'],
                ['Schools', 'Parents, the register, and fees that reconcile', '/solutions/schools'],
                ['Universities', 'Programme structure and accessibility conformance', '/solutions/universities'],
                ['Skilling academies', 'Placement is the product', '/solutions/skilling-academies'],
                ['Corporate L&D', 'Certificates anyone can verify', '/solutions/corporate-l-and-d'],
              ].map(([title, body, href]) => (
                <Link
                  key={title}
                  href={href as Route}
                  className="block h-full rounded-lg border border-border bg-surface p-5 transition-colors duration-fast hover:bg-surface-muted"
                >
                  <h4 className="text-mk-subtitle font-semibold text-fg">{title}</h4>
                  <p className="mt-1.5 text-mk-body-sm text-fg-muted">{body}</p>
                </Link>
              ))}
            </Stagger>
          </div>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT XI — Value */}
      <Act labelledBy="act-11" surface="muted">
        <div className="container-mk">
          <Eyebrow>The arithmetic</Eyebrow>
          <Heading level={2} id="act-11" className="mt-4">
            Do the arithmetic yourself.
          </Heading>
          <Lead className="mt-5">
            Every input below is your number. We have pre-filled nothing, we compute only what
            your inputs support, and the formula is printed on the page.
          </Lead>

          <div className="mt-block">
            <RoiCalculator />
          </div>

          <Divider className="my-block" />

          <Heading level={3} display="title">
            The same table, with the right-hand column replaced
          </Heading>
          <div className="mt-6">
            <Table
              caption="Each job an institute does, where it lives today, and where it lives with Algoryq Learn"
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

          <Divider className="my-block" />

          <Heading level={3} display="title">
            Six rows, side by side
          </Heading>
          <p className="mt-3 max-w-measure text-mk-body-sm text-fg-muted">
            Where they are better, this table says so. A comparison one column wins outright is
            an advertisement, and nobody reads it twice.
          </p>
          <div className="mt-6">
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
          <p className="mt-4 text-mk-body-sm">
            <Link href="/compare/moodle" className="text-link underline underline-offset-4">
              The full comparisons, with a source and a date on every cell
            </Link>
          </p>

          <div className="mt-block">
            <DesignPartnerOffer />
          </div>
        </div>
      </Act>

      {/* ───────────────────────────────── ACT XII — Decision */}
      <Act labelledBy="act-12" surface="ink" aurora>
        <div className="container-mk">
          <Reveal>
            <Eyebrow surface="ink">Pricing</Eyebrow>
          </Reveal>
          <Reveal variant="lines" delay={80}>
            <Heading level={2} id="act-12" surface="ink" className="mt-4">
              Free for one campus. Priced for a group.
            </Heading>
          </Reveal>

          {/*
            Three plans arriving left to right, cheapest first. The stagger is the reading
            order and it is doing work: a price grid that appears all at once invites a
            comparison, and one that arrives in sequence invites you to start at the free tier
            — which is the tier we actually want somebody to start on.
          */}
          <Stagger step={90} className="mt-block grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.key} surface="ink">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-mk-title font-semibold text-on-ink">{plan.name}</h3>
                  {plan.key === 'starter' && <Badge tone="accent">No card</Badge>}
                </div>
                <p className="mt-3 font-display text-display-3 text-on-ink">
                  {plan.maxSeats === null
                    ? 'Let’s talk'
                    : plan.priceMinor === 0
                      ? '₹0'
                      : formatMoney(plan.priceMinor, plan.currency)}
                  {plan.maxSeats !== null && plan.priceMinor > 0 && (
                    <span className="text-mk-body text-on-ink-muted"> / month</span>
                  )}
                </p>
                <p className="mt-3 text-mk-body-sm text-on-ink-muted">{plan.description}</p>
                <ul className="mt-4 space-y-1.5 text-mk-body-sm text-on-ink-muted">
                  <li>
                    {plan.maxSeats === null
                      ? 'Unlimited seats'
                      : `${plan.maxSeats.toLocaleString('en-IN')} seats`}
                  </li>
                  <li>
                    {plan.maxCourses === null
                      ? 'Unlimited courses'
                      : `${plan.maxCourses.toLocaleString('en-IN')} courses`}
                  </li>
                </ul>
              </Card>
            ))}
          </Stagger>

          <p className="mt-8 max-w-prose text-mk-body text-on-ink-muted">
            There is no online checkout yet — the billing module has no payment-gateway adapter,
            so every paid plan starts with a short conversation. The free tier starts without
            one.{' '}
            <Link href="/pricing" className="text-on-ink underline underline-offset-4">
              What is included on every plan
            </Link>
            .
          </p>

          <div className="mt-block">
            <Heading level={3} display="title" surface="ink">
              Questions people actually ask
            </Heading>
            <div className="mt-6 max-w-prose">
              {FAQ.map((item) => (
                <Disclosure key={item.q} summary={item.q} surface="ink">
                  {item.a}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      </Act>

      <ClosingCTA />
    </>
  );
}
