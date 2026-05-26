import type { Calculator, Category } from '@/lib/types';

export const categories: Category[] = [
  {
    id: 'length',
    name: 'Length',
    icon: 'Ruler',
    description: 'Metric, imperial, trade and field distance conversions.',
    baseUnit: 'meter',
    popular: ['meter', 'centimeter', 'inch', 'foot', 'yard', 'kilometer', 'mile'],
    units: [
      { id: 'meter', label: 'Meter', symbol: 'm', aliases: ['meter', 'metre', 'meters', 'metres', 'm'], toBase: 1 },
      { id: 'centimeter', label: 'Centimeter', symbol: 'cm', aliases: ['cm', 'centimeter', 'centimetre', 'centimeters'], toBase: 0.01 },
      { id: 'millimeter', label: 'Millimeter', symbol: 'mm', aliases: ['mm', 'millimeter', 'millimetre', 'millimeters'], toBase: 0.001 },
      { id: 'inch', label: 'Inch', symbol: 'in', aliases: ['inch', 'inches', 'in', '"'], toBase: 0.0254 },
      { id: 'foot', label: 'Foot', symbol: 'ft', aliases: ['foot', 'feet', 'ft', "'"], toBase: 0.3048 },
      { id: 'yard', label: 'Yard', symbol: 'yd', aliases: ['yard', 'yards', 'yd'], toBase: 0.9144 },
      { id: 'kilometer', label: 'Kilometer', symbol: 'km', aliases: ['km', 'kilometer', 'kilometre'], toBase: 1000 },
      { id: 'mile', label: 'Mile', symbol: 'mi', aliases: ['mile', 'miles', 'mi'], toBase: 1609.344 }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    icon: 'Grid3X3',
    description: 'Land, roofing, flooring, farm and mining area conversions.',
    baseUnit: 'square-meter',
    popular: ['square-meter', 'hectare', 'acre', 'square-foot'],
    units: [
      { id: 'square-meter', label: 'Square meter', symbol: 'm2', aliases: ['m2', 'sqm', 'square meter', 'square metre'], toBase: 1 },
      { id: 'hectare', label: 'Hectare', symbol: 'ha', aliases: ['ha', 'hectare', 'hectares'], toBase: 10000 },
      { id: 'acre', label: 'Acre', symbol: 'ac', aliases: ['acre', 'acres', 'ac'], toBase: 4046.8564224 },
      { id: 'square-foot', label: 'Square foot', symbol: 'ft2', aliases: ['sq ft', 'ft2', 'square foot', 'square feet'], toBase: 0.09290304 }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: 'Box',
    description: 'Water, concrete, fuel, grain, aggregate and cooking volumes.',
    baseUnit: 'liter',
    popular: ['liter', 'milliliter', 'cubic-meter', 'gallon-us', 'truckload-gravel'],
    units: [
      { id: 'liter', label: 'Liter', symbol: 'L', aliases: ['l', 'liter', 'litre', 'liters', 'litres'], toBase: 1 },
      { id: 'milliliter', label: 'Milliliter', symbol: 'ml', aliases: ['ml', 'milliliter', 'millilitre'], toBase: 0.001 },
      { id: 'cubic-meter', label: 'Cubic meter', symbol: 'm3', aliases: ['m3', 'cubic meter', 'cubic metre', 'cube'], toBase: 1000 },
      { id: 'gallon-us', label: 'US gallon', symbol: 'gal', aliases: ['gallon', 'gallons', 'gal', 'us gallon'], toBase: 3.785411784 },
      { id: 'truckload-gravel', label: 'Truckload gravel', symbol: 'truck', aliases: ['truckload', 'truck load', 'tipper load'], toBase: 6000 }
    ]
  },
  {
    id: 'weight',
    name: 'Weight',
    icon: 'Scale',
    description: 'Mass conversions for produce, cement, fertilizer, ore and cargo.',
    baseUnit: 'kilogram',
    popular: ['kilogram', 'gram', 'tonne', 'pound', 'cement-bag-50kg'],
    units: [
      { id: 'kilogram', label: 'Kilogram', symbol: 'kg', aliases: ['kg', 'kilogram', 'kilograms'], toBase: 1 },
      { id: 'gram', label: 'Gram', symbol: 'g', aliases: ['g', 'gram', 'grams'], toBase: 0.001 },
      { id: 'tonne', label: 'Tonne', symbol: 't', aliases: ['tonne', 'tonnes', 'metric ton', 't'], toBase: 1000 },
      { id: 'pound', label: 'Pound', symbol: 'lb', aliases: ['lb', 'lbs', 'pound', 'pounds'], toBase: 0.45359237 },
      { id: 'cement-bag-50kg', label: 'Cement bag 50 kg', symbol: 'bag', aliases: ['cement bag', 'bag cement', '50kg bag'], toBase: 50 }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: 'Thermometer',
    description: 'Celsius, Fahrenheit and Kelvin conversions.',
    baseUnit: 'celsius',
    popular: ['celsius', 'fahrenheit', 'kelvin'],
    units: [
      { id: 'celsius', label: 'Celsius', symbol: 'C', aliases: ['c', 'celsius', 'centigrade'], toBase: 1 },
      { id: 'fahrenheit', label: 'Fahrenheit', symbol: 'F', aliases: ['f', 'fahrenheit'], toBase: 5 / 9, offset: -32 },
      { id: 'kelvin', label: 'Kelvin', symbol: 'K', aliases: ['k', 'kelvin'], toBase: 1, offset: -273.15 }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: 'Gauge',
    description: 'Tyre, hydraulic, irrigation and engineering pressure units.',
    baseUnit: 'pascal',
    popular: ['bar', 'psi', 'kilopascal', 'pascal'],
    units: [
      { id: 'pascal', label: 'Pascal', symbol: 'Pa', aliases: ['pa', 'pascal'], toBase: 1 },
      { id: 'kilopascal', label: 'Kilopascal', symbol: 'kPa', aliases: ['kpa', 'kilopascal'], toBase: 1000 },
      { id: 'bar', label: 'Bar', symbol: 'bar', aliases: ['bar', 'bars'], toBase: 100000 },
      { id: 'psi', label: 'PSI', symbol: 'psi', aliases: ['psi', 'pounds per square inch'], toBase: 6894.7572932 }
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: 'Zap',
    description: 'Vehicle, pump, conveyor and wind speed conversions.',
    baseUnit: 'meter-per-second',
    popular: ['kilometer-per-hour', 'meter-per-second', 'mile-per-hour'],
    units: [
      { id: 'meter-per-second', label: 'Meter per second', symbol: 'm/s', aliases: ['m/s', 'meter per second'], toBase: 1 },
      { id: 'kilometer-per-hour', label: 'Kilometer per hour', symbol: 'km/h', aliases: ['kmh', 'kph', 'km/h'], toBase: 0.2777777778 },
      { id: 'mile-per-hour', label: 'Mile per hour', symbol: 'mph', aliases: ['mph', 'miles per hour'], toBase: 0.44704 }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: 'BatteryCharging',
    description: 'Electricity, fuel, food energy and solar system conversions.',
    baseUnit: 'joule',
    popular: ['joule', 'kilowatt-hour', 'calorie'],
    units: [
      { id: 'joule', label: 'Joule', symbol: 'J', aliases: ['j', 'joule', 'joules'], toBase: 1 },
      { id: 'kilowatt-hour', label: 'Kilowatt hour', symbol: 'kWh', aliases: ['kwh', 'kilowatt hour'], toBase: 3600000 },
      { id: 'calorie', label: 'Calorie', symbol: 'cal', aliases: ['calorie', 'calories', 'cal'], toBase: 4.184 }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    icon: 'PlugZap',
    description: 'Motors, generators, pumps, solar and appliance power units.',
    baseUnit: 'watt',
    popular: ['watt', 'kilowatt', 'horsepower'],
    units: [
      { id: 'watt', label: 'Watt', symbol: 'W', aliases: ['w', 'watt', 'watts'], toBase: 1 },
      { id: 'kilowatt', label: 'Kilowatt', symbol: 'kW', aliases: ['kw', 'kilowatt'], toBase: 1000 },
      { id: 'horsepower', label: 'Horsepower', symbol: 'hp', aliases: ['hp', 'horsepower'], toBase: 745.699872 }
    ]
  },
  {
    id: 'data',
    name: 'Data storage',
    icon: 'HardDrive',
    description: 'Phone, internet, storage and cloud data units.',
    baseUnit: 'byte',
    popular: ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'],
    units: [
      { id: 'byte', label: 'Byte', symbol: 'B', aliases: ['byte', 'bytes', 'b'], toBase: 1 },
      { id: 'kilobyte', label: 'Kilobyte', symbol: 'KB', aliases: ['kb', 'kilobyte'], toBase: 1000 },
      { id: 'megabyte', label: 'Megabyte', symbol: 'MB', aliases: ['mb', 'megabyte'], toBase: 1000000 },
      { id: 'gigabyte', label: 'Gigabyte', symbol: 'GB', aliases: ['gb', 'gigabyte'], toBase: 1000000000 },
      { id: 'terabyte', label: 'Terabyte', symbol: 'TB', aliases: ['tb', 'terabyte'], toBase: 1000000000000 }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'Cable',
    description: 'Voltage, current, resistance and practical site calculations.',
    baseUnit: 'ampere',
    popular: ['ampere', 'milliampere'],
    units: [
      { id: 'ampere', label: 'Ampere', symbol: 'A', aliases: ['a', 'amp', 'amps', 'ampere'], toBase: 1 },
      { id: 'milliampere', label: 'Milliampere', symbol: 'mA', aliases: ['ma', 'milliamp', 'milliampere'], toBase: 0.001 }
    ]
  },
  {
    id: 'fuel-consumption',
    name: 'Fuel consumption',
    icon: 'Fuel',
    description: 'Vehicle and farm fuel rates including liters per hectare and acre.',
    baseUnit: 'liter-per-hectare',
    popular: ['liter-per-hectare', 'liter-per-acre'],
    units: [
      { id: 'liter-per-hectare', label: 'Liter per hectare', symbol: 'L/ha', aliases: ['l/ha', 'liters per hectare', 'litres per hectare'], toBase: 1 },
      { id: 'liter-per-acre', label: 'Liter per acre', symbol: 'L/ac', aliases: ['l/ac', 'liters per acre', 'litres per acre'], toBase: 2.4710538147 }
    ]
  }
];

export const calculators: Calculator[] = [
  { id: 'concrete', name: 'Concrete volume', href: '/construction/concrete-calculator', category: 'Construction', description: 'Estimate slab, footing or column concrete in cubic meters and 50 kg cement bags.', fields: ['length', 'width', 'depth'] },
  { id: 'brick', name: 'Brick quantity', href: '/construction/brick-quantity-calculator', category: 'Construction', description: 'Plan bricks, blocks and mortar allowance for walls.', fields: ['wall area', 'brick size', 'waste'] },
  { id: 'crop-spacing', name: 'Crop spacing', href: '/farming/crop-spacing-calculator', category: 'Farming', description: 'Calculate plant population per hectare from row and plant spacing.', fields: ['row spacing', 'plant spacing'] },
  { id: 'fertilizer', name: 'Fertilizer application', href: '/farming/fertilizer-application-calculator', category: 'Farming', description: 'Convert kg/ha recommendations into bag counts and field totals.', fields: ['rate', 'area', 'bag size'] },
  { id: 'water-tank', name: 'Water tank volume', href: '/tools/water-tank-volume-calculator', category: 'Water', description: 'Calculate round, rectangular and JoJo-style tank capacity.', fields: ['diameter', 'height'] },
  { id: 'diesel', name: 'Diesel usage', href: '/tools/diesel-usage-calculator', category: 'Field operations', description: 'Estimate liters, cost and per-hectare fuel use.', fields: ['hours', 'rate', 'cost'] },
  { id: 'amperage', name: 'Electrical amperage', href: '/tools/electrical-amperage-calculator', category: 'Electrical', description: 'Calculate amps from watts and volts for AC/DC planning.', fields: ['watts', 'volts'] },
  { id: 'solar', name: 'Solar sizing', href: '/tools/solar-sizing-calculator', category: 'Electrical', description: 'Estimate panel, battery and inverter sizing for homes and farms.', fields: ['daily kWh', 'sun hours'] },
  { id: 'roofing', name: 'Roofing material', href: '/construction/roofing-material-calculator', category: 'Construction', description: 'Estimate roof area, sheets and overlap allowance.', fields: ['length', 'width', 'pitch'] },
  { id: 'paint', name: 'Paint quantity', href: '/construction/paint-quantity-calculator', category: 'Construction', description: 'Estimate liters of paint by coverage and number of coats.', fields: ['area', 'coats', 'coverage'] }
];

export const currencyUnits = [
  { code: 'ZAR', name: 'South African rand' },
  { code: 'NAD', name: 'Namibian dollar' },
  { code: 'BWP', name: 'Botswana pula' },
  { code: 'ZMW', name: 'Zambian kwacha' },
  { code: 'KES', name: 'Kenyan shilling' },
  { code: 'NGN', name: 'Nigerian naira' },
  { code: 'GHS', name: 'Ghanaian cedi' },
  { code: 'USD', name: 'US dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British pound' }
];
