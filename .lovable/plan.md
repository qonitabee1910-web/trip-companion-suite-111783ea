
# Integrasi Seat Editor ke Admin Dashboard

## Analisis Struktur Saat Ini

**Yang sudah ada:**
- `SeatLayoutEditor` standalone di `/shuttle/seat-editor` (full-page, header sendiri, link kembali ke `/shuttle`).
- 9 layout key kombinasi: `{HIACE,SUV,MINICAR} × {REGULER,SEMI,EXEC}` — disimpan via `LAYOUT_STORAGE_KEY()` di localStorage, terpisah dari repository admin.
- `AdminVehicles` & `AdminServices` mengelola data di repository (`shuttle-admin:vehicles`, `shuttle-admin:services`) — **tidak terhubung** dengan seat layouts.
- Link "Edit denah" di `AdminVehicles` & sidebar membuka tab baru ke editor standalone — UX terputus.

**Masalah sinkronisasi:**
1. Admin ubah `totalSeats` di vehicle (mis. HiAce 12 → 10), tapi seat layout `HIACE_REGULER` tetap punya 12 kursi tersimpan → mismatch dengan tampilan user (resolver `getSeatLayout` auto-slice/extend kursi tanpa peringatan).
2. Editor tidak tahu service tier mana yang aktif/dinonaktifkan admin.
3. Editor terpisah dari konteks admin (tidak ada AdminLayout, sidebar hilang).

## Solusi

### 1. Embed Seat Editor di Admin Layout
**NEW** `src/modules/admin/pages/AdminSeatEditor.tsx`
- Wrapper tipis: render `<AdminLayout title="Seat Layout">` + komponen editor inti.
- Refactor `SeatLayoutEditor.tsx` → ekstrak isi `<main>` jadi komponen `SeatEditorPanel.tsx` (reusable) yang menerima prop `initialKey?: LayoutKey`. Halaman lama `/shuttle/seat-editor` tetap pakai komponen ini (full-page mode) untuk backward-compat.
- Route baru: `/admin/shuttle/seat-editor` di `App.tsx`.

### 2. Sinkronisasi Vehicle × Service → Seat Layout
**Selector pintar di SeatEditorPanel:**
- Selector lama (1 dropdown 9 kombinasi) diganti **2 dropdown bersisian**: Kendaraan (dari `getVehicleTypesAll()`) × Service Tier (dari `getServicesAll()`) → otomatis `buildLayoutKey()`.
- Tampilkan badge info dari repo: kapasitas vehicle (`totalSeats`), label service, harga akhir (vehicle.basePrice × service.multiplier).
- **Validasi mismatch**: Jika `config.seats.length !== vehicle.totalSeats` → tampilkan banner peringatan kuning + tombol **"Sinkronkan ke kapasitas (X kursi)"** yang auto add/remove kursi sampai sesuai.
- Service yang dinonaktifkan / vehicle yang dihapus admin → disabled di dropdown.

### 3. Cross-link 2 Arah
- `AdminVehicles`: tombol "Edit denah" untuk **tiap kombinasi service** (3 chip: Reguler / Semi / Exec) → link internal `/admin/shuttle/seat-editor?vehicle={id}&tier={tier}` (open di tab yang sama, bukan tab baru).
- `AdminServices`: tambah link "Atur denah kursi service ini" → `/admin/shuttle/seat-editor?tier={tier}`.
- `AdminSidebar`: ganti link Seat Layout dari external (`/shuttle/seat-editor` target=_blank) → internal `/admin/shuttle/seat-editor`.

### 4. AdminSeatEditor Membaca Query Params
- Parse `?vehicle=hiace&tier=executive` → set initial `LayoutKey` ke `HIACE_EXEC`.

## File Changes

**NEW:**
- `src/modules/admin/pages/AdminSeatEditor.tsx`
- `src/modules/shuttle/components/SeatEditorPanel.tsx` (extracted from SeatLayoutEditor)

**EDIT:**
- `src/modules/shuttle/pages/SeatLayoutEditor.tsx` → tipis, hanya wrap `<SeatEditorPanel fullPage />`
- `src/modules/admin/components/AdminSidebar.tsx` → link internal
- `src/modules/admin/pages/AdminVehicles.tsx` → 3 tombol per service tier dengan deep-link
- `src/modules/admin/pages/AdminServices.tsx` → tombol link denah
- `src/App.tsx` → tambah route `/admin/shuttle/seat-editor`

## Hasil
Admin membuka Seat Layout dari sidebar → tetap di dashboard (sidebar/header utuh). Pilih HiAce + Executive dari 2 dropdown, lihat info kapasitas/harga real-time dari repo. Jika kapasitas vehicle diubah di halaman Kendaraan, editor langsung kasih banner sinkronkan. Klik "Edit denah" di Vehicle/Service langsung melompat ke editor dengan kombinasi yang benar.
