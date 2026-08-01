import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MARKETING_FONT_SIZES, PRODUCT_FONT_SIZES, cn } from '../lib/cn';

/**
 * The regression test for the defect that made every heading on the site render at the
 * inherited size: tailwind-merge treating an unknown `text-*` class as a colour and dropping
 * the size that came with it.
 */
describe('cn', () => {
  it('keeps a font size and a text colour together', () => {
    expect(cn('font-display text-display-2', 'text-fg')).toContain('text-display-2');
    expect(cn('font-display text-display-2', 'text-fg')).toContain('text-fg');
  });

  it('keeps every size in the marketing ramp', () => {
    for (const size of MARKETING_FONT_SIZES) {
      const result = cn(`text-${size}`, 'text-fg-muted');
      expect(result, `text-${size} was dropped`).toContain(`text-${size}`);
    }
  });

  it('keeps every size in the inherited product ramp', () => {
    for (const size of PRODUCT_FONT_SIZES) {
      expect(cn(`text-${size}`, 'text-fg-muted')).toContain(`text-${size}`);
    }
  });

  it('still resolves genuine conflicts', () => {
    expect(cn('text-fg', 'text-fg-muted')).toBe('text-fg-muted');
    expect(cn('text-mk-body', 'text-mk-lead')).toBe('text-mk-lead');
    expect(cn('p-4', 'p-6')).toBe('p-6');
  });

  it('drops nothing that is not a conflict', () => {
    expect(cn('rounded-lg border border-border bg-surface p-6')).toBe(
      'rounded-lg border border-border bg-surface p-6',
    );
  });
});

describe('the font-size list', () => {
  it('matches the Tailwind config exactly — a size added there must be added here', () => {
    const config = readFileSync(join(process.cwd(), 'tailwind.config.ts'), 'utf8');
    const block = config.slice(config.indexOf('fontSize: {'), config.indexOf('spacing: {'));
    const declared = [...block.matchAll(/^\s+'([a-z0-9-]+)':\s*\[/gm)].map((match) => match[1]!);

    expect(declared.sort()).toEqual([...MARKETING_FONT_SIZES].sort());
  });
});
