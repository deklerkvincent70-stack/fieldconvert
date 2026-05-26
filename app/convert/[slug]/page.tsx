import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConverterPanel } from '@/components/converter-panel';
import { Header } from '@/components/header';
import { allUnits, conversionPages, convert, formatNumber } from '@/lib/conversions/engine';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return conversionPages().map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = resolvePage(params.slug);
  if (!page) return {};
  return {
    title: `${page.from.label} to ${page.to.label} Converter`,
    description: `Convert ${page.from.label} (${page.from.symbol}) to ${page.to.label} (${page.to.symbol}) instantly with formula, FAQ and mobile field tools.`,
    alternates: { canonical: `/convert/${params.slug}` }
  };
}

export default function ConversionPage({ params }: Props) {
  const page = resolvePage(params.slug);
  if (!page) notFound();
  const sample = convert(page.category.id, page.from.id, page.to.id, 1);

  return (
    <main>
      <Header />
      <article className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wide text-field">{page.category.name}</p>
        <h1 className="mt-2 text-3xl font-black text-ink dark:text-white sm:text-5xl">
          {page.from.label} to {page.to.label} converter
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
          1 {page.from.symbol} equals {formatNumber(sample.value)} {page.to.symbol}. Use this fast mobile converter for site work, study, agriculture, engineering and everyday planning.
        </p>
        <ConverterPanel categoryId={page.category.id} fromId={page.from.id} toId={page.to.id} />
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-black">Formula</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{sample.formula}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-black">Offline use</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">Install FieldConvert as a PWA to keep recent converters and calculator pages available on site.</p>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `How do I convert ${page.from.label} to ${page.to.label}?`,
                  acceptedAnswer: { '@type': 'Answer', text: `Use the converter or multiply by ${sample.from.toBase / sample.to.toBase}.` }
                },
                {
                  '@type': 'Question',
                  name: 'Can I use this converter offline?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. FieldConvert includes PWA support and a service worker for offline access to cached pages.' }
                }
              ]
            })
          }}
        />
      </article>
    </main>
  );
}

function resolvePage(slug: string) {
  const exact = conversionPages().find((item) => item.slug === slug);
  if (exact) return exact;
  const [fromTerm, toTerm] = slug.split('-to-');
  if (!fromTerm || !toTerm) return undefined;
  const from = allUnits().find((entry) => entry.unit.id === fromTerm || entry.unit.aliases.includes(fromTerm));
  const to = allUnits().find((entry) => entry.unit.id === toTerm || entry.unit.aliases.includes(toTerm));
  if (!from || !to || from.category.id !== to.category.id) return undefined;
  return { slug, category: from.category, from: from.unit, to: to.unit };
}
