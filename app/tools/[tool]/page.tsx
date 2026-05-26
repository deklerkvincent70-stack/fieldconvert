import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { PracticalCalculator } from '@/components/practical-calculator';
import { calculators } from '@/lib/conversions/data';

export function generateStaticParams() {
  return calculators.filter((tool) => tool.href.startsWith('/tools/')).map((tool) => ({ tool: tool.href.split('/').pop() ?? '' }));
}

export default function ToolPage({ params }: { params: { tool: string } }) {
  const calculator = calculators.find((item) => item.href === `/tools/${params.tool}`);
  if (!calculator) notFound();
  return (
    <main>
      <Header />
      <PracticalCalculator calculator={calculator} />
    </main>
  );
}
