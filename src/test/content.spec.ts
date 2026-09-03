import { describe, expect, it } from 'vitest';
import { clusters, footer, header, solutions } from '../config/navigation';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  TITLE_TEMPLATE_SUFFIX,
  seoEntries,
} from '../config/seo';
import { modules } from '../content/modules';
import { buildStatus, notBuiltAtAll } from '../content/build-status';
import { articles } from '../content/articles';
import { comparisons } from '../content/comparisons';
import { legalDocs } from '../content/legal';
import { solutionPages } from '../content/solutions';
import { plans } from '../content/plans';
import { spine, toolStack } from '../content/lifecycle';
import { awards, caseStudies, customerLogos, testimonials } from '../components/sections/proof';

describe('the proof slots', () => {
  /**
   * ADR 0004. This is the test that stops six grey placeholder logos appearing three weeks
   * before launch. If it fails, somebody has added social proof — check every entry has
   * written permission from a named person before deleting this expectation.
   */
  it('are empty, and stay empty until somebody has signed something', () => {
    expect(testimonials).toHaveLength(0);
    expect(caseStudies).toHaveLength(0);
    expect(awards).toHaveLength(0);
    expect(customerLogos).toHaveLength(0);
  });
});

describe('modules', () => {
  it('all belong to a real cluster', () => {
    const keys = new Set(clusters.map((cluster) => cluster.key));
    for (const module of modules) expect(keys.has(module.cluster)).toBe(true);
  });

  it('have unique slugs', () => {
    expect(new Set(modules.map((m) => m.slug)).size).toBe(modules.length);
  });

  it('every one names something it does not do', () => {
    // A module page with no gap is a module page nobody believes.
    for (const module of modules) expect(module.notBuilt.length).toBeGreaterThan(0);
  });

  it('point only at modules that exist', () => {
    const slugs = new Set(modules.map((m) => m.slug));
    for (const module of modules) {
      for (const related of module.related) expect(slugs.has(related)).toBe(true);
    }
  });

  it('carry a completeness figure inside the published range', () => {
    const published = new Map(buildStatus.map((row) => [row.module, row.percent]));
    for (const module of modules) {
      expect(module.completeness).toBeGreaterThan(0);
      expect(module.completeness).toBeLessThanOrEqual(100);
    }
    // Spot-check that the two sources agree where they name the same thing.
    expect(published.get('AI Services')).toBe(modules.find((m) => m.slug === 'ai-assistance')?.completeness);
    expect(published.get('Certificates')).toBe(modules.find((m) => m.slug === 'certificates')?.completeness);
  });
});

describe('build status', () => {
  it('publishes the unflattering rows', () => {
    const weak = buildStatus.filter((row) => row.percent < 60);
    expect(weak.length).toBeGreaterThanOrEqual(4);
  });

  it('names a gap on every row that is not finished', () => {
    for (const row of buildStatus) {
      if (row.percent < 100) expect(row.gap.length).toBeGreaterThan(0);
    }
  });

  it('lists what is not built at all, with a reason each', () => {
    expect(notBuiltAtAll.length).toBeGreaterThanOrEqual(8);
    for (const item of notBuiltAtAll) expect(item.why.length).toBeGreaterThan(20);
  });
});

