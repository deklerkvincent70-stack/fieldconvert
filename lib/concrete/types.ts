export type Shape = 'rectangle' | 'circle' | 'column' | 'beam' | 'stair' | 'custom';

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type BagSize = 25 | 42.5 | 50;

export type WastageOption = 0 | 5 | 10;

export type CementType = 'Type I' | 'Type II' | 'Type III' | 'Type IV' | 'Type V';

export type Purpose =
  | 'Site leveling'
  | 'Blinding concrete'
  | 'Sub-base'
  | 'Footpath'
  | 'Shed base'
  | 'Domestic slab'
  | 'Driveway'
  | 'Foundation'
  | 'Reinforced slab'
  | 'Beam'
  | 'Column'
  | 'Heavy-duty industrial';

export interface MixDesign {
  strengthMpa: number;
  strengthPsi: number;
  label: string;
  ratio: [number, number, number] | null;
  waterCementRatio: number;
  typicalUse: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  defaultUnit: LengthUnit;
  unitSystem: 'metric' | 'imperial';
  bagSize: BagSize;
  wastagePercent: number;
  dryVolumeFactor: number;
  waterCementRatio: number;
  cementDensityKgM3: number;
  sandDensityKgM3: number;
  aggregateDensityKgM3: number;
  mixerCapacityLiters: number;
  wheelbarrowCapacityLiters: number;
  currencySymbol: string;
}

export interface Costs {
  cementPerBag: number;
  cementPerKg: number;
  sandPerM3: number;
  aggregatePerM3: number;
  water: number;
  labor: number;
  transport: number;
}

export interface Dimensions {
  length: number;
  width: number;
  depth: number;
  diameter: number;
  height: number;
  steps: number;
  rise: number;
  run: number;
  customVolume: number;
}

export interface CalculationInput {
  projectName: string;
  notes: string;
  shape: Shape;
  unit: LengthUnit;
  purpose: Purpose;
  cementType: CementType;
  strengthMpa: number;
  ratio: [number, number, number] | null;
  dimensions: Dimensions;
  settings: Settings;
  costs: Costs;
}

export interface MaterialOutput {
  cementKg: number;
  cementBags: number;
  sandM3: number;
  sandKg: number;
  aggregateM3: number;
  aggregateKg: number;
  waterLiters: number;
}

export interface CostOutput {
  materialSubtotal: number;
  laborSubtotal: number;
  total: number;
  costPerM3: number;
}

export interface CalculationResult {
  wetVolumeM3: number;
  dryVolumeM3: number;
  volumeLiters: number;
  volumeFt3: number;
  materials: MaterialOutput;
  costs: CostOutput;
  mixerBatches: number;
  wheelbarrows: number;
  warnings: string[];
}

export interface SavedCalculation {
  id: string;
  createdAt: string;
  input: CalculationInput;
  result: CalculationResult;
}
