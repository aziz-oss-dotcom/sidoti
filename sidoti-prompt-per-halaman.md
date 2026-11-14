# Prompt SIDOTI untuk Kiro

## Cara pakai
1. Simpan `sidoti-design-system.md` di `.kiro/steering/` (Kiro akan membacanya otomatis).
2. **Commit/backup dulu** sebelum mulai (`git add . && git commit -m "backup sebelum redesign"`).
3. Kirim **Prompt 0** dulu, lalu kerjakan halaman satu per satu. Cek hasil tiap halaman sebelum lanjut.
4. Sertakan screenshot Figma halaman terkait di setiap prompt sebagai pembanding.
5. Kalau ada yang meleset, koreksi dengan angka spesifik (mis. "tinggi navbar 80px, bukan 64px"), jangan cuma "masih beda".

---

## Prompt 0 — Komponen bersama (kerjakan pertama)

```
Baca steering file `sidoti-design-system.md`. Tugas: ubah HANYA tampilan komponen bersama
agar sesuai desain Figma terlampir:

1. Pasang font Inter dan design tokens (warna, radius, shadow) sebagai CSS variables / tailwind config.
2. Navbar: versi belum login (tombol "Masuk") dan versi sudah login (avatar + nama + chevron, plus menu "Riwayat Donasi").
3. Footer.
4. Komponen: tombol utama/sekunder, kartu, input, badge status, stepper, progress bar, pagination.

Aturan:
- Jangan ubah route, controller, model, database, autentikasi, atau logika pembayaran.
- Sebelum mengedit, sebutkan daftar file yang akan kamu ubah. Setelah selesai, sebutkan file yang berubah.
- Jangan sentuh halaman lain selain yang diperlukan untuk memasang komponen.
```

---

## Prompt 1 — Beranda (guest)

```
Ubah tampilan halaman Beranda agar sesuai screenshot terlampir. Pakai komponen bersama dan
design tokens dari steering. Jangan ubah backend. Data panti/statistik tetap dari backend yang ada.

Struktur dari atas ke bawah (latar putih):
1. Navbar guest, menu "Beranda" aktif.
2. Hero 2 kolom (kiri teks ±55%, kanan gambar ±40%, jarak 48px, align center):
   - Kiri: eyebrow "KEBAIKAN KECIL, HARAPAN BESAR" (ikon hati + uppercase, primary);
     H1 "Berbagi Kebaikan untuk Anak-Anak Panti" (2 baris, 44px bold navy);
     paragraf "Bantu wujudkan hari yang lebih baik lewat donasi yang mudah, aman, dan transparan. Setiap bantuan Anda berarti.";
     baris tombol: tombol utama "→ Donasi Sekarang" + teks kecil slate "Disalurkan ke panti terverifikasi".
   - Kanan: foto anak-anak panti bersama pengasuh, radius 16, tinggi ±230px (object-fit: cover).
     Di pojok kiri bawah foto ada pill putih (radius 12, shadow halus) berisi ikon hati-tangan + teks bold "Bersama, kita tumbuhkan harapan."
3. Section "Kebaikan Anda dibutuhkan di sini" (H2) + subjudul "Pilih kebutuhan yang ingin Anda bantu. Sedikit dari Anda, berarti bagi mereka."
   Di kanan judul: link "Lihat semua panti →" (primary bold 14px).
4. Grid 3 kartu sama lebar (gap 20px). Tiap kartu: gambar banner di atas (tinggi ±70px, cover, sudut atas membulat),
   lalu padding 16px: kategori kecil primary bold ("Kebutuhan pangan" / "Pendidikan" / "Fasilitas panti"),
   judul 18px ("Bantu penuhi gizi anak" / "Bekal untuk masa depan" / "Rumah yang lebih nyaman"),
   baris slate kecil "Panti Asuhan Harapan • Bandung", progress bar,
   baris bawah: terkumpul bold primary kecil di kiri ("Rp3.500.000"), "dari Rp5.000.000" slate di kanan.
5. Strip statistik: bg primary-tint, radius 12, padding 24px, 4 kolom:
   kolom 1 teks "Kebaikan yang terus bertumbuh" (18px navy) + "Terima kasih telah menjadi bagian dari perjalanan ini." (slate kecil);
   kolom 2-4 angka besar bold primary (28px) + label slate kecil:
   "Rp128.450.000 / Total donasi terkumpul", "1.248 / Donatur berbagi", "24 / Panti terbantu".
6. Footer.
```

