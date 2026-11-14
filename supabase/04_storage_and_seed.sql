-- =====================================================
-- SIDOTI - Storage bucket dan data contoh (urutan keempat, opsional)
-- =====================================================
-- Jalankan setelah 01-03. Membuat bucket Storage untuk bukti
-- transfer dan mengisi data contoh untuk pengembangan.
-- =====================================================

-- -----------------------------------------------------
-- Bucket Storage untuk bukti transfer
-- -----------------------------------------------------
insert into storage.buckets (id, name, public)
values ('bukti-transfer', 'bukti-transfer', true)
on conflict (id) do nothing;

-- Policy bucket: donatur hanya bisa unggah file di folder miliknya,
-- semua orang bisa melihat (public), hanya admin hapus.
drop policy if exists "bukti_select_all" on storage.objects;
create policy "bukti_select_all"
  on storage.objects for select
  using (bucket_id = 'bukti-transfer');

drop policy if exists "bukti_insert_self" on storage.objects;
create policy "bukti_insert_self"
  on storage.objects for insert
  with check (
    bucket_id = 'bukti-transfer'
    and (auth.uid() = nullif(split_part(name, '/', 1), '')::uuid or public.is_admin())
  );

drop policy if exists "bukti_delete_admin" on storage.objects;
create policy "bukti_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'bukti-transfer' and public.is_admin());

-- -----------------------------------------------------
-- Data contoh: panti
-- -----------------------------------------------------
insert into public.panti (nama_panti, deskripsi, kebutuhan, kota, kategori, target_dana)
values
  ('Panti Asuhan Harapan',
   'Panti asuhan yang menampung 30 anak yatim piatu, menyediakan tempat tinggal, pendidikan, dan kebutuhan harian.',
   'Beras, minyak goreng, buku pelajaran, perlengkapan sekolah',
   'Bandung', 'Anak yatim', 50000000),
  ('Panti Asuhan Cahaya',
   'Panti asuhan dengan 20 anak yang membutuhkan dukungan untuk pendidikan formal dan nonformal.',
   'Biaya sekolah, seragam, sepatu, alat tulis',
   'Surabaya', 'Pendidikan', 30000000),
  ('Panti Asuhan Asa',
   'Rumah singgah bagi anak-anak kurang mampu dengan fokus kesehatan dan gizi.',
   'Sus, vitamin, obat-obatan, alat kesehatan',
   'Yogyakarta', 'Kesehatan', 25000000)
on conflict do nothing;

-- -----------------------------------------------------
-- Petunjuk membuat admin manual
-- -----------------------------------------------------
-- 1. Buka Supabase Dashboard > Authentication > Users > Add user.
--    Isi email dan password (nonaktifkan "Auto Confirm User" jika perlu
--    konfirmasi email; aktifkan jika ingin langsung pakai).
-- 2. Salin UUID user tersebut, lalu jalankan:
--
--    insert into public.admin (id, nama, email)
--    values ('UUID-USER-DI-SINI', 'Nama Admin', 'email@admin.com');
--
-- Setelah itu user bisa login lewat /admin/login dan diakui sebagai admin.
