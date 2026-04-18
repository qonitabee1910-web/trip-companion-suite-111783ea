
# Simpan Layout dari Editor → Update Tampilan User

## Tujuan
Menambah tombol **Simpan** di Seat Layout Editor yang menyimpan hasil edit ke `localStorage`, lalu `SeatMap.tsx` (tampilan user di booking shuttle) otomatis membaca layout tersimpan tersebut sehingga perubahan editor langsung terlihat oleh user.

## Mekanisme Penyimpanan

Pakai `localStorage` (client-side, sesuai mode showcase tanpa backend):
- Key: `shuttle-seat-layout:HIACE`, `shuttle-seat-layout:ELF`, `shuttle-seat-layout:PREMIO`
- Value: JSON `{ aspect, driverSeat, seats, image? }`
- `image` hanya disimpan kalau user upload custom (sebagai data URL base64) — kalau pakai default, tidak disimpan agar bundle asset tetap dipakai

## Perubahan File

### 1. `src/modules/shuttle/data/seatLayouts.ts` (edit)
Tambah helper:
- `LAYOUT_STORAGE_KEY(vehicle)` → string key
- `saveLayoutToStorage(vehicleKey, config)` → simpan ke localStorage
- `loadLayoutFromStorage(vehicleKey)` → baca, return null kalau kosong
- `clearLayoutFromStorage(vehicleKey)`
- Modifikasi `getSeatLayout(vehicle, totalSeats)` agar **prioritaskan layout dari localStorage** sebelum fallback ke preset bawaan

### 2. `src/modules/shuttle/pages/SeatLayoutEditor.tsx` (edit)
- Tambah tombol **Simpan** (icon `Save`) di panel kontrol — di samping tombol Reset
- Saat klik:
  - Kalau `customImage` aktif → convert file ke data URL base64, simpan beserta layout
  - Kalau pakai default → simpan tanpa field image
  - Toast: "Layout HiAce disimpan — tampilan user sudah diperbarui"
- Tambah tombol **Hapus Simpanan** (icon `Trash2` kecil) → `clearLayoutFromStorage` + reset ke preset, toast konfirmasi
- Saat editor pertama dibuka / ganti vehicle → cek localStorage, kalau ada layout tersimpan langsung di-load (bukan preset default), tampilkan badge kecil "Tersimpan" sebagai indikator

### 3. `src/modules/shuttle/components/SeatMap.tsx` (tidak perlu diubah)
Sudah pakai `getSeatLayout()` yang otomatis baca dari storage setelah perubahan #1.

## Catatan Teknis

- File upload → data URL pakai `FileReader.readAsDataURL` agar persist di localStorage (URL.createObjectURL hanya valid per session)
- Quota localStorage ~5MB per origin → cukup untuk 3 layout + gambar kecil (warning toast kalau gagal save)
- Tampilan user di `/shuttle/:id/book` akan otomatis pakai layout baru saat halaman dibuka berikutnya (tidak perlu refresh logic khusus karena `getSeatLayout` dipanggil saat render)

## Hasil
Edit posisi kursi di `/shuttle/seat-editor` → klik **Simpan** → buka booking shuttle → seat map user persis sesuai hasil edit. Bisa di-reset kapan saja ke preset bawaan.
