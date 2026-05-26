import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorker } from '@/components/service-worker';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fieldconvert.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FieldConvert - Fast Unit Conversions for Worksites, Farms and Classrooms',
    template: '%s | FieldConvert'
  },
  description: 'Mobile-first unit conversion platform for engineering, construction, farming, mining, trades and African markets.',
  applicationName: 'FieldConvert',
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FieldConvert',
    description: 'Fast field-ready conversions, calculators and AI conversion search.',
    url: siteUrl,
    siteName: 'FieldConvert',
    type: 'website'
  },
  appleWebApp: {
    capable: true,
    title: 'FieldConvert',
    statusBarStyle: 'default'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8f4' },
    { media: '(prefers-color-scheme: dark)', color: '#101418' }
  ],
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
