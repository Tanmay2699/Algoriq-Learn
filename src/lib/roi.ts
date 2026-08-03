import { plans, type Plan } from '../content/plans';

/**
 * The ROI arithmetic, as a pure function so it can be tested and so the formula printed on
 * the page and the formula that runs are provably the same one.
 *
 * Everything here is derived from numbers the visitor typed. There is deliberately no
 * "revenue increase" and no "completion-rate uplift": we have no data for either, and a
 * calculator that manufactures a benefit is one a finance director discards along with the
 * vendor (docs/10 §6).
 */

export interface RoiInputs {
  learners: number;
  /** Rupees per month, in whole rupees as typed. */
  toolSpendMonthly: number;
  reconcileHoursWeekly: number;
  /** Rupees per hour, loaded. */
  hourlyCost: number;
}

export interface RoiResult {
  /** All money in integer minor units, like the product's own ledger. */
  toolsAnnualMinor: number;
  hoursAnnual: number;
  reconcileCostMinor: number;
  plan: Plan | undefined;
  algoryqAnnualMinor: number;
  /** Undefined when the plan is negotiated — there is no honest number to show. */
  netMinor: number | undefined;
}

/** The smallest public plan that fits, or the largest one when nothing does. */
export function planFor(learners: number): Plan | undefined {
  if (learners <= 0) return undefined;
  const eligible = plans.filter((plan) => plan.isPublic);
  return eligible.find((plan) => plan.maxSeats === null || learners <= plan.maxSeats) ?? eligible.at(-1);
}

export function computeRoi(inputs: RoiInputs): RoiResult {
  const toolsAnnualMinor = Math.round(inputs.toolSpendMonthly * 12) * 100;
  const hoursAnnual = inputs.reconcileHoursWeekly * 52;
  const reconcileCostMinor = Math.round(hoursAnnual * inputs.hourlyCost) * 100;

  const plan = planFor(inputs.learners);
  const algoryqAnnualMinor = plan ? plan.priceMinor * (plan.interval === 'MONTHLY' ? 12 : 1) : 0;

  // A negotiated plan has no published price, so there is nothing to subtract and we say so
  // rather than printing a number that looks derived and is not.
  const negotiated = plan?.maxSeats === null;

  return {
    toolsAnnualMinor,
    hoursAnnual,
    reconcileCostMinor,
    plan,
    algoryqAnnualMinor,
    netMinor: negotiated ? undefined : toolsAnnualMinor + reconcileCostMinor - algoryqAnnualMinor,
  };
}

/** True once the visitor has given us enough to say anything at all. */
export function roiIsReady(inputs: RoiInputs): boolean {
  return inputs.learners > 0 && (inputs.toolSpendMonthly > 0 || inputs.reconcileHoursWeekly > 0);
}

/** The formula, printed on the page. Kept here so it cannot drift from the code above it. */
export const ROI_FORMULA = `toolsAnnual      = monthlyToolSpend × 12
hoursAnnual      = hoursPerWeek × 52
reconcileCost    = hoursAnnual × loadedHourlyCost
algoryqAnnual     = plan(learners).price × 12      (Starter is ₹0)
difference       = toolsAnnual + reconcileCost − algoryqAnnual`;
