import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Card, Heading, Mono, StatBlock } from '../../../components/primitives';
import { CodeBlock } from '../../../components/primitives/code-block';
import { pageMeta } from '../../../config/seo';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/developers');

const TRAIL = [{ href: '/developers', label: 'Developers' }];

const CODE = {
  auth: `curl https://api.learn.algoryq.com/v1/courses \\
  -H "Authorization: Bearer $ALGORYQ_API_KEY" \\
  -H "X-Correlation-Id: $(uuidgen)"`,
  envelope: `{
  "data": [ { "id": "…", "title": "Data Structures" } ],
  "meta": { "page": 1, "pageSize": 20, "total": 43 }
}`,
  error: `{
  "type": "https://learn.algoryq.com/errors/forbidden",
  "title": "You do not hold course.course.publish",
  "status": 403,
  "instance": "/v1/courses/42/publish"
}`,
  webhook: `POST https://your-endpoint.example.com/algoryq-learn
X-Algoryq Learn-Signature: sha256=<hmac of the raw body>
X-Algoryq Learn-Delivery: 01J2…
X-Algoryq Learn-Event: enrollment.created`,
  selfhost: `docker compose up -d
pnpm db:migrate && pnpm db:rls && pnpm db:seed
pnpm --filter @akechi/api worker:dev`,
};

