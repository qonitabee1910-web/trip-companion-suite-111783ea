
# Tambah Fitur Resize & Hapus Cepat di Seat Layout Editor

## Tujuan
Di `/shuttle/seat-editor`, user bisa:
1. **Resize** ukuran tombol kursi (kecil / sedang / besar) — supaya pas dengan denah varian berbeda (Mini Car butuh tombol lebih besar, HiAce 12 kursi butuh lebih kecil agar tidak tumpuk).
2. **Hapus cepat** kursi langsung dari canvas (tombol × kecil di pojok tiap kursi saat selected) tanpa harus buka panel detail.
3. **Hapus semua kursi** sekaligus (tombol "Clear All" dengan konfirmasi) untuk mulai dari kosong.

## Perubahan File

### 1. `src/modules/shuttle/data/seatLayouts.ts`
- Tambah field opsional `seatSize?: number` (persen, default 9) ke `SeatLayoutConfig`.
- Set ukuran default berbeda per preset: HiAce ~8%, SUV ~10%, MiniCar ~12%.
- Simpan/load `seatSize` di `saveLayoutToStorage` & `loadLayoutFromStorage` (sudah pakai JSON, tinggal ikut serialized).
- Update `exportSnippet` agar ikut menulis `seatSize`.

### 2. `src/modules/shuttle/components/DraggableSeat.tsx`
- Terima prop `size?: number` (persen container) — default 9.
- Ganti class fixed `h-9 w-9` jadi style inline `width/height: size%` dengan `aspect-ratio: 1`.
- Tambah prop `onDelete?: () => void` — kalau ada & `selected`, render tombol × kecil absolute di pojok kanan-atas tombol kursi (bukan untuk driver seat).

### 3. `src/modules/shuttle/pages/SeatLayoutEditor.tsx`
- Tambah Slider (komponen `@/components/ui/slider` sudah ada) di control panel: "Ukuran kursi" range 5–18%, bind ke `config.seatSize`.
- Tambah tombol "Hapus semua kursi" (variant destructive ghost) dengan AlertDialog konfirmasi → set `seats: []`.
- Pass `size={config.seatSize}` ke semua `<DraggableSeat>`.
- Pass `onDelete={() => removeSeat(s.num)}` ke seat (bukan driver).
- Renumber otomatis setelah hapus agar nomor tetap sequential 1..N.

### 4. `src/modules/shuttle/components/SeatMap.tsx` (tampilan user)
- Baca `config.seatSize` dan teruskan ke tombol kursi (style inline) supaya hasil resize editor ikut tampak di booking flow.

## Catatan Teknis
- `seatSize` disimpan dalam persen relatif container, jadi tetap responsif di semua viewport.
- Tombol × delete pakai `lucide-react X` ukuran `h-3 w-3`, posisi absolute, `pointer-events-auto` di atas seat (stop propagation supaya tidak memicu drag).
- Konfirmasi hapus semua pakai `AlertDialog` shadcn agar konsisten dengan pola existing.
- Tidak ada perubahan ke flow booking / data kursi user — hanya nilai visual.

## Hasil
User editor bisa atur ukuran tombol kursi via slider, hapus kursi 1-klik via tombol × di canvas, atau reset semua kursi sekaligus. Perubahan tersimpan via tombol "Simpan" existing dan langsung tampil di SeatMap user.
