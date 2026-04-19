import { getBookings } from "./repository";

const KEY = "shuttle-admin:inventory";

export interface SlotKey {
  date: string; // yyyy-MM-dd
  time: string;
  rayonId: string;
  vehicleId: string;
  tier: string;
}

export function slotKeyString(s: SlotKey): string {
  return `${s.date}_${s.time}_${s.rayonId.toUpperCase()}_${s.vehicleId}_${s.tier}`;
}

type InventoryStore = Record<string, number[]>; // slot -> manually blocked seat numbers

function read(): InventoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as InventoryStore) : {};
  } catch {
    return {};
  }
}

function write(store: InventoryStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getBlockedSeats(slot: SlotKey): number[] {
  return read()[slotKeyString(slot)] ?? [];
}

export function setBlockedSeats(slot: SlotKey, seats: number[]) {
  const store = read();
  const k = slotKeyString(slot);
  if (seats.length === 0) delete store[k];
  else store[k] = [...new Set(seats)].sort((a, b) => a - b);
  write(store);
}

export function toggleBlockedSeat(slot: SlotKey, seat: number) {
  const current = getBlockedSeats(slot);
  setBlockedSeats(
    slot,
    current.includes(seat) ? current.filter((s) => s !== seat) : [...current, seat],
  );
}

/** Real seats already booked (excluding cancelled) for this slot. */
export function getBookedSeats(slot: SlotKey): number[] {
  return getBookings()
    .filter(
      (b) =>
        b.status !== "cancelled" &&
        b.date === slot.date &&
        b.time === slot.time &&
        b.rayonId.toUpperCase() === slot.rayonId.toUpperCase() &&
        b.vehicleId === slot.vehicleId &&
        b.serviceTier === slot.tier,
    )
    .flatMap((b) => b.seats);
}

/** Combined occupied (booking real + manual block). Returns unique sorted list. */
export function getOccupiedSeats(slot: SlotKey): number[] {
  return [...new Set([...getBookedSeats(slot), ...getBlockedSeats(slot)])].sort((a, b) => a - b);
}

export function getAvailableCount(slot: SlotKey, totalSeats: number): number {
  return Math.max(0, totalSeats - getOccupiedSeats(slot).length);
}
