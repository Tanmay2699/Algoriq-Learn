'use client';

// 'use client': validation state, submission state, and a timing check.

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { LEARNER_LABELS, ROLE_LABELS, leadSchema, type LeadInput } from '../../lib/lead';
import { site } from '../../config/site';

type Errors = Partial<Record<keyof LeadInput, string[]>>;

/**
 * `FormData.get` returns `string | File | null`. Stringifying a File yields `[object File]`,
 * which would sail through validation and arrive as nonsense on somebody's board.
 */
function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}

/**
 * The only form on the site.
 *
 * Every field has a real `<label for>` — never a placeholder as a label. Errors are inline,
 * associated with `aria-describedby`, focus moves to the first invalid field on submit, and a
 * failure preserves every value and offers an email fallback rather than silently retrying.
 */
export function DemoForm({ intent }: { intent: LeadInput['intent'] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: text(data, 'name'),
      email: text(data, 'email'),
      institute: text(data, 'institute'),
      role: text(data, 'role'),
      learners: text(data, 'learners'),
      phone: text(data, 'phone'),
      message: text(data, 'message'),
      intent,
      website: text(data, 'website'),
      elapsedMs: Date.now() - mountedAt.current,
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as Errors;
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus('sending');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      setStatus(response.ok ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-mk-title font-semibold text-fg">That is with us.</h2>
        <p className="mt-3 max-w-measure text-mk-body text-fg-muted">
          A real person will reply within one working day, from an address ending in
          learn.algoryq.com. Not a sequence, not a bot, and not a call you did not ask for.
        </p>
        <p className="mt-3 max-w-measure text-mk-body-sm text-fg-muted">
          It arrived as an enquiry on our own admissions board — the same module in the
          screenshots on this site. We run our funnel on our own product.
        </p>
        <p className="mt-6">
          <a
            href={site.sandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mk-body text-link underline underline-offset-4"
          >
            While you wait, open the sandbox
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      // `void` rather than passing the async function directly: React expects a void return
      // from an event handler, and handing it a promise makes an unhandled rejection possible.
      onSubmit={(event) => void onSubmit(event)}
      noValidate
      className="space-y-5"
    >
      <Field name="name" label="Your name" autoComplete="name" required errors={errors.name} />
      <Field name="email" label="Work email" type="email" autoComplete="email" required errors={errors.email} />
      <Field name="institute" label="Institute" autoComplete="organization" required errors={errors.institute} />

      <Select name="role" label="What do you do there?" required errors={errors.role} options={ROLE_LABELS} />
      <Select
        name="learners"
        label="Roughly how many learners?"
        required
        errors={errors.learners}
        options={LEARNER_LABELS}
      />

      <Field name="phone" label="Phone" type="tel" autoComplete="tel" optional errors={errors.phone} />

      <div>
        <label htmlFor="lead-message" className="block text-mk-body-sm font-medium text-fg">
          What would you like to see? <span className="font-normal text-fg-muted">(optional)</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          className="mt-1.5 w-full rounded-[--radius] border border-border bg-surface p-3 text-mk-body text-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        <p className="mt-1 text-caption text-fg-muted">
          The most useful field on the form for whoever takes the call.
        </p>
      </div>

      {/* Honeypot. Hidden from everybody, including assistive technology, and not focusable. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-website">Leave this empty</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'failed' && (
        <div role="alert" className="rounded-[--radius] border border-border bg-surface-muted p-4">
          <p className="text-mk-body-sm font-medium text-danger-text">That did not go through.</p>
          <p className="mt-1 text-mk-body-sm text-fg-muted">
            Nothing has been lost — your answers are still here. Try again, or email{' '}
            <a href={`mailto:${site.contactEmail}`} className="text-link underline underline-offset-4">
              {site.contactEmail}
            </a>{' '}
            and we will pick it up from there.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className={cn(
            'inline-flex h-13 min-h-[52px] items-center justify-center rounded-[--radius] bg-brand px-6',
            'text-mk-body font-medium text-fg-inverse transition-colors duration-fast',
            'hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2',
            status === 'sending' && 'cursor-not-allowed opacity-45',
          )}
        >
          {status === 'sending' ? 'Sending…' : 'Send it'}
        </button>
        <p aria-live="polite" className="text-mk-body-sm text-fg-muted">
          {status === 'sending' ? 'Sending…' : 'One working day, from a person.'}
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  required = false,
  optional = false,
  errors,
}: {
  name: keyof LeadInput;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  errors?: string[];
}) {
  const id = `lead-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-mk-body-sm font-medium text-fg">
        {label}
        {optional && <span className="font-normal text-fg-muted"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? errorId : undefined}
        className={cn(
          'mt-1.5 h-11 w-full rounded-[--radius] border bg-surface px-3 text-mk-body text-fg outline-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          errors ? 'border-danger' : 'border-border',
        )}
      />
      {errors && (
        <p id={errorId} className="mt-1 text-mk-body-sm text-danger-text">
          {errors[0]}
        </p>
      )}
    </div>
  );
}

function Select({
  name,
  label,
  options,
  required = false,
  errors,
}: {
  name: keyof LeadInput;
  label: string;
  options: Record<string, string>;
  required?: boolean;
  errors?: string[];
}) {
  const id = `lead-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-mk-body-sm font-medium text-fg">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-required={required || undefined}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? errorId : undefined}
        className={cn(
          'mt-1.5 h-11 w-full rounded-[--radius] border bg-surface px-3 text-mk-body text-fg outline-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          errors ? 'border-danger' : 'border-border',
        )}
      >
        <option value="" disabled>
          Choose one
        </option>
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {errors && (
        <p id={errorId} className="mt-1 text-mk-body-sm text-danger-text">
          {errors[0]}
        </p>
      )}
    </div>
  );
}
