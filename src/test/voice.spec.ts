import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The vocabulary gate.
 *
 * docs/02 §7 lists the words we do not use, and docs/17 §7 lists the claims we do not make.
 * A style guide nobody enforces is a style guide that decays one deadline at a time, so this
 * reads every page and content file and fails on one.
 */

const SRC = join(process.cwd(), 'src');

function collect(dir: string, acc: { file: string; text: string }[] = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'test') continue;
      collect(full, acc);
      continue;
    }
    if (!/\.(tsx?|json)$/.test(name)) continue;
    if (name.endsWith('.spec.ts')) continue;
    acc.push({ file: full.replace(process.cwd(), ''), text: readFileSync(full, 'utf8') });
  }
  return acc;
}

const files = collect(SRC);

/** Words that mean nothing, and would survive being pasted onto a competitor's site. */
const BANNED_WORDS = [
  'world-class',
  'best-in-class',
  'cutting-edge',
  'game-chang',
  'revolutionis',
  'revolutioniz',
  'supercharge',
  'unlock the power',
  'seamlessly',
  'effortlessly',
  'robust and scalable',
  'next-generation',
  'one-stop shop',
];

/** Claims we may not make until they are true (docs/17 §7). */
const BANNED_CLAIMS = [
  'trusted by thousands',
  'trusted by leading',
  'soc 2 certified',
  'iso 27001',
  '99.9% uptime',
  '99.99% uptime',
  'award-winning',
  'industry-leading',
  '#1 lms',
  'gdpr compliant',
];

/**
 * A banned phrase may legitimately appear when we are *denying* it — the security page says
 * "we are not SOC 2 certified", and the data-processing page explains why it will not call
 * itself "GDPR compliant". So the check looks for a negation in the 90 characters before the
 * phrase; an affirmative use has none, and fails.
 */
const NEGATIONS = /\b(no|not|never|without|until|neither|nor|rather than|refuse|cannot|do not|does not|will not|have not|has not|is not|are not|unironically)\b/;

function affirmativeUses(text: string, phrase: string): number {
  const lower = text.toLowerCase();
  let count = 0;
  let from = 0;
  for (;;) {
    const at = lower.indexOf(phrase, from);
    if (at === -1) break;
    const before = lower.slice(Math.max(0, at - 90), at);
    if (!NEGATIONS.test(before)) count += 1;
    from = at + phrase.length;
  }
  return count;
}

describe('voice', () => {
  it('uses none of the words that mean nothing', () => {
    const hits: string[] = [];
    for (const { file, text } of files) {
      const lower = text.toLowerCase();
      for (const word of BANNED_WORDS) {
        if (lower.includes(word)) hits.push(`${file}: "${word}"`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('makes no claim we have not earned', () => {
    const hits: string[] = [];
    for (const { file, text } of files) {
      for (const claim of BANNED_CLAIMS) {
        if (affirmativeUses(text, claim) > 0) hits.push(`${file}: "${claim}" used affirmatively`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('never emits an AggregateRating or Review, because there are no reviews', () => {
    // The *emitting* form, not the word: json-ld.tsx names both in a comment explaining that
    // it does not emit them, and that comment is the documentation of this rule.
    for (const { file, text } of files) {
      expect(text, file).not.toContain("'@type': 'AggregateRating'");
      expect(text, file).not.toContain('"@type": "AggregateRating"');
      expect(text, file).not.toContain("'@type': 'Review'");
      expect(text, file).not.toContain('aggregateRating:');
    }
  });

  it('says "enterprise-grade" nowhere', () => {
    // The specific adjective the security page exists to replace with a mechanism.
    for (const { file, text } of files) {
      if (file.includes('voice.spec')) continue;
      const lower = text.toLowerCase();
      const uses = lower.split('enterprise-grade').length - 1;
      const quoted = lower.split('“enterprise-grade”').length - 1 + lower.split('&ldquo;enterprise-grade&rdquo;').length - 1;
      expect(uses - quoted, `${file} uses "enterprise-grade" unironically`).toBeLessThanOrEqual(0);
    }
  });
});

describe('third parties', () => {
  it('are referenced from no source file', () => {
    // ADR 0007. The CSP forbids them at runtime; this catches one being added at author time.
    const hosts = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'googletagmanager.com',
      'google-analytics.com',
      'cdn.jsdelivr.net',
      'unpkg.com',
      'youtube.com/embed',
      'hcaptcha.com',
      'recaptcha',
    ];
    const hits: string[] = [];
    for (const { file, text } of files) {
      for (const host of hosts) {
        if (text.includes(host)) hits.push(`${file}: ${host}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
