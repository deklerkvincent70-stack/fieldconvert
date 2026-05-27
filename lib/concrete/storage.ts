import { defaultSettings } from './data';
import type { Costs, SavedCalculation, Settings } from './types';

const SETTINGS_KEY = 'concretemix:settings';
const COSTS_KEY = 'concretemix:costs';
const HISTORY_KEY = 'concretemix:history';

export const defaultCosts: Costs = {
  cementPerBag: 0,
  cementPerKg: 0,
  sandPerM3: 0,
  aggregatePerM3: 0,
  water: 0,
  labor: 0,
  transport: 0
};

export function loadSettings(): Settings {
  return { ...defaultSettings, ...readJson<Partial<Settings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: Settings) {
  writeJson(SETTINGS_KEY, settings);
}

export function loadCosts(): Costs {
  return { ...defaultCosts, ...readJson<Partial<Costs>>(COSTS_KEY, {}) };
}

export function saveCosts(costs: Costs) {
  writeJson(COSTS_KEY, costs);
}

export function loadHistory(): SavedCalculation[] {
  return readJson<SavedCalculation[]>(HISTORY_KEY, []);
}

export function saveCalculation(calculation: SavedCalculation) {
  const next = [calculation, ...loadHistory().filter((item) => item.id !== calculation.id)].slice(0, 20);
  writeJson(HISTORY_KEY, next);
  return next;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
