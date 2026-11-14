# SIDOTI — Sistem Donasi Panti Asuhan

Aplikasi web untuk mengelola donasi panti asuhan: donatur berdonasi secara daring
(transfer bank + unggah bukti), pengurus panti (admin) memverifikasi dan
mempublikasikan laporan penggunaan dana secara transparan.

Proyek kuliah Rekayasa Perangkat Lunak — Kelompok 11, Kelas TI B.

---

## Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | HTML, CSS, JavaScript (vanilla, tanpa framework) |
| Backend-as-a-service | Supabase (PostgreSQL, Auth, Storage) |
| Autentikasi | Supabase Auth (email/password + Google OAuth) |
| Penyimpanan file | Supabase Storage (bukti transfer) |
| Hosting | Netlify (gratis) |

Tidak ada server buatan sendiri. Seluruh logika penting ditangani Supabase:
tabel, Row Level Security (RLS), fungsi, dan trigger.

---

## Struktur Proyek

```
.
├─ index.html                # Beranda
├─ login.html                # Login/Registrasi donatur (email & Google)
├─ panti.html                # Info Panti (publik)
├─ laporan.html              # Laporan Dana (publik)
├─ donasi.html               # Form Donasi (donatur)
├─ pembayaran.html           # Pembayaran & unggah bukti (donatur)
├─ riwayat.html              # Riwayat Donasi (donatur)
├─ admin/
│  ├─ login.html             # Login admin (terpisah)
│  ├─ index.html             # Dashboard admin
│  ├─ donasi.html            # Verifikasi donasi
│  ├─ panti.html             # Kelola panti (CRUD)
│  └─ laporan.html           # Kelola laporan (buat/publikasi)
├─ assets/
│  ├─ css/style.css          # Styling bersama
│  └─ js/
│     ├─ config.js           # ⚠️ Konfigurasi Supabase (edit di sini)
│     ├─ supabase.js         # Inisialisasi klien Supabase
│     ├─ auth.js             # Helper autentikasi & util
│     ├─ beranda.js, login.js, donasi.js, pembayaran.js, riwayat.js,
│     │  panti.js, laporan.js
│     ├─ admin.js            # Guard & sidebar admin
│     └─ admin/              # login.js, dashboard.js, verifikasi.js,
│                            #   kelola-panti.js, kelola-laporan.js
├─ supabase/
│  ├─ 01_schema.sql          # Tabel
│  ├─ 02_functions.sql       # Fungsi & trigger
│  ├─ 03_policies.sql        # Row Level Security
│  ├─ 04_storage_and_seed.sql # Bucket Storage + data contoh
│  └─ 05_guards.sql          # Guard: status pembayaran hanya ubah admin
├─ netlify.toml              # Routing & redirect
└─ Ringkasan_Perancangan_SIDOTI.md  # Dokumen rancangan
```

---

## Setup (Langkah demi Langkah)

### 1. Buat proyek Supabase
1. Daftar/buka [supabase.com](https://supabase.com) lalu buat **New Project**.
2. Catat **Project URL** dan **anon public key** (di Project Settings → API).

### 2. Jalankan skrip SQL
Buka **SQL Editor** di dashboard Supabase lalu jalankan file `supabase/` **berurutan**:
1. `01_schema.sql` — membuat tabel
2. `02_functions.sql` — fungsi `handle_new_user`, `is_admin`, `ringkasan_publik`, `panti_terkumpul`
3. `03_policies.sql` — Row Level Security
4. `04_storage_and_seed.sql` — bucket Storage `bukti-transfer` + data contoh panti (opsional)
5. `05_guards.sql` — guard status pembayaran (disarankan dijalankan)

### 3. Aktifkan Google OAuth (opsional)
Project Settings → Authentication → Providers → Google.
Isi Client ID & Secret dari Google Cloud Console, dan set Redirect URL
yang ditampilkan Supabase. Tanpa ini, login email tetap jalan.

### 4. Konfigurasi frontend
Edit `assets/js/config.js`, ganti placeholder:
```js
const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-PUBLIC-ANON-KEY';
```

### 5. Buat akun admin (manual)
Admin **tidak** dibuat lewat pendaftaran/Google, agar tidak sembarang orang jadi admin:
1. Supabase Dashboard → **Authentication → Users → Add user**.
   Isi email & password (aktifkan "Auto Confirm User" jika ingin langsung pakai).
2. Salin **UUID** user tersebut.
3. Jalankan di SQL Editor:
   ```sql
   insert into public.admin (id, nama, email)
   values ('UUID-USER', 'Nama Admin', 'email@admin.com');
   ```
Setelah itu admin bisa login di `/admin/login.html`.

### 5b. Fix data pembayaran lama (jika ada)
Jika sudah ada donasi/pembayaran yang dibuat sebelum fix bug upload bukti,
jalankan di SQL Editor untuk set status pembayaran NULL menjadi 'pending':
```sql
update public.pembayaran
set status = 'pending'
where status is null;
```
Ini ensure semua pembayaran yang sudah ada status-nya jadi 'pending',
jadi admin bisa verifikasi dengan benar.

### 6. Jalankan secara lokal
Karena memakai modul/URL absolut (`/assets/...`), buka lewat server lokal,
**bukan** langsung klik file:
```powershell
# Pakai Python (kalau terpasang)
python -m http.server 5500
# lalu buka http://localhost:5500
```
Atau pakai ekstensi "Live Server" di VS Code.

### 7. Deploy ke Netlify
1. Push repo ke Git (GitHub/GitLab) atau tarik folder langsung.
2. Netlify → **Add new site**:
   - Build command: (kosong)
   - Publish directory: `.`
3. Setelah deploy, tambahkan domain Supabase ke **Authentication → URL Configuration**
   (Site URL & Redirect URLs) supaya login Google bisa kembali ke situs Anda.

---

## Alur Singkat

**Donatur:** Daftar/Login → lihat panti → pilih nominal & isi data → transfer bank →
unggah bukti → status "Menunggu" → admin verifikasi → "Berhasil"/"Gagal" → lihat laporan.

**Admin:** Login di `/admin/login.html` → dashboard → verifikasi donasi,
kelola panti (CRUD), buat & publikasikan laporan.

---

## Catatan Keamanan
- Password di-hash oleh Supabase Auth.
- Row Level Security aktif di semua tabel:
  - Donatur hanya akses datanya sendiri.
  - Panti & laporan terpublikasi bisa dibaca semua orang.
  - Verifikasi donasi & kelola panti/laporan hanya admin.
- Akun admin dibuat manual (lihat langkah 5).
- Bukti transfer disimpan di Storage publik dengan policy: donatur unggah miliknya,
  semua orang lihat, hanya admin hapus.

---

## Rencana Pengujian
Lihat 20 test case Black Box di `Ringkasan_Perancangan_SIDOTI.md` bagian 7.



TEST doang ini, TETAPI HARI INI SY KATAKAN SAYA AKAN LAWAN!!