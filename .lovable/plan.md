
# Traveloka Clone — UI/UX Showcase (Web + Mobile-first)

Aplikasi cloning Traveloka dengan 3 modul (Hotel, Shuttle, Ride) yang **modular** sehingga mudah dikembangkan. Mode tampilan **otomatis berdasarkan device** (responsive breakpoint), pakai **mock data**, dan peta **Leaflet + OpenStreetMap**.

## Arsitektur Modular

```
src/
├── modules/
│   ├── hotel/      (pages, components, mock data, types)
│   ├── shuttle/    (pages, components, mock data, types)
│   └── ride/       (pages, components, mock data, types)
├── shared/
│   ├── layouts/    (WebLayout, MobileLayout, ResponsiveLayout)
│   ├── components/ (Header, BottomNav, ModuleCard, SearchBar)
│   └── hooks/      (useIsMobile)
└── pages/          (Home, NotFound)
```

Setiap modul self-contained → menambah modul baru (Flight, Train, dll) cukup buat folder baru + daftarkan di route & home grid.

## Desain Visual (Mirip Traveloka)

- **Primary**: biru Traveloka `#0194F3`, accent orange `#FF5E1F`
- **Card** putih dengan shadow lembut, border-radius medium
- **Ikon kategori** warna-warni per modul (hotel = biru, shuttle = hijau, ride = orange)
- Tipografi: Inter, body 14–16px
- Semua token dimasukkan ke `index.css` & `tailwind.config.ts` (HSL)

## Layout Responsive (auto switch)

- **≥768px → Web Mode**: top nav horizontal, hero banner besar, search panel multi-kolom, grid produk
- **<768px → Mobile Mode**: header ringkas + search bar, modul grid 4 kolom ikon, bottom navigation (Home / Booking / Promo / Account), bottom sheet untuk filter

## Halaman Beranda

- Hero banner + search bar kontekstual
- **Grid 3 modul** (Hotel, Shuttle, Ride) dengan ikon ala Traveloka
- Section "Promo Spesial" & "Rekomendasi" (mock)

## Modul 1 — Hotel

1. **Search**: kota, check-in/out (date picker), jumlah tamu & kamar
2. **Hasil pencarian**: list/grid hotel dengan foto, rating bintang, harga/malam, fasilitas, filter (harga, bintang, fasilitas) di sidebar (web) / bottom sheet (mobile)
3. **Detail hotel**: galeri foto, deskripsi, fasilitas, peta lokasi mini (Leaflet), pilih tipe kamar
4. **Booking form** (mock): data tamu → halaman konfirmasi sukses

## Modul 2 — Shuttle

1. **Search**: kota asal → kota tujuan (swap button), tanggal, jumlah penumpang
2. **Hasil**: daftar jadwal shuttle (operator, jam berangkat–tiba, durasi, harga, kursi tersisa), filter waktu & operator
3. **Detail**: pilih kursi (seat map sederhana), pilih titik jemput/antar
4. **Booking form** (mock) → konfirmasi e-ticket

## Modul 3 — Ride (Hailing dengan Map)

1. **Map fullscreen** Leaflet + OSM, marker posisi user
2. **Bottom sheet**: input "Jemput di" & "Tujuan" (autocomplete mock kota/POI)
3. Pilih jenis kendaraan (Bike, Car, XL) dengan estimasi harga & ETA
4. **Simulasi cari driver** (loading) → kartu driver muncul (nama, plat, rating, foto) + marker driver bergerak ke titik jemput (animasi sederhana)
5. Status trip: menuju penjemputan → dalam perjalanan → selesai (mock)

## Tech & Library

- React + Vite + TS + Tailwind + shadcn/ui (existing)
- **react-leaflet + leaflet** untuk peta
- **date-fns** untuk handling tanggal
- React Router untuk routing per modul (`/hotel`, `/shuttle`, `/ride`)
- Mock data di tiap modul (`modules/<name>/data/*.ts`)

## Hasil Akhir

User membuka aplikasi → otomatis dapat tampilan Web atau Mobile sesuai device → bisa menjelajah 3 modul lengkap dengan flow search → list → detail → booking confirmation (mock), plus pengalaman peta nyata di modul Ride.
