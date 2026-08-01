'use client';

// 'use client': six controlled inputs and arithmetic on them.

import { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { formatMoney } from '../../content/plans';
import { ROI_FORMULA, computeRoi, roiIsReady } from '../../lib/roi';
import { CodeBlock } from '../primitives/code-block';
import { Disclosure } from '../primitives/disclosure';

/**
 * Arithmetic on the visitor's own numbers. Nothing else.
 *
 * The rules, which are the design (docs/10 §6):
 *  1. Every input starts empty. There is no default that flatters us.
 *  2. Only outputs the inputs support. No "revenue increase", no "completion-rate uplift" —
 *     we have no data for either, and a calculator that manufactures a benefit is one a CFO
 *     discards along with the vendor.
 *  3. The formula is printed on the page.
 *  4. Nothing is submitted, stored or emailed.
 */

interface Field {
  key: keyof Inputs;
  label: string;
  hint: string;
  prefix?: string;
  suffix?: string;
}

interface Inputs {
  learners: string;
  toolSpendMonthly: string;
  reconcileHoursWeekly: string;
  hourlyCost: string;
}

const FIELDS: Field[] = [
  { key: 'learners', label: 'Learners you would put on it', hint: 'Seats, not logins.' },
  {
    key: 'toolSpendMonthly',
    label: 'Monthly spend on the tools you would retire',
    hint: 'Only the ones you would actually stop paying for.',
    prefix: '₹',
  },
  {
    key: 'reconcileHoursWeekly',
    label: 'Hours a week spent moving data between them',
    hint: 'Copying marks into a spreadsheet, reconciling fees, chasing attendance.',
    suffix: 'hrs',
  },
  {
    key: 'hourlyCost',
    label: 'Loaded hourly cost of whoever does that',
    hint: 'Salary plus overheads, divided by hours worked.',
    prefix: '₹',
  },
];

const num = (value: string): number => {
  const parsed = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function RoiCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    learners: '',
    toolSpendMonthly: '',
    reconcileHoursWeekly: '',
    hourlyCost: '',
  });

  const parsed = useMemo(
    () => ({
      learners: num(inputs.learners),
      toolSpendMonthly: num(inputs.toolSpendMonthly),
      reconcileHoursWeekly: num(inputs.reconcileHoursWeekly),
      hourlyCost: num(inputs.hourlyCost),
    }),
    [inputs],
  );
  const result = useMemo(() => computeRoi(parsed), [parsed]);
  const ready = roiIsReady(parsed);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <form
        // No action and no submit: nothing leaves this page. Preventing the default is what
        // makes Enter in a field harmless rather than a navigation.
        onSubmit={(event) => event.preventDefault()}
        className="space-y-5"
      >
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label htmlFor={`roi-${field.key}`} className="block text-mk-body-sm font-medium text-fg">
              {field.label}
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-[--radius] border border-border bg-surface px-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
              {field.prefix && (
                <span aria-hidden="true" className="text-mk-body-sm text-fg-muted">
                  {field.prefix}
                </span>
              )}
              <input
                id={`roi-${field.key}`}
                name={field.key}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={inputs[field.key]}
                aria-describedby={`roi-${field.key}-hint`}
                onChange={(event) => setInputs({ ...inputs, [field.key]: event.target.value })}
                className="h-11 min-w-0 flex-1 bg-transparent text-mk-body text-fg outline-none placeholder:text-fg-muted"
                placeholder="—"
              />
              {field.suffix && (
                <span aria-hidden="true" className="text-mk-body-sm text-fg-muted">
                  {field.suffix}
                </span>
              )}
            </div>
            <p id={`roi-${field.key}-hint`} className="mt-1 text-caption text-fg-muted">
              {field.hint}
            </p>
          </div>
        ))}
      </form>

      <div>
        <div
          aria-live="polite"
          className={cn(
            'rounded-lg border p-6',
            ready ? 'border-border bg-surface' : 'border-dashed border-border bg-surface-muted',
          )}
        >
          {!ready ? (
            <p className="text-mk-body text-fg-muted">
              Type your own numbers. We have not pre-filled anything, because a default that
              flatters us is not a calculator, it is an advertisement with a text box.
            </p>
          ) : (
            <>
              <dl className="space-y-3 text-mk-body-sm">
                <Row label="Tools you would stop paying for" value={formatMoney(result.toolsAnnualMinor, 'INR')} sub="per year" />
                <Row
                  label="Time spent moving data between them"
                  value={`${result.hoursAnnual.toLocaleString('en-IN')} hrs`}
                  sub={`per year ≈ ${formatMoney(result.reconcileCostMinor, 'INR')}`}
                />
                <Row
                  label={`Akechi at ${parsed.learners.toLocaleString('en-IN')} learners`}
                  value={
                    result.plan && result.plan.priceMinor === 0 && result.plan.key === 'starter'
                      ? 'Free'
                      : result.plan?.maxSeats === null
                        ? 'Negotiated'
                        : formatMoney(result.akechiAnnualMinor, 'INR')
                  }
                  sub={result.plan ? `${result.plan.name} plan, per year` : ''}
                />
              </dl>

              <p className="mt-5 border-t border-border pt-5 text-mk-body">
                <span className="text-fg-muted">First-year difference on your numbers: </span>
                <span className="font-display text-display-3 tabular-nums text-fg">
                  {result.netMinor === undefined ? '—' : formatMoney(result.netMinor, 'INR')}
                </span>
              </p>
              {result.netMinor === undefined && (
                <p className="mt-2 text-mk-body-sm text-fg-muted">
                  At your size the price is negotiated, so there is no honest number to put here.
                </p>
              )}
            </>
          )}
        </div>

        <Disclosure summary="Show the maths" className="mt-6 border-t">
          <CodeBlock label="The formula this calculator uses" className="whitespace-pre-wrap">
            {ROI_FORMULA}
          </CodeBlock>
          <p className="mt-4">
            This is arithmetic on the numbers you typed, not a study. We have not measured a
            customer&apos;s savings, because we do not have a customer yet. Nothing here is sent
            anywhere — there is no form to submit and no field is stored.
          </p>
        </Disclosure>
      </div>
    </div>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="text-end">
        <span className="font-medium tabular-nums text-fg">{value}</span>
        {sub && <span className="block text-caption text-fg-muted">{sub}</span>}
      </dd>
    </div>
  );
}
