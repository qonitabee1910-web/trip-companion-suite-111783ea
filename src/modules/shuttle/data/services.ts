export type ServiceTier = "reguler" | "semi-executive" | "executive";
export type VehicleTypeId = "hiace" | "suv" | "minicar";

export interface ServiceConfig {
  tier: ServiceTier;
  label: string;
  description: string;
  priceMultiplier: number;
  features: string[];
}

export interface VehicleType {
  id: VehicleTypeId;
  label: string;
  vehicleName: string; // mapped name used by SeatMap (HiAce / Premio / Elf)
  totalSeats: number;
  basePrice: number;
  description: string;
}

export const SERVICES: ServiceConfig[] = [
  {
    tier: "reguler",
    label: "Reguler",
    description: "Pilihan ekonomis untuk perjalanan nyaman.",
    priceMultiplier: 1.0,
    features: ["AC dingin", "Air mineral", "Asuransi penumpang"],
  },
  {
    tier: "semi-executive",
    label: "Semi Executive",
    description: "Lebih lapang dengan fasilitas tambahan.",
    priceMultiplier: 1.4,
    features: ["AC dingin", "Reclining seat", "Snack ringan", "WiFi onboard", "USB charger"],
  },
  {
    tier: "executive",
    label: "Executive",
    description: "Pengalaman premium menuju bandara.",
    priceMultiplier: 1.8,
    features: ["Captain seat", "Snack box", "Selimut & bantal", "WiFi cepat", "USB charger", "Free luggage 25kg"],
  },
];

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "hiace",
    label: "HiAce",
    vehicleName: "HiAce Premium",
    totalSeats: 12,
    basePrice: 120000,
    description: "Kapasitas besar, cocok rombongan keluarga.",
  },
  {
    id: "suv",
    label: "SUV",
    vehicleName: "Premio",
    totalSeats: 6,
    basePrice: 180000,
    description: "Lebih privat, ruang kabin luas.",
  },
  {
    id: "minicar",
    label: "Mini Car",
    vehicleName: "Elf Mini",
    totalSeats: 4,
    basePrice: 95000,
    description: "Hemat untuk solo & pasangan.",
  },
];

export function getService(tier: string): ServiceConfig | undefined {
  return SERVICES.find((s) => s.tier === tier);
}

export function getVehicleType(id: string): VehicleType | undefined {
  return VEHICLE_TYPES.find((v) => v.id === id);
}

export function calcPrice(vehicle: VehicleType, service: ServiceConfig): number {
  // round to nearest 1000
  return Math.round((vehicle.basePrice * service.priceMultiplier) / 1000) * 1000;
}

// Mock available seats per (vehicle x service) combination
export function mockSeatsAvailable(vehicleId: VehicleTypeId, tier: ServiceTier, totalSeats: number): number {
  const seed = (vehicleId.length * 3 + tier.length * 5) % totalSeats;
  return Math.max(1, totalSeats - seed - 1);
}
