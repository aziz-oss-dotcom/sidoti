// =====================================================
// SIDOTI - Modul bersama halaman admin
// =====================================================
// Menyediakan: guard halaman admin, render sidebar, dan helper.
// Setiap halaman admin memanggil initAdminPage(jalankan).
// =====================================================

async function initAdminPage(afterInit) {
  // Wajib admin, alihkan kalau bukan
  const user = await requireAdmin();
  if (!user) return;

  await renderNavbar();
  
  // Setup logout button di sidebar
  const btnLogout = document.getElementById('btn-logout-sidebar');
  if (btnLogout) btnLogout.addEventListener('click', (e) => { e.preventDefault(); logout(); });

  // Tombol logout di navbar juga
  const btnLogoutNav = document.querySelector('button#btn-logout-sidebar') || document.querySelector('header button');
  if (btnLogoutNav) btnLogoutNav.addEventListener('click', (e) => { e.preventDefault(); logout(); });

  // Jalankan callback
  if (typeof afterInit === 'function') await afterInit(user);
}



// Helper: dapatkan semua donasi yang perlu diverifikasi (status menunggu)
async function getDonasiMenunggu() {
  const { data, error } = await window.sb
    .from('donasi')
    .select(`
      id, nominal, status_bayar, tanggal, pesan, anonim,
      donatur: id_donatur (nama, email, no_hp),
      panti: id_panti ( nama_panti ),
      pembayaran: pembayaran ( id, status, bukti, metode )
    `)
    .eq('status_bayar', 'menunggu')
    .order('tanggal', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Helper: ambil semua donasi (untuk statistik / dashboard)
async function getSemuaDonasi() {
  const { data, error } = await window.sb
    .from('donasi')
    .select('id, nominal, status_bayar, tanggal, id_donatur, id_panti')
    .order('tanggal', { ascending: false });
  if (error) throw error;
  return data || [];
}
