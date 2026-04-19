
# Admin Dashboard Shuttle (LocalStorage + Repository Pattern)

## Tujuan
Buat dashboard admin di `/admin/shuttle` untuk kelola seluruh data shuttle. Data disimpan di localStorage via repository layer, dan **user flow shuttle** (Home/Rayon/Service/Vehicle/Booking) otomatis baca dari repository yang sama — jadi perubahan admin langsung terlihat di sisi user.

## Arsitektur

### 1. Repository Layer baru: `src/modules/shuttle/data/repository.ts`
Abstraksi getter/setter agar mudah migrasi ke Cloud nanti.
- `getRayons() / saveRayons()` — fallback ke `RAYONS` static jika belum ada di localStorage
- `getDepartTimes() / saveDepartTimes()`
- `getServices() / saveServices()`
- `getVehicleTypes() / saveVehicleTypes()`
- `getBookings() / addBooking() / updateBookingStatus()`
- Key prefix: `shuttle-admin:rayons`, `shuttle-admin:services`, dll.
- `resetAll()` untuk reset ke default.

### 2. Refactor file data existing (rayons.ts, services.ts)
Tetap export konstanta default sebagai seed, tapi tambah re-export helper `getRayon(id)` yang baca dari repository (bukan array static). Komponen user flow ganti import dari helper ini.

### 3. Hook booking persistence
Di `ShuttleBooking.tsx` saat user "Bayar Sekarang" → panggil `addBooking({rayon, pickup, date, time, vehicle, service, seats, pax, totalPrice, status: "confirmed", createdAt})`. Booking ini muncul di admin.

## Halaman Admin

### Layout: `src/modules/admin/components/AdminLayout.tsx`
- Sidebar shadcn (sesuai pedoman) dengan menu: Dashboard, Rayon & Jam, Service, Kendaraan, Booking, Seat Layout (link → `/shuttle/seat-editor`).
- Header dengan SidebarTrigger always-visible + tombol "Lihat sebagai user" (link `/shuttle`).

### Halaman:
1. **`/admin`** — `AdminDashboard.tsx`: ringkasan kartu (total booking hari ini, revenue, jumlah rayon, jumlah service aktif), tabel 5 booking terbaru.
2. **`/admin/shuttle/rayons`** — `AdminRayons.tsx`: tabel CRUD rayon (id, nama, area, estimasi). Klik row → drawer edit titik jemput (list + add/remove). Section "Jam Berangkat Global" dengan chip add/remove.
3. **`/admin/shuttle/services`** — `AdminServices.tsx`: tabel 3 service tier, form edit label/deskripsi/multiplier/fitur (textarea baris-per-baris).
4. **`/admin/shuttle/vehicles`** — `AdminVehicles.tsx`: tabel 3 vehicle type, form edit label/kapasitas/harga dasar/deskripsi. Tombol "Edit denah kursi" → buka `/shuttle/seat-editor`.
5. **`/admin/shuttle/bookings`** — `AdminBookings.tsx`: tabel booking (id, tanggal, rayon, kendaraan, pax, total, status), filter status/tanggal, action ubah status (confirmed/done/cancel).

### Routing di `App.tsx`
Tambah block:
```
/admin                        → AdminDashboard
/admin/shuttle/rayons         → AdminRayons
/admin/shuttle/services       → AdminServices
/admin/shuttle/vehicles       → AdminVehicles
/admin/shuttle/bookings       → AdminBookings
```
Semua dibungkus `<AdminLayout>`. Tanpa auth (sesuai pilihan localStorage).

### Entry point dari Home
Tambah card "Admin Dashboard" kecil di `/` (atau tombol kecil di `ShuttleHome` header) → `/admin`. Optional: cuma muncul jika query `?admin=1` agar tidak ganggu user biasa. Akan saya tampilkan sebagai link kecil di footer Home.

## Perubahan File Singkat
- **NEW**: `src/modules/shuttle/data/repository.ts`, `src/modules/shuttle/types/booking.ts`
- **NEW**: `src/modules/admin/components/AdminLayout.tsx`, `AdminSidebar.tsx`
- **NEW**: `src/modules/admin/pages/AdminDashboard.tsx`, `AdminRayons.tsx`, `AdminServices.tsx`, `AdminVehicles.tsx`, `AdminBookings.tsx`
- **EDIT**: `src/App.tsx` (5 route admin), `src/modules/shuttle/data/rayons.ts` & `services.ts` (helper baca repo), `ShuttleHome/Rayon/Service/Vehicle.tsx` (pakai getter repo), `ShuttleBooking.tsx` (panggil `addBooking` saat sukses), `src/pages/Home.tsx` (link kecil "Admin")

## Catatan Teknis
- Repository pure function + JSON serialize, mudah swap ke Supabase nanti (tinggal ganti body fungsi).
- Reset button di tiap halaman admin → kembalikan ke seed default.
- Toast feedback (`useToast`) saat save sukses/gagal.
- Sidebar collapsible="icon" agar mini-collapse tetap kelihatan di mobile.

## Hasil
Admin buka `/admin`, edit rayon/service/kendaraan/jam → user yang buka `/shuttle` langsung melihat data terbaru. Setiap booking user masuk ke `/admin/shuttle/bookings` untuk dipantau. Seat layout editor existing diakses via link cepat dari menu admin Kendaraan.
