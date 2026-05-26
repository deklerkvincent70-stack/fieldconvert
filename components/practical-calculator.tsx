'use client';

import { Copy, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Calculator } from '@/lib/types';
import { amperage, concreteVolume, cropPopulation, fertilizerTotal, tankVolumeLiters } from '@/lib/calculators';
import { formatNumber } from '@/lib/conversions/engine';

export function PracticalCalculator({ calculator }: { calculator: Calculator }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(calculator.fields.map((field, index) => [field, index === 2 ? 0.1 : 1]))
  );
  const result = useMemo(() => calculate(calculator.id, values), [calculator.id, values]);

  function update(field: string, value: number) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function copy() {
    await navigator.clipboard?.writeText(`${calculator.name}: ${result}`);
  }

  function save() {
    const key = 'fieldconvert:saved-calculators';
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
    localStorage.setItem(key, JSON.stringify(Array.from(new Set([calculator.href, ...saved])).slice(0, 20)));
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-clay">{calculator.category}</p>
      <h1 className="mt-2 text-3xl font-black text-ink dark:text-white sm:text-5xl">{calculator.name}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">{calculator.description}</p>
      <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-3">
          {calculator.fields.map((field) => (
            <label key={field} className="grid gap-2">
              <span className="text-sm font-bold capitalize text-slate-600 dark:text-slate-300">{field}</span>
              <input
                type="number"
                value={values[field] ?? 0}
                onChange={(event) => update(field, Number(event.target.value))}
                className="h-13 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-lg font-bold outline-none ring-clay/30 focus:ring-4 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          ))}
        </div>
        <div className="rounded-lg bg-slate-50 p-5 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Estimated result</p>
          <p className="mt-3 text-2xl font-black leading-snug text-ink dark:text-white">{result}</p>
          <div className="mt-5 flex gap-2">
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white dark:bg-white dark:text-ink">
              <Copy size={18} /> Copy
            </button>
            <button onClick={save} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold dark:border-slate-700">
              <Save size={18} /> Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function calculate(id: string, values: Record<string, number>) {
  if (id === 'concrete') {
    const result = concreteVolume(values.length ?? 1, values.width ?? 1, values.depth ?? 0.1);
    return `${formatNumber(result.cubicMeters)} m3 concrete, about ${formatNumber(result.cementBags50kg)} cement bags`;
  }
  if (id === 'crop-spacing') {
    return `${formatNumber(cropPopulation(values['row spacing'] ?? 0.75, values['plant spacing'] ?? 0.3))} plants per hectare`;
  }
  if (id === 'fertilizer') {
    const result = fertilizerTotal(values.rate ?? 100, values.area ?? 1, values['bag size'] ?? 50);
    return `${formatNumber(result.kg)} kg total, about ${formatNumber(result.bags)} bags`;
  }
  if (id === 'water-tank') {
    return `${formatNumber(tankVolumeLiters(values.diameter ?? 1, values.height ?? 1))} liters`;
  }
  if (id === 'amperage') {
    return `${formatNumber(amperage(values.watts ?? 1000, values.volts ?? 230))} amps`;
  }
  if (id === 'solar') {
    const daily = values['daily kWh'] ?? 5;
    const sun = values['sun hours'] ?? 5;
    return `${formatNumber((daily / sun) * 1.25)} kW solar array before site losses`;
  }
  if (id === 'diesel') {
    const liters = (values.hours ?? 1) * (values.rate ?? 8);
    return `${formatNumber(liters)} liters, estimated cost ${formatNumber(liters * (values.cost ?? 23))}`;
  }
  if (id === 'roofing') {
    const area = (values.length ?? 1) * (values.width ?? 1) * (1 + ((values.pitch ?? 15) / 100));
    return `${formatNumber(area)} m2 roof area before sheet overlap`;
  }
  if (id === 'paint') {
    return `${formatNumber(((values.area ?? 20) * (values.coats ?? 2)) / (values.coverage ?? 8))} liters`;
  }
  if (id === 'brick') {
    return `${formatNumber((values['wall area'] ?? 10) * 52 * (1 + (values.waste ?? 10) / 100))} bricks or blocks including waste`;
  }
  return 'Add values to calculate an estimate.';
}
