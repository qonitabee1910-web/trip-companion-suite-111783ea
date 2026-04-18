
# Restruktur Modul Shuttle: Rayon → Service → Kendaraan → Kursi

## Konsep Bisnis
- **4 Rayon** (A, B, C, D) — setiap rayon punya beberapa **titik jemput** di area Medan/sekitarnya
- **Tujuan tetap**: KNO Airport (Kualanamu)
- **3 Service tier** per rute: Reguler, Semi Executive, Executive (beda harga & fasilitas)
- **3 Tipe kendaraan** per service: HiAce (12 kursi), SUV (6 kursi), Mini Car (4 kursi) — semuanya pakai seat picker visual

## Flow User Baru

```text
ShuttleHome (/shuttle)
   │  pilih Rayon (A/B/C/D)
   ▼
ShuttleRayon (/shuttle/rayon/:id)
   │  pilih titik jemput + jam
   ▼
ShuttleService (/shuttle/service?rayon=A&pickup=...&time=...)
   │  pilih Reguler / Semi Exec / Executive
   ▼
ShuttleVehicle (/shuttle/vehicle?...&service=executive)
   │  pilih HiAce / SUV / Mini Car (lihat sisa kursi & harga)
   ▼
ShuttleBooking (/shuttle/book?...&vehicle=hiace)
   pilih kursi (SeatMap existing) → form → e-ticket
```

## Struktur Data Baru

**`src/modules/shuttle/data/rayons.ts`**
```ts
RAYONS: [
  { id: "A", name: "Rayon A — Medan Kota", 
    pickupPoints: ["Lapangan Merdeka", "Stasiun Medan", "Centre Point Mall"] },
  { id: "B", name: "Rayon B — Medan Utara",
    pickupPoints: ["Belawan", "Marelan", "Labuhan"] },
  { id: "C", name: "Rayon C — Medan Selatan",
    pickupPoints: ["Amplas", "Johor", "Polonia"] },
  { id: "D", name: "Rayon D — Medan Barat/Binjai",
    pickupPoints: ["Binjai Kota", "Sunggal", "Helvetia"] },
]
```

**`src/modules/shuttle/data/services.ts`**
```ts
SERVICES: [
  { tier: "reguler",       label: "Reguler",       priceMultiplier: 1.0, features: ["AC", "Air mineral"] },
  { tier: "semi-executive",label: "Semi Executive",priceMultiplier: 1.4, features: ["AC", "Reclining", "Snack", "WiFi"] },
  { tier: "executive",     label: "Executive",     priceMultiplier: 1.8, features: ["Captain seat", "WiFi", "Snack box", "Selimut", "USB charger"] },
]

VEHICLE_TYPES: [
  { id: "hiace",   label: "HiAce",   totalSeats: 12, basePrice: 120000, vehicleName: "HiAce Premium" },
  { id: "suv",     label: "SUV",     totalSeats: 6,  basePrice: 180000, vehicleName: "Premio" },
  { id: "minicar", label: "Mini Car",totalSeats: 4,  basePrice: 95000,  vehicleName: "Elf Mini" },
]
```
Harga final = `basePrice × service.priceMultiplier`. Sisa kursi di-mock per kombinasi.

## File yang Dibuat / Diubah

**Create**
- `src/modules/shuttle/data/rayons.ts` — 4 rayon + titik jemput
- `src/modules/shuttle/data/services.ts` — 3 tier service + 3 vehicle type + helper harga
- `src/modules/shuttle/pages/ShuttleRayon.tsx` — pilih titik jemput & jam dalam 1 rayon
- `src/modules/shuttle/pages/ShuttleService.tsx` — list 3 service tier (card dengan fitur & harga mulai dari)
- `src/modules/shuttle/pages/ShuttleVehicle.tsx` — list 3 kendaraan (gambar mini, kapasitas, sisa kursi, harga)

**Edit**
- `src/modules/shuttle/pages/ShuttleHome.tsx` — ganti hero/search lama jadi grid 4 kartu Rayon (warna berbeda) + info "Tujuan: KNO Airport"
- `src/modules/shuttle/pages/ShuttleBooking.tsx` — baca query param `vehicle`, `service`, `rayon`, `pickup`, `time`; total seat & harga pakai data baru; SeatMap tetap jalan (mapping vehicle id → preset HIACE/PREMIO/ELF di `seatLayouts.ts`)
- `src/App.tsx` — daftar route baru: `/shuttle/rayon/:id`, `/shuttle/service`, `/shuttle/vehicle`, `/shuttle/book`
- `src/modules/shuttle/data/seatLayouts.ts` — tambah mapping `vehicleTypeId → VehicleKey` (suv→PREMIO, minicar→ELF, hiace→HIACE) supaya seat editor existing tetap kompatibel

**Tidak diubah**
- `SeatMap.tsx`, `SeatLayoutEditor.tsx`, `DraggableSeat.tsx` — fitur edit & simpan layout tetap berlaku per tipe kendaraan
- `ShuttleSearch.tsx` lama — biarkan tapi tidak di-link dari home (bisa dihapus nanti)

## Detail UI Singkat

- **ShuttleHome**: header "Shuttle ke KNO Airport", grid 2×2 kartu rayon (icon + nama + jumlah titik jemput)
- **ShuttleRayon**: chip titik jemput, picker jam (06:00 / 09:00 / 12:00 / 15:00 / 18:00), pax stepper, tombol "Lihat Service"
- **ShuttleService**: 3 card vertikal dengan badge tier, list fitur (CheckCircle), harga "mulai Rp...", tombol "Pilih"
- **ShuttleVehicle**: 3 card kendaraan — thumbnail (pakai base-hiace.png untuk hiace, placeholder untuk lainnya), kapasitas, sisa kursi (warning kalau <30%), harga total untuk pax, tombol "Pilih Kursi"
- **ShuttleBooking**: tetap pakai `SeatMap` dengan `totalSeats` dari vehicle type yang dipilih

## Hasil
User: pilih rayon → titik jemput/jam → service tier → kendaraan → kursi → bayar. Hierarkinya jelas, harga dinamis, dan seat picker visual existing tetap dipakai untuk semua jenis kendaraan.
