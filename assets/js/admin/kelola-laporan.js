// =====================================================
// SIDOTI - Kelola Laporan (Admin)
// =====================================================
let daftarLaporan = [];

document.addEventListener('DOMContentLoaded', async () => {
  await initAdminPage(async () => {
    bindForm();
    await loadLaporan();
  });
});

function showAlert(type, msg) {
  document.getElementById('alert-box').innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}

function bindForm() {
  document.getElementById('btn-tambah').addEventListener('click', bukaFormTambah);
  document.getElementById('btn-batal').addEventListener('click', tutupForm);
  document.getElementById('form-laporan').addEventListener('submit', onSubmitLaporan);
}

async function loadLaporan() {
  const body = document.getElementById('lap-body');
  try {
    const { data, error } = await window.sb
      .from('laporan')
      .select('id, periode, total_donasi, rincian_penggunaan, dipublikasi, tanggal_publikasi, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    daftarLaporan = data || [];
    renderTabel();
  } catch (err) {
    console.error('[KelolaLaporan] Gagal memuat:', err);
    body.innerHTML = `<tr><td colspan="5"><p class="muted">Gagal memuat: ${escapeHtml(err.message)}</p></td></tr>`;
  }
}

function renderTabel() {
  const body = document.getElementById('lap-body');
  if (!daftarLaporan.length) {
    body.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="emoji">📄</div><p>Belum ada laporan. Klik "Buat Laporan".</p></div></td></tr>';
    return;
  }
  body.innerHTML = daftarLaporan.map(l => `<tr>
    <td><strong>${escapeHtml(l.periode)}</strong></td>
    <td>${formatRupiah(l.total_donasi)}</td>
    <td>${l.dipublikasi
      ? '<span class="badge badge-success">Terpublikasi</span>'
      : '<span class="badge badge-muted">Draft</span>'}</td>
    <td>${l.dipublikasi ? formatTanggal(l.tanggal_publikasi) : '-'}</td>
    <td>
      <button class="btn btn-outline btn-sm" onclick="editLaporan(${l.id})">Edit</button>
      ${l.dipublikasi
        ? `<button class="btn btn-ghost btn-sm" onclick="togglePublish(${l.id}, false)">Sembunyikan</button>`
        : `<button class="btn btn-success btn-sm" onclick="togglePublish(${l.id}, true)">Publikasikan</button>`}
      <button class="btn btn-danger btn-sm" onclick="hapusLaporan(${l.id})">Hapus</button>
    </td>
  </tr>`).join('');
}

function bukaFormTambah() {
  document.getElementById('form-title').textContent = 'Buat Laporan Baru';
  document.getElementById('form-laporan').reset();
  document.getElementById('lap-id').value = '';
  // Default periode: bulan-tahun sekarang
  const now = new Date();
  document.getElementById('periode').value = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  document.getElementById('form-card').style.display = 'block';
  document.getElementById('btn-simpan').textContent = 'Simpan';
  document.getElementById('form-card').scrollIntoView({ behavior: 'smooth' });
}

function tutupForm() {
  document.getElementById('form-card').style.display = 'none';
}

function editLaporan(id) {
  const l = daftarLaporan.find(x => x.id === id);
  if (!l) return;
  document.getElementById('form-title').textContent = 'Edit Laporan';
  document.getElementById('lap-id').value = l.id;
  document.getElementById('periode').value = l.periode || '';
  document.getElementById('total_donasi').value = l.total_donasi || 0;
  document.getElementById('rincian').value = l.rincian_penggunaan || '';
  document.getElementById('form-card').style.display = 'block';
  document.getElementById('btn-simpan').textContent = 'Perbarui';
  document.getElementById('form-card').scrollIntoView({ behavior: 'smooth' });
}

async function togglePublish(id, publish) {
  try {
    const payload = { dipublikasi: publish };
    if (publish) payload.tanggal_publikasi = new Date().toISOString();
    else payload.tanggal_publikasi = null;
    const { error } = await window.sb.from('laporan').update(payload).eq('id', id);
    if (error) throw error;
    showAlert('success', publish ? 'Laporan dipublikasikan.' : 'Laporan disembunyikan.');
    await loadLaporan();
  } catch (err) {
    showAlert('error', 'Gagal: ' + err.message);
  }
}

async function hapusLaporan(id) {
  if (!confirm('Yakin menghapus laporan ini?')) return;
  try {
    const { error } = await window.sb.from('laporan').delete().eq('id', id);
    if (error) throw error;
    showAlert('success', 'Laporan dihapus.');
    await loadLaporan();
  } catch (err) {
    showAlert('error', 'Gagal: ' + err.message);
  }
}

async function onSubmitLaporan(e) {
  e.preventDefault();
  const id = document.getElementById('lap-id').value;
  const payload = {
    periode: document.getElementById('periode').value.trim(),
    total_donasi: Number(document.getElementById('total_donasi').value) || 0,
    rincian_penggunaan: document.getElementById('rincian').value.trim() || null,
  };
  if (!payload.periode) { showAlert('error', 'Periode wajib diisi.'); return; }

  const btn = document.getElementById('btn-simpan');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    let error;
    if (id) {
      // Saat edit, jangan ubah flag dipublikasi/tanggal_publikasi
      ({ error } = await window.sb.from('laporan').update(payload).eq('id', id));
    } else {
      payload.dipublikasi = false; // draft awal
      ({ error } = await window.sb.from('laporan').insert(payload));
    }
    if (error) throw error;
    showAlert('success', id ? 'Laporan diperbarui.' : 'Laporan dibuat sebagai draft.');
    tutupForm();
    await loadLaporan();
  } catch (err) {
    showAlert('error', 'Gagal menyimpan: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Perbarui' : 'Simpan';
  }
}

window.editLaporan = editLaporan;
window.togglePublish = togglePublish;
window.hapusLaporan = hapusLaporan;
