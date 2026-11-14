-- =====================================================
-- SIDOTI - Fix pembayaran existing (opsional, untuk cleanup data lama)
-- =====================================================
-- Jalankan file ini jika ada donasi yang belum punya record pembayaran.
-- Ini untuk cleanup data yang dibuat sebelum kode `donasi.js` auto-create pembayaran.
-- =====================================================

-- =====================================================
-- STEP 1: Buat pembayaran untuk donasi yang belum punya pembayaran
-- =====================================================
insert into public.pembayaran (id_donasi, metode, status)
select d.id, 'transfer_bank', 'pending'
from public.donasi d
where not exists (
  select 1 from public.pembayaran p where p.id_donasi = d.id
);

-- Verifikasi: lihat berapa banyak pembayaran yang sudah dibuat
-- Jalankan query ini untuk cek:
-- select id, id_donasi, status, bukti, created_at from public.pembayaran order by created_at desc;

-- =====================================================
-- STEP 2 (Opsional): Set status pembayaran menjadi 'pending' jika masih NULL
-- =====================================================
-- Uncomment jika ada pembayaran yang status-nya masih NULL
-- update public.pembayaran
-- set status = 'pending'
-- where status is null;