---

## Prompt 2 — Login & Daftar

```
Ubah tampilan halaman Login/Daftar sesuai screenshot. Jangan ubah logika autentikasi, validasi, atau route.

- Navbar guest. Latar halaman --bg-page.
- Kartu putih di tengah, lebar maks 480px, padding 32px, radius 12, shadow halus, jarak atas ±32px dari navbar.
- Judul tengah "Selamat datang kembali" (28px bold navy); subjudul tengah slate 14px
  "Masuk dan lanjutkan langkah kecil Anda untuk berbagi kebahagiaan." (2 baris).
- Tab segmented "Masuk | Daftar": wadah bg #F0F4F8 radius 12 padding 4px; tab aktif bg putih + shadow tipis,
  teks primary bold; tab nonaktif teks slate. Tab "Daftar" tetap menampilkan form daftar yang sudah ada, hanya ubah gayanya.
- Field Email (ikon amplop, placeholder "nama@email.com") dan Password (ikon gembok, placeholder "Masukkan password Anda",
  ikon mata-coret di kanan untuk toggle tampil/sembunyi).
- Baris: checkbox "Ingat saya" (kiri, 13px slate) dan link "Lupa password?" (kanan, primary bold 13px).
- Tombol utama penuh lebar "Masuk" (tinggi 48px).
- Pemisah: garis tipis dengan teks "atau" di tengah.
- Tombol outline penuh lebar dengan logo Google berwarna + "Masuk dengan Google".
- Teks tengah "Belum punya akun? Daftar sekarang" ("Daftar sekarang" primary bold).
- Di bawah kartu (di luar kartu), tengah: ikon perisai kecil + "Data Anda aman. Kebaikan Anda berarti." (13px slate).
- Footer.
```

---

## Prompt 3 — Form Donasi (langkah 1)

```
Ubah tampilan halaman Form Donasi sesuai screenshot. Jangan ubah logika pemilihan nominal,
validasi, atau penyimpanan data.

- Navbar sudah login (avatar "AP", nama pengguna dari data login). Latar --bg-page.
- Header kiri (dalam container ±1000px): H1 "Mulai langkah kebaikan Anda" (32px bold) + subjudul
  "Lengkapi donasi untuk membantu memenuhi kebutuhan anak-anak panti."
- Stepper: langkah 1 "Isi Donasi" aktif, 2 "Pembayaran", 3 "Verifikasi" belum.
- Grid 2 kolom: kiri ±65%, kanan ±32%, gap 24px.
- Kartu kiri "Informasi donasi" (judul 18px):
  - label "Pilih nominal donasi" lalu 4 tombol sejajar sama lebar: Rp25.000, Rp50.000, Rp100.000, Lainnya.
    Tombol biasa: bg putih, border 1px, radius 12, tinggi 44px, teks navy bold. Terpilih: border 2px primary,
    bg primary-tint, teks primary, ikon centang kecil di kiri teks.
  - garis pemisah tipis
  - 2 input sejajar: "Nama lengkap" dan "No. HP"
  - textarea "Pesan untuk panti (opsional)"
  - checkbox "Sembunyikan nama saya sebagai donatur anonim"
  - kotak info bg primary-tint radius 12 padding 12px: ikon perisai + "Data pribadi Anda hanya digunakan untuk proses donasi dan konfirmasi pembayaran."
- Kartu kanan "Ringkasan donasi": foto panti (radius 12, tinggi ±95px), "Panti Asuhan Harapan" (bold),
  "Bandung, Jawa Barat" (slate kecil), "Bantu penuhi gizi anak" (primary kecil); garis pemisah;
  baris "Nominal donasi — Rp100.000", "Biaya layanan — Rp0"; baris "Total donasi" dengan angka 26px bold primary di kanan;
  tombol utama penuh "→ Lanjut Pembayaran"; caption tengah "100% donasi Anda disalurkan untuk kebutuhan panti."
  Nilai pada ringkasan harus mengikuti pilihan nominal dari backend/state yang ada.
- Footer.
```

