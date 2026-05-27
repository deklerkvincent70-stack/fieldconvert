import type { MetadataRoute } from 'next';
import { conversionPages } from '@/lib/conversions/engine';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://convert.vindk.com';
  return [
    { url: siteUrl, priority: 1 },
    ...conversionPages().map((page) => ({ url: `${siteUrl}/convert/${page.slug}`, priority: 0.8 }))
  ];
}
