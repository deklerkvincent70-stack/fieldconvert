'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, Calculator, Download, Moon, Printer, Save, Settings as SettingsIcon, Share2, Sun } from 'lucide-react';
import { cementDescriptions, defaultSettings, purposes, strengthDatabase } from '@/lib/concrete/data';
import { calculateConcrete, formatRatio, getMixByStrength, recommendedForPurpose } from '@/lib/concrete/engine';
import { printReport } from '@/lib/concrete/pdf';
import { defaultCosts, loadCosts, loadHistory, loadSettings, saveCalculation, saveCosts, saveSettings } from '@/lib/concrete/storage';
import type { BagSize, CalculationInput, CementType, Costs, Dimensions, LengthUnit, Purpose, SavedCalculation, Settings, Shape } from '@/lib/concrete/types';
import { kgToPounds, round } from '@/lib/concrete/units';

const shapes: { id: Shape; label: string }[] = [
  { id: 'rectangle', label: 'Slab' },
  { id: 'circle', label: 'Circle' },
  { id: 'column', label: 'Column' },
  { id: 'beam', label: 'Beam' },
  { id: 'stair', label: 'Stair' },
  { id: 'custom', label: 'Custom' }
];

const units: LengthUnit[] = ['mm', 'cm', 'm', 'in', 'ft'];
const cementTypes: CementType[] = ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V'];
const emptyDimensions: Dimensions = { length: 0, width: 0, depth: 0, diameter: 0, height: 0, steps: 0, rise: 0, run: 0, customVolume: 0 };

