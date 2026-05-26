import type { Category, ConversionResult, Unit } from '@/lib/types';
import { categories } from './data';

export function findCategory(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function allUnits(): Array<{ category: Category; unit: Unit }> {
  return categories.flatMap((category) => category.units.map((unit) => ({ category, unit })));
}

export function findUnit(term: string, categoryId?: string): { category: Category; unit: Unit } | undefined {
  const normalized = normalize(term);
  const pool = categoryId ? allUnits().filter((entry) => entry.category.id === categoryId) : allUnits();
  return pool.find(({ unit }) => unit.id === normalized || unit.aliases.some((alias) => normalize(alias) === normalized));
}

export function convert(categoryId: string, fromId: string, toId: string, input: number): ConversionResult {
  const category = findCategory(categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);
  const from = category.units.find((unit) => unit.id === fromId);
  const to = category.units.find((unit) => unit.id === toId);
  if (!from || !to) throw new Error('Unknown unit for category');

  const value = category.id === 'temperature' ? convertTemperature(input, from, to) : (input * from.toBase) / to.toBase;
  return {
    category: category.id,
    from,
    to,
    input,
    value,
    formula: category.id === 'temperature' ? `${from.label} to ${to.label}` : `${input} x ${from.toBase} / ${to.toBase}`
  };
}

export function conversionPages() {
  return categories.flatMap((category) =>
    category.units.flatMap((from) =>
      category.units
        .filter((to) => to.id !== from.id)
        .map((to) => ({
          slug: `${from.id}-to-${to.id}`,
          category,
          from,
          to
        }))
    )
  );
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en', { maximumFractionDigits: Math.abs(value) < 1 ? 8 : 4 }).format(value);
}

function convertTemperature(input: number, from: Unit, to: Unit): number {
  const celsius = (input + (from.offset ?? 0)) * from.toBase;
  if (to.id === 'fahrenheit') return celsius * (9 / 5) + 32;
  if (to.id === 'kelvin') return celsius + 273.15;
  return celsius;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[²³]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9/-]/g, '');
}
