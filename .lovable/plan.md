
# Halaman Scanner QR Validasi Tiket

## Tujuan
Buat `/admin/shuttle/scan` — petugas lapangan buka kamera HP, scan QR booking → otomatis cari di repository → tampilkan detail singkat → konfirmasi → status booking jadi `done`.

## Library
- `@yudiel/react-qr-scanner` — modern, ringan, support kamera depan/belakang, sudah handle `getUserMedia` + permission. Lebih stabil dari `html5-qrcode` di React 18.

## File Baru
**`src/modules/admin/pages/AdminScan.tsx`**
State machine 3 fase:
1. `scanning` — komponen `<Scanner>` aktif (kamera). Tombol switch kamera depan/belakang.
2. `found` — booking ketemu, tampilkan ringkasan (ID, nama, kendaraan, kursi, tanggal, status saat ini). 2 tombol: **Konfirmasi & Tandai Done** / **Scan Lagi**.
3. `not-found` — ID tidak ditemukan / sudah `done` / `cancelled`. Tampilkan pesan + tombol **Scan Lagi**.

Logika:
- `getBookings().find(b => b.id === scannedText)`
- Jika `status === "done"` → tampilkan banner "Sudah pernah divalidasi" tapi tetap tampilkan info.
- Jika `status === "cancelled"` → banner merah "Booking dibatalkan, tidak valid".
- Klik konfirmasi → `updateBookingStatus(id, "done")` + toast sukses + auto kembali ke `scanning` setelah 2 detik.
- Manual input fallback (kalau kamera bermasalah): Input text + tombol "Cek" — useful untuk testing dan kondisi kamera mati.

UI:
- AdminLayout dengan title "Scan Tiket".
- Card max-w-md center, kamera 1:1 aspect, rounded.
- Tombol "Mode Manual" toggle ke input ID.
- Banner status (success/warning/destructive) sesuai hasil.

## Routing
- Tambah route `/admin/shuttle/scan` di `App.tsx`.
- Tambah menu "Scan Tiket" (icon `ScanLine`) di `AdminSidebar.tsx`.

## Catatan Teknis
- Kamera butuh HTTPS — preview Lovable sudah HTTPS, aman.
- Browser akan minta permission camera — handle `onError` untuk pesan ramah.
- Mobile-first: scanner full-width di mobile, max-w-md di desktop.
- Tidak ubah data layer / e-ticket existing.

## Hasil
Petugas buka `/admin/shuttle/scan` di HP, arahkan kamera ke QR di e-ticket pelanggan → langsung muncul detail → 1 tap konfirmasi → status booking otomatis `done` dan tercatat di admin/bookings.
