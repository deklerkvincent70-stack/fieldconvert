export type Unit = {
  id: string;
  label: string;
  symbol: string;
  aliases: string[];
  toBase: number;
  offset?: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseUnit: string;
  popular: string[];
  units: Unit[];
  marketNotes?: string[];
};

export type Calculator = {
  id: string;
  name: string;
  href: string;
  category: string;
  description: string;
  fields: string[];
};

export type ConversionResult = {
  category: string;
  from: Unit;
  to: Unit;
  input: number;
  value: number;
  formula: string;
};

export type ParseSuggestion = {
  confidence: number;
  intent: 'convert' | 'calculate' | 'currency' | 'unknown';
  message: string;
  href?: string;
  result?: ConversionResult;
};
