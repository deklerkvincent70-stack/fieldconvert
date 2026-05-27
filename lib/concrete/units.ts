import type { LengthUnit } from './types';

const toMeters: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048
};

export function lengthToMeters(value: number, unit: LengthUnit) {
  return safeNumber(value) * toMeters[unit];
}

export function cubicMetersToCubicFeet(value: number) {
  return value * 35.3146667215;
}

export function kgToPounds(value: number) {
  return value * 2.2046226218;
}

export function safeNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function round(value: number, digits = 2) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
