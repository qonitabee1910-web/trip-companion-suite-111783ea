import hiaceImg from "@/assets/shuttle/base-hiace.png";

export interface SeatPosition {
  num: number;
  x: number; // % left
  y: number; // % top
}

export interface SeatLayoutConfig {
  image: string;
  aspect: string; // tailwind-friendly e.g. "1/2.2"
  driverSeat: { x: number; y: number };
  seats: SeatPosition[];
}

// HiAce 14 seats: 1 driver (non-clickable) + front passenger 1, then rows of 2-2 with center aisle, last row of 4
export const HIACE_LAYOUT: SeatLayoutConfig = {
  image: hiaceImg,
  aspect: "1/2.2",
  driverSeat: { x: 68, y: 14 },
  seats: [
    // Front passenger
    { num: 1, x: 28, y: 14 },
    // Row 2 (2-2)
    { num: 2, x: 24, y: 30 },
    { num: 3, x: 44, y: 30 },
    { num: 4, x: 60, y: 30 },
    { num: 5, x: 76, y: 30 },
    // Row 3 (2-2)
    { num: 6, x: 24, y: 46 },
    { num: 7, x: 44, y: 46 },
    { num: 8, x: 60, y: 46 },
    { num: 9, x: 76, y: 46 },
    // Row 4 - back row of 4
    { num: 10, x: 20, y: 70 },
    { num: 11, x: 40, y: 70 },
    { num: 12, x: 60, y: 70 },
    { num: 13, x: 80, y: 70 },
    // Row 4 spare (some HiAce has 14)
    { num: 14, x: 50, y: 84 },
  ],
};

export const ELF_LAYOUT: SeatLayoutConfig = {
  image: hiaceImg,
  aspect: "1/2.2",
  driverSeat: { x: 68, y: 14 },
  seats: [
    { num: 1, x: 28, y: 14 },
    { num: 2, x: 28, y: 30 },
    { num: 3, x: 50, y: 30 },
    { num: 4, x: 72, y: 30 },
    { num: 5, x: 28, y: 46 },
    { num: 6, x: 50, y: 46 },
    { num: 7, x: 72, y: 46 },
    { num: 8, x: 28, y: 62 },
    { num: 9, x: 72, y: 62 },
    { num: 10, x: 35, y: 80 },
    { num: 11, x: 65, y: 80 },
  ],
};

export const PREMIO_LAYOUT: SeatLayoutConfig = {
  image: hiaceImg,
  aspect: "1/2.2",
  driverSeat: { x: 68, y: 16 },
  seats: [
    { num: 1, x: 28, y: 16 },
    { num: 2, x: 25, y: 36 },
    { num: 3, x: 50, y: 36 },
    { num: 4, x: 75, y: 36 },
    { num: 5, x: 25, y: 56 },
    { num: 6, x: 50, y: 56 },
    { num: 7, x: 75, y: 56 },
    { num: 8, x: 35, y: 78 },
    { num: 9, x: 65, y: 78 },
  ],
};

export type VehicleKey = "HIACE" | "ELF" | "PREMIO";

export const LAYOUT_STORAGE_KEY = (vehicle: VehicleKey) => `shuttle-seat-layout:${vehicle}`;

export function vehicleKeyFromName(vehicle: string): VehicleKey {
  const v = vehicle.toLowerCase();
  // vehicle type ids from services.ts
  if (v === "suv" || v.includes("premio")) return "PREMIO";
  if (v === "minicar" || v.includes("elf") || v.includes("mini")) return "ELF";
  return "HIACE";
}

function getPresetByKey(key: VehicleKey): SeatLayoutConfig {
  if (key === "ELF") return ELF_LAYOUT;
  if (key === "PREMIO") return PREMIO_LAYOUT;
  return HIACE_LAYOUT;
}

export function saveLayoutToStorage(key: VehicleKey, config: SeatLayoutConfig, includeImage: boolean): boolean {
  try {
    const payload: Partial<SeatLayoutConfig> = {
      aspect: config.aspect,
      driverSeat: config.driverSeat,
      seats: config.seats,
    };
    if (includeImage) payload.image = config.image;
    localStorage.setItem(LAYOUT_STORAGE_KEY(key), JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadLayoutFromStorage(key: VehicleKey): SeatLayoutConfig | null {
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEY(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SeatLayoutConfig>;
    const preset = getPresetByKey(key);
    return {
      image: parsed.image || preset.image,
      aspect: parsed.aspect || preset.aspect,
      driverSeat: parsed.driverSeat || preset.driverSeat,
      seats: parsed.seats || preset.seats,
    };
  } catch {
    return null;
  }
}

export function clearLayoutFromStorage(key: VehicleKey) {
  try {
    localStorage.removeItem(LAYOUT_STORAGE_KEY(key));
  } catch {
    // ignore
  }
}

export function hasStoredLayout(key: VehicleKey): boolean {
  try {
    return !!localStorage.getItem(LAYOUT_STORAGE_KEY(key));
  } catch {
    return false;
  }
}

export function getSeatLayout(vehicle: string, totalSeats: number): SeatLayoutConfig {
  const key = vehicleKeyFromName(vehicle);
  const stored = loadLayoutFromStorage(key);
  const base: SeatLayoutConfig = stored || getPresetByKey(key);

  // Trim or extend seats to match totalSeats
  if (base.seats.length === totalSeats) return base;
  if (base.seats.length > totalSeats) {
    return { ...base, seats: base.seats.slice(0, totalSeats) };
  }
  // Extend with extra rows at bottom if needed
  const extra: SeatPosition[] = [];
  for (let i = base.seats.length; i < totalSeats; i++) {
    extra.push({ num: i + 1, x: 30 + ((i % 3) * 20), y: 90 });
  }
  return { ...base, seats: [...base.seats, ...extra] };
}
