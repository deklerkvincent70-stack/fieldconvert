import { Header } from '@/components/header';
import { calculators, categories } from '@/lib/conversions/data';

export default function AdminPage() {
  const seoPages = categories.reduce((sum, category) => sum + category.units.length * (category.units.length - 1), 0);

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black text-ink dark:text-white">Admin overview</h1>
        <p className="mt-2 max-w-2xl text-slate-700 dark:text-slate-300">
          Lightweight content operations shell for categories, formulas, SEO fields, analytics slots and featured calculators. Connect this to a CMS, Git-backed JSON editor or protected API when ready.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['Categories', categories.length],
            ['Calculators', calculators.length],
            ['SEO pages', seoPages]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 text-4xl font-black text-field">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-black">Content queues</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {['Formula review', 'SEO descriptions', 'Featured calculators', 'Analytics events'].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <input type="checkbox" className="h-5 w-5 accent-field" />
                <span className="font-semibold">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
