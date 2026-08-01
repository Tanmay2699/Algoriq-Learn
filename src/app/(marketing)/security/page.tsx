import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading, Mono } from '../../../components/primitives';
import { Table, Td, Tr } from '../../../components/primitives/table';
import { PermissionCatalog } from '../../../components/product/permission-catalog';
import { RolesMatrix, VerifyCertificate } from '../../../components/product/renderings';
import { pageMeta } from '../../../config/seo';
import { site } from '../../../config/site';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/security');

const TRAIL = [{ href: '/security', label: 'Security' }];

const SUMMARY: { control: string; how: string; where: string }[] = [
  {
    control: 'Tenant isolation',
    how: 'PostgreSQL row-level security, ENABLE and FORCE, on 114 tables',
    where: 'apps/api/prisma/rls.ts',
  },
  {
    control: 'Database privilege',
    how: 'The application role is not the owner, not a superuser, and holds no BYPASSRLS',
    where: 'apps/api/prisma/rls.ts',
  },
  {
    control: 'Authorization',
    how: 'Deny by default: 272 permission keys, 264 enforced on a route, coverage checked in CI',
    where: 'packages/authz, pnpm authz:check',
  },
  {
    control: 'Authentication',
    how: 'Argon2id with lockout, 15-minute access tokens, rotating refresh with family revocation',
    where: 'apps/api/src/modules/auth',
  },
  {
    control: 'Multi-factor',
    how: 'TOTP with recovery codes; device list and revoke',
    where: 'apps/api/src/modules/auth',
  },
  {
    control: 'Token handling',
    how: 'httpOnly session cookie in the browser; the JWT is attached server-side and never reaches client JavaScript',
    where: 'apps/web BFF',
  },
  {
    control: 'Audit',
    how: 'Every mutation, with a field-level diff, hash-chained to the entry before it',
    where: 'apps/api/src/modules/audit',
  },
  {
    control: 'Data subject requests',
    how: 'Export and erasure; erasure tombstones rather than rewriting the chain',
    where: 'apps/api/src/modules/audit',
  },
  {
    control: 'Secrets',
    how: 'The production environment schema throws on defaults and placeholders',
    where: 'apps/api/src/config',
  },
  {
    control: 'Accessibility',
    how: 'WCAG 2.2 AA, automated checks failing the build at 360px among other widths',
    where: 'Storybook + Playwright',
  },
];

