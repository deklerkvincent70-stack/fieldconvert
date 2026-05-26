import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { PracticalCalculator } from '@/components/practical-calculator';
import { calculators } from '@/lib/conversions/data';

export function generateStaticParams() {
  return calculators.filter((tool) => tool.href.startsWith('/construction/')).map((tool) => ({ tool: tool.href.split('/').pop() ?? '' }));
}

export default function ConstructionToolPage({ params }: { params: { tool: string } }) {
  const calculator = calculators.find((item) => item.href === `/construction/${params.tool}`);
  if (!calculator) notFound();
  return (
    <main>
      <Header />
      <PracticalCalculator calculator={calculator} />
    </main>
  );
}
