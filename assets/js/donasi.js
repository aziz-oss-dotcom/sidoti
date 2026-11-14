// =====================================================
// SIDOTI - Halaman Form Donasi
// =====================================================
let daftarPanti = [];
let userSekarang = null;

document.addEventListener('DOMContentLoaded', async () => {
  userSekarang = await requireDonatur();
  if (!userSekarang) return;

  await renderNavbar();
  await isiDataAwalDonatur();
  await loadPantiOptions();
  bindEvents();
});

// Prabil donatur sudah punya data nama/no_hp, otomatis diisi
async function isiDataAwalDonatur() {
  try {
    const { data } = await window.sb
      .from('donatur')
      .select('nama, no_hp')
      .eq('id', userSekarang.id)
      .maybeSingle();
    if (data) {
      if (data.nama) document.getElementById('nama').value = data.nama;
      if (data.no_hp) document.getElementById('no_hp').value = data.no_hp;
    }
  } catch (err) {
    console.error('[Donasi] Gagal mengambil data donatur:', err);
  }
}

// Muat daftar panti ke <select>
async function loadPantiOptions() {
  const sel = document.getElementById('panti');
  try {
    const { data, error } = await window.sb
      .from('panti')
      .select('id, nama_panti, deskripsi, kota, kategori, target_dana')
      .order('nama_panti', { ascending: true });
    if (error) throw error;

    daftarPanti = data || [];
    sel.innerHTML = daftarPanti.length
      ? daftarPanti.map(p => `<option value="${p.id}">${escapeHtml(p.nama_panti)} — ${escapeHtml(p.kota || '-')}</option>`).join('')
      : '<option value="">Belum ada panti</option>';

    // Jika ada param ?panti=, pilih panti itu
    const params = new URLSearchParams(location.search);
    const pantiId = params.get('panti');
    if (pantiId) sel.value = pantiId;

    updateRingkasanPanti();
  } catch (err) {
    console.error('[Donasi] Gagal memuat panti:', err);
    sel.innerHTML = '<option value="">Gagal memuat panti</option>';
  }
}

function bindEvents() {
  // Nominal preset buttons
  document.querySelectorAll('.nominal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const nominal = btn.dataset.nominal;
      
      // Hapus selected dari semua
      document.querySelectorAll('.nominal-btn').forEach(b => b.classList.remove('selected'));
      
      if (nominal === 'custom') {
        // Tampilkan input manual
        document.getElementById('nominal').style.display = 'block';
        document.getElementById('nominal').focus();
      } else {
        // Set nominal & hide input
        document.getElementById('nominal').value = nominal;
        document.getElementById('nominal').style.display = 'none';
        btn.classList.add('selected');
        updateRingkasanNominal();
      }
    });
  });

  document.getElementById('nominal').addEventListener('focus', () => {
    document.querySelectorAll('.nominal-btn').forEach(b => b.classList.remove('selected'));
  });

  document.getElementById('nominal').addEventListener('input', updateRingkasanNominal);
  document.getElementById('panti').addEventListener('change', updateRingkasanPanti);

  document.getElementById('form-donasi').addEventListener('submit', onSubmitDonasi);
}

function updateRingkasanPanti() {
  const id = Number(document.getElementById('panti').value);
  const panti = daftarPanti.find(p => p.id === id);
  const box = document.getElementById('ringkasan-panti');
  
  if (!panti) {
    box.innerHTML = '<p style="color: var(--slate-light); font-size: 13px;">Pilih panti terlebih dahulu</p>';
    return;
  }
  
  // Render panti info dalam ringkasan
  box.innerHTML = `
    <div style="text-align: left;">
      <div style="font-weight: 600; color: var(--navy); font-size: 15px; margin-bottom: 2px;">
        ${escapeHtml(panti.nama_panti)}
      </div>
      <div style="font-size: 12px; color: var(--slate-light); margin-bottom: 8px;">
        ${escapeHtml(panti.kota || '-')}, Jawa Barat
      </div>
      <div style="font-size: 12px; color: var(--primary); font-weight: 600;">
        ${escapeHtml(panti.kategori || 'Panti Asuhan')}
      </div>
    </div>
  `;
  
  // Update progress bar
  hitungTerkumpul(panti.id).then(t => {
    const persen = panti.target_dana > 0 ? Math.min(100, (t / panti.target_dana) * 100) : 0;
    // Progress akan di-update di ringkasan donasi nantinya
  });
}

function updateRingkasanNominal() {
  const n = Number(document.getElementById('nominal').value) || 0;
  const biaya = 0; // Sesuai design spec, biaya layanan = Rp0
  const total = n + biaya;
  
  document.getElementById('ringkasan-nominal').textContent = formatRupiah(n);
  document.getElementById('ringkasan-biaya').textContent = formatRupiah(biaya);
  document.getElementById('ringkasan-total').textContent = formatRupiah(total);
}

async function hitungTerkumpul(pantiId) {
  try {
    const { data } = await window.sb.rpc('panti_terkumpul', { p_panti_id: pantiId });
    return Number(data) || 0;
  } catch {
    return 0;
  }
}

function showAlert(type, msg) {
  document.getElementById('alert-box').innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}
function clearAlert() {
  document.getElementById('alert-box').innerHTML = '';
}

// -----------------------------------------------------
// Submit: simpan donasi + buat baris pembayaran (status pending)
// -----------------------------------------------------
async function onSubmitDonasi(e) {
  e.preventDefault();
  clearAlert();

  const idPanti = Number(document.getElementById('panti').value);
  const nominal = Number(document.getElementById('nominal').value);
  const nama = document.getElementById('nama').value.trim();
  const no_hp = document.getElementById('no_hp').value.trim();
  const pesan = document.getElementById('pesan').value.trim();
  const anonim = document.getElementById('anonim').checked;

  if (!idPanti) { showAlert('error', 'Pilih panti tujuan terlebih dahulu.'); return; }
  if (nominal < 10000) { showAlert('error', 'Nominal minimal Rp10.000.'); return; }
  if (!nama) { showAlert('error', 'Nama lengkap wajib diisi.'); return; }
  if (!no_hp) { showAlert('error', 'No. HP wajib diisi.'); return; }

  const btn = document.getElementById('btn-submit');
  btn.disabled = true; btn.textContent = 'Menyimpan...';

  try {
    // 1. Update profil donatur (nama & no_hp)
    await window.sb.from('donatur')
      .update({ nama, no_hp })
      .eq('id', userSekarang.id);

    // 2. Simpan donasi (status awal menunggu)
    const { data: donasi, error: errDonasi } = await window.sb
      .from('donasi')
      .insert({
        id_donatur: userSekarang.id,
        id_panti: idPanti,
        nominal,
        pesan: pesan || null,
        anonim,
        status_bayar: 'menunggu'
      })
      .select()
      .single();
    if (errDonasi) throw errDonasi;

    // 3. Buat baris pembayaran awal (status pending)
    const { error: errBayar } = await window.sb
      .from('pembayaran')
      .insert({
        id_donasi: donasi.id,
        metode: 'transfer_bank',
        status: 'pending'
      });
    if (errBayar) throw errBayar;

    // 4. Alihkan ke halaman pembayaran
    window.location.href = '/pembayaran.html?id=' + donasi.id;
  } catch (err) {
    console.error('[Donasi] Gagal menyimpan:', err);
    showAlert('error', 'Gagal menyimpan donasi: ' + (err.message || 'kesalahan tidak diketahui'));
  } finally {
    btn.disabled = false; btn.textContent = 'Lanjut ke Pembayaran';
  }
}