export default function DevelopersPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Developers"
        title="A REST API where every route carries a permission key"
        lead="Versioned, permission-checked, correlation-tagged, and documented. The same API the product's own frontend uses — there is no privileged internal one."
        trail={TRAIL}
      />

      <Act labelledBy="numbers-heading" surface="paper" spacing="tight">
        <div className="container-mk">
          <h2 id="numbers-heading" className="sr-only">
            The shape of the API
          </h2>
          <div className="grid gap-8 sm:grid-cols-4">
            <StatBlock evidence="api-routes" label="routes" />
            <StatBlock evidence="api-modules" label="modules" />
            <StatBlock evidence="permission-keys" label="permission keys" />
            <StatBlock evidence="prisma-models" label="models behind them" />
          </div>
        </div>
      </Act>

      <Act labelledBy="auth-heading" surface="muted" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="auth-heading" display="display-3">
              Authentication
            </Heading>
            <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
              <p>
                API keys are hashed at rest and shown once, at creation. If it is lost it is
                rotated, not recovered — a key a vendor can show you again is a key stored in a
                way you should mind.
              </p>
              <p>
                Every request carries the permissions of the key&apos;s owner. There is no
                &ldquo;API user&rdquo; with special powers: a key that can publish a course is a
                key held by somebody who can publish a course.
              </p>
              <p>
                Send a correlation id and it travels through every log line the request touches,
                which is what makes a support conversation short.
              </p>
            </div>
          </div>
          <CodeBlock label="Authenticating a request with an API key">{CODE.auth}</CodeBlock>
        </div>
      </Act>

      <Act labelledBy="shape-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="shape-heading" display="display-3">
            The shape of a response
          </Heading>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-mk-subtitle font-semibold text-fg">Success</h3>
              <p className="mt-2 text-mk-body-sm text-fg-muted">
                One envelope everywhere: <Mono>data</Mono> plus <Mono>meta</Mono>. Lists are
                paginated; the total is real, not an estimate.
              </p>
              <CodeBlock label="A successful response envelope" className="mt-4">{CODE.envelope}</CodeBlock>
            </div>
            <div>
              <h3 className="text-mk-subtitle font-semibold text-fg">Failure</h3>
              <p className="mt-2 text-mk-body-sm text-fg-muted">
                RFC 7807 problem+json. Note where the human-readable message lives:{' '}
                <Mono>title</Mono>, not <Mono>detail</Mono>. Our own frontend once dropped every
                API error message by reading the wrong field, so it is worth saying out loud.
              </p>
              <CodeBlock label="An error response" className="mt-4">{CODE.error}</CodeBlock>
            </div>
          </div>
        </div>
      </Act>

      <Act labelledBy="public-heading" surface="ink" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="public-heading" display="display-3" surface="ink">
            The public endpoints, and their threat model
          </Heading>
          <p className="mt-5 max-w-prose text-mk-body text-on-ink-muted">
            Almost everything requires a key. Three things do not, and each was designed with a
            specific abuse in mind.
          </p>

          <div className="mt-block grid gap-6 md:grid-cols-3">
            <Card surface="ink">
              <h3 className="text-mk-subtitle font-semibold text-on-ink">
                <Mono>POST /public/institutes/:slug/enquiries</Mono>
              </h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                Web-to-lead. It forces the source and has <em>no fields</em> for stage, owner or
                pipeline — absent from the schema rather than validated away, because a field
                that is accepted and then overridden is one somebody eventually forgets to
                override. It returns a fixed acknowledgement, so it cannot be used to ask whether
                an address is on file, and it answers identically for an unknown or a suspended
                institute, so it cannot enumerate them. It notifies nobody automatically: an
                unauthenticated request that can put a message in a named person&apos;s inbox is
                a spam vector wearing a feature&apos;s clothes.
              </p>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                The form on this website posts to it.
              </p>
            </Card>
            <Card surface="ink">
              <h3 className="text-mk-subtitle font-semibold text-on-ink">
                <Mono>GET /verify/:code</Mono>
              </h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                Certificate verification. Whoever holds the code is usually an employer, not a
                user. It returns what was certified, to whom, when, and whether it still stands —
                and deliberately nothing else. Unknown and revoked produce different words,
                because those mean very different things to the person checking.
              </p>
            </Card>
            <Card surface="ink">
              <h3 className="text-mk-subtitle font-semibold text-on-ink">
                <Mono>GET /public/sites/:slug</Mono>
              </h3>
              <p className="mt-3 text-mk-body-sm text-on-ink-muted">
                An institute&apos;s own public website — pages, posts, events, gallery. Author
                text is Markdown source rendered to React elements; the renderer never emits
                HTML, so nothing an author types can become script in a visitor&apos;s browser.
              </p>
            </Card>
          </div>
        </div>
      </Act>

      <Act labelledBy="webhooks-heading" surface="paper" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="webhooks-heading" display="display-3">
              Webhooks
            </Heading>
            <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
              <p>
                Register an endpoint, subscribe to events, and every delivery is signed with an
                HMAC over the raw body. Verify the signature before you parse — parsing first is
                how a signature check becomes decorative.
              </p>
              <p>
                Deliveries are logged with their status and response, retried on failure, and can
                be replayed from the interface. A webhook you cannot inspect is a webhook you
                cannot debug at 9pm.
              </p>
            </div>
            <p className="mt-6">
              <Link href="/developers/webhooks" className="text-mk-body text-link underline underline-offset-4">
                Events, signatures and retries in detail
              </Link>
            </p>
          </div>
          <CodeBlock label="An example webhook delivery">{CODE.webhook}</CodeBlock>
        </div>
      </Act>

      <Act labelledBy="selfhost-heading" surface="muted" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="selfhost-heading" display="display-3">
              Run it yourself
            </Heading>
            <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
              <p>
                Three commands and no cloud account. The second line is three steps on purpose:
                migrations create the schema, row-level security is applied separately from the
                database catalogue so a table added later is covered automatically, and the seed
                installs the permission catalogue and role templates.
              </p>
              <p>
                Run exactly one worker. Its jobs claim no rows, so a second copy would
                double-send email.
              </p>
            </div>
            <p className="mt-6">
              <Link
                href="/resources/self-hosting-algoryq-learn"
                className="text-mk-body text-link underline underline-offset-4"
              >
                The full self-hosting guide
              </Link>
            </p>
          </div>
          <CodeBlock label="The three commands that boot the whole platform">{CODE.selfhost}</CodeBlock>
        </div>
      </Act>

      <Act labelledBy="gaps-heading" surface="paper" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="gaps-heading" display="title">
            What the API does not have
          </Heading>
          <ul className="mt-5 space-y-2 text-mk-body text-fg-muted">
            <li>No GraphQL.</li>
            <li>No public sandbox key — you need an instance, and the compose file gives you one.</li>
            <li>No SCIM, no SAML, no OIDC.</li>
            <li>No official client libraries beyond the typed internal SDK.</li>
            <li>
              No hosted, browsable reference on this site yet. The OpenAPI document is exported
              from the running application, which means it is generated from the routes rather
              than maintained by hand — and it is on the list to publish here.
            </li>
          </ul>
        </div>
      </Act>

      <ClosingCTA
        title="Read the security model before you build against it."
        lead="Deny-by-default authorization, forced row-level isolation, and a hash-chained audit log — with the file each one lives in."
        primary={{ href: '/security', label: 'Security notes' }}
        secondary={{ href: '/demo', label: 'Talk to whoever built it' }}
      />
    </>
  );
}
