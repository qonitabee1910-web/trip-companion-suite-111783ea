
# Tambah Pemilihan Tanggal Keberangkatan di Shuttle

## Tujuan
User memilih **tanggal** keberangkatan (selain jam) di halaman Rayon, lalu tanggal terbawa ke seluruh flow (Service → Vehicle → Booking → E-Ticket).

## Perubahan File

### 1. `src/modules/shuttle/pages/ShuttleRayon.tsx`
- Tambah state `date: Date` (default = hari ini).
- Tambah field "Tanggal Berangkat" pakai **Shadcn Datepicker** (Popover + Calendar) di atas section "Jam Berangkat":
  - Trigger: Button outline full-width, ikon `CalendarIcon`, format `EEEE, d MMM yyyy` (locale id) via `date-fns/locale/id`.
  - Calendar `mode="single"`, `disabled={(d) => d < startOfToday()}` (tidak bisa pilih tanggal lewat).
  - Wrapper calendar pakai `className="p-3 pointer-events-auto"` sesuai pedoman.
- Kirim `date` (ISO `yyyy-MM-dd`) di query param saat lanjut: `params.set("date", format(date, "yyyy-MM-dd"))`.

### 2. `src/modules/shuttle/pages/ShuttleBooking.tsx`
- Baca `params.get("date")` → parse ke Date, format tampilan `EEE, d MMM yyyy` (locale id).
- Tampilkan baris **"Tanggal"** di:
  - Ringkasan kanan (di atas baris "Berangkat").
  - E-Ticket sukses (di atas baris "Berangkat").

### 3. `src/modules/shuttle/pages/ShuttleService.tsx` & `ShuttleVehicle.tsx`
- Tidak ada UI baru — tanggal cukup ikut diteruskan via `URLSearchParams` (sudah otomatis karena `new URLSearchParams(params)` mempertahankan semua key).

## Catatan Teknis
- `date-fns` sudah terpasang (dipakai `react-day-picker`). Locale `id` dari `date-fns/locale`.
- Default tanggal di Rayon = hari ini. Validasi disable tanggal lampau supaya tidak bisa booking ke masa lalu.
- Format query: `date=2026-04-19` (string aman di URL, mudah diparse).
- Tidak ada perubahan ke data layer / pricing — tanggal hanya display & dibawa ke e-ticket.

## Hasil
Di halaman Rayon muncul date picker (default hari ini, tidak bisa pilih hari kemarin). Tanggal terpilih ditampilkan di ringkasan booking dan e-ticket akhir.
