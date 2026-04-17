# Seat Layout di Atas Denah Mobil

## Tujuan

Mengganti grid kursi datar di `ShuttleBooking.tsx` (step "seat") menjadi seat layout yang **di-overlay di atas gambar denah mobil** (top-view, mirip image base HiAce yang diupload), sehingga user melihat posisi kursi sesuai layout kendaraan asli (sopir, pintu, lorong, baris).

## Aset Gambar

- Copy `user-uploads://BASE_HIACE.png` → `src/assets/shuttle/base-hiace.png` (top-view HiAce kosong)
- Siapkan layout default untuk kendaraan lain (Elf, Premio) — fallback ke base HiAce dulu, bisa ditambah aset baru nanti.

## Konfigurasi Layout per Kendaraan

Buat file baru `src/modules/shuttle/data/seatLayouts.ts` berisi mapping vehicle → konfigurasi:

```ts
{
  image: hiaceImg,
  aspect: "1/2.2",         // rasio gambar
  driverSeat: { x%, y% },  // posisi sopir (non-clickable, ikon stir)
  seats: [
    { num: 1, x: 25, y: 30 },  // posisi % terhadap container
    { num: 2, x: 60, y: 30 },
    ...
  ]
}
```

- HiAce 14 kursi: 1 sopir + 1 depan, lalu baris 2-2 (lorong tengah), baris belakang 4
- Elf 11 kursi: variasi posisi
- Premio 9 kursi: variasi posisi
- Posisi pakai persen agar responsive

## Komponen Baru: `SeatMap.tsx`

`src/modules/shuttle/components/SeatMap.tsx`

- Props: `vehicle`, `totalSeats`, `occupied: Set<number>`, `selected: number[]`, `onToggle(n)`, `maxSelect`
- Render:
  - Container `relative` dengan `aspect-ratio` & background image denah mobil (object-contain)
  - Ikon stir di posisi sopir (Lucide `Disc3` / steering-wheel SVG)
  - Tombol kursi `absolute` per koordinat — bulat, ukuran `~10%` lebar container
  - State warna: tersedia (outline primary), dipilih (filled primary + nomor putih), terisi (abu + ikon User), sopir (kuning, disabled)
- Legend di bawah gambar (Tersedia / Dipilih / Terisi)

## Update `ShuttleBooking.tsx`

- Import `SeatMap` dan `getSeatLayout(vehicle)`
- Ganti blok `<div className="grid grid-cols-5 ...">` (baris ~99-126) dengan `<SeatMap ... />`
- Container kursi diberi background `bg-muted/30` + padding agar gambar denah terlihat jelas
- Sisanya (pickup/dropoff, ringkasan, step form & success) tetap

## Hasil Visual

User melihat sketsa mobil top-view dengan tombol kursi bernomor yang ditempatkan presisi di atas denah, mengklik untuk memilih sebanyak `pax`. Pengalaman jauh lebih realistis dibanding grid datar.

## Files yang akan diubah/dibuat

- create: `src/assets/shuttle/base-hiace.png` (copy dari upload)
- create: `src/modules/shuttle/data/seatLayouts.ts`
- create: `src/modules/shuttle/components/SeatMap.tsx`
- edit: `src/modules/shuttle/pages/ShuttleBooking.tsx`