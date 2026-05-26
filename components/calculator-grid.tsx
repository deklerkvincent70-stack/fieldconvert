import Link from 'next/link';
import { Calculator } from 'lucide-react';
import type { Calculator as CalculatorType } from '@/lib/types';

export function CalculatorGrid({ calculators }: { calculators: CalculatorType[] }) {
  return (
    <section className="bg-slate-100 py-10 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wide text-clay">Field tools</p>
        <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">Specialized calculators</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <Link key={calculator.id} href={calculator.href} className="rounded-lg bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-950">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-clay/10 text-clay">
                  <Calculator size={22} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{calculator.category}</p>
                  <h3 className="mt-1 font-black text-ink dark:text-white">{calculator.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{calculator.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
