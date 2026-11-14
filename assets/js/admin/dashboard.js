// =====================================================
// SIDOTI - Dashboard Admin
// =====================================================
console.log('[Dashboard.js] Loaded');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Check login
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = '/admin/login.html';
      return;
    }
    
    // 2. Render navbar
    await renderNavbar();
    
    // 3. Set welcome message (jika element ada)
    const welcomeEl = document.getElementById('welcome');
    if (welcomeEl) {
      welcomeEl.textContent = 'Halo, ' + (user.email || 'Admin');
    }
    
    // 4. Setup logout
    const btnLogout = document.getElementById('btn-logout-sidebar');
    if (btnLogout) {
      btnLogout.onclick = () => logout();
    }
    
    // 5. Load data
    await loadStats();
    await loadRecent();
    
  } catch (err) {
    console.error('[Dashboard Error]', err);
  }
});

async function loadStats() {
  try {
    console.log('[loadStats] Start - computing from database');
    
    // Load donasi dari database (same source as tabel Donasi Masuk)
    const allDonasi = await loadDonasiFromDatabase();
    
    // 1. Hitung: Menunggu Verifikasi
    const menunggunya = allDonasi.filter(d => d.status_bayar === 'menunggu').length;
    const elMasuk = document.getElementById('stat-masuk');
    if (elMasuk) elMasuk.textContent = menunggunya;
    
    // 2. Hitung: Total Donasi (hanya status "berhasil")
    const totalDonasi = allDonasi
      .filter(d => d.status_bayar === 'berhasil')
      .reduce((sum, d) => sum + (d.nominal || 0), 0);
    const elTotal = document.getElementById('stat-total');
    if (elTotal) elTotal.textContent = 'Rp' + totalDonasi.toLocaleString('id-ID');
    
    // 3. Hitung: Donatur unik (jangan hitung anonim per donasi)
    const donaturs = new Set();
    allDonasi.forEach(d => {
      if (!d.anonim && d.id_donatur) {
        donaturs.add(d.id_donatur);
      }
    });
    const totalDonatr = donaturs.size;
    const elDonatur = document.getElementById('stat-donatur');
    if (elDonatur) elDonatur.textContent = totalDonatr;
    
    console.log('[loadStats] Done:', {
      menunggu: menunggunya,
      totalDonasi,
      donatur: totalDonatr,
      dataBanyak: allDonasi.length
    });
    
  } catch (err) {
    console.error('[loadStats] Gagal hitung stats:', err);
    // Fallback: jangan ubah nilai jika error
  }
}

async function loadRecent() {
  try {
    console.log('[loadRecent] Start');
    
    const body = document.getElementById('recent-body');
    if (!body) {
      console.error('[loadRecent] Element recent-body not found');
      return;
    }
    
    // Load dari database (shared function) - bukan hardcoded
    const allData = await loadDonasiFromDatabase();
    
    // Transform ke format dashboard
    const dashboardData = allData.map(d => ({
      id: d.id,
      tanggal: formatTanggal(d.tanggal),
      donatur: d.anonim ? 'Anonim' : (d.donatur?.nama || '-'),
      panti: d.panti?.nama_panti || '-',
      nominal: d.nominal,
      status: d.status_bayar,
      pembayaran: d.pembayaran
    }));
    
    // Simpan ke window untuk pakai di filter
    window.recentDonasiData = dashboardData;
    
    // Render dengan filter kosong (semua status)
    filterAndRenderRecent('');
    
    console.log('[loadRecent] Done - loaded', dashboardData.length, 'donasi');
    
  } catch (err) {
    console.error('[loadRecent] Exception:', err);
    const body = document.getElementById('recent-body');
    if (body) {
      body.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">Error: ' + err.message + '</td></tr>';
    }
  }
}

// Handle dropdown filter change
function handleDashboardFilter() {
  const status = document.getElementById('dashboard-filter-status').value;
  filterAndRenderRecent(status);
}

// Filter dan render data
function filterAndRenderRecent(statusFilter) {
  const allData = window.recentDonasiData || [];
  let filteredData = allData;
  
  if (statusFilter) {
    filteredData = allData.filter(d => d.status === statusFilter);
  }
  
  const body = document.getElementById('recent-body');
  
  if (!filteredData.length) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--slate-light);font-size:13px;">Tidak ada donasi dengan status ini.</td></tr>`;
    const paginationEl = document.getElementById('pagination-text');
    if (paginationEl) {
      paginationEl.textContent = 'Tidak ada donasi';
    }
    return;
  }
  
  const html = filteredData.map(d => {
    const badgeClass = {
      'menunggu': 'badge-warning',
      'berhasil': 'badge-success',
      'gagal': 'badge-danger'
    }[d.status] || 'badge-muted';
    
    const tindakan = d.status === 'menunggu' 
      ? `<a href="/admin/verifikasi.html" class="btn btn-primary btn-sm" style="padding: 6px 12px; font-size: 12px;">Periksa</a>`
      : `<span class="muted">Sudah diproses</span>`;
    
    return `<tr>
      <td>${d.tanggal}</td>
      <td>${d.donatur}</td>
      <td>${d.panti}</td>
      <td><strong>Rp${d.nominal.toLocaleString('id-ID')}</strong></td>
      <td><span class="badge ${badgeClass}">${d.status}</span></td>
      <td>${tindakan}</td>
    </tr>`;
  }).join('');
  
  body.innerHTML = html;
  
  // Update pagination
  const paginationEl = document.getElementById('pagination-text');
  if (paginationEl) {
    paginationEl.textContent = `Menampilkan 1-${filteredData.length} dari ${filteredData.length} donasi`;
  }
}

// Expose untuk onclick
window.handleDashboardFilter = handleDashboardFilter;
