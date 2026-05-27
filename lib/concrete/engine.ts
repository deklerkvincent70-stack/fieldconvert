import { purposeRecommendations, strengthDatabase } from './data';
import type { CalculationInput, CalculationResult, MixDesign, Purpose } from './types';
import { cubicMetersToCubicFeet, lengthToMeters, round, safeNumber } from './units';

export function getMixByStrength(strengthMpa: number): MixDesign {
  return strengthDatabase.find((mix) => mix.strengthMpa === strengthMpa) ?? strengthDatabase[3];
}

export function formatRatio(ratio: [number, number, number] | null) {
  return ratio ? ratio.join(' : ') : 'Design mix';
}

export function recommendedForPurpose(purpose: Purpose) {
  const recommendation = purposeRecommendations[purpose];
  const mix = getMixByStrength(recommendation.strengthMpa);
  return { ...recommendation, mix };
}

export function calculateConcrete(input: CalculationInput): CalculationResult {
  const wetVolumeM3 = calculateWetVolume(input);
  const dryVolumeM3 = wetVolumeM3 * safeNumber(input.settings.dryVolumeFactor || 1.54);
  const wastageMultiplier = 1 + Math.max(0, input.settings.wastagePercent) / 100;
  const ratio = input.ratio ?? [1, 1, 2];
  const totalRatio = ratio ? ratio.reduce((sum, part) => sum + part, 0) : 1;
  const dryWithWastage = dryVolumeM3 * wastageMultiplier;
  const cementVolumeM3 = ratio ? (ratio[0] / totalRatio) * dryWithWastage : 0;
  const sandM3 = ratio ? (ratio[1] / totalRatio) * dryWithWastage : 0;
  const aggregateM3 = ratio ? (ratio[2] / totalRatio) * dryWithWastage : 0;
  const cementKg = cementVolumeM3 * input.settings.cementDensityKgM3;
  const waterCementRatio = input.settings.waterCementRatio;
  const waterLiters = cementKg * waterCementRatio;
  const cementBags = input.settings.bagSize > 0 ? cementKg / input.settings.bagSize : 0;
  const cementCost = input.costs.cementPerBag > 0 ? cementBags * input.costs.cementPerBag : cementKg * input.costs.cementPerKg;
  const materialSubtotal =
    cementCost +
    sandM3 * safeNumber(input.costs.sandPerM3) +
    aggregateM3 * safeNumber(input.costs.aggregatePerM3) +
    safeNumber(input.costs.water);
  const laborSubtotal = safeNumber(input.costs.labor) + safeNumber(input.costs.transport);
  const total = materialSubtotal + laborSubtotal;
  const mixerBatches = input.settings.mixerCapacityLiters > 0 ? (wetVolumeM3 * 1000 * wastageMultiplier) / input.settings.mixerCapacityLiters : 0;
  const wheelbarrows =
    input.settings.wheelbarrowCapacityLiters > 0 ? (wetVolumeM3 * 1000 * wastageMultiplier) / input.settings.wheelbarrowCapacityLiters : 0;

  return {
    wetVolumeM3,
    dryVolumeM3,
    volumeLiters: wetVolumeM3 * 1000,
    volumeFt3: cubicMetersToCubicFeet(wetVolumeM3),
    materials: {
      cementKg,
      cementBags,
      sandM3,
      sandKg: sandM3 * input.settings.sandDensityKgM3,
      aggregateM3,
      aggregateKg: aggregateM3 * input.settings.aggregateDensityKgM3,
      waterLiters
    },
    costs: {
      materialSubtotal,
      laborSubtotal,
      total,
      costPerM3: wetVolumeM3 > 0 ? total / wetVolumeM3 : 0
    },
    mixerBatches,
    wheelbarrows,
    warnings: buildWarnings(input, wetVolumeM3)
  };
}

function calculateWetVolume(input: CalculationInput) {
  const d = input.dimensions;
  const unit = input.unit;
  const length = lengthToMeters(d.length, unit);
  const width = lengthToMeters(d.width, unit);
  const depth = lengthToMeters(d.depth, unit);
  const diameter = lengthToMeters(d.diameter, unit);
  const height = lengthToMeters(d.height, unit);
  const rise = lengthToMeters(d.rise, unit);
  const run = lengthToMeters(d.run, unit);

  if (input.shape === 'circle') return Math.PI * (diameter / 2) ** 2 * depth;
  if (input.shape === 'column') return Math.PI * (diameter / 2) ** 2 * height;
  if (input.shape === 'beam') return length * width * depth;
  if (input.shape === 'stair') return 0.5 * rise * run * width * safeNumber(d.steps);
  if (input.shape === 'custom') return safeNumber(d.customVolume);
  return length * width * depth;
}

function buildWarnings(input: CalculationInput, wetVolumeM3: number) {
  const warnings: string[] = [];
  const recommended = purposeRecommendations[input.purpose];
  const depthM = lengthToMeters(input.dimensions.depth, input.unit);
  if (wetVolumeM3 <= 0) warnings.push('Enter valid positive dimensions to calculate concrete.');
  if (input.strengthMpa < recommended.strengthMpa) {
    warnings.push(`${input.strengthMpa} MPa concrete is not recommended for ${input.purpose.toLowerCase()}.`);
  }
  if (input.settings.waterCementRatio < 0.4 || input.settings.waterCementRatio > 0.6) {
    warnings.push('Water-cement ratio should stay between 0.40 and 0.60 for normal onsite mixes.');
  }
  if (depthM > 0 && (depthM < 0.04 || depthM > 0.6) && input.shape !== 'column' && input.shape !== 'custom') {
    warnings.push(`Thickness looks unusual at ${round(depthM * 1000, 0)} mm. Confirm before ordering.`);
  }
  if (!input.ratio) warnings.push('30 MPa+ uses a provisional 1 : 1 : 2 quantity estimate. Confirm the final design mix before ordering.');
  return warnings;
}
