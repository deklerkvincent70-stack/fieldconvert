'use client';

import { Copy, RotateCcw, Share2, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { categories } from '@/lib/conversions/data';
import { convert, findCategory, formatNumber } from '@/lib/conversions/engine';

export function ConverterPanel({ categoryId, fromId, toId, compact = false }: { categoryId: string; fromId: string; toId: string; compact?: boolean }) {
  const [value, setValue] = useState(1);
  const [activeCategoryId, setActiveCategoryId] = useState(categoryId);
  const [from, setFrom] = useState(fromId);
  const [to, setTo] = useState(toId);
  const category = findCategory(activeCategoryId) ?? categories[0];
  const validFrom = category.units.some((unit) => unit.id === from) ? from : category.units[0].id;
  const validTo = category.units.some((unit) => unit.id === to) ? to : category.units[1]?.id ?? category.units[0].id;
  const result = useMemo(() => convert(category.id, validFrom, validTo, value || 0), [category.id, validFrom, validTo, value]);
  const text = `${formatNumber(value)} ${result.from.symbol} = ${formatNumber(result.value)} ${result.to.symbol}`;

  function changeCategory(nextCategoryId: string) {
    const nextCategory = findCategory(nextCategoryId) ?? categories[0];
    setActiveCategoryId(nextCategory.id);
    setFrom(nextCategory.popular[0] ?? nextCategory.units[0].id);
    setTo(nextCategory.popular[1] ?? nextCategory.units[1]?.id ?? nextCategory.units[0].id);
  }

  function swap() {
    setFrom(validTo);
    setTo(validFrom);
  }

  async function copy() {
    await navigator.clipboard?.writeText(text);
    saveRecent(text);
  }

  async function share() {
    saveRecent(text);
    if (navigator.share) await navigator.share({ title: 'FieldConvert conversion', text, url: location.href });
  }

  function favorite() {
    const key = 'fieldconvert:favorites';
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
    localStorage.setItem(key, JSON.stringify(Array.from(new Set([location.pathname, ...saved])).slice(0, 20)));
  }

  return (
    <section className={`${compact ? '' : 'mt-6'} rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 sm:p-5`}>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Category</span>
        <select
          value={category.id}
          onChange={(event) => changeCategory(event.target.value)}
          className="h-14 rounded-lg border border-slate-300 bg-white px-3 text-base font-bold dark:border-slate-700 dark:bg-slate-900"
        >
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">From</span>
          <input
            type="number"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="h-14 rounded-lg border border-slate-300 bg-slate-50 px-4 text-lg font-bold outline-none ring-field/30 focus:ring-4 dark:border-slate-700 dark:bg-slate-900"
          />
          <select value={validFrom} onChange={(event) => setFrom(event.target.value)} className="h-12 rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
            {category.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label} ({unit.symbol})
              </option>
            ))}
          </select>
        </label>
        <button onClick={swap} className="grid h-12 w-12 place-items-center rounded-lg bg-field text-white" aria-label="Swap units">
          <RotateCcw size={20} />
        </button>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">To</span>
          <input
            readOnly
            value={formatNumber(result.value)}
            className="h-14 rounded-lg border border-slate-200 bg-slate-100 px-4 text-lg font-black text-ink outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            aria-label="Converted value"
          />
          <select value={validTo} onChange={(event) => setTo(event.target.value)} className="h-12 rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
            {category.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label} ({unit.symbol})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white dark:bg-white dark:text-ink">
          <Copy size={18} /> Copy
        </button>
        <button onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold dark:border-slate-700">
          <Share2 size={18} /> Share
        </button>
        <button onClick={favorite} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold dark:border-slate-700">
          <Star size={18} /> Save
        </button>
        <p className="ml-auto text-sm font-semibold text-slate-500">{text}</p>
      </div>
    </section>
  );
}

function saveRecent(text: string) {
  const key = 'fieldconvert:recent';
  const saved = JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
  localStorage.setItem(key, JSON.stringify(Array.from(new Set([text, ...saved])).slice(0, 20)));
}
