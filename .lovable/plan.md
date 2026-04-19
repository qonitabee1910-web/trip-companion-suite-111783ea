
# Plan: Sentralisasi Seluruh User Shuttle Logic ke Admin Dashboard

## Analisis User Flow Saat Ini

**Flow user (5 langkah):**
```
ShuttleHome → ShuttleRayon → ShuttleService → ShuttleVehicle → ShuttleBooking
   (rayon)     (pickup,jam,    (tier)         (kendaraan)      (pilih kursi
                tgl, pax)                                       + form + bayar)
```

**Yang sudah bisa di-admin:**
- ✅ Rayon, titik jemput, jam berangkat (`AdminRayons`)
- ✅ Service tier + harga multiplier (`AdminServices`)
- ✅ Kendaraan + kapasitas + base price (`AdminVehicles`)
- ✅ Seat layout per kombinasi (`AdminSeatEditor`)
- ✅ Booking (`AdminBookings`) + Scan QR (`AdminScan`)

**Yang BELUM bisa di-admin (hardcoded di code):**
1. **DESTINATION** (`KNO Airport`) — hardcoded `rayons.ts`. Tidak bisa ganti tujuan/multi-tujuan.
2. **Hero & branding ShuttleHome** — judul, subtitle, gradient.
3. **Mock occupied seats** — `mockSeatsAvailable()` deterministik per kombinasi, tidak baca booking riil. Akibatnya admin tidak punya kontrol kursi yang sudah terjual untuk slot tertentu.
4. **Kapasitas pax max** (hardcoded 12 di stepper `ShuttleRayon`).
5. **Service yang dinonaktifkan/vehicle dihapus** masih dipakai user — belum ada flag `active` & filter.
6. **Tarif final** — multiplier × base, tidak ada per-rayon surcharge / promo.
7. **Cara pesan / instruksi** copy di footer ShuttleHome — hardcoded.

**Masalah UX admin saat ini:**
- 7 menu sidebar terasa flat — tidak ada grouping logis (Setup vs Operasional vs Konten).
- Dashboard hanya angka — tidak ada quick action ke setup yang belum lengkap.
- Tidak ada indikator "data belum sinkron" (mis. seat layout mismatch capacity).

---

## Solusi: Restrukturisasi + Lengkapi Coverage Admin

### A. Reorganisasi Sidebar dengan Grouping
Pisah jadi 3 grup biar tidak membingungkan:

```
KONTEN & BRANDING
  • Beranda Shuttle      (NEW — atur DESTINATION + hero copy)

SETUP LAYANAN
  • Rayon & Jam
  • Service              (+toggle aktif)
  • Kendaraan            (+toggle aktif)
  • Seat Layout

OPERASIONAL
  • Dashboard
  • Booking
  • Scan Tiket
  • Inventori Kursi      (NEW — kelola occupied per slot)
```

### B. Halaman Baru: `AdminShuttleContent`
Satu halaman atur konten user-facing:
- **Tujuan (DESTINATION)**: code, nama panjang, nama pendek. Disimpan di `shuttle-admin:destination`.
- **Hero ShuttleHome**: judul (default "Shuttle ke KNO"), subtitle, label tujuan tetap.
- **Footer instruksi**: text "Cara pesan: ..." editable.
- **Pax max** per booking (default 12).
- **Live preview** di samping form — render mini-card mirip ShuttleHome.

Refactor: `DESTINATION` di `rayons.ts` jadi `getDestination()` yang baca dari repo, fallback default. Update `ShuttleHome/Rayon/Service/Vehicle/Booking` untuk pakai `getDestination()`.

### C. Halaman Baru: `AdminInventory` (Kelola Kursi Terjual per Slot)
Menggantikan `mockSeatsAvailable()` random:
- Pilih **tanggal + jam + rayon + vehicle + service** → tampilkan SeatMap interaktif.
- Admin bisa **block/unblock kursi manual** (mis. untuk maintenance, VIP, atau penjualan offline).
- Kursi yang sudah dipesan via booking otomatis tampil terisi (warna beda, tidak bisa diunblock).
- Disimpan di `shuttle-admin:inventory` dengan key `{date}_{time}_{rayonId}_{vehicleId}_{tier}` → array nomor kursi diblok.

Refactor `ShuttleBooking.tsx`: ganti `mockSeatsAvailable` & `occupiedSeats` dengan `getOccupiedSeats(slot)` yang gabung **booking riil dari `getBookings()` (filter slot match)** + **manual block dari inventory**.

