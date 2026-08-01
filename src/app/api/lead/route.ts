import { NextResponse } from 'next/server';
import { server } from '../../../config/server';
import { site } from '../../../config/site';
import { LEARNER_LABELS, MIN_ELAPSED_MS, ROLE_LABELS, leadSchema } from '../../../lib/lead';

/**
 * The only write on this site.
 *
 * It forwards to the product's own public enquiry endpoint against our own institute, so a
 * demo request from this website lands on the admissions board in the screenshots above it
 * (ADR 0006). Nothing is stored here: there is no database on the marketing side, and a lead
 * that existed in two places would be the exact failure the product exists to fix.
 *
 * Three deliberate absences:
 *  - No retry. A duplicate on a counsellor's board is worse than a visible failure, and the
 *    client keeps every value and offers a mailto fallback.
 *  - No CAPTCHA. It would be a third-party origin and a cognitive-function test (WCAG 3.3.8).
 *    A honeypot, a timing floor and the API's own per-tenant rate limit do the job.
 *  - No extra information in the response. The upstream deliberately returns a fixed
 *    acknowledgement so it cannot be asked whether an address is on file; adding detail here
 *    would undo that.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIMEOUT_MS = 8_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Some fields need attention.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  // Honeypot and timing. Both answer 200 rather than 400: telling a script which check it
  // failed is telling it how to pass next time.
  if (lead.website || lead.elapsedMs < MIN_ELAPSED_MS) {
    return NextResponse.json({ ok: true });
  }

  const referer = request.headers.get('referer') ?? '';
  const ref = referer.startsWith(site.url) ? referer.slice(site.url.length) || '/' : 'direct';

  const message = [
    lead.message?.trim(),
    `— ${ROLE_LABELS[lead.role]} · ${LEARNER_LABELS[lead.learners]} learners`,
    `— intent: ${lead.intent} · from: ${ref}`,
  ]
    .filter(Boolean)
    .join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(
      `${server.apiUrl}/public/institutes/${encodeURIComponent(server.tenantSlug)}/enquiries`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          ...(lead.phone ? { phone: lead.phone } : {}),
          message: `${lead.institute}\n${message}`,
        }),
        signal: controller.signal,
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: 'We could not record that just now.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'We could not reach our own systems.' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
