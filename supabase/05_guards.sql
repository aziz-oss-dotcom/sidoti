-- =====================================================
-- SIDOTI - Guard tambahan (urutan kelima, opsional tapi disarankan)
-- =====================================================
-- Menjaga aturan "hanya admin yang mengubah status" pada tabel
-- pembayaran. Donatur boleh mengunggah/mengubah kolom `bukti`,
-- tetapi perubahan kolom `status` oleh non-admin akan dikembalikan
-- ke nilai lama oleh trigger ini.
-- =====================================================

create or replace function public.protect_pembayaran_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if TG_OP = 'UPDATE' and new.status is distinct from old.status then
    -- Jika bukan admin, kembalikan status ke nilai lama.
    if not public.is_admin() then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_pembayaran_status on public.pembayaran;
create trigger trg_protect_pembayaran_status
  before update on public.pembayaran
  for each row execute function public.protect_pembayaran_status();
