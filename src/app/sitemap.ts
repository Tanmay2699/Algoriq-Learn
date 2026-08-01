import type { MetadataRoute } from 'next';
import { site } from '../config/site';
import { clusters, solutions } from '../config/navigation';
import { seoEntries } from '../config/seo';
import { modules } from '../content/modules';
import { articles } from '../content/articles';
import { comparisons } from '../content/comparisons';
import { legalDocs } from '../content/legal';

/**
 * Generated from the same registries the navigation reads, so a page cannot exist without
 * appearing here and cannot appear here without existing. `/demo` is excluded because it is
 * noindex — a form page in the index wastes crawl budget and ranks for nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly') => ({
    url: `${site.url}${path === '/' ? '' : path}`,
    lastModified: new Date('2026-07-31'),
    changeFrequency,
    priority,
  });

  const staticPaths = Object.entries(seoEntries)
    .filter(([, meta]) => !meta.noindex)
    .map(([path]) => entry(path, path === '/' ? 1 : 0.7, path === '/' || path === '/pricing' ? 'weekly' : 'monthly'));

  return [
    ...staticPaths,
    ...clusters.map((cluster) => entry(cluster.href, 0.8, 'monthly')),
    ...modules.map((module) => entry(`/product/modules/${module.slug}`, 0.6, 'monthly')),
    ...solutions.map((solution) => entry(solution.href, 0.8, 'monthly')),
    ...comparisons.map((comparison) => entry(`/compare/${comparison.slug}`, 0.8, 'monthly')),
    ...articles.map((article) => entry(`/resources/${article.slug}`, 0.6, 'monthly')),
    ...legalDocs.map((doc) => entry(`/legal/${doc.slug}`, 0.3, 'yearly')),
  ];
}
