-- =====================================================
-- SIDOTI - Skema Database (urutan pertama dijalankan)
-- =====================================================
-- Jalankan file ini di SQL Editor Supabase.
-- Membuat seluruh tabel sesuai rancangan SIDOTI.
-- =====================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------
-- Tabel admin (pengurus panti)
-- id terhubung ke auth.users. Akun admin dibuat manual.
-- -----------------------------------------------------
create table if not exists public.admin (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  email text unique not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------
-- Tabel donatur
-- id terhubung ke auth.users. Baris dibuat otomatis
-- oleh trigger handle_new_user saat pendaftaran.
-- -----------------------------------------------------
create table if not exists public.donatur (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text,
  email text unique,
  no_hp text,
  auth_provider text not null default 'email', -- 'email' atau 'google'
  foto_profil text,
  tanggal_daftar timestamptz not null default now()
);

-- -----------------------------------------------------
-- Tabel panti asuhan
-- -----------------------------------------------------
create table if not exists public.panti (
  id bigint generated always as identity primary key,
  nama_panti text not null,
  deskripsi text,
  kebutuhan text,
  foto text,
  kota text,
  kategori text,
  target_dana numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------
-- Tabel donasi
-- nominal minimal 10.000 (sesuai kebutuhan fungsional)
-- status_bayar: menunggu / berhasil / gagal
-- -----------------------------------------------------
create table if not exists public.donasi (
  id bigint generated always as identity primary key,
  id_donatur uuid references public.donatur(id) on delete set null,
  id_panti bigint not null references public.panti(id) on delete restrict,
  nominal numeric(14,2) not null check (nominal >= 10000),
  pesan text,
  anonim boolean not null default false,
  status_bayar text not null default 'menunggu'
    check (status_bayar in ('menunggu','berhasil','gagal')),
  tanggal timestamptz not null default now()
);

create index if not exists donasi_id_donatur_idx on public.donasi(id_donatur);
create index if not exists donasi_id_panti_idx on public.donasi(id_panti);
create index if not exists donasi_status_idx on public.donasi(status_bayar);

-- -----------------------------------------------------
-- Tabel pembayaran
-- status: pending / verified / rejected
-- bukti: alamat file di Supabase Storage
-- Satu donasi hanya punya satu pembayaran (unique)
-- -----------------------------------------------------
create table if not exists public.pembayaran (
  id bigint generated always as identity primary key,
  id_donasi bigint not null references public.donasi(id) on delete cascade,
  metode text not null default 'transfer_bank',
  id_transaksi_gateway text,
  status text not null default 'pending'
    check (status in ('pending','verified','rejected')),
  bukti text,
  created_at timestamptz not null default now(),
  unique (id_donasi)
);

-- -----------------------------------------------------
-- Tabel laporan keuangan
-- dipublikasi: true -> tampil di halaman Laporan Dana
-- -----------------------------------------------------
create table if not exists public.laporan (
  id bigint generated always as identity primary key,
  periode text not null,
  total_donasi numeric(14,2) not null default 0,
  rincian_penggunaan text,
  dipublikasi boolean not null default false,
  tanggal_publikasi timestamptz,
  created_at timestamptz not null default now()
);
