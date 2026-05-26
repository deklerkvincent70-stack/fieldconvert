import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConverterPanel } from '@/components/converter-panel';
import { Header } from '@/components/header';
import { allUnits, conversionPages } from '@/lib/conversions/engine';

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

  return (
    <main>
      <Header />
      <section className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
        <h1 className="sr-only">
          {page.from.label} to {page.to.label} converter
        </h1>
        <ConverterPanel categoryId={page.category.id} fromId={page.from.id} toId={page.to.id} compact />
      </section>
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
