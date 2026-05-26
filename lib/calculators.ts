export function concreteVolume(lengthM: number, widthM: number, depthM: number) {
  const cubicMeters = lengthM * widthM * depthM;
  return {
    cubicMeters,
    cementBags50kg: cubicMeters * 6.5,
    sandCubicMeters: cubicMeters * 0.44,
    stoneCubicMeters: cubicMeters * 0.88
  };
}

export function cropPopulation(rowSpacingM: number, plantSpacingM: number, hectares = 1) {
  return hectares * (10000 / (rowSpacingM * plantSpacingM));
}

export function fertilizerTotal(rateKgHa: number, hectares: number, bagKg = 50) {
  const kg = rateKgHa * hectares;
  return { kg, bags: kg / bagKg };
}

export function tankVolumeLiters(diameterM: number, heightM: number) {
  return Math.PI * Math.pow(diameterM / 2, 2) * heightM * 1000;
}

export function amperage(watts: number, volts: number, powerFactor = 1) {
  return watts / (volts * powerFactor);
}
