import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Heading, Prose } from '../../../../components/primitives';
import { pageMeta } from '../../../../config/seo';
import { site } from '../../../../config/site';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/trust/dpa');

const TRAIL = [
  { href: '/trust', label: 'Trust' },
  { href: '/trust/dpa', label: 'Data processing' },
];

export default function DpaPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Trust"
        title="Data processing"
        lead="Who is responsible for what, in plain words, before the contract that says the same thing in longer ones."
        trail={TRAIL}
      >
        <p className="mt-6 text-mk-body-sm text-fg-muted">Version 1.0 · 31 July 2026</p>
      </PageHero>

      <Act labelledBy="roles-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Prose>
            <h2 id="roles-heading">Who is the controller</h2>
            <p>
              The institute is. When a school, college or coaching centre runs Algoryq Learn, it decides
              what data to collect about its learners and staff and why — so it is the data
              controller, and it is the party a subject-access or erasure request is actually
              made to.
            </p>
            <p>
              That is not a legal nicety in this product; it is reflected in how the software is
              built. Retention policies, legal holds and data-subject requests sit behind a
              permission held by the <strong>institute&apos;s</strong> administrator rather than by
              the platform operator. Suspending an institute is the operator&apos;s call;
              deciding what happens to its data is not.
            </p>

            <h2 id="processor">When we are a processor</h2>
            <p>
              If we host your instance, we process personal data on your instructions in order to
              provide the service: storing it, backing it up, and letting your people reach it.
              We do not use it to train anything, we do not sell it, and we do not look at it
              except when you ask us to help with a problem — which is done through impersonation,
              and impersonation is recorded in the audit log with dual attribution, so you can
              see both who acted and on whose behalf.
            </p>

            <h2 id="self-hosted">When we are neither</h2>
            <p>
              If you self-host, we never see your data. There is no telemetry, no phone-home and
              no licence check. The compose file boots the entire platform with no account of any
              kind, and that is deliberate.
            </p>

            <h2 id="security">What we do to protect it</h2>
            <p>
              The measures are described in full on the{' '}
              <Link href="/security">security page</Link>, with the file each one lives in.
              Summarised: isolation between institutes is a forced row-level security policy in
              PostgreSQL on a non-owner, non-superuser role; every route is permission-checked;
              every mutation is written to a hash-chained audit log; passwords are Argon2id;
              tokens never reach client JavaScript.
            </p>

            <h2 id="requests">Subject requests</h2>
            <p>
              The product has built-in flows for export and erasure. Erasure tombstones the
              record rather than rewriting the audit chain that proves the erasure happened — a
              chain that could be rewritten would not be evidence of anything. A legal hold
              overrides retention, and retention overrides erasure, in that order.
            </p>

            <h2 id="breach">If something goes wrong</h2>
            <p>
              We will tell you, quickly, with what we know and what we do not yet know. We would
              rather send you an incomplete notification early than a tidy one late.
            </p>

            <h2 id="signing">The actual agreement</h2>
            <p>
              A signable data-processing agreement is available on request —{' '}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. This page describes
              it honestly; it is not a substitute for it.
            </p>
          </Prose>
        </div>
      </Act>

      <Act labelledBy="honest-heading" surface="muted" spacing="tight">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="honest-heading" display="title">
            One thing this page will not claim
          </Heading>
          <p className="mt-4 text-mk-body text-fg-muted">
            We will never describe ourselves as &ldquo;GDPR compliant&rdquo;. Compliance is a
            property of how an organisation operates, not a badge a vendor can hand over. What we
            can tell you is what we built: subject-request flows, retention policies, legal holds,
            an erasure job that respects the audit chain, and an isolation model you can inspect.
            Those are facts. The adjective is not ours to award.
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="Questions your legal team will ask next"
        lead="Sub-processors, responsible disclosure, and the accessibility conformance statement."
        primary={{ href: '/trust/sub-processors', label: 'Sub-processors' }}
        secondary={{ href: '/accessibility', label: 'Accessibility statement' }}
      />
    </>
  );
}
