import Link from 'next/link';
import type { Category } from '@/lib/types';
import { CategoryIcon } from './icon';

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-field">Converters</p>
          <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">Popular categories</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/convert/${category.popular[0]}-to-${category.popular[1]}`}
            className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-field/10 text-field">
                <CategoryIcon name={category.icon} />
              </span>
              <div>
                <h3 className="font-black text-ink dark:text-white">{category.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