### D. Toggle Aktif untuk Service & Vehicle
- Tambah field `active: boolean` di `ServiceConfig` & `VehicleType` (default `true`).
- `AdminServices` & `AdminVehicles` tambah toggle switch per row.
- `ShuttleService` & `ShuttleVehicle` filter `.filter(s => s.active !== false)`.
- Jika hanya 1 service aktif → auto-skip halaman service. Sama untuk vehicle.

### E. Per-Rayon Surcharge (Opsional, Tarif Lebih Realistis)
Tambah `surcharge: number` (default 0) di `Rayon`. Edit di `AdminRayons`. `calcPrice` jadi `(base × multiplier) + rayon.surcharge`. Update `ShuttleService` & `ShuttleVehicle` & `ShuttleBooking` untuk passing rayon ke `calcPrice`.

### F. Dashboard Admin Diperkaya
- **Setup completeness card**: Checklist (Destination ✓, ≥1 Rayon ✓, ≥1 Service aktif ✓, ≥1 Vehicle aktif ✓, semua seat layout match capacity ✓). Jika belum lengkap → CTA langsung ke halaman setup.
- **Quick actions**: tombol "Tambah Rayon", "Atur Konten", "Buka Editor Kursi".
- **Mismatch warning**: jumlah kombinasi vehicle×service yang seat layoutnya tidak sinkron capacity.

### G. Improve Flow User (Auto-skip & Validasi)
- Jika hanya 1 service aktif → `ShuttleRayon` tombol "Lanjut" langsung lompat ke `/shuttle/vehicle`.
- Jika hanya 1 vehicle aktif → `ShuttleService` langsung redirect ke `/shuttle/book`.
- Tambah **breadcrumb stepper** di header tiap halaman shuttle: `Rayon › Jadwal › Service › Kendaraan › Kursi` biar user tahu ada di langkah mana.

---

## File Changes Ringkas

**NEW:**
- `src/modules/admin/pages/AdminShuttleContent.tsx` — atur DESTINATION + hero + footer copy + pax max
- `src/modules/admin/pages/AdminInventory.tsx` — kelola kursi terjual/blocked per slot
- `src/shared/components/StepperHeader.tsx` — breadcrumb stepper user shuttle
- `src/modules/shuttle/data/inventory.ts` — helper getOccupied/blockSeat/unblockSeat

**EDIT:**
- `src/modules/shuttle/data/rayons.ts` — `getDestination()` baca repo + tambah `surcharge` di Rayon
- `src/modules/shuttle/data/services.ts` — tambah `active` field; `calcPrice(vehicle, service, rayon?)`
- `src/modules/shuttle/data/repository.ts` — getter/setter untuk destination, hero copy, inventory
- `src/modules/shuttle/pages/ShuttleHome.tsx` — pakai konten dari repo
- `src/modules/shuttle/pages/ShuttleRayon.tsx` — pax max dari repo + auto-skip
- `src/modules/shuttle/pages/ShuttleService.tsx` — filter aktif + auto-skip + stepper
- `src/modules/shuttle/pages/ShuttleVehicle.tsx` — filter aktif + stepper + occupied riil
- `src/modules/shuttle/pages/ShuttleBooking.tsx` — `getOccupiedSeats(slot)` gabung booking + block
- `src/modules/admin/pages/AdminServices.tsx` — toggle aktif
- `src/modules/admin/pages/AdminVehicles.tsx` — toggle aktif
- `src/modules/admin/pages/AdminRayons.tsx` — input surcharge
- `src/modules/admin/pages/AdminDashboard.tsx` — setup checklist + quick actions + mismatch warning
- `src/modules/admin/components/AdminSidebar.tsx` — restrukturisasi grouping
- `src/App.tsx` — 2 route baru

---

## Hasil Akhir

Admin punya **kontrol penuh** atas semua yang dilihat & dialami user shuttle: branding, tujuan, rayon/jam/tarif, service & kendaraan (termasuk on/off), denah kursi, **dan stok kursi per slot**. Sidebar dirapikan jadi 3 grup (Konten, Setup, Operasional) sehingga alur kerja admin jelas: **setup sekali → kelola operasional harian**. User flow lebih cepat (auto-skip kalau hanya 1 pilihan) dan jelas (stepper breadcrumb). Dashboard memandu admin lewat checklist setup, sehingga tidak ada lagi data hardcoded yang tertinggal.