---

## Prompt 4 — Pembayaran (langkah 2)

```
Ubah tampilan halaman Pembayaran sesuai screenshot. Jangan ubah logika upload bukti, validasi file, atau status donasi.

- Navbar sudah login. Latar --bg-page. H1 "Satu langkah lagi untuk berbagi" + subjudul
  "Transfer sesuai total donasi, lalu unggah bukti pembayaran Anda."
- Stepper: langkah 1 selesai (centang), 2 "Pembayaran" aktif, 3 "Verifikasi" belum.
- Grid 2 kolom (±65% / ±32%).
- Kartu kiri "Transfer bank" (di kanan judul: ikon centang-lingkaran + "Transfer manual", primary kecil bold):
  - kotak border 1px radius 12 padding 16px: kiri tile "BCA" (bg primary-tint, radius 8, teks primary), nomor rekening
    "123 456 7890" (24px bold navy) + "a.n. Yayasan Panti Asuhan Harapan" (slate kecil); kanan tombol outline "Salin" dengan ikon copy.
  - baris bg primary-tint radius 12 padding 14px: kiri "Total yang ditransfer", kanan "Rp100.000" (26px bold primary).
  - baris label: "Bukti transfer" (kiri, 13px) dan "JPG, PNG, PDF • Maks. 5 MB" (kanan, 12px slate).
  - zona upload: border 1.5px dashed primary, bg primary-tint (opacity ringan), radius 12, padding 16px;
    kiri tile ikon file, nama file bold ("bukti-transfer-anisa.png"), baris hijau kecil "✓ 248 KB • Siap dikirim"; kanan link "Ganti file".
    Saat belum ada file, tampilkan teks ajakan unggah dengan gaya sama.
  - tombol utama penuh "➤ Kirim Bukti" (ikon pesawat kertas)
  - caption tengah "Bukti pembayaran akan diverifikasi oleh admin dalam 1 × 24 jam."
- Kolom kanan, 2 kartu bertumpuk (gap 16px):
  - "Detail donasi": "Panti Asuhan Harapan", "Bantu penuhi gizi anak" (slate kecil), garis, lalu 3 baris label-kiri/nilai-kanan:
    "No. donasi — SDT-20261010-018", "Donatur — Anisa Putri", "Total donasi — Rp100.000" (nilai bold navy).
  - "Cara menyelesaikan pembayaran": 3 langkah bernomor (lingkaran 24px bg primary-tint angka primary):
    1 "Transfer ke rekening tujuan sesuai total donasi." 2 "Pastikan bukti transfer menampilkan nominal dan tanggal."
    3 "Kirim bukti dan pantau status di Riwayat Donasi." Lalu link "Butuh bantuan? Hubungi kami →".
- Footer.
```

---

## Prompt 5 — Riwayat Donasi

```
Ubah tampilan halaman Riwayat Donasi sesuai screenshot. Jangan ubah query, filter, atau pagination di backend.

- Navbar sudah login, menu "Riwayat Donasi" aktif. Latar --bg-page. Lebar konten ±1100px (container).
- Header: kiri H1 "Riwayat Donasi" + subjudul "Jejak kebaikan Anda, tercatat dengan transparan. Pantau setiap donasi di sini.";
  kanan tombol utama "+ Donasi Lagi".
- Satu kartu putih besar (radius 12) berisi:
  - Toolbar (padding 16px): kiri input pencarian lebar ±300px (ikon kaca pembesar, placeholder "Cari nama panti atau nomor donasi");
    kanan 2 tombol outline "Semua Status" (ikon chevron) dan "Semua Tanggal" (ikon kalender).
  - Tabel: header baris bg #F3F7FA, teks 12px slate, kolom: Tanggal, Panti, Nominal, Status, Detail.
    Baris: tinggi ±57px, garis pemisah 1px --border.
    Kolom Tanggal: "10 Okt 2026" (14px navy) + nomor donasi di bawahnya (11px slate, mis. "SDT-20261010-018").
    Kolom Panti: nama (14px navy medium) + "Bandung, Jawa Barat" (11px slate).
    Kolom Nominal: bold navy ("Rp100.000"). Kolom Status: badge pill (Menunggu/Berhasil/Gagal sesuai token).
    Kolom Detail: link "Lihat detail →" (primary 13px bold).
  - Footer kartu (padding 16px): kiri "Menampilkan 1–6 dari 18 donasi" (13px slate); kanan pagination.
- Footer halaman.
```

