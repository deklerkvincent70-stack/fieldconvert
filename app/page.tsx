import { CalculatorGrid } from '@/components/calculator-grid';
import { CategoryGrid } from '@/components/category-grid';
import { ConverterPanel } from '@/components/converter-panel';
import { Header } from '@/components/header';
import { calculators, categories } from '@/lib/conversions/data';

export default function HomePage() {
  return (
    <main>
      <Header />
      <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-4 sm:px-6 sm:pt-8">
        <h1 className="sr-only">FieldConvert unit converter</h1>
        <ConverterPanel categoryId="length" fromId="meter" toId="centimeter" compact />
      </section>
      <section className="border-y border-slate-200 bg-white py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {['Length', 'Area', 'Volume', 'Weight'].map((item) => (
            <div key={item} className="rounded-lg bg-slate-50 p-4 text-center text-sm font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>
      <CategoryGrid categories={categories} />
      <CalculatorGrid calculators={calculators} />
    </main>
  );
}
