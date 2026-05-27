import { cementDescriptions } from './data';
import { formatRatio } from './engine';
import type { CalculationInput, CalculationResult } from './types';
import { round } from './units';

export function buildReportHtml(input: CalculationInput, result: CalculationResult) {
  const currency = input.settings.currencySymbol;
  const date = new Date().toLocaleDateString();
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(input.projectName || 'ConcreteMix Pro Report')}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 32px; line-height: 1.45; }
    h1 { margin: 0 0 4px; font-size: 28px; }
    h2 { margin-top: 24px; border-bottom: 1px solid #d1d5db; padding-bottom: 6px; font-size: 17px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    td, th { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
    .muted { color: #4b5563; }
    .total { font-size: 20px; font-weight: 700; }
  </style>
</head>
<body>
  <h1>${escapeHtml(input.projectName || 'ConcreteMix Pro')}</h1>
  <div class="muted">${date} · ${escapeHtml(input.purpose)} · ${escapeHtml(input.shape)}</div>
  <h2>Dimensions</h2>
  <table>
    <tr><td>Unit</td><td>${input.unit}</td></tr>
    <tr><td>Length</td><td>${input.dimensions.length}</td></tr>
    <tr><td>Width</td><td>${input.dimensions.width}</td></tr>
    <tr><td>Depth / Thickness</td><td>${input.dimensions.depth}</td></tr>
    <tr><td>Wet Volume</td><td>${round(result.wetVolumeM3, 3)} m³ / ${round(result.volumeLiters, 0)} L / ${round(result.volumeFt3, 2)} ft³</td></tr>
    <tr><td>Dry Volume</td><td>${round(result.dryVolumeM3, 3)} m³</td></tr>
  </table>
  <h2>Mix</h2>
  <table>
    <tr><td>Strength</td><td>${input.strengthMpa} MPa</td></tr>
    <tr><td>Ratio</td><td>${formatRatio(input.ratio)}</td></tr>
    <tr><td>Cement Type</td><td>${input.cementType} - ${cementDescriptions[input.cementType]}</td></tr>
    <tr><td>Water-cement ratio</td><td>${input.settings.waterCementRatio}</td></tr>
    <tr><td>Wastage</td><td>${input.settings.wastagePercent}%</td></tr>
  </table>
  <h2>Materials</h2>
  <table>
    <tr><td>Cement</td><td>${round(result.materials.cementKg, 1)} kg / ${round(result.materials.cementBags, 1)} bags</td></tr>
    <tr><td>Sand</td><td>${round(result.materials.sandM3, 3)} m³ / ${round(result.materials.sandKg, 0)} kg</td></tr>
    <tr><td>Aggregate</td><td>${round(result.materials.aggregateM3, 3)} m³ / ${round(result.materials.aggregateKg, 0)} kg</td></tr>
    <tr><td>Water</td><td>${round(result.materials.waterLiters, 0)} L</td></tr>
  </table>
  <h2>Costs</h2>
  <table>
    <tr><td>Materials</td><td>${currency}${round(result.costs.materialSubtotal, 2)}</td></tr>
    <tr><td>Labor and transport</td><td>${currency}${round(result.costs.laborSubtotal, 2)}</td></tr>
    <tr><td>Total</td><td class="total">${currency}${round(result.costs.total, 2)}</td></tr>
    <tr><td>Cost per m³</td><td>${currency}${round(result.costs.costPerM3, 2)}</td></tr>
  </table>
  <h2>Site Estimates</h2>
  <table>
    <tr><td>Mixer batches</td><td>${Math.ceil(result.mixerBatches)}</td></tr>
    <tr><td>Wheelbarrows</td><td>${Math.ceil(result.wheelbarrows)}</td></tr>
  </table>
  <h2>Notes</h2>
  <p>${escapeHtml(input.notes || 'No notes.')}</p>
</body>
</html>`;
}

export function printReport(input: CalculationInput, result: CalculationResult) {
  const report = window.open('', '_blank', 'width=900,height=1100');
  if (!report) return;
  report.document.write(buildReportHtml(input, result));
  report.document.close();
  report.focus();
  report.print();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}
