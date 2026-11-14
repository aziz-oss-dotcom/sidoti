-- =====================================================
-- SIDOTI - Row Level Security (urutan ketiga)
-- =====================================================
-- Jalankan setelah 01_schema.sql dan 02_functions.sql.
-- Mengatur siapa boleh baca/tulis di tiap tabel.
-- =====================================================

-- Aktifkan RLS di semua tabel
alter table public.donatur    enable row level security;
alter table public.admin      enable row level security;
alter table public.panti      enable row level security;
alter table public.donasi     enable row level security;
alter table public.pembayaran enable row level security;
alter table public.laporan    enable row level security;

-- =====================================================
-- donatur
-- - User hanya melihat/mengubah datanya sendiri
-- - Admin bisa melihat semua
-- =====================================================
drop policy if exists "donatur_select_self_or_admin" on public.donatur;
create policy "donatur_select_self_or_admin"
  on public.donatur for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "donatur_update_self" on public.donatur;
create policy "donatur_update_self"
  on public.donatur for update
  using (auth.uid() = id);

-- =====================================================
-- admin (hanya admin yang bisa akses)
-- =====================================================
drop policy if exists "admin_all_admin" on public.admin;
create policy "admin_all_admin"
  on public.admin for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================
-- panti
-- - Dibaca semua orang (publik)
-- - Hanya admin yang menambah/mengubah/menghapus
-- =====================================================
drop policy if exists "panti_select_all" on public.panti;
create policy "panti_select_all"
  on public.panti for select
  using (true);

drop policy if exists "panti_modify_admin" on public.panti;
create policy "panti_modify_admin"
  on public.panti for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================
-- donasi
-- - Donatur melihat donasi miliknya
-- - Donatur membuat donasi (status awal 'menunggu')
-- - Hanya admin mengubah status
-- =====================================================
drop policy if exists "donasi_select_self_or_admin" on public.donasi;
create policy "donasi_select_self_or_admin"
  on public.donasi for select
  using (auth.uid() = id_donatur or public.is_admin());

drop policy if exists "donasi_insert_self" on public.donasi;
create policy "donasi_insert_self"
  on public.donasi for insert
  with check (auth.uid() = id_donatur);

drop policy if exists "donasi_update_admin" on public.donasi;
create policy "donasi_update_admin"
  on public.donasi for update
  using (public.is_admin());

-- =====================================================
-- pembayaran
-- - Donatur melihat/membuat pembayaran untuk donasinya
-- - Hanya admin mengubah status
-- =====================================================
drop policy if exists "pembayaran_select_self_or_admin" on public.pembayaran;
create policy "pembayaran_select_self_or_admin"
  on public.pembayaran for select
  using (
    exists (
      select 1 from public.donasi d
      where d.id = pembayaran.id_donasi
        and (d.id_donatur = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "pembayaran_insert_self" on public.pembayaran;
create policy "pembayaran_insert_self"
  on public.pembayaran for insert
  with check (
    exists (
      select 1 from public.donasi d
      where d.id = pembayaran.id_donasi and d.id_donatur = auth.uid()
    )
  );

drop policy if exists "pembayaran_update_self_or_admin" on public.pembayaran;
create policy "pembayaran_update_self_or_admin"
  on public.pembayaran for update
  using (
    exists (
      select 1 from public.donasi d
      where d.id = pembayaran.id_donasi
        and (d.id_donatur = auth.uid() or public.is_admin())
    )
  );
-- Catatan: kolom `status` tetap hanya boleh diubah admin, dijaga oleh
-- trigger protect_pembayaran_status (lihat 05_guards.sql).

-- =====================================================
-- laporan
-- - Laporan terpublikasi dibaca semua orang
-- - Semua kelola laporan hanya admin
-- =====================================================
drop policy if exists "laporan_select_published_or_admin" on public.laporan;
create policy "laporan_select_published_or_admin"
  on public.laporan for select
  using (dipublikasi = true or public.is_admin());

drop policy if exists "laporan_modify_admin" on public.laporan;
create policy "laporan_modify_admin"
  on public.laporan for all
  using (public.is_admin())
  with check (public.is_admin());
