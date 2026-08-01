import type { Metadata } from 'next';
import { Act } from '../../../components/layout/act';
import { ClosingCTA, PageHero } from '../../../components/layout/page-parts';
import { Heading, Prose } from '../../../components/primitives';
import { Table, Td, Tr } from '../../../components/primitives/table';
import { pageMeta } from '../../../config/seo';
import { site } from '../../../config/site';
import { breadcrumbJsonLd, jsonLd } from '../../../lib/json-ld';

export const metadata: Metadata = pageMeta('/accessibility');

const TRAIL = [{ href: '/accessibility', label: 'Accessibility' }];

/**
 * Known issues, with dates.
 *
 * Publishing these is the point. Every procurement officer has read a hundred statements
 * claiming full conformance; the one with four dated open items is the one they believe.
 */
const KNOWN_ISSUES = [
  {
    issue: 'This website has not yet had an independent audit',
    sc: 'All',
    impact:
      'Our conformance claim rests on automated checks and our own manual passes. An external audit is planned; until it happens, treat this statement as self-assessed.',
    since: '2026-07-31',
  },
  {
    issue: 'Product screen-reader passes are not yet on a fixed cadence',
    sc: '4.1.2',
    impact:
      'Automated checks run on every build. Manual VoiceOver and NVDA passes happen before a release rather than on a published schedule.',
    since: '2026-07-31',
  },
  {
    issue: 'Component borders are decorative rather than sole indicators',
    sc: '1.4.11',
    impact:
      'Card and input borders sit below 3:1 against their background in light mode. They are never the only signal — state is carried by text and by a filled colour as well — but a reviewer counting contrast ratios will see them.',
    since: '2026-07-23',
  },
  {
    issue: 'One product locale',
    sc: '3.1.1',
    impact:
      'The product supports eight locale tags including right-to-left. This website ships English only, so `lang` is fixed rather than negotiated.',
    since: '2026-07-31',
  },
];

const VPAT = [
  { criterion: '1.1.1 Non-text content', level: 'A', status: 'Supports', note: 'Decorative graphics are hidden from assistive technology; the aurora and connecting lines carry no meaning.' },
  { criterion: '1.3.1 Info and relationships', level: 'A', status: 'Supports', note: 'Real headings, lists and tables with captions and scoped headers.' },
  { criterion: '1.4.3 Contrast (minimum)', level: 'AA', status: 'Supports', note: 'Every text token measured against every surface it can land on, including tinted ones, by a test that fails the build.' },
  { criterion: '1.4.10 Reflow', level: 'AA', status: 'Supports', note: 'No horizontal scroll at 320 CSS pixels except deliberate, keyboard-reachable table and code regions.' },
  { criterion: '1.4.11 Non-text contrast', level: 'AA', status: 'Partially supports', note: 'See known issues — decorative borders.' },
  { criterion: '1.4.12 Text spacing', level: 'AA', status: 'Supports', note: 'Survives the standard override with no clipping.' },
  { criterion: '2.1.1 Keyboard', level: 'A', status: 'Supports', note: 'Everything, including the role switcher, the module explorer and the mobile sheet. No drag-and-drop anywhere.' },
  { criterion: '2.2.2 Pause, stop, hide', level: 'A', status: 'Supports', note: 'Nothing auto-advances. No carousels.' },
  { criterion: '2.4.1 Bypass blocks', level: 'A', status: 'Supports', note: 'A skip link is the first focusable element on every page.' },
  { criterion: '2.4.7 Focus visible', level: 'AA', status: 'Supports', note: 'A 2px ring at 2px offset, never removed, re-coloured on dark surfaces so it stays visible.' },
  { criterion: '2.4.11 Focus not obscured', level: 'AA (2.2)', status: 'Supports', note: 'Scroll padding clears the sticky header, so a focused anchor target is never hidden behind it.' },
  { criterion: '2.5.8 Target size', level: 'AA (2.2)', status: 'Supports', note: 'Interactive targets are at least 44 by 44 CSS pixels with separation.' },
  { criterion: '3.2.1 On focus', level: 'A', status: 'Supports', note: 'Tab sets use manual activation, so moving focus never changes context.' },
  { criterion: '3.3.1 Error identification', level: 'A', status: 'Supports', note: 'Inline, associated with the field, described in words, with focus moved to the first error.' },
  { criterion: '3.3.7 Redundant entry', level: 'A (2.2)', status: 'Supports', note: 'The one form asks for nothing twice and preserves values on a failed submit.' },
  { criterion: '3.3.8 Accessible authentication', level: 'AA (2.2)', status: 'Supports', note: 'There is no authentication and no CAPTCHA on this site.' },
  { criterion: '4.1.3 Status messages', level: 'AA', status: 'Supports', note: 'Polite live regions on the form status and the catalogue result count; counters are deliberately not announced.' },
];

