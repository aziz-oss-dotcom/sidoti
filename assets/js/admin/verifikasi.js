// =====================================================
// SIDOTI - Verifikasi Donasi (Admin)
// =====================================================
let semuaDonasi = [];

document.addEventListener('DOMContentLoaded', async () => {
  await initAdminPage(async () => {
    document.getElementById('filter-status').addEventListener('change', renderTabel);
    await loadDonasi();
  });
});

function showAlert(type, msg) {
  document.getElementById('alert-box').innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}

async function loadDonasi() {
  try {
    console.log('[Verifikasi] Loading donasi...');
    
    // Load dari shared function (same source as dashboard)
    semuaDonasi = await loadDonasiFromDatabase();
    
    console.log('[Verifikasi] Loaded', semuaDonasi.length, 'donasi');
    renderTabel();
  } catch (err) {
    console.error('[Verifikasi] Gagal memuat:', err);
    showAlert('error', 'Gagal memuat donasi: ' + err.message);
  }
}

function renderTabel() {
  const body = document.getElementById('verifikasi-body');
  const status = document.getElementById('filter-status').value;
  let list = semuaDonasi;
  
  console.log('[renderTabel] Start - filter status:', status, 'total semuaDonasi:', semuaDonasi.length);
  
  if (status) list = list.filter(d => d.status_bayar === status);
  
  console.log('[renderTabel] After filter - list length:', list.length, 'list:', list.map(d => ({id: d.id, status: d.status_bayar})));

  if (!list.length) {
    body.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <div class="emoji">✅</div><p>Tidak ada donasi dengan status ini.</p>
    </div></td></tr>`;
    console.log('[renderTabel] Empty list, showing empty-state');
    return;
  }

  body.innerHTML = list.map(d => {
    const donatur = d.donatur || {};
    const namaDonatur = d.anonim ? 'Anonim' : (donatur.nama || '-');
    const panti = d.panti?.nama_panti || '-';
    const bayar = (d.pembayaran && d.pembayaran[0]) || null;
    
    // Debug log
    console.log(`[renderTabel] Rendering donasi #${d.id}:`, {
      status: d.status_bayar,
      donatur: namaDonatur
    });
    
    const buktiCell = bayar && bayar.bukti && bayar.bukti.trim()
      ? `<button class="btn btn-ghost btn-sm" onclick="previewBukti('${escapeHtml(bayar.bukti)}')">Lihat</button>`
      : '<span class="muted">Belum</span>';

    let aksi;
    if (d.status_bayar === 'menunggu') {
      aksi = `
        <button class="btn btn-success btn-sm" onclick="verifikasi(${d.id}, 'berhasil')">Verifikasi</button>
        <button class="btn btn-danger btn-sm" onclick="verifikasi(${d.id}, 'gagal')">Tolak</button>`;
    } else {
      aksi = '<span class="muted">Sudah diproses</span>';
    }
    return `<tr>
      <td>${escapeHtml(namaDonatur)}<br><span class="muted" style="font-size:12px">${escapeHtml(donatur.email || '')}</span></td>
      <td>${formatTanggal(d.tanggal)}</td>
      <td>${escapeHtml(panti)}</td>
      <td><strong>${formatRupiah(d.nominal)}</strong></td>
      <td>${buktiCell}</td>
      <td><span class="badge ${statusBadgeClass(d.status_bayar)}">${d.status_bayar}</span></td>
      <td>${aksi}</td>
    </tr>`;
  }).join('');
  
  console.log('[renderTabel] Done rendering');

// -----------------------------------------------------
// Verifikasi atau tolak donasi
// -----------------------------------------------------
async function verifikasi(donasiId, statusAkhir) {
  console.log('[Verifikasi] START - donasiId:', donasiId, 'statusAkhir:', statusAkhir);
  
  if (!confirm(`Yakin ingin menandai donasi ini sebagai "${statusAkhir}"?`)) {
    console.log('[Verifikasi] User cancelled');
    return;
  }
  try {
    console.log('[Verifikasi] Updating database...');
    
    // 1. Update status donasi
    const { error: e1 } = await window.sb
      .from('donasi')
      .update({ status_bayar: statusAkhir })
      .eq('id', donasiId);
    if (e1) throw e1;
    console.log('[Verifikasi] Database donasi update SUCCESS');

    // 2. Update status pembayaran (verified/rejected)
    const statusBayar = statusAkhir === 'berhasil' ? 'verified' : 'rejected';
    const { error: e2 } = await window.sb
      .from('pembayaran')
      .update({ status: statusBayar })
      .eq('id_donasi', donasiId);
    if (e2) throw e2;
    console.log('[Verifikasi] Database pembayaran update SUCCESS');

    showAlert('success', `Donasi #${donasiId} ditandai sebagai "${statusAkhir}".`);
    
    // Update local data & DOM langsung (instant, tidak perlu refresh)
    const idx = semuaDonasi.findIndex(d => d.id === donasiId);
    console.log('[Verifikasi] Update local - idx:', idx, 'total donasi:', semuaDonasi.length);
    
    if (idx >= 0) {
      console.log('[Verifikasi] Before update:', {
        id: semuaDonasi[idx].id,
        status_bayar_before: semuaDonasi[idx].status_bayar,
        statusAkhir: statusAkhir
      });
      
      semuaDonasi[idx].status_bayar = statusAkhir;
      
      console.log('[Verifikasi] After update:', {
        id: semuaDonasi[idx].id,
        status_bayar_after: semuaDonasi[idx].status_bayar
      });
      
      // Sync pembayaran status juga
      const statusBayar = statusAkhir === 'berhasil' ? 'verified' : 'rejected';
      if (semuaDonasi[idx].pembayaran[0]) {
        semuaDonasi[idx].pembayaran[0].status = statusBayar;
      }
    }
    
    console.log('[Verifikasi] Calling renderTabel()...');
    // Render ulang dengan filter tetap dipertahankan
    renderTabel();
    console.log('[Verifikasi] renderTabel() finished');
    
  } catch (err) {
    console.error('[Verifikasi] CATCH ERROR:', err);
    showAlert('error', 'Gagal memperbarui status: ' + err.message);
  }
}

// Expose untuk onclick inline
window.verifikasi = verifikasi;

// Global untuk store bukti URL
let currentBuktiUrl = null;

// Preview bukti transfer
function previewBukti(url) {
  const modal = document.getElementById('modal-bukti');
  const filename = document.getElementById('modal-bukti-filename');
  
  // Extract filename dari URL
  const urlObj = new URL(url, window.location.origin);
  const parts = urlObj.pathname.split('/');
  const name = parts[parts.length - 1] || 'bukti_transfer';
  
  filename.textContent = decodeURIComponent(name);
  currentBuktiUrl = url;
  modal.style.display = 'flex';
  
  // Close when clicking outside
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
}

// Download bukti
function downloadBukti() {
  if (!currentBuktiUrl) {
    alert('URL file tidak ditemukan');
    return;
  }
  
  try {
    // Buat temporary link dan trigger download
    const link = document.createElement('a');
    link.href = currentBuktiUrl;
    link.download = 'bukti_transfer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Download error:', err);
    alert('Gagal download: ' + err.message);
  }
}

window.previewBukti = previewBukti;
window.downloadBukti = downloadBukti;
