import type { Metadata } from 'next';
import { Act } from '../../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../../components/layout/page-parts';
import { Prose } from '../../../../components/primitives';
import { pageMeta } from '../../../../config/seo';
import { site } from '../../../../config/site';
import { breadcrumbJsonLd, jsonLd } from '../../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/trust/responsible-disclosure');

const TRAIL = [
  { href: '/trust', label: 'Trust' },
  { href: '/trust/responsible-disclosure', label: 'Responsible disclosure' },
];

export default function DisclosurePage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Trust"
        title="Responsible disclosure"
        lead="If you find something, tell us before you tell anybody else, and we will behave well about it."
        trail={TRAIL}
      />

      <Act labelledBy="policy-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Prose>
            <h2 id="policy-heading">How to report</h2>
            <p>
              Email <a href={`mailto:${site.securityEmail}`}>{site.securityEmail}</a>. Include what
              you found, how to reproduce it, and what you think the impact is. If you need to
              send something sensitive, say so and we will arrange a way.
            </p>

            <h2 id="commitments">What we commit to</h2>
            <ul>
              <li>We acknowledge within two working days. A real person, not an autoresponder.</li>
              <li>We tell you what we think the severity is, and why, within five working days.</li>
              <li>We keep you updated while we fix it rather than going quiet.</li>
              <li>We credit you publicly if you want to be credited, and stay quiet if you do not.</li>
              <li>
                We will not threaten you, and we will not involve lawyers over a report made in
                good faith under this policy.
              </li>
            </ul>

            <h2 id="scope">In scope</h2>
            <ul>
              <li>The product at the application and API domains.</li>
              <li>This website.</li>
              <li>
                Anything that lets one institute reach another institute&apos;s data. This is the
                one we care about most: the isolation model is the load-bearing claim of the
                whole system.
              </li>
              <li>Authentication, session handling and permission bypasses.</li>
            </ul>

            <h2 id="out-of-scope">Out of scope</h2>
            <ul>
              <li>Findings from automated scanners with no demonstrated impact.</li>
              <li>Missing headers on a static page that has no session and sets no cookie.</li>
              <li>Social engineering of our people, or physical access.</li>
              <li>Denial of service. Please do not.</li>
              <li>
                Anything requiring a compromised device or a person who has already been phished.
              </li>
            </ul>

            <h2 id="rules">What we ask while you look</h2>
            <ul>
              <li>Use your own test institute. Do not touch anybody else&apos;s data.</li>
              <li>
                If you do reach data that is not yours, stop, and tell us what you saw so we can
                assess the exposure. Do not download it.
              </li>
              <li>Do not degrade the service for anybody else.</li>
              <li>
                Give us a reasonable window before publishing. We will not use that window to
                stall.
              </li>
            </ul>

            <h2 id="bounty">Money</h2>
            <p>
              We have no bug-bounty programme, because we have no revenue yet and we would rather
              not run one badly. We will say so honestly rather than implying a reward that does
              not exist. When there is a programme, this page will say so.
            </p>
          </Prose>
        </div>
      </Act>

      <ClosingCTA
        title="The controls you would be testing"
        lead="Row-level isolation, deny-by-default authorization and a hash-chained audit log — with the file each one lives in."
        primary={{ href: '/security', label: 'Read the security notes' }}
        secondary={{ href: '/developers', label: 'The API reference' }}
      />
    </>
  );
}
