import { z } from 'zod';

/**
 * The one payload this site sends anywhere.
 *
 * Shared between the form and the API route so the two cannot disagree — the same discipline
 * the product uses, where every request shape is a Zod schema in a shared package rather than
 * a DTO class per module.
 *
 * Seven fields, two optional. Every additional required field costs roughly five to eight per
 * cent of completions; each one here earns it. There is deliberately no "budget", no "timeline"
 * and no "company size in revenue" — those are questions for the call, and asking them on a
 * form is how you collect fake answers.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(120),
  email: z.string().trim().email('That does not look like an email address.').max(200),
  institute: z.string().trim().min(2, 'Which institute?').max(160),
  role: z.enum(['owner', 'academic', 'it', 'finance', 'other'], {
    errorMap: () => ({ message: 'Please choose the closest one.' }),
  }),
  learners: z.enum(['under-100', '100-500', '500-2000', '2000-plus', 'not-sure'], {
    errorMap: () => ({ message: 'A rough range is fine.' }),
  }),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  intent: z.enum(['walkthrough', 'design-partner', 'pricing', 'security', 'starter', 'growth', 'enterprise']),
  /**
   * Honeypot. A real person never fills this in; it is hidden and not focusable.
   *
   * It is deliberately impossible to fail — clamped rather than bounded. A constraint here
   * would reject a filled honeypot at the schema, and the 400 would name `website` in its
   * field errors, which tells a script precisely which input to leave alone next time. That
   * is the leak the route exists to avoid, so the field parses whatever arrives and the route
   * answers a silent 200 instead (see `app/api/lead/route.ts`).
   */
  website: z
    .string()
    .transform((value) => value.slice(0, 2000))
    .optional(),
  /** Milliseconds between the form rendering and being submitted. Bots are fast. */
  elapsedMs: z.number().int().nonnegative(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Anything under this is a script, not a person reading seven labels. */
export const MIN_ELAPSED_MS = 2_500;

export const ROLE_LABELS: Record<LeadInput['role'], string> = {
  owner: 'Owner or principal',
  academic: 'Academic — head, teacher, curriculum',
  it: 'IT or engineering',
  finance: 'Finance or operations',
  other: 'Something else',
};

export const LEARNER_LABELS: Record<LeadInput['learners'], string> = {
  'under-100': 'Under 100',
  '100-500': '100 to 500',
  '500-2000': '500 to 2,000',
  '2000-plus': 'More than 2,000',
  'not-sure': 'Not sure yet',
};

export const INTENT_HEADINGS: Record<LeadInput['intent'], { title: string; lead: string }> = {
  walkthrough: {
    title: 'Book a 20-minute walkthrough',
    lead: 'A real person, your questions, and the parts of the product you actually care about. No slides.',
  },
  'design-partner': {
    title: 'Apply as a design partner',
    lead: 'Growth free for twelve months, weekly access to the people who built it, and a case study at ninety days that is yours to approve or refuse.',
  },
  pricing: {
    title: 'Talk about pricing',
    lead: 'The plans are on the pricing page. This is for the questions they do not answer.',
  },
  security: {
    title: 'A technical and security walkthrough',
    lead: 'Isolation, permissions, audit and self-hosting, with whoever wrote them.',
  },
  starter: {
    title: 'Start on the free tier',
    lead: 'A hundred seats, twenty-five courses, no card. Tell us where to set it up.',
  },
  growth: { title: 'Start on Growth', lead: 'A thousand seats. There is no checkout yet, so this begins with a short conversation.' },
  enterprise: { title: 'Talk about Enterprise', lead: 'Unlimited scale, negotiated commercially. Tell us what you need it to do.' },
};

export function parseIntent(value: string | undefined): LeadInput['intent'] {
  const allowed = Object.keys(INTENT_HEADINGS) as LeadInput['intent'][];
  return allowed.includes(value as LeadInput['intent']) ? (value as LeadInput['intent']) : 'walkthrough';
}
