// =====================================================
// SIDOTI - Shared Donasi Loader
// Sumber Kebenaran Tunggal untuk Loading Donasi
// Digunakan oleh: dashboard.js, verifikasi.js
// =====================================================

/**
 * Ambil semua donasi dari database Supabase
 * @returns {Promise<Array>} Array donasi dengan pembayaran merged
 */
async function loadDonasiFromDatabase() {
  try {
    console.log('[SharedDonasi] Loading donasi from database...');
    
    // Query 1: Ambil semua donasi
    const { data: donasi, error: e1 } = await window.sb
      .from('donasi')
      .select(`
        id, nominal, status_bayar, tanggal, pesan, anonim, id_donatur, id_panti,
        donatur: id_donatur ( nama, email, no_hp ),
        panti: id_panti ( nama_panti )
      `)
      .order('tanggal', { ascending: false });
    
    if (e1) throw e1;

    // Query 2: Ambil semua pembayaran
    const { data: pembayaranList, error: e2 } = await window.sb
      .from('pembayaran')
      .select('id, id_donasi, status, bukti');
    
    if (e2) throw e2;

    // Build map: id_donasi -> pembayaran
    const pembayaranMap = {};
    (pembayaranList || []).forEach(p => {
      if (p.id_donasi && !pembayaranMap[p.id_donasi]) {
        pembayaranMap[p.id_donasi] = p;
      }
    });

    // Merge: tambah pembayaran ke setiap donasi
    const result = (donasi || []).map(d => ({
      ...d,
      pembayaran: pembayaranMap[d.id] ? [pembayaranMap[d.id]] : []
    }));

    console.log('[SharedDonasi] Loaded', result.length, 'donasi');
    return result;
    
  } catch (err) {
    console.error('[SharedDonasi] Error loading donasi:', err);
    throw err;
  }
}

// Expose ke window agar bisa diakses dari file lain
window.loadDonasiFromDatabase = loadDonasiFromDatabase;
