
# Modul Editor Posisi Kursi (Seat Layout Editor)

## Tujuan
Membuat halaman admin/dev untuk **mengedit posisi kursi secara visual** di atas gambar denah mobil, lalu meng-export hasilnya sebagai konfigurasi siap-pakai untuk `seatLayouts.ts` — sehingga layout tampak realistis tanpa perlu menebak koordinat manual.

## Halaman Baru: `/shuttle/seat-editor`

Route baru `SeatLayoutEditor.tsx` (akses langsung via URL, tidak masuk navigasi user). Tidak butuh auth karena ini UI/UX showcase.

## Fitur Editor

### 1. Panel Kontrol (kiri / atas di mobile)
- **Pilih kendaraan**: dropdown HiAce / Elf / Premio (load layout existing dari `seatLayouts.ts`)
- **Upload gambar denah** (opsional): user bisa pilih file PNG sendiri sebagai background; default pakai `base-hiace.png`
- **Aspect ratio**: input (default `1/2.2`)
- **Tombol**: 
  - `+ Tambah Kursi` (kursi baru muncul di tengah)
  - `Set Sopir` (klik di canvas untuk pindahkan ikon stir)
  - `Reset ke Default`
  - `Export JSON` (copy ke clipboard + download `.ts` snippet)

### 2. Canvas Edit (kanan)
- Container `relative` dengan gambar denah sebagai background — sama seperti `SeatMap.tsx` versi user
- Tiap kursi = tombol **draggable** (pakai pointer events: `onPointerDown` → track delta → update `x%, y%`)
- Klik kursi → seleksi (highlight ring) → muncul panel kecil: nomor kursi, tombol hapus, input manual `x` & `y`
- Snap-to-grid opsional (toggle, default off; grid 1%)
- Driver seat juga draggable dengan ikon stir

### 3. Daftar Kursi (bawah panel kiri)
- List nomor kursi 1..N dengan posisi `(x%, y%)`
- Klik item → fokus & seleksi kursi di canvas
- Tombol naik/turun untuk reorder nomor

### 4. Export
Output berupa snippet TypeScript siap paste ke `seatLayouts.ts`:
```ts
const HIACE_LAYOUT: SeatLayoutConfig = {
  image: hiaceImg,
  aspect: "1/2.2",
  driverSeat: { x: 68, y: 14 },
  seats: [
    { num: 1, x: 28, y: 14 },
    ...
  ],
};
```
Plus tombol "Copy to Clipboard" dengan toast konfirmasi.

## Komponen & File

- **create**: `src/modules/shuttle/pages/SeatLayoutEditor.tsx` (halaman utama, ~250 baris)
- **create**: `src/modules/shuttle/components/DraggableSeat.tsx` (1 tombol kursi yang bisa drag, reusable)
- **edit**: `src/App.tsx` — tambah route `/shuttle/seat-editor`
- **edit**: `src/modules/shuttle/data/seatLayouts.ts` — export `HIACE_LAYOUT`, `ELF_LAYOUT`, `PREMIO_LAYOUT` agar bisa di-load editor

## Teknis Drag

- Pakai pointer events native (tidak perlu library tambahan)
- Saat `pointerdown` di kursi: simpan offset relatif terhadap container, set `setPointerCapture`
- Saat `pointermove`: hitung `(clientX - rect.left) / rect.width * 100` → update state `x` (clamp 0–100)
- Saat `pointerup`: release capture
- Bekerja di mouse + touch

## Hasil

Developer/admin buka `/shuttle/seat-editor` → pilih HiAce → drag tiap kursi tepat di atas gambar denah → klik **Export** → paste hasil ke `seatLayouts.ts`. Layout jadi presisi & realistis dalam hitungan menit, tanpa trial-error koordinat.

## Catatan
- Editor ini murni client-side (tidak save ke DB) — sesuai mode UI/UX showcase mock data.
- Bisa dikembangkan nanti: simpan ke localStorage, multi-image upload per vehicle, preview mode "user view".