export default function SecurityPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Security"
        title="Isolation you can inspect."
        lead="Not “enterprise-grade”. Here is the mechanism, here is where it lives, and here is the list of what we have not built."
        trail={TRAIL}
      />

      <Act labelledBy="summary-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="summary-heading" display="display-3">
            The ten-row summary
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            For the reviewer with a checklist. Everything below expands one of these rows.
          </p>
          <div className="mt-8">
            <Table caption="Security controls, how each is implemented, and where it lives" head={['Control', 'How', 'Where']}>
              {SUMMARY.map((row) => (
                <Tr key={row.control}>
                  <Td header>{row.control}</Td>
                  <Td>{row.how}</Td>
                  <Td>
                    <Mono className="text-fg-muted">{row.where}</Mono>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <Act id="tenancy" labelledBy="tenancy-heading" surface="muted" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="tenancy-heading" display="display-3">
            Tenant isolation is a database policy
          </Heading>
          <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
            <p>
              Every tenant-owned table carries a <Mono>tenant_id</Mono> and a{' '}
              <Mono>tenant_isolation</Mono> policy applied with both <Mono>ENABLE</Mono> and{' '}
              <Mono>FORCE</Mono>. Without <Mono>FORCE</Mono>, the table owner bypasses every
              policy — which is the single most common way row-level security is deployed and
              does nothing.
            </p>
            <p>
              <Mono>FORCE</Mono> is still not enough on its own: a superuser, or any role with{' '}
              <Mono>BYPASSRLS</Mono>, ignores policies unconditionally. So the application
              connects as a role that is none of those, and the owner role is reserved for
              migrations on a separate connection string. The check verifies the runtime role as
              well as the policies.
            </p>
            <p>
              The policy set is <strong className="text-fg">derived from the database catalogue</strong>,
              not hand-written per table: every table with a <Mono>tenant_id</Mono> column is
              covered automatically, and a gap fails CI. A policy that has to be remembered on
              each new table is a policy that will eventually be forgotten, and the forgetting is
              invisible until it leaks.
            </p>
            <p>
              <strong className="text-fg">114 tables are covered.</strong> Thirteen are exempt,
              and we publish the list rather than claiming there are none.
            </p>
          </div>

          <h3 className="mt-block text-mk-title font-semibold text-fg">The thirteen exemptions</h3>
          <p className="mt-3 text-mk-body text-fg-muted">Two groups, for two different reasons.</p>
          <ul className="mt-4 space-y-3 text-mk-body text-fg-muted">
            <li>
              <strong className="text-fg">No tenant id at all</strong> — users, credentials, user
              identities, permissions, tenants. A user is a global principal who may belong to
              several institutes; the <em>membership</em> is what is scoped, and the membership
              table is in the second group.
            </li>
            <li>
              <strong className="text-fg">The identity plane</strong> — sessions, permission
              versions, memberships, invitations, tenant domains. These carry a tenant id, but
              they are read <em>in order to determine</em> the tenant, before any binding can
              exist. Refreshing a token means looking a session up by id to discover which
              institute it belongs to; a policy requiring the institute first makes that
              unresolvable. Every access is keyed by an unguessable id.
            </li>
          </ul>
        </div>
      </Act>

      <Act id="authorization" labelledBy="authz-heading" surface="ink" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="authz-heading" display="display-3" surface="ink">
            Authorization is deny-by-default, and the build enforces it
          </Heading>
          <div className="mt-6 max-w-prose space-y-4 text-mk-body text-on-ink-muted">
            <p>
              Every controller route ships with a permission key or an explicit{' '}
              <Mono>@Public()</Mono>. A lint rule and a route-coverage check fail the build
              otherwise, so &ldquo;we forgot to add the guard&rdquo; is not a class of bug that
              can reach production.
            </p>
            <p>
              <strong className="text-on-ink">272 keys, 264 enforced on a route.</strong> The
              remaining eight belong to surfaces that are designed and not yet built. We publish
              that number too, because a catalogue with unenforced keys is a normal state of a
              growing system and hiding it would be the suspicious choice.
            </p>
            <p>
              Frontend gating — hiding a button somebody cannot use — is a courtesy, not a
              boundary. It is never the only check.
            </p>
          </div>

          <div className="mt-block">
            <h3 className="text-mk-title font-semibold text-on-ink">The whole catalogue</h3>
            <p className="mt-2 max-w-measure text-mk-body-sm text-on-ink-muted">
              Every act the software can perform, with the description a school administrator
              sees when building a role.
            </p>
            <div className="mt-6">
              <PermissionCatalog />
            </div>
          </div>
        </div>
      </Act>

      <Act id="roles" labelledBy="roles-heading" surface="paper" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="roles-heading" display="display-3">
              Roles, scopes and overrides
            </Heading>
            <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
              <p>
                A role is a named bundle of keys plus a scope. Eleven templates ship; each
                institute gets its own editable copies. <strong className="text-fg">Nothing in
                the code branches on a role&apos;s name</strong> — a guard asks whether the
                person holds a key, never what they are called.
              </p>
              <p>
                Scopes: global, organisation, institute, branch, department, course, batch, or a
                single record. A learner and a parent hold record scope, which is why a parent
                sees their own children and nothing else.
              </p>
              <p>
                On top of roles: per-user overrides (grant or deny, with an expiry), and
                out-of-office delegation. Denials win.
              </p>
            </div>
          </div>
          <RolesMatrix />
        </div>
      </Act>

      <Act id="identity" labelledBy="identity-heading" surface="muted" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="identity-heading" display="display-3">
            Identity
          </Heading>
          <ul className="mt-6 space-y-3 text-mk-body text-fg-muted">
            <li>Passwords hashed with Argon2id, with lockout after repeated failures.</li>
            <li>
              Fifteen-minute access tokens and a rotating refresh token; revoking one revokes its
              whole family, so a stolen refresh token cannot outlive its detection.
            </li>
            <li>TOTP multi-factor with recovery codes, and a device list you can revoke from.</li>
            <li>Sign-in with Google, Microsoft and GitHub.</li>
            <li>
              People are added <strong className="text-fg">by invitation only</strong>. There is
              deliberately no route where an administrator sets somebody else&apos;s password.
            </li>
            <li>
              Impersonation for support, with dual audit attribution — the log records both who
              acted and on whose behalf.
            </li>
          </ul>
          <p className="mt-6 text-mk-body text-fg-muted">
            <strong className="text-fg">Not built:</strong> SAML, OIDC, SCIM, phone OTP.
          </p>
        </div>
      </Act>

      <Act id="audit" labelledBy="audit-heading" surface="paper" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="audit-heading" display="display-3">
            The audit log is a hash chain
          </Heading>
          <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
            <p>
              Every mutation emits a domain event that lands in the audit log with a field-level
              diff and a hash of the entry before it. Tampering with an entry breaks the chain
              from that point forward, which is detectable without trusting the application that
              wrote it.
            </p>
            <p>
              Retention policies, legal holds and data-subject requests are built.{' '}
              <strong className="text-fg">A hold beats retention; retention beats erasure.</strong>{' '}
              And erasure tombstones the record rather than rewriting the chain that proves the
              erasure happened — which is the part most implementations get backwards.
            </p>
          </div>
        </div>
      </Act>

      <Act id="verification" labelledBy="verification-heading" surface="muted" spacing="normal">
        <div className="container-mk grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading level={2} id="verification-heading" display="display-3">
              Something you can check right now
            </Heading>
            <p className="mt-6 max-w-measure text-mk-body text-fg-muted">
              Certificate verification is public and unauthenticated by design: whoever holds the
              code is usually an employer, not a user of this system. The page renders exactly
              what the API returns — what was certified, to whom, when, and whether it still
              stands — and deliberately nothing else.
            </p>
            <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
              An unknown code and a revoked one both render, with different words. &ldquo;Nothing
              found&rdquo; and &ldquo;withdrawn&rdquo; mean very different things to the person
              checking.
            </p>
          </div>
          <VerifyCertificate />
        </div>
      </Act>

      <Act id="scale" labelledBy="scale-heading" surface="paper" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="scale-heading" display="display-3">
            Scale, and one honest limit
          </Heading>
          <div className="mt-6 space-y-4 text-mk-body text-fg-muted">
            <p>
              The API is horizontally scalable: the rate limiter, the permission-grant cache and
              tenant host resolution all sit in shared cache rather than in per-process memory,
              and production refuses the in-memory driver. Rate limiting runs before the guards
              and fails open on a cache outage.
            </p>
            <p>
              <strong className="text-fg">The background worker is deliberately one process.</strong>{' '}
              Its jobs claim no rows, so a second copy would double-send email. That is a real
              limit on throughput for a very large deployment, it is on our list, and we would
              rather you read it here than discover it.
            </p>
          </div>
        </div>
      </Act>

      <Act id="portability" labelledBy="portability-heading" surface="ink" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="portability-heading" display="display-3" surface="ink">
            The exit, documented before the entrance
          </Heading>
          <div className="mt-6 space-y-4 text-mk-body text-on-ink-muted">
            <p>
              Storage, mail, search, AI and cache are ports with multiple drivers, selected by an
              environment variable. <strong className="text-on-ink">No cloud-provider SDK is
              imported in feature code.</strong> Moving from one to another is a connection
              string, not a project.
            </p>
            <p>
              <Mono>docker compose up</Mono> boots the entire platform on a laptop with no cloud
              account at all. Everything exports. The database is ordinary PostgreSQL.
            </p>
            <p>
              That is not a developer convenience. It is what makes the rest of this page worth
              trusting: a vendor who has made leaving easy has fewer reasons to make staying
              compulsory.
            </p>
          </div>
        </div>
      </Act>

      <Act id="not-yet" labelledBy="not-yet-heading" surface="paper" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="not-yet-heading" display="display-3">
            What we do not have
          </Heading>
          <p className="mt-4 text-mk-body text-fg-muted">
            This section is why the rest of the page is believable.
          </p>
          <ul className="mt-6 space-y-3 text-mk-body text-fg-muted">
            <li>
              <strong className="text-fg">No SOC 2 certificate.</strong> The policy set exists and
              the audit log produces the evidence automatically; the audit itself has not
              happened. We will not put a badge up before it is earned.
            </li>
            <li>
              <strong className="text-fg">No published penetration-test report.</strong>
            </li>
            <li>
              <strong className="text-fg">No SAML, OIDC or SCIM.</strong>
            </li>
            <li>
              <strong className="text-fg">No formal uptime SLA</strong>, because we have no
              telemetry to hold ourselves to one yet — and a status page that cannot go red is
              theatre.
            </li>
            <li>
              <strong className="text-fg">No multi-region data residency.</strong> Designed, and
              deliberately not built: a region field that does not move bytes would read as a
              guarantee and be false.
            </li>
            <li>
              <strong className="text-fg">No customers yet</strong>, and therefore no operational
              history. This is our first deployment.
            </li>
          </ul>
        </div>
      </Act>

      <Act id="disclosure" labelledBy="disclosure-heading" surface="muted" spacing="tight">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="disclosure-heading" display="title">
            Found something?
          </Heading>
          <p className="mt-4 text-mk-body text-fg-muted">
            Email{' '}
            <a href={`mailto:${site.securityEmail}`} className="text-link underline underline-offset-4">
              {site.securityEmail}
            </a>
            . We will acknowledge within two working days, keep you updated, fix it, and credit
            you if you want to be credited. We will not threaten you.
          </p>
          <p className="mt-4 text-mk-body-sm">
            <Link href="/trust/responsible-disclosure" className="text-link underline underline-offset-4">
              The full policy
            </Link>
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="Read the rest of it, then try it."
        lead="The build status, the sub-processors and the accessibility statement are all one click away. Or open the sandbox and look at the software instead."
        primary={{ href: '/trust', label: 'What we can prove' }}
        secondary={{ href: '/demo', label: 'Book a technical walkthrough' }}
      />
    </>
  );
}