export function ConcreteMixPro() {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [costs, setCosts] = useState<Costs>(defaultCosts);
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [shape, setShape] = useState<Shape>('rectangle');
  const [unit, setUnit] = useState<LengthUnit>('m');
  const [purpose, setPurpose] = useState<Purpose>('Domestic slab');
  const [projectName, setProjectName] = useState('Site pour');
  const [notes, setNotes] = useState('');
  const [dimensions, setDimensions] = useState<Dimensions>(emptyDimensions);
  const [strengthMpa, setStrengthMpa] = useState(20);
  const [cementType, setCementType] = useState<CementType>('Type I');
  const [manualMix, setManualMix] = useState(false);
  const [manualRatio, setManualRatio] = useState<[number, number, number]>([1, 1.5, 3]);
  const [openSettings, setOpenSettings] = useState(false);
  const [openCosts, setOpenCosts] = useState(false);

  useEffect(() => {
    const storedSettings = loadSettings();
    setSettings(storedSettings);
    setUnit(storedSettings.defaultUnit);
    setCosts(loadCosts());
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    saveSettings(settings);
  }, [hydrated, settings]);

  useEffect(() => {
    if (hydrated) saveCosts(costs);
  }, [costs, hydrated]);

  useEffect(() => {
    if (manualMix) return;
    const recommendation = recommendedForPurpose(purpose);
    setStrengthMpa(recommendation.strengthMpa);
    setCementType(recommendation.cementType);
    if (recommendation.mix.ratio) setManualRatio(recommendation.mix.ratio);
  }, [purpose, manualMix]);

  const selectedMix = getMixByStrength(strengthMpa);
  const ratio = manualMix ? manualRatio : selectedMix.ratio;
  const input: CalculationInput = useMemo(
    () => ({ projectName, notes, shape, unit, purpose, cementType, strengthMpa, ratio, dimensions, settings, costs }),
    [projectName, notes, shape, unit, purpose, cementType, strengthMpa, ratio, dimensions, settings, costs]
  );
  const result = useMemo(() => calculateConcrete(input), [input]);
  const currency = settings.currencySymbol || '$';

  function saveCurrent() {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const saved = saveCalculation({ id, createdAt: new Date().toISOString(), input, result });
    setHistory(saved);
  }

  async function shareResult() {
    const text = `${projectName}: ${round(result.wetVolumeM3, 3)} m3, ${round(result.materials.cementBags, 1)} bags, ${currency}${round(result.costs.total, 2)} total.`;
    if (navigator.share) await navigator.share({ title: 'ConcreteMix Pro estimate', text });
    else await navigator.clipboard?.writeText(text);
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#101418] dark:bg-[#121412] dark:text-[#f7f5ed]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 pb-24 pt-3 sm:px-5 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="sticky top-0 z-10 -mx-3 border-b border-black/10 bg-[#f4f2ea]/95 px-3 py-3 backdrop-blur dark:border-white/10 dark:bg-[#121412]/95 sm:-mx-5 sm:px-5 lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#b8562f]">Offline contractor calculator</p>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">ConcreteMix Pro</h1>
            </div>
            <button
              className="grid h-12 w-12 place-items-center rounded border border-black/15 bg-white text-[#101418] shadow-sm dark:border-white/15 dark:bg-[#1d211e] dark:text-white"
              onClick={() => setSettings((next) => ({ ...next, theme: next.theme === 'dark' ? 'light' : 'dark' }))}
              aria-label="Toggle theme"
            >
              {settings.theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Project" value={projectName} onChange={setProjectName} />
              <Select label="Unit" value={unit} onChange={(value) => setUnit(value as LengthUnit)} options={units} />
            </div>
            <Segmented label="Shape" value={shape} onChange={(value) => setShape(value as Shape)} options={shapes} />
            <DimensionFields shape={shape} unit={unit} dimensions={dimensions} setDimensions={setDimensions} />
          </Panel>

          <Panel>
            <Select label="Purpose of Concrete" value={purpose} onChange={(value) => setPurpose(value as Purpose)} options={purposes} />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Select
                label="Strength"
                value={String(strengthMpa)}
                onChange={(value) => {
                  const nextStrength = Number(value);
                  setStrengthMpa(nextStrength);
                  const nextMix = getMixByStrength(nextStrength);
                  if (nextMix.ratio) setManualRatio(nextMix.ratio);
                  setManualMix(true);
                }}
                options={strengthDatabase.map((mix) => String(mix.strengthMpa))}
                suffix="MPa"
              />
              <Select label="Cement" value={cementType} onChange={(value) => setCementType(value as CementType)} options={cementTypes} />
            </div>
            <div className="mt-3 rounded border border-black/10 bg-[#eef1e8] p-3 text-sm dark:border-white/10 dark:bg-[#20251f]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{selectedMix.label} / {selectedMix.strengthPsi} PSI</p>
                  <p className="text-black/70 dark:text-white/70">{selectedMix.typicalUse}</p>
              <p className="mt-1 text-black/70 dark:text-white/70">{cementDescriptions[cementType]}</p>
              {!selectedMix.ratio && <p className="mt-1 font-bold text-[#b8562f]">Quantities use a provisional 1 : 1 : 2 estimate until you enter a verified design mix.</p>}
                </div>
                <button className="min-h-11 rounded bg-[#1f7a5a] px-3 font-bold text-white" onClick={() => setManualMix((value) => !value)}>
                  {manualMix ? 'Manual' : 'Auto'}
                </button>
              </div>
              {manualMix && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {manualRatio.map((part, index) => (
                    <NumberField key={index} label={['Cement', 'Sand', 'Stone'][index]} value={part} onChange={(value) => setManualRatio((next) => next.map((item, i) => (i === index ? value : item)) as [number, number, number])} />
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black">Materials</h2>
              <p className="rounded bg-[#b8562f] px-3 py-1 text-sm font-black text-white">{formatRatio(ratio)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Cement" value={round(result.materials.cementKg, 1)} unit="kg" sub={`${round(result.materials.cementBags, 1)} bags`} />
              <Metric label="Sand" value={round(result.materials.sandM3, 3)} unit="m³" sub={`${round(result.materials.sandKg, 0)} kg`} />
              <Metric label="Aggregate" value={round(result.materials.aggregateM3, 3)} unit="m³" sub={`${round(result.materials.aggregateKg, 0)} kg`} />
              <Metric label="Water" value={round(result.materials.waterLiters, 0)} unit="L" sub={`w/c ${settings.waterCementRatio}`} />
            </div>
            {settings.unitSystem === 'imperial' && (
              <p className="mt-3 text-sm font-semibold text-black/65 dark:text-white/70">
                Imperial weights: cement {round(kgToPounds(result.materials.cementKg), 0)} lb, sand {round(kgToPounds(result.materials.sandKg), 0)} lb, aggregate {round(kgToPounds(result.materials.aggregateKg), 0)} lb.
              </p>
            )}
          </Panel>

          <Panel>
            <button className="flex min-h-12 w-full items-center justify-between text-left" onClick={() => setOpenCosts((value) => !value)}>
              <span className="text-lg font-black">Costs</span>
              <span className="text-2xl font-black">{currency}{round(result.costs.total, 2)}</span>
            </button>
            {openCosts && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <NumberField label="Cement / bag" value={costs.cementPerBag} onChange={(value) => setCosts({ ...costs, cementPerBag: value })} prefix={currency} />
                <NumberField label="Cement / kg" value={costs.cementPerKg} onChange={(value) => setCosts({ ...costs, cementPerKg: value })} prefix={currency} />
                <NumberField label="Sand / m³" value={costs.sandPerM3} onChange={(value) => setCosts({ ...costs, sandPerM3: value })} prefix={currency} />
                <NumberField label="Stone / m³" value={costs.aggregatePerM3} onChange={(value) => setCosts({ ...costs, aggregatePerM3: value })} prefix={currency} />
                <NumberField label="Water" value={costs.water} onChange={(value) => setCosts({ ...costs, water: value })} prefix={currency} />
                <NumberField label="Labor" value={costs.labor} onChange={(value) => setCosts({ ...costs, labor: value })} prefix={currency} />
                <NumberField label="Transport" value={costs.transport} onChange={(value) => setCosts({ ...costs, transport: value })} prefix={currency} />
              </div>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm font-bold">
              <span className="rounded bg-black/5 p-2 dark:bg-white/10">Materials {currency}{round(result.costs.materialSubtotal, 2)}</span>
              <span className="rounded bg-black/5 p-2 dark:bg-white/10">Labor {currency}{round(result.costs.laborSubtotal, 2)}</span>
              <span className="rounded bg-black/5 p-2 dark:bg-white/10">Per m³ {currency}{round(result.costs.costPerM3, 2)}</span>
            </div>
          </Panel>

          <Panel>
            <button className="flex min-h-12 w-full items-center justify-between text-left" onClick={() => setOpenSettings((value) => !value)}>
              <span className="flex items-center gap-2 text-lg font-black"><SettingsIcon size={20} /> Settings</span>
              <span className="text-sm font-bold text-black/60 dark:text-white/60">{settings.bagSize} kg bags · {settings.wastagePercent}% waste</span>
            </button>
            {openSettings && <SettingsEditor settings={settings} setSettings={setSettings} setUnit={setUnit} />}
          </Panel>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
          <Panel emphasis>
            <div className="flex items-center gap-2">
              <Calculator size={22} />
              <h2 className="text-xl font-black">Result</h2>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Metric label="Wet" value={round(result.wetVolumeM3, 3)} unit="m³" sub={`${round(result.volumeLiters, 0)} L`} strong />
              <Metric label="Dry" value={round(result.dryVolumeM3, 3)} unit="m³" sub={`x ${settings.dryVolumeFactor}`} strong />
              <Metric label="Feet" value={round(result.volumeFt3, 2)} unit="ft³" sub="volume" strong />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Metric label="Bags" value={Math.ceil(result.materials.cementBags)} unit="" sub={`${settings.bagSize} kg`} />
              <Metric label="Mixer" value={Math.ceil(result.mixerBatches)} unit="" sub="loads" />
              <Metric label="Barrows" value={Math.ceil(result.wheelbarrows)} unit="" sub="loads" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Action icon={<Save size={18} />} label="Save" onClick={saveCurrent} />
              <Action icon={<Printer size={18} />} label="PDF" onClick={() => printReport(input, result)} />
              <Action icon={<Share2 size={18} />} label="Share" onClick={shareResult} />
              <Action icon={<Download size={18} />} label="Print" onClick={() => printReport(input, result)} />
            </div>
          </Panel>

          {result.warnings.length > 0 && (
            <Panel>
              <div className="flex items-center gap-2 text-[#b8562f]">
                <AlertTriangle size={20} />
                <h2 className="font-black">Warnings</h2>
              </div>
              <div className="mt-2 space-y-2 text-sm font-semibold">
                {result.warnings.map((warning) => (
                  <p key={warning} className="rounded border border-[#b8562f]/30 bg-[#fff4ea] p-2 dark:bg-[#311f18]">{warning}</p>
                ))}
              </div>
            </Panel>
          )}

          <Panel>
            <h2 className="font-black">Saved</h2>
            <div className="mt-2 space-y-2">
              {history.length === 0 ? <p className="text-sm text-black/65 dark:text-white/70">Saved calculations stay on this device for offline reuse.</p> : history.slice(0, 4).map((item) => (
                <button key={item.id} className="w-full rounded border border-black/10 bg-white p-3 text-left text-sm dark:border-white/10 dark:bg-[#1d211e]" onClick={() => {
                  setProjectName(item.input.projectName);
                  setNotes(item.input.notes);
                  setShape(item.input.shape);
                  setUnit(item.input.unit);
                  setPurpose(item.input.purpose);
                  setCementType(item.input.cementType);
                  setStrengthMpa(item.input.strengthMpa);
                  setDimensions(item.input.dimensions);
                }}>
                  <span className="block font-bold">{item.input.projectName || 'Concrete estimate'}</span>
                  <span>{round(item.result.wetVolumeM3, 3)} m³ · {new Date(item.createdAt).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          </Panel>
        </aside>
      </section>
    </main>
  );
}

function DimensionFields({ shape, unit, dimensions, setDimensions }: { shape: Shape; unit: LengthUnit; dimensions: Dimensions; setDimensions: (next: Dimensions) => void }) {
  const update = (key: keyof Dimensions, value: number) => setDimensions({ ...dimensions, [key]: value });
  if (shape === 'custom') return <NumberField label="Volume m³" value={dimensions.customVolume} onChange={(value) => update('customVolume', value)} />;
  if (shape === 'circle') return <div className="mt-3 grid grid-cols-2 gap-3"><NumberField label={`Diameter (${unit})`} value={dimensions.diameter} onChange={(value) => update('diameter', value)} /><NumberField label={`Depth (${unit})`} value={dimensions.depth} onChange={(value) => update('depth', value)} /></div>;
  if (shape === 'column') return <div className="mt-3 grid grid-cols-2 gap-3"><NumberField label={`Diameter (${unit})`} value={dimensions.diameter} onChange={(value) => update('diameter', value)} /><NumberField label={`Height (${unit})`} value={dimensions.height} onChange={(value) => update('height', value)} /></div>;
  if (shape === 'stair') return <div className="mt-3 grid grid-cols-2 gap-3"><NumberField label={`Width (${unit})`} value={dimensions.width} onChange={(value) => update('width', value)} /><NumberField label="Steps" value={dimensions.steps} onChange={(value) => update('steps', value)} /><NumberField label={`Rise (${unit})`} value={dimensions.rise} onChange={(value) => update('rise', value)} /><NumberField label={`Run (${unit})`} value={dimensions.run} onChange={(value) => update('run', value)} /></div>;
  return <div className="mt-3 grid grid-cols-3 gap-2"><NumberField label={`Length (${unit})`} value={dimensions.length} onChange={(value) => update('length', value)} /><NumberField label={`Width (${unit})`} value={dimensions.width} onChange={(value) => update('width', value)} /><NumberField label={`Depth (${unit})`} value={dimensions.depth} onChange={(value) => update('depth', value)} /></div>;
}

function SettingsEditor({ settings, setSettings, setUnit }: { settings: Settings; setSettings: (next: Settings) => void; setUnit: (unit: LengthUnit) => void }) {
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings({ ...settings, [key]: value });
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <Select label="Unit system" value={settings.unitSystem} onChange={(value) => update('unitSystem', value as Settings['unitSystem'])} options={['metric', 'imperial']} />
      <Select label="Default unit" value={settings.defaultUnit} onChange={(value) => { update('defaultUnit', value as LengthUnit); setUnit(value as LengthUnit); }} options={units} />
      <Select label="Bag size" value={String(settings.bagSize)} onChange={(value) => update('bagSize', Number(value) as BagSize)} options={['25', '42.5', '50']} suffix="kg" />
      <NumberField label="Wastage %" value={settings.wastagePercent} onChange={(value) => update('wastagePercent', value)} />
      <NumberField label="Dry factor" value={settings.dryVolumeFactor} onChange={(value) => update('dryVolumeFactor', value)} />
      <NumberField label="Water-cement" value={settings.waterCementRatio} onChange={(value) => update('waterCementRatio', value)} />
      <NumberField label="Cement kg/m³" value={settings.cementDensityKgM3} onChange={(value) => update('cementDensityKgM3', value)} />
      <NumberField label="Sand kg/m³" value={settings.sandDensityKgM3} onChange={(value) => update('sandDensityKgM3', value)} />
      <NumberField label="Stone kg/m³" value={settings.aggregateDensityKgM3} onChange={(value) => update('aggregateDensityKgM3', value)} />
      <NumberField label="Mixer L" value={settings.mixerCapacityLiters} onChange={(value) => update('mixerCapacityLiters', value)} />
      <NumberField label="Barrow L" value={settings.wheelbarrowCapacityLiters} onChange={(value) => update('wheelbarrowCapacityLiters', value)} />
      <Field label="Currency" value={settings.currencySymbol} onChange={(value) => update('currencySymbol', value)} />
    </div>
  );
}

function Panel({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return <section className={`rounded-lg border p-4 shadow-sm ${emphasis ? 'border-[#1f7a5a] bg-[#e5efe6] dark:bg-[#18261f]' : 'border-black/10 bg-white dark:border-white/10 dark:bg-[#191d1a]'}`}>{children}</section>;
}

function Segmented({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { id: string; label: string }[] }) {
  return <div className="mt-4"><p className="mb-2 text-sm font-bold text-black/70 dark:text-white/70">{label}</p><div className="grid grid-cols-3 gap-2">{options.map((option) => <button key={option.id} className={`min-h-12 rounded border px-2 text-sm font-black ${value === option.id ? 'border-[#1f7a5a] bg-[#1f7a5a] text-white' : 'border-black/10 bg-[#eef1e8] dark:border-white/10 dark:bg-[#222720]'}`} onClick={() => onChange(option.id)}>{option.label}</button>)}</div></div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-bold text-black/70 dark:text-white/70">{label}<input className="mt-1 h-12 w-full rounded border border-black/15 bg-white px-3 text-base font-bold text-[#101418] outline-none focus:border-[#1f7a5a] dark:border-white/15 dark:bg-[#121412] dark:text-white" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function NumberField({ label, value, onChange, prefix = '' }: { label: string; value: number; onChange: (value: number) => void; prefix?: string }) {
  return <label className="block text-sm font-bold text-black/70 dark:text-white/70">{label}<span className="mt-1 flex h-12 items-center rounded border border-black/15 bg-white px-2 focus-within:border-[#1f7a5a] dark:border-white/15 dark:bg-[#121412]">{prefix && <span className="pr-1 text-black/50 dark:text-white/60">{prefix}</span>}<input className="w-full bg-transparent text-base font-bold text-[#101418] outline-none dark:text-white" type="number" min="0" step="any" value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.target.value))} /></span></label>;
}

function Select({ label, value, onChange, options, suffix = '' }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; suffix?: string }) {
  return <label className="block text-sm font-bold text-black/70 dark:text-white/70">{label}<span className="mt-1 flex h-12 items-center rounded border border-black/15 bg-white px-2 dark:border-white/15 dark:bg-[#121412]"><select className="w-full bg-transparent text-base font-bold text-[#101418] outline-none dark:text-white" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{suffix && <span className="pl-1 text-black/50 dark:text-white/60">{suffix}</span>}</span></label>;
}

function Metric({ label, value, unit, sub, strong = false }: { label: string; value: number; unit: string; sub: string; strong?: boolean }) {
  return <div className="rounded border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#121412]"><p className="text-xs font-bold uppercase text-black/55 dark:text-white/55">{label}</p><p className={`${strong ? 'text-2xl' : 'text-xl'} font-black leading-tight`}>{value}<span className="ml-1 text-sm">{unit}</span></p><p className="text-xs font-bold text-black/55 dark:text-white/55">{sub}</p></div>;
}

function Action({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return <button className="flex min-h-12 items-center justify-center gap-2 rounded bg-[#101418] px-3 font-black text-white dark:bg-white dark:text-[#101418]" onClick={onClick}>{icon}{label}</button>;
}
