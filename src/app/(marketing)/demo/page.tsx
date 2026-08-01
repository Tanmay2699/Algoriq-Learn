import type { Metadata } from 'next';
import Link from 'next/link';
import { Act } from '../../../components/layout/act';
import { Heading } from '../../../components/primitives';
import { DemoForm } from '../../../components/sections/demo-form';
import { pageMeta } from '../../../config/seo';
import { site } from '../../../config/site';
import { INTENT_HEADINGS, parseIntent } from '../../../lib/lead';

export const metadata: Metadata = pageMeta('/demo');

/**
 * The only form on the site.
 *
 * `?intent=` changes the heading and is recorded on the lead, which is the site's one honest
 * attribution point — we set no cookies, so there is no cross-session journey to reconstruct.
 */
export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent: raw } = await searchParams;
  const intent = parseIntent(raw);
  const heading = INTENT_HEADINGS[intent];

  return (
    <Act labelledBy="demo-title" surface="paper" spacing="normal" className="pt-12">
      <div className="container-mk grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div>
          <Heading level={1} display="display-3" id="demo-title">
            {heading.title}
          </Heading>
          <p className="mt-5 max-w-measure text-mk-lead text-fg-muted">{heading.lead}</p>

          <div className="mt-block">
            <DemoForm intent={intent} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-mk-subtitle font-semibold text-fg">What happens next</h2>
            <ol className="mt-3 space-y-2 text-mk-body-sm text-fg-muted">
              <li>1. Your enquiry lands on our own admissions board, in our own product.</li>
              <li>2. A person reads it — within one working day.</li>
              <li>3. They reply with a time, or with an answer if that is all you needed.</li>
            </ol>
            <p className="mt-4 text-mk-body-sm text-fg-muted">
              No sequence, no drip, no call you did not ask for.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-muted p-6">
            <h2 className="text-mk-subtitle font-semibold text-fg">Would rather not talk yet?</h2>
            <p className="mt-2 text-mk-body-sm text-fg-muted">
              Entirely reasonable. The sandbox is a real institute with seeded data, read-only,
              and you can look at every role in it without giving us anything.
            </p>
            <p className="mt-4">
              <a
                href={site.sandboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mk-body-sm text-link underline underline-offset-4"
              >
                Open the sandbox
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-mk-subtitle font-semibold text-fg">Design partners</h2>
            <p className="mt-2 text-mk-body-sm text-fg-muted">
              Three institutes get Growth free for twelve months, weekly access to the people who
              built it, and a case study at ninety days that is theirs to approve or refuse.
            </p>
            <p className="mt-4">
              <Link
                href={{ pathname: '/demo', query: { intent: 'design-partner' } }}
                className="text-mk-body-sm text-link underline underline-offset-4"
              >
                Apply as a design partner
              </Link>
            </p>
          </div>

          <p className="text-caption text-fg-muted">
            We store nothing on this website. Your enquiry is recorded in our own instance of
            Akechi and used to answer you.{' '}
            <Link href="/legal/privacy" className="underline underline-offset-4">
              Privacy
            </Link>
            .
          </p>
        </aside>
      </div>
    </Act>
  );
}
