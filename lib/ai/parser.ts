import type { ParseSuggestion } from '@/lib/types';
import { calculators, currencyUnits } from '@/lib/conversions/data';
import { allUnits, convert, findUnit, formatNumber } from '@/lib/conversions/engine';

const calculatorKeywords: Record<string, string[]> = {
  concrete: ['concrete', 'cement', 'slab', 'foundation'],
  brick: ['brick', 'block', 'wall'],
  'crop-spacing': ['crop spacing', 'plant population', 'spacing', 'plants per hectare'],
  fertilizer: ['fertilizer', 'fertiliser', 'kg/ha', 'application rate'],
  'water-tank': ['tank', 'jojo', 'water storage'],
  diesel: ['diesel', 'fuel usage', 'liters per hectare'],
  amperage: ['amps', 'amperage', 'watts', 'volts'],
  solar: ['solar', 'battery', 'inverter'],
  roofing: ['roof', 'roofing', 'ibr', 'sheeting'],
  paint: ['paint', 'coats', 'coverage']
};

export function parseNaturalLanguage(input: string): ParseSuggestion[] {
  const query = input.trim();
  if (!query) return [];
  const normalized = query.toLowerCase();
  const suggestions: ParseSuggestion[] = [];
  const amount = extractNumber(normalized);
  const currencyMatch = detectCurrency(normalized);

  if (currencyMatch) {
    suggestions.push({
      confidence: 0.82,
      intent: 'currency',
      message: `Currency conversion detected: ${currencyMatch.from} to ${currencyMatch.to}. Live exchange rates are coming soon.`
    });
  }

  const detectedUnits = detectUnits(normalized);
  if (amount !== undefined && detectedUnits.length >= 2) {
    const [from, to] = detectedUnits;
    if (from.category.id === to.category.id) {
      const result = convert(from.category.id, from.unit.id, to.unit.id, amount);
      suggestions.push({
        confidence: 0.92,
        intent: 'convert',
        result,
        href: `/convert/${from.unit.id}-to-${to.unit.id}`,
        message: `${formatNumber(amount)} ${from.unit.symbol} = ${formatNumber(result.value)} ${to.unit.symbol}`
      });
    }
  }

  for (const calculator of calculators) {
    const keywords = calculatorKeywords[calculator.id] ?? [calculator.name.toLowerCase()];
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      suggestions.push({
        confidence: 0.74,
        intent: 'calculate',
        href: calculator.href,
        message: `This looks like a ${calculator.name.toLowerCase()} problem. Open the calculator for field-ready inputs.`
      });
    }
  }

  if (suggestions.length === 0 && amount !== undefined) {
    const likely = allUnits().filter(({ unit }) => normalized.includes(unit.aliases[0])).slice(0, 3);
    suggestions.push({
      confidence: 0.38,
      intent: 'unknown',
      message: likely.length ? `I found a value and possible units. Try: convert ${amount} ${likely[0].unit.symbol} to ...` : 'I found a value. Add the source and target units for an instant conversion.'
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
}

function extractNumber(value: string): number | undefined {
  const feetInches = value.match(/(\d+(?:\.\d+)?)\s*(foot|feet|ft|')\s*(\d+(?:\.\d+)?)?\s*(inch|inches|in|")?/);
  if (feetInches) {
    const feet = Number(feetInches[1]);
    const inches = feetInches[3] ? Number(feetInches[3]) : 0;
    return feet + inches / 12;
  }
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function detectUnits(value: string) {
  const units = allUnits();
  const matches = units.filter(({ unit }) => unit.aliases.some((alias) => hasTerm(value, alias)));
  const fromTo = value.match(/from\s+(.+?)\s+to\s+(.+)$/) ?? value.match(/convert\s+.+?\s+(.+?)\s+to\s+(.+)$/);
  if (fromTo) {
    const from = findUnit(fromTo[1].trim());
    const to = findUnit(fromTo[2].trim());
    if (from && to) return [from, to];
  }
  return matches;
}

function hasTerm(value: string, term: string) {
  const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(value);
}

function detectCurrency(value: string) {
  const found = currencyUnits.filter((currency) => {
    const code = currency.code.toLowerCase();
    return value.includes(code) || value.includes(currency.name.toLowerCase()) || value.includes(currency.name.split(' ')[0].toLowerCase());
  });
  if (found.length >= 2) return { from: found[0].code, to: found[1].code };
  return undefined;
}
