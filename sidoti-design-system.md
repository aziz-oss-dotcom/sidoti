---
inclusion: always
---

# SIDOTI — Aturan Desain UI (WAJIB DIIKUTI)

Desain acuan ada di Figma (6 layar). Dokumen ini adalah sumber kebenaran untuk tampilan.
Jangan mengarang warna, font, ukuran, atau spacing di luar yang tertulis di sini.
Aturan utama: **hanya ubah lapisan tampilan** (template/komponen UI, CSS, aset statis).
**Dilarang mengubah** route, controller, model, query database, autentikasi, validasi server, atau logika pembayaran.

> Catatan: angka di bawah adalah perkiraan dari screenshot (frame ~1440px).
> Jika nilai asli dari Figma Dev Mode tersedia, nilai asli menang atas angka di sini.

## 1. Design tokens

```css
:root {
  /* Warna */
  --primary: #3F6FA3;          /* tombol utama, link, angka penting, ikon aktif */
  --primary-hover: #35608F;
  --primary-tint: #E8F0F8;     /* panel info, strip statistik, item aktif sidebar, bg nominal terpilih */
  --navy: #1E2F45;             /* judul (H1/H2), teks tebal */
  --slate: #5B6B80;            /* teks isi, label, subjudul */
  --slate-light: #8A97A8;      /* placeholder, caption kecil */
  --bg-page: #F3F7FA;          /* latar halaman aplikasi (login, form, riwayat, admin) */
  --surface: #FFFFFF;          /* navbar, kartu, footer */
  --border: #E3E8EF;           /* border kartu, input, garis pemisah */
  --track: #E5EAF1;            /* track progress bar, lingkaran step nonaktif */

  /* Status */
  --warn-bg: #FEF3DC;  --warn-text: #B7791F;   /* Menunggu */
  --ok-bg:   #E6F4EC;  --ok-text:   #1E7B4B;   /* Berhasil */
  --err-bg:  #FDE8E8;  --err-text:  #C53030;   /* Gagal / Tolak */

  /* Bentuk */
  --radius-sm: 8px;
  --radius-md: 12px;           /* input, tombol, kartu */
  --radius-lg: 16px;           /* gambar hero */
  --radius-pill: 999px;        /* badge status */
  --shadow-card: 0 1px 3px rgba(16, 24, 40, 0.06);

  /* Layout */
  --container: 1200px;         /* lebar konten, di-center, padding samping 24px */
}
```

Jika proyek memakai Tailwind, petakan token di atas ke `tailwind.config` (colors, borderRadius, boxShadow) — jangan hardcode hex di komponen.

## 2. Tipografi

- Font: **Inter** (fallback: system-ui, sans-serif). Impor dari Google Fonts atau simpan lokal.
- H1 hero: 44px, bold (700), navy, line-height 1.15.
- H1 judul halaman (form, pembayaran, riwayat): 32px, bold, navy.
- H2 section: 22px, bold, navy.
- Judul kartu (mis. "Informasi donasi", "Ringkasan donasi"): 18px, regular/medium (500), navy.
- Teks isi: 14–15px, regular, slate, line-height 1.5.
- Label form & caption: 13px, slate. Teks sangat kecil: 12px.
- Angka besar (total, statistik): 24–28px bold, primary. Total di kartu ringkasan: 26px bold primary.
- Label kategori kecil di kartu panti: 11–12px, bold, primary.
- Eyebrow di hero: 12px, bold, UPPERCASE, letter-spacing 0.04em, primary, dengan ikon hati kecil di kiri.

## 3. Komponen bersama

**Navbar** (putih, tinggi ±80px, border-bottom 1px `--border`, konten dalam container):
- Kiri: logo = kotak 44×44 radius 12 warna `--primary` berisi ikon tangan-memegang-hati putih; di kanannya teks "SIDOTI" (22px, regular, warna primary) dan di bawahnya "Sistem Donasi Panti Asuhan" (10–11px, slate).
- Tengah: menu "Beranda", "Info Panti", "Laporan" (+ "Riwayat Donasi" jika sudah login). 15px, slate, jarak antar menu 32px. Menu aktif: warna primary, medium, garis bawah 2px primary.
- Kanan (belum login): tombol "Masuk" (primary, putih, radius 12, padding 10×24, bold 14px).
- Kanan (sudah login): lingkaran avatar 36px bg `--primary-tint` berisi inisial primary bold (mis. "AP"), nama pengguna ("Anisa Putri"), ikon chevron-down.

**Footer** (putih, border-top 1px, padding 24px): kiri "© 2026 SIDOTI. Bersama, hadirkan lebih banyak kebaikan." (13px slate); kanan link "Kebijakan Privasi" dan "Hubungi Kami" (13px slate, jarak 24px).

**Tombol utama**: bg primary, teks putih bold 14–15px, radius 12, tinggi 44–48px, ikon (panah/centang/kirim) 16px di kiri teks. Hover: `--primary-hover`.
**Tombol sekunder (outline)**: bg putih, border 1px `--border`, teks primary/navy bold, radius 12.
**Tombol Tolak**: bg `--err-bg`, teks `--err-text`, bold, radius 12, tanpa border.

**Kartu**: bg putih, border 1px `--border`, radius 12, shadow `--shadow-card`, padding 20–24px.

**Input & textarea**: tinggi 44px (textarea min 90px), bg putih, border 1px `--border`, radius 12, padding horizontal 14px, teks 14px navy, placeholder `--slate-light`. Ikon di dalam input (amplop, gembok, mata) 16px warna slate-light. Fokus: border primary + ring 3px primary dengan opacity 15%. Label di atas input: 13px slate, jarak 6px.

**Badge status**: pill (radius 999), padding 4×10px, 12px bold, diawali titik bulat kecil. Menunggu = warn, Berhasil = ok, Gagal = err.

**Stepper 3 langkah** (Isi Donasi → Pembayaran → Verifikasi): rata tengah, tiap langkah = lingkaran 28px + label 14px. Aktif: lingkaran primary berisi angka putih, label primary bold. Selesai: lingkaran primary berisi ikon centang putih. Belum: lingkaran `--track` angka slate, label slate. Antar langkah ada garis horizontal 1px `--border`.

**Progress bar**: tinggi 6px, radius pill, track `--track`, isi primary.

**Pagination**: tombol 32×32 radius 8; halaman aktif bg primary teks putih; lainnya teks slate tanpa bg; ikon chevron kiri/kanan di ujung.

**Ikon**: set Lucide (garis tipis 1.5px). Jangan pakai emoji kecuali yang tertulis di desain (👋 di sapaan admin).

## 4. Aturan umum

- Latar halaman aplikasi (login, form donasi, pembayaran, riwayat, admin) = `--bg-page`. Beranda = putih.
- Spasi antar section besar 32–40px; antar elemen dalam kartu 16px.
- Semua sudut membulat sesuai token di atas; tidak ada sudut tajam.
- Responsif: di bawah 768px layout dua kolom menjadi satu kolom, navbar menjadi menu hamburger, tabel menjadi daftar kartu.
- Gunakan aset gambar dari folder `public/images/` (atau folder aset proyek). Jangan membuat ulang logo/foto; jika file belum ada, beri placeholder dan beri tahu saya.
- Teks (copywriting) harus persis seperti di desain, termasuk huruf besar-kecil dan tanda baca.