export default function AccessibilityPage() {
  return (
    <>
      {jsonLd([breadcrumbJsonLd(TRAIL)])}

      <PageHero
        eyebrow="Accessibility"
        title="Conformance statement"
        lead="WCAG 2.2 level AA, partially conformant, with the exceptions listed. We do not claim full conformance, because nobody honest does for a product this size."
        trail={TRAIL}
      >
        <p className="mt-6 text-mk-body-sm text-fg-muted">
          Scope: akechi.com and the Akechi product. Assessed 31 July 2026. Self-assessed;
          an independent audit is planned and is listed below as an open item.
        </p>
      </PageHero>

      <Act labelledBy="how-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Prose>
            <h2 id="how-heading">How we test</h2>
            <ul>
              <li>
                <strong>Automated, in CI, failing the build.</strong> axe runs in the component
                library and across every page in the browser suite — at 360 pixels among other
                widths, in both light and dark. A failure blocks the merge; it is not a report
                somebody reads later.
              </li>
              <li>
                <strong>Contrast, computed from the tokens.</strong> A test measures every text
                colour against every surface it can land on, including the tinted backgrounds
                used by status banners. It exists because the product once shipped error text at
                2.1:1 for three days — a fill colour used as a text colour — and nothing caught
                it until a page happened to render an error on load rather than after a submit.
              </li>
              <li>
                <strong>Motion.</strong> A test loads every page with reduced motion emulated and
                asserts both that nothing is still animating and that the same text is visible.
                The second assertion is the important one: it is what stops an animation from
                carrying meaning.
              </li>
              <li>
                <strong>Manual, before a release.</strong> Keyboard-only pass, VoiceOver with
                Safari, NVDA with Firefox, 400 per cent zoom, and Windows forced-colours mode.
              </li>
            </ul>

            <h2 id="decisions">Decisions we made because of accessibility</h2>
            <ul>
              <li>
                <strong>No drag-and-drop anywhere in the product.</strong> The admissions board
                moves cards with a select and reorders stages with arrow buttons. HTML5 drag
                works from neither a keyboard nor a phone, and a board that only works with a
                mouse excludes both a screen-reader user and a counsellor on a bus.
              </li>
              <li>
                <strong>No CAPTCHA on this site.</strong> It would be a cognitive-function test
                (SC 3.3.8) and a third-party origin. The form is defended by a honeypot, a
                timing floor and the API&apos;s own rate limit instead.
              </li>
              <li>
                <strong>No scroll-jacking.</strong> Pinned scroll scenes break the scrollbar&apos;s
                meaning, Page Down, find-in-page and scroll restoration.
              </li>
              <li>
                <strong>Menus are groups of links, not ARIA menus.</strong> `role=&quot;menu&quot;`
                promises arrow-key-only semantics we do not implement, and a screen-reader user
                told to expect them is worse off than one given plain links.
              </li>
              <li>
                <strong>Reduced motion is a designed rendering</strong>, reviewed on its own, not
                a stripped-down leftover.
              </li>
            </ul>
          </Prose>
        </div>
      </Act>

      <Act labelledBy="issues-heading" surface="muted" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="issues-heading" display="display-3">
            Known issues
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            With dates. A statement without this section is a statement nobody in procurement
            believes.
          </p>
          <div className="mt-8">
            <Table caption="Known accessibility issues, the criterion each touches, and its impact" head={['Issue', 'Criterion', 'Impact', 'Known since']}>
              {KNOWN_ISSUES.map((item) => (
                <Tr key={item.issue}>
                  <Td header>{item.issue}</Td>
                  <Td>{item.sc}</Td>
                  <Td>{item.impact}</Td>
                  <Td>{item.since}</Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <Act labelledBy="vpat-heading" surface="paper" spacing="normal">
        <div className="container-mk">
          <Heading level={2} id="vpat-heading" display="display-3">
            Criterion by criterion
          </Heading>
          <p className="mt-4 max-w-measure text-mk-body text-fg-muted">
            Shaped so it can be lifted into a procurement checklist. Only the criteria this site
            can meaningfully fail are listed; the rest are supported by construction.
          </p>
          <div className="mt-8">
            <Table caption="WCAG 2.2 criteria, conformance level, and our status against each" head={['Criterion', 'Level', 'Status', 'Notes']}>
              {VPAT.map((row) => (
                <Tr key={row.criterion}>
                  <Td header>{row.criterion}</Td>
                  <Td>{row.level}</Td>
                  <Td className={row.status === 'Supports' ? 'text-success-text' : 'text-warning-text'}>
                    {row.status}
                  </Td>
                  <Td>{row.note}</Td>
                </Tr>
              ))}
            </Table>
          </div>
        </div>
      </Act>

      <Act labelledBy="feedback-heading" surface="ink" spacing="normal">
        <div className="container-mk max-w-prose">
          <Heading level={2} id="feedback-heading" display="display-3" surface="ink">
            Tell us what we missed
          </Heading>
          <p className="mt-6 text-mk-body text-on-ink-muted">
            Email{' '}
            <a href={`mailto:${site.accessibilityEmail}`} className="text-on-ink underline underline-offset-4">
              {site.accessibilityEmail}
            </a>
            . We answer within five working days, and we will tell you what we are going to do
            and when — including if the answer is &ldquo;not soon&rdquo;, which is more useful
            than silence.
          </p>
          <p className="mt-4 text-mk-body text-on-ink-muted">
            If you are evaluating software for an institution, the guide on{' '}
            <a href="/resources/buying-accessible-software" className="text-on-ink underline underline-offset-4">
              what to ask a vendor
            </a>{' '}
            lists the nine questions that separate a real accessibility programme from a
            paragraph in a sales deck. Ask us all nine.
          </p>
        </div>
      </Act>

      <ClosingCTA
        title="The rest of the procurement pack"
        lead="Security notes with the mechanism behind each control, sub-processors, data processing, and the honest build status."
        primary={{ href: '/security', label: 'Security notes' }}
        secondary={{ href: '/trust', label: 'What we can prove' }}
      />
    </>
  );
}
