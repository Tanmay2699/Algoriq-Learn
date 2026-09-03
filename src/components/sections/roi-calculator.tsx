'use client';

// 'use client': six controlled inputs and arithmetic on them.

import { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { formatMoney } from '../../content/plans';
import { ROI_FORMULA, computeRoi, roiIsReady } from '../../lib/roi';
import { CodeBlock } from '../primitives/code-block';
import { Counter } from '../primitives';
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
              {/*
                The visible figures animate on every keystroke, and an aria-live region that
                watches them mutate would read out each intermediate frame rather than the
                result — the same reason `Counter` itself carries no aria-live (see its
                docstring, and VPAT 4.1.3). This sr-only paragraph is the one thing the live
                region actually announces: the settled numbers, once, in plain text.
              */}
              <p className="sr-only">
                Tools you would stop paying for: {formatMoney(Math.round(result.toolsAnnualMinor), 'INR')} per
                year. Time spent moving data between them: {result.hoursAnnual} hrs per year, about{' '}
                {formatMoney(Math.round(result.reconcileCostMinor), 'INR')}. Algoryq Learn at{' '}
                {parsed.learners.toLocaleString('en-IN')} learners:{' '}
                {result.plan && result.plan.priceMinor === 0 && result.plan.key === 'starter'
                  ? 'free'
                  : result.plan?.maxSeats === null
                    ? 'negotiated'
                    : `${formatMoney(Math.round(result.algoryqAnnualMinor), 'INR')}, ${result.plan?.name} plan, per year`}
                . First-year difference on your numbers:{' '}
                {result.netMinor === undefined
                  ? 'negotiated at your size, no honest number to give'
                  : `${result.netMinor < 0 ? 'a loss of ' : ''}${formatMoney(Math.round(Math.abs(result.netMinor)), 'INR')}`}
                .
              </p>
              <dl aria-hidden="true" className="space-y-3 text-mk-body-sm">
                <Row
                  label="Tools you would stop paying for"
                  value={<Counter value={result.toolsAnnualMinor / 100} format={(n) => formatMoney(Math.round(n * 100), 'INR')} />}
                  sub="per year"
                />
                <Row
                  label="Time spent moving data between them"
                  value={<Counter value={result.hoursAnnual} suffix=" hrs" />}
                  sub={
                    <span>
                      per year ≈{' '}
                      <Counter
                        value={result.reconcileCostMinor / 100}
                        format={(n) => formatMoney(Math.round(n * 100), 'INR')}
                      />
                    </span>
                  }
                />
                <Row
                  label={`Algoryq Learn at ${parsed.learners.toLocaleString('en-IN')} learners`}
                  value={
                    result.plan && result.plan.priceMinor === 0 && result.plan.key === 'starter' ? (
                      'Free'
                    ) : result.plan?.maxSeats === null ? (
                      'Negotiated'
                    ) : (
                      <Counter
                        value={result.algoryqAnnualMinor / 100}
                        format={(n) => formatMoney(Math.round(n * 100), 'INR')}
                      />
                    )
                  }
                  sub={result.plan ? `${result.plan.name} plan, per year` : ''}
                />
              </dl>

              <p aria-hidden="true" className="mt-5 border-t border-border pt-5 text-mk-body">
                <span className="text-fg-muted">First-year difference on your numbers: </span>
                <span className="font-display text-display-3 tabular-nums text-fg">
                  {result.netMinor === undefined ? (
                    '—'
                  ) : (
                    // A local const, not `result.netMinor!`: TypeScript narrows a variable
                    // across a closure, not a property access, so the capture below is what
                    // makes the sign check provably safe rather than merely asserted.
                    (() => {
                      const netMinor = result.netMinor;
                      return (
                        <Counter
                          value={Math.abs(netMinor / 100)}
                          format={(n) => `${netMinor < 0 ? '-' : ''}${formatMoney(Math.round(n * 100), 'INR')}`}
                        />
                      );
                    })()
                  )}
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

function Row({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
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