describe('comparisons', () => {
  it('give the other product wins', () => {
    // A comparison one column sweeps is an advertisement. docs/17 §5.
    for (const comparison of comparisons) {
      const theirs = comparison.rows.filter((row) => row.verdict === 'them' || row.verdict === 'even');
      expect(theirs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('source and date every cell', () => {
    for (const comparison of comparisons) {
      for (const row of comparison.rows) {
        expect(row.source.length).toBeGreaterThan(0);
        expect(row.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('lead with what the other product is good at', () => {
    for (const comparison of comparisons) expect(comparison.theirStrength.length).toBeGreaterThan(120);
  });

  it('use no pejoratives', () => {
    const banned = ['legacy', 'clunky', 'outdated', 'ancient', 'bloated'];
    for (const comparison of comparisons) {
      const text = JSON.stringify(comparison).toLowerCase();
      for (const word of banned) expect(text).not.toContain(word);
    }
  });
});

describe('plans', () => {
  it('are money in integer minor units', () => {
    for (const plan of plans) {
      expect(Number.isInteger(plan.priceMinor)).toBe(true);
      expect(plan.currency).toBe('INR');
    }
  });

  it('match the product’s seeded rows', () => {
    expect(plans.find((p) => p.key === 'starter')?.maxSeats).toBe(100);
    expect(plans.find((p) => p.key === 'growth')?.priceMinor).toBe(1_499_900);
    expect(plans.find((p) => p.key === 'enterprise')?.maxSeats).toBeNull();
  });
});

describe('solutions', () => {
  it('each end by saying when we are the wrong choice', () => {
    for (const solution of solutionPages) expect(solution.disqualifier.length).toBeGreaterThan(60);
  });

  it('cover every solution the navigation offers', () => {
    const slugs = new Set(solutionPages.map((s) => s.slug));
    for (const link of solutions) {
      expect(slugs.has(link.href.replace('/solutions/', ''))).toBe(true);
    }
  });
});

describe('articles', () => {
  it('have unique slugs and real bodies', () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    for (const article of articles) {
      expect(article.body.length).toBeGreaterThan(4);
      expect(article.objection.length).toBeGreaterThan(5);
    }
  });

  it('give every heading a stable id, so a link into one keeps working', () => {
    for (const article of articles) {
      for (const block of article.body) {
        if (block.kind === 'h2') expect(block.id).toMatch(/^[a-z][a-z0-9-]*$/);
      }
    }
  });
});

describe('legal', () => {
  it('are all dated', () => {
    for (const doc of legalDocs) expect(doc.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('navigation and metadata', () => {
  it('gives every header destination a real target', () => {
    for (const item of header) {
      expect(item.href !== undefined || item.menu !== undefined).toBe(true);
    }
  });

  it('has an SEO entry for every static page it links to', () => {
    const dynamicPrefixes = ['/product/', '/solutions/', '/compare/', '/resources/', '/legal/'];
    const linked = footer.flatMap((group) => group.links.map((link) => link.href));
    for (const href of linked) {
      if (dynamicPrefixes.some((prefix) => href.startsWith(prefix) && href !== prefix.slice(0, -1))) continue;
      expect(Object.keys(seoEntries)).toContain(href);
    }
  });

  it('keeps only /demo out of the index', () => {
    const noindex = Object.entries(seoEntries)
      .filter(([, entry]) => entry.noindex)
      .map(([path]) => path);
    expect(noindex).toEqual(['/demo']);
  });

  /**
   * The budgets are the search-result ones, not generous ones. A title that renders past 60
   * characters, or a description past 158, is truncated mid-sentence — so the sentence that
   * reaches a reader is not the sentence anybody wrote. The homepage title is absolute; every
   * other one carries the ` · Algoryq Learn` template, which counts.
   */
  it('writes a title and a description that survive a search result intact', () => {
    for (const [path, entry] of Object.entries(seoEntries)) {
      const rendered = entry.title.length + (path === '/' ? 0 : TITLE_TEMPLATE_SUFFIX.length);
      expect(rendered, `${path} title renders at ${rendered} characters`).toBeLessThanOrEqual(
        MAX_TITLE_LENGTH,
      );
      expect(entry.description.length, `${path} description`).toBeGreaterThan(110);
      expect(entry.description.length, `${path} description`).toBeLessThanOrEqual(
        MAX_DESCRIPTION_LENGTH,
      );
    }
  });

  /**
   * Two pages chasing the same query is two pages splitting the same ranking. Titles are the
   * cheapest place for that to happen by accident, so they are required to be distinct.
   */
  it('gives every page its own title and its own description', () => {
    const titles = Object.values(seoEntries).map((entry) => entry.title);
    const descriptions = Object.values(seoEntries).map((entry) => entry.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  /**
   * The dynamic routes are the easy ones to miss: their metadata is composed from content
   * fields rather than written in seo.ts, so nobody sees the rendered length. Twenty-four of
   * the thirty-four were past the budget when this was written — every solution and most module
   * pages, because `name — h1` is prose and a <title> is not. They carry their own `seoTitle`
   * and `seoDescription` now, and this walks the same tuples `generateMetadata` does.
   */
  it('keeps every dynamic page inside the same budgets', () => {
    const pages: { path: string; title: string; description: string }[] = [
      ...comparisons.map((c) => ({
        path: `/compare/${c.slug}`,
        title: c.seoTitle,
        description: c.seoDescription,
      })),
      ...solutionPages.map((s) => ({
        path: `/solutions/${s.slug}`,
        title: s.seoTitle,
        description: s.seoDescription,
      })),
      ...modules.map((m) => ({
        path: `/product/modules/${m.slug}`,
        title: m.seoTitle,
        description: m.seoDescription,
      })),
      ...articles.map((a) => ({
        path: `/resources/${a.slug}`,
        title: a.seoTitle ?? a.title,
        description: a.description,
      })),
      ...legalDocs.map((d) => ({
        path: `/legal/${d.slug}`,
        title: d.title,
        description: d.description,
      })),
    ];

    for (const page of pages) {
      const rendered = page.title.length + TITLE_TEMPLATE_SUFFIX.length;
      expect(rendered, `${page.path} title renders at ${rendered}`).toBeLessThanOrEqual(
        MAX_TITLE_LENGTH,
      );
      expect(page.description.length, `${page.path} description`).toBeLessThanOrEqual(
        MAX_DESCRIPTION_LENGTH,
      );
      expect(page.description.length, `${page.path} description`).toBeGreaterThan(80);
    }
  });

  it('does not let a dynamic page reuse another page’s title', () => {
    const titles = [
      ...comparisons.map((c) => c.seoTitle),
      ...solutionPages.map((s) => s.seoTitle),
      ...modules.map((m) => m.seoTitle),
      ...Object.values(seoEntries).map((e) => e.title),
    ];
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('the lifecycle', () => {
  it('has seven stops, each owned by a module page', () => {
    expect(spine).toHaveLength(7);
    const slugs = new Set(modules.map((m) => m.slug));
    for (const stop of spine) {
      expect(slugs.has(stop.href.replace('/product/modules/', ''))).toBe(true);
    }
  });

  it('maps every job in the tool stack to somewhere real', () => {
    for (const row of toolStack) expect(row.href.startsWith('/product')).toBe(true);
  });
});
