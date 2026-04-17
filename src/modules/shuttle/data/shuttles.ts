export interface ShuttleSchedule {
  id: string;
  operator: string;
  operatorLogo?: string;
  vehicle: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  durationMin: number;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  pickupPoints: string[];
  dropoffPoints: string[];
}

export const SHUTTLE_CITIES = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Bali", "Semarang", "Malang", "Bogor"];

export const SHUTTLES: ShuttleSchedule[] = [
  {
    id: "s1",
    operator: "Cipaganti",
    vehicle: "HiAce Premium",
    from: "Jakarta",
    to: "Bandung",
    departTime: "06:00",
    arriveTime: "09:30",
    durationMin: 210,
    price: 150000,
    seatsAvailable: 8,
    totalSeats: 12,
    pickupPoints: ["Pasar Minggu", "Blok M", "Bekasi"],
    dropoffPoints: ["Pasteur", "Dipatiukur", "Buah Batu"],
  },
  {
    id: "s2",
    operator: "Day Trans",
    vehicle: "Elf Long",
    from: "Jakarta",
    to: "Bandung",
    departTime: "08:00",
    arriveTime: "11:00",
    durationMin: 180,
    price: 135000,
    seatsAvailable: 5,
    totalSeats: 11,
    pickupPoints: ["Tebet", "Senen"],
    dropoffPoints: ["Pasteur", "Cihampelas"],
  },
  {
    id: "s3",
    operator: "Xtrans",
    vehicle: "Premio",
    from: "Jakarta",
    to: "Bandung",
    departTime: "10:30",
    arriveTime: "13:30",
    durationMin: 180,
    price: 175000,
    seatsAvailable: 3,
    totalSeats: 9,
    pickupPoints: ["Kuningan", "Fatmawati"],
    dropoffPoints: ["Dago", "Pasteur"],
  },
  {
    id: "s4",
    operator: "Cititrans",
    vehicle: "HiAce",
    from: "Jakarta",
    to: "Bandung",
    departTime: "14:00",
    arriveTime: "17:30",
    durationMin: 210,
    price: 145000,
    seatsAvailable: 10,
    totalSeats: 12,
    pickupPoints: ["Bintaro", "Pondok Indah"],
    dropoffPoints: ["Cihampelas", "Setiabudhi"],
  },
  {
    id: "s5",
    operator: "Cipaganti",
    vehicle: "HiAce Premium",
    from: "Jakarta",
    to: "Bandung",
    departTime: "18:00",
    arriveTime: "21:30",
    durationMin: 210,
    price: 155000,
    seatsAvailable: 11,
    totalSeats: 12,
    pickupPoints: ["Blok M", "Sudirman"],
    dropoffPoints: ["Pasteur", "Dipatiukur"],
  },
];
