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
const HIACE_LAYOUT: SeatLayoutConfig = {
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

const ELF_LAYOUT: SeatLayoutConfig = {
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

const PREMIO_LAYOUT: SeatLayoutConfig = {
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

export function getSeatLayout(vehicle: string, totalSeats: number): SeatLayoutConfig {
  const v = vehicle.toLowerCase();
  let base: SeatLayoutConfig;
  if (v.includes("elf")) base = ELF_LAYOUT;
  else if (v.includes("premio")) base = PREMIO_LAYOUT;
  else base = HIACE_LAYOUT;

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
