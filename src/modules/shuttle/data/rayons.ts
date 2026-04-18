export type RayonId = "A" | "B" | "C" | "D";

export interface Rayon {
  id: RayonId;
  name: string;
  area: string;
  pickupPoints: string[];
  color: string; // tailwind utility hint via semantic class
  estimateMin: number;
}

export const RAYONS: Rayon[] = [
  {
    id: "A",
    name: "Rayon A",
    area: "Medan Kota",
    pickupPoints: ["Lapangan Merdeka", "Stasiun Medan", "Centre Point Mall", "Sun Plaza"],
    color: "primary",
    estimateMin: 60,
  },
  {
    id: "B",
    name: "Rayon B",
    area: "Medan Utara",
    pickupPoints: ["Belawan", "Marelan", "Labuhan", "Titi Papan"],
    color: "accent",
    estimateMin: 90,
  },
  {
    id: "C",
    name: "Rayon C",
    area: "Medan Selatan",
    pickupPoints: ["Amplas", "Johor", "Polonia", "Tuntungan"],
    color: "success",
    estimateMin: 50,
  },
  {
    id: "D",
    name: "Rayon D",
    area: "Medan Barat / Binjai",
    pickupPoints: ["Binjai Kota", "Sunggal", "Helvetia", "Diski"],
    color: "warning",
    estimateMin: 75,
  },
];

export const DEPART_TIMES = ["04:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

export const DESTINATION = {
  code: "KNO",
  name: "Kualanamu International Airport",
  short: "KNO Airport",
};

export function getRayon(id: string): Rayon | undefined {
  return RAYONS.find((r) => r.id === id.toUpperCase());
}
