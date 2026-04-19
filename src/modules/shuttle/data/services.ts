import type { Rayon } from "./rayons";
import { LAYOUT_PRESETS } from "./seatLayouts";

export type ServiceTier = "reguler" | "semi-executive" | "executive";
export type VehicleTypeId = "hiace" | "suv" | "minicar";

export interface ServiceConfig {
  tier: ServiceTier;
  label: string;
  description: string;
  priceMultiplier: number;
  features: string[];
  active?: boolean; // default true
}

export interface VehicleType {
  id: VehicleTypeId;
  label: string;
  vehicleName: string;
  description: string;
  active?: boolean; // default true
}

export const SERVICES: ServiceConfig[] = [
  {
    tier: "reguler",
    label: "Reguler",
    description: "Pilihan ekonomis untuk perjalanan nyaman.",
    priceMultiplier: 1.0,
    features: ["AC dingin", "Air mineral", "Asuransi penumpang"],
    active: true,
  },
  {
    tier: "semi-executive",
    label: "Semi Executive",
    description: "Lebih lapang dengan fasilitas tambahan.",
    priceMultiplier: 1.4,
    features: ["AC dingin", "Reclining seat", "Snack ringan", "WiFi onboard", "USB charger"],
    active: true,
  },
  {
    tier: "executive",
    label: "Executive",
    description: "Pengalaman premium menuju bandara.",
    priceMultiplier: 1.8,
    features: ["Captain seat", "Snack box", "Selimut & bantal", "WiFi cepat", "USB charger", "Free luggage 25kg"],
    active: true,
  },
];

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "hiace",
    label: "HiAce",
    vehicleName: "HiAce Premium",
    description: "Kapasitas besar, cocok rombongan keluarga.",
    active: true,
  },
  {
    id: "suv",
    label: "SUV",
    vehicleName: "Premio",
    description: "Lebih privat, ruang kabin luas.",
    active: true,
  },
  {
    id: "minicar",
    label: "Mini Car",
    vehicleName: "Elf Mini",
    description: "Hemat untuk solo & pasangan.",
    active: true,
  },
];

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getService(tier: string): ServiceConfig | undefined {
  return readLS<ServiceConfig[]>("shuttle-admin:services", SERVICES).find((s) => s.tier === tier);
}

export function getVehicleType(id: string): VehicleType | undefined {
  return readLS<VehicleType[]>("shuttle-admin:vehicles", VEHICLE_TYPES).find((v) => v.id === id);
}

export function getTotalSeatsForVehicle(vehicleId: string): number {
  const vehicleUpper = vehicleId.toUpperCase();
  const layoutKey = `${vehicleUpper}_REGULER` as const;
  const layout = LAYOUT_PRESETS[layoutKey as keyof typeof LAYOUT_PRESETS];
  return layout?.seats.length ?? 0;
}

export function calcPrice(vehicle: VehicleType, service: ServiceConfig, rayon?: Rayon | null): number {
  // Price calculation now based on service tier and rayon surcharge only
  // Base vehicle pricing removed
  const surcharge = rayon?.surcharge ?? 0;
  return Math.round(surcharge / 1000) * 1000;
}

// Deprecated: kept for backward compat. Real availability comes from inventory.ts.
export function mockSeatsAvailable(vehicleId: VehicleTypeId, tier: ServiceTier, totalSeats: number): number {
  const seed = (vehicleId.length * 3 + tier.length * 5) % totalSeats;
  return Math.max(1, totalSeats - seed - 1);
}