---

## Prompt 6 — Dashboard Admin

```
Ubah tampilan Dashboard Admin sesuai screenshot. Jangan ubah logika verifikasi/tolak donasi,
hak akses admin, atau query data.

Layout: sidebar kiri tetap (lebar ±240px, putih, border-right) + area kanan (bg --bg-page).
- Sidebar: logo SIDOTI di atas (sama seperti navbar); label "RUANG ADMIN" (11px uppercase slate);
  menu dengan ikon + teks: Dashboard (aktif: bg primary-tint, teks primary bold, radius 12), Kelola Donasi, Kelola Panti, Laporan.
  Bagian bawah: kartu bg primary-tint radius 12 padding 16px (ikon headset, "Butuh bantuan?" bold,
  "Tim SIDOTI siap membantu pengelolaan donasi Anda.", link "Hubungi tim →"); di bawahnya item "Keluar" dengan ikon logout.
- Topbar (putih, tinggi ±60px, border-bottom): kiri breadcrumb "Admin / Dashboard" (13px slate);
  kanan ikon lonceng, avatar "AS", "Admin SIDOTI" (bold) dengan "Administrator" di bawahnya (11px slate), chevron.
- Konten (padding 28px):
  - Header: kiri "Selamat pagi, Admin 👋" (32px bold navy) + "Mari pastikan setiap kebaikan sampai kepada yang membutuhkan.";
    kanan tombol outline berikon kalender berisi tanggal hari ini ("10 Oktober 2026").
  - 3 kartu statistik sama lebar (gap 20px): label kecil slate di atas, angka 28px bold navy, teks bantu di bawah,
    ikon dalam kotak 40px bg primary-tint di pojok kanan atas.
    "Total Donasi / Rp128.450.000 / ↑ 12,8% dari bulan lalu" (hijau), "Menunggu Verifikasi / 12 donasi / Segera periksa bukti pembayaran" (amber),
    "Donatur / 1.248 / ↑ 86 donatur baru bulan ini" (hijau).
  - Kartu tabel "Donasi masuk" (subjudul "Periksa bukti transfer sebelum memverifikasi."; kanan tombol outline "Semua Status"):
    kolom Donatur / Tanggal (nama bold + "10 Okt 2026 • 10.24" slate kecil), Panti (nama + kategori slate kecil), Nominal (bold), Status (badge), Tindakan.
    Tindakan untuk status Menunggu: tombol utama kecil "✓ Verifikasi" + tombol "Tolak" (gaya err). Untuk status Berhasil:
    teks muted "✓ Sudah diverifikasi" (ikon centang-lingkaran).
    Footer tabel: "Menampilkan 1–5 dari 248 donasi" + pagination.
```

---

## Prompt koreksi (pakai setelah tiap halaman)

```
Bandingkan hasil halaman ini dengan screenshot Figma terlampir. Perbaiki HANYA selisih berikut
tanpa menyentuh file lain atau backend:
- [elemen]: sekarang [nilai/kondisi sekarang], seharusnya [nilai yang benar]
- ...
Sebutkan file yang kamu ubah.
```

## Halaman yang belum ada desainnya
"Info Panti", "Laporan", detail panti, dan "Daftar" (kalau beda dari tab Daftar) belum ada di Figma.
Minta Kiro memakai komponen dan token yang sama persis (navbar, kartu, badge, tabel, tombol) supaya tampilannya konsisten dengan 6 halaman di atas.
