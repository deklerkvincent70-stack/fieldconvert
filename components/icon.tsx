import {
  BatteryCharging,
  Box,
  Cable,
  Fuel,
  Gauge,
  Grid3X3,
  HardDrive,
  LucideIcon,
  PlugZap,
  Ruler,
  Scale,
  Thermometer,
  Zap
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  BatteryCharging,
  Box,
  Cable,
  Fuel,
  Gauge,
  Grid3X3,
  HardDrive,
  PlugZap,
  Ruler,
  Scale,
  Thermometer,
  Zap
};

export function CategoryIcon({ name }: { name: string }) {
  const Icon = icons[name] ?? Ruler;
  return <Icon size={22} aria-hidden />;
}
