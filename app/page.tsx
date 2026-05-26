import { AiConvertBox } from '@/components/ai-convert-box';
import { CalculatorGrid } from '@/components/calculator-grid';
import { CategoryGrid } from '@/components/category-grid';
import { Header } from '@/components/header';
import { calculators, categories } from '@/lib/conversions/data';

export default function HomePage() {
  return (
    <main>
      <Header />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-8 pt-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-14 lg:pt-10">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-field">Built for real work in the field</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink dark:text-white sm:text-5xl">
            Fast unit conversions for engineers, builders, farmers, miners and students.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            Search, convert, calculate and save practical results. Works offline, installs on Android and iPhone, and is tuned for low-bandwidth use across African markets.
          </p>
        </div>
        <AiConvertBox />
      </section>
      <section className="border-y border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {['Offline PWA', 'SEO pages', 'Voice ready', 'Local currencies'].map((item) => (
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
