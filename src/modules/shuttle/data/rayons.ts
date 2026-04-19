export type RayonId = string;

export interface Rayon {
  id: RayonId;
  name: string;
  area: string;
  pickupPoints: string[];
  color: string;
  estimateMin: number;
  surcharge?: number; // additional Rp added to final price
}

export interface Destination {
  code: string;
  name: string;
  short: string;
}

export interface ShuttleContent {
  heroTitle: string;
  heroSubtitle: string;
  footerNote: string;
  paxMax: number;
}

export const RAYONS: Rayon[] = [
  {
    id: "A",
    name: "Rayon A",
    area: "Medan Kota",
    pickupPoints: ["Lapangan Merdeka", "Stasiun Medan", "Centre Point Mall", "Sun Plaza"],
    color: "primary",
    estimateMin: 60,
    surcharge: 0,
  },
  {
    id: "B",
    name: "Rayon B",
    area: "Medan Utara",
    pickupPoints: ["Belawan", "Marelan", "Labuhan", "Titi Papan"],
    color: "accent",
    estimateMin: 90,
    surcharge: 10000,
  },
  {
    id: "C",
    name: "Rayon C",
    area: "Medan Selatan",
    pickupPoints: ["Amplas", "Johor", "Polonia", "Tuntungan"],
    color: "success",
    estimateMin: 50,
    surcharge: 0,
  },
  {
    id: "D",
    name: "Rayon D",
    area: "Medan Barat / Binjai",
    pickupPoints: ["Binjai Kota", "Sunggal", "Helvetia", "Diski"],
    color: "warning",
    estimateMin: 75,
    surcharge: 15000,
  },
];

export const DEPART_TIMES = ["04:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

export const DEFAULT_DESTINATION: Destination = {
  code: "KNO",
  name: "Kualanamu International Airport",
  short: "KNO Airport",
};

export const DEFAULT_CONTENT: ShuttleContent = {
  heroTitle: "Shuttle ke KNO",
  heroSubtitle: "Pilih rayon keberangkatanmu",
  footerNote:
    "Cara pesan: pilih rayon → tentukan titik jemput & jam → pilih kelas service → pilih kendaraan → pilih kursi.",
  paxMax: 12,
};

// Backwards-compat alias (still exported but reads from repo at runtime via getDestination)
export const DESTINATION: Destination = DEFAULT_DESTINATION;

export function getRayon(id: string): Rayon | undefined {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("shuttle-admin:rayons");
      if (raw) {
        const list = JSON.parse(raw) as Rayon[];
        return list.find((r) => r.id.toUpperCase() === id.toUpperCase());
      }
    } catch {
      /* fallthrough */
    }
  }
  return RAYONS.find((r) => r.id.toUpperCase() === id.toUpperCase());
}

export function getDestination(): Destination {
  if (typeof window === "undefined") return DEFAULT_DESTINATION;
  try {
    const raw = localStorage.getItem("shuttle-admin:destination");
    return raw ? { ...DEFAULT_DESTINATION, ...(JSON.parse(raw) as Partial<Destination>) } : DEFAULT_DESTINATION;
  } catch {
    return DEFAULT_DESTINATION;
  }
}

export function getContent(): ShuttleContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = localStorage.getItem("shuttle-admin:content");
    return raw ? { ...DEFAULT_CONTENT, ...(JSON.parse(raw) as Partial<ShuttleContent>) } : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}
