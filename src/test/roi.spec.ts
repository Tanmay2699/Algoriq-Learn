import { describe, expect, it } from 'vitest';
import { ROI_FORMULA, computeRoi, planFor, roiIsReady } from '../lib/roi';

describe('planFor', () => {
  it('has no answer for nobody', () => {
    expect(planFor(0)).toBeUndefined();
    expect(planFor(-5)).toBeUndefined();
  });

  it('picks the smallest plan that fits', () => {
    expect(planFor(1)?.key).toBe('starter');
    expect(planFor(100)?.key).toBe('starter');
    expect(planFor(101)?.key).toBe('growth');
    expect(planFor(1_000)?.key).toBe('growth');
    expect(planFor(1_001)?.key).toBe('enterprise');
  });
});

describe('computeRoi', () => {
  const base = { learners: 400, toolSpendMonthly: 12_000, reconcileHoursWeekly: 6, hourlyCost: 500 };

  it('works in integer minor units, never floats', () => {
    const result = computeRoi(base);
    expect(Number.isInteger(result.toolsAnnualMinor)).toBe(true);
    expect(Number.isInteger(result.reconcileCostMinor)).toBe(true);
    expect(Number.isInteger(result.akechiAnnualMinor)).toBe(true);
  });

  it('computes exactly what the printed formula says', () => {
    const result = computeRoi(base);
    expect(result.toolsAnnualMinor).toBe(12_000 * 12 * 100);
    expect(result.hoursAnnual).toBe(6 * 52);
    expect(result.reconcileCostMinor).toBe(6 * 52 * 500 * 100);
    expect(result.plan?.key).toBe('growth');
    expect(result.akechiAnnualMinor).toBe(1_499_900 * 12);
    expect(result.netMinor).toBe(result.toolsAnnualMinor + result.reconcileCostMinor - result.akechiAnnualMinor);
  });

  it('produces no net figure on a negotiated plan, because there is no honest one', () => {
    const result = computeRoi({ ...base, learners: 5_000 });
    expect(result.plan?.key).toBe('enterprise');
    expect(result.netMinor).toBeUndefined();
  });

  it('can produce a negative result — it is arithmetic, not an advertisement', () => {
    const result = computeRoi({ learners: 400, toolSpendMonthly: 0, reconcileHoursWeekly: 1, hourlyCost: 100 });
    expect(result.netMinor).toBeLessThan(0);
  });

  it('charges nothing on the free tier', () => {
    const result = computeRoi({ ...base, learners: 80 });
    expect(result.plan?.key).toBe('starter');
    expect(result.akechiAnnualMinor).toBe(0);
  });

  it('treats an empty form as nothing to say', () => {
    const empty = { learners: 0, toolSpendMonthly: 0, reconcileHoursWeekly: 0, hourlyCost: 0 };
    expect(roiIsReady(empty)).toBe(false);
    expect(roiIsReady({ ...empty, learners: 100 })).toBe(false);
    expect(roiIsReady({ ...empty, learners: 100, toolSpendMonthly: 1 })).toBe(true);
  });
});

describe('the printed formula', () => {
  it('names every term the code actually uses', () => {
    for (const term of ['monthlyToolSpend', 'hoursPerWeek', 'loadedHourlyCost', 'plan(learners)']) {
      expect(ROI_FORMULA).toContain(term);
    }
  });

  it('promises no term the code does not compute', () => {
    for (const absent of ['revenue', 'uplift', 'conversion', 'retention']) {
      expect(ROI_FORMULA.toLowerCase()).not.toContain(absent);
    }
  });
});
