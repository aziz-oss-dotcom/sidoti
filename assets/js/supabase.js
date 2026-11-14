// =====================================================
// SIDOTI - Inisialisasi klien Supabase
// =====================================================
// File ini WAJIB dimuat setelah:
//   1. library Supabase JS v2 (via CDN)
//   2. assets/js/config.js
// =====================================================
(function initSupabase() {
  if (typeof window === 'undefined' || !window.supabase) {
    console.error(
      '[SIDOTI] Library Supabase JS belum dimuat. Pastikan tag script CDN berada sebelum supabase.js.'
    );
    return;
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.SIDOTI_CONFIG || {};

  if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR-PROJECT-REF')) {
    console.warn(
      '[SIDOTI] SUPABASE_URL belum dikonfigurasi. Edit assets/js/config.js agar aplikasi berfungsi.'
    );
  }

  try {
    // Inisialisasi klien dan simpan di window.sb (hindari bentrok
    // dengan namespace library `supabase` dari CDN).
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error('[SIDOTI] Gagal membuat klien Supabase:', err);
  }
})();
