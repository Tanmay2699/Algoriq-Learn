import type { MetadataRoute } from 'next';
import { site } from '../config/site';

/**
 * Everything is crawlable except the three server routes and the form page.
 *
 * The large-language-model crawlers are explicitly allowed. Our content *is* the argument —
 * the security model, the honest build status, the comparison sources — and we would rather it
 * were read than hoarded.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/demo'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
