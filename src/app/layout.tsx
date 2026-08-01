import type { Metadata, Viewport } from 'next';
import { fraunces, inter } from './fonts';
import { NO_FLASH_SCRIPT } from '../lib/theme';
import { site } from '../config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Akechi — the multi-tenant LMS for institutes',
    template: '%s · Akechi',
  },
  description:
    'One system of record for schools, colleges and coaching institutes: admissions, courses, '
    + 'live classes, assessments, fees, staff and outcomes. Free for 100 seats.',
  applicationName: 'Akechi',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Akechi',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#17171c' },
  ],
};

/**
 * The root layout.
 *
 * `lang` is fixed at the product's default locale rather than negotiated: this site ships one
 * language. The routing shape for a second one is decided (docs/11 §4) but pretending to
 * negotiate a locale we do not have would put a wrong `lang` on the page, and `lang` is what a
 * screen reader uses to pick a voice.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale} dir="ltr" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        {/* Before first paint, so an explicit light/dark choice never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
