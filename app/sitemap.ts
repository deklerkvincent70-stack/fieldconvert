import type { MetadataRoute } from 'next';
import { calculators } from '@/lib/conversions/data';
import { conversionPages } from '@/lib/conversions/engine';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fieldconvert.example.com';
  return [
    { url: siteUrl, priority: 1 },
    ...conversionPages().map((page) => ({ url: `${siteUrl}/convert/${page.slug}`, priority: 0.8 })),
    ...calculators.map((calculator) => ({ url: `${siteUrl}${calculator.href}`, priority: 0.75 }))
  ];
}
