-- =====================================================
-- SIDOTI - Fungsi dan Trigger Database (urutan kedua)
-- =====================================================
-- Jalankan setelah 01_schema.sql.
-- =====================================================

-- -----------------------------------------------------
-- handle_new_user: trigger AFTER INSERT pada auth.users
-- Membuat baris donatur otomatis saat akun baru terdaftar
-- (baik email maupun Google OAuth).
-- -----------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.donatur (id, nama, email, auth_provider, foto_profil)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    coalesce(new.raw_user_meta_data->>'provider', 'email'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------
-- is_admin(): cek apakah user yang login ada di tabel admin
-- -----------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin where id = auth.uid()
  );
$$;

-- -----------------------------------------------------
-- ringkasan_publik(): total donasi berhasil, jumlah donatur,
-- dan jumlah panti untuk Beranda.
-- -----------------------------------------------------
create or replace function public.ringkasan_publik()
returns table (
  total_donasi numeric,
  jumlah_donatur bigint,
  jumlah_panti bigint
)
language sql
security definer set search_path = public
as $$
  select
    coalesce(sum(d.nominal) filter (where d.status_bayar = 'berhasil'), 0)::numeric as total_donasi,
    count(distinct d.id_donatur) filter (where d.status_bayar = 'berhasil')::bigint as jumlah_donatur,
    (select count(*)::bigint from public.panti) as jumlah_panti
  from public.donasi d;
$$;

-- -----------------------------------------------------
-- panti_terkumpul(): dana terkumpul per panti (yang berhasil)
-- untuk progress bar di halaman Info Panti.
-- -----------------------------------------------------
create or replace function public.panti_terkumpul(p_panti_id bigint)
returns numeric
language sql
security definer set search_path = public
as $$
  select coalesce(sum(nominal), 0)::numeric
  from public.donasi
  where id_panti = p_panti_id and status_bayar = 'berhasil';
$$;
