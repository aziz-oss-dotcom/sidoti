// =====================================================
// SIDOTI - Halaman Pembayaran (unggah bukti transfer)
// =====================================================
let donasiId = null;
let donasiData = null;
let pembayaranData = null;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/png', 'application/pdf'];

document.addEventListener('DOMContentLoaded', async () => {
  if (!(await requireDonatur())) return;
  await renderNavbar();

  const params = new URLSearchParams(location.search);
  donasiId = Number(params.get('id'));
  if (!donasiId) { showAlert('error', 'ID donasi tidak ditemukan. Kembali ke form donasi.'); return; }

  await loadDonasi();
  bindFileEvents();
});

function showAlert(type, msg) {
  document.getElementById('alert-box').innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}

async function loadDonasi() {
  const box = document.getElementById('detail-donasi');
  try {
    // Ambil donasi milik user ini (RLS memastikan hanya milik sendiri)
    const { data: don, error: e1 } = await window.sb
      .from('donasi')
      .select('id, nominal, status_bayar, tanggal, pesan, anonim, id_panti, panti: id_panti (nama_panti, kota)')
      .eq('id', donasiId)
      .maybeSingle();
    if (e1) throw e1;
    if (!don) { showAlert('error', 'Donasi tidak ditemukan atau bukan milik Anda.'); box.innerHTML = ''; return; }
    donasiData = don;

    // Ambil baris pembayaran terkait
    const { data: bay, error: e2 } = await window.sb
      .from('pembayaran')
      .select('id, status, bukti, metode')
      .eq('id_donasi', donasiId)
      .maybeSingle();
    if (e2) throw e2;
    pembayaranData = bay;

    renderDetail();
  } catch (err) {
    console.error('[Pembayaran] Gagal memuat:', err);
    showAlert('error', 'Gagal memuat data donasi.');
    box.innerHTML = '';
  }
}

function renderDetail() {
  const d = donasiData;
  const namaPanti = d.panti && d.panti.nama_panti ? d.panti.nama_panti : '-';
  const kota = d.panti && d.panti.kota ? d.panti.kota : '-';
  
  document.getElementById('detail-donasi').innerHTML = `
    <div style="text-align: left;">
      <div style="font-weight: 600; color: var(--navy); font-size: 15px; margin-bottom: 2px;">
        ${escapeHtml(namaPanti)}
      </div>
      <div style="font-size: 12px; color: var(--slate-light); margin-bottom: 8px;">
        ${escapeHtml(kota)}, Jawa Barat
      </div>
      ${d.pesan ? `<div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 8px;">Pesan: ${escapeHtml(d.pesan)}</div>` : ''}
    </div>
  `;

  // Update nomor donasi di bank section
  document.getElementById('payment-nominal').textContent = formatRupiah(d.nominal);
}

function bindFileEvents() {
  const input = document.getElementById('file-bukti');
  if (!input) return;
  
  input.addEventListener('change', (e) => {
    const file = input.files[0];
    if (!file) {
      document.getElementById('file-preview').style.display = 'none';
      document.getElementById('upload-zone').style.display = 'flex';
      return;
    }
    
    // Update preview
    document.getElementById('preview-filename').textContent = file.name;
    document.getElementById('preview-filesize').textContent = (file.size / 1024).toFixed(0) + ' KB • Siap dikirim';
    document.getElementById('file-preview').style.display = 'block';
    document.getElementById('upload-zone').style.display = 'none';
  });
}

async function onUploadBukti(e) {
  e.preventDefault();
  console.log('[Pembayaran] Starting file upload...');
  
  const file = document.getElementById('file-bukti').files[0];
  if (!file) { showAlert('error', 'Pilih file bukti terlebih dahulu.'); return; }
  if (!ALLOWED.includes(file.type)) {
    showAlert('error', 'Format tidak didukung. Gunakan JPG, PNG, atau PDF.'); return;
  }
  if (file.size > MAX_BYTES) {
    showAlert('error', 'Ukuran file melebihi 5 MB.'); return;
  }

  const btn = document.getElementById('btn-upload');
  btn.disabled = true; 
  btn.textContent = 'Mengunggah...';
  
  try {
    console.log('[Pembayaran] File selected:', file.name, file.size, file.type);
    console.log('[Pembayaran] Getting current user...');
    
    const user = await getCurrentUser();
    console.log('[Pembayaran] User ID:', user?.id);
    
    if (!user || !user.id) throw new Error('User tidak teridentifikasi');
    
    const userId = user.id;
    const ext = file.name.split('.').pop();
    const path = `${userId}/${donasiId}/bukti-${Date.now()}.${ext}`;

    console.log('[Pembayaran] Upload path:', path);
    console.log('[Pembayaran] Bucket name:', window.SIDOTI_CONFIG.BUKTI_BUCKET);
    
    // Upload file
    const { error: upErr, data: upData } = await window.sb.storage
      .from(window.SIDOTI_CONFIG.BUKTI_BUCKET)
      .upload(path, file, { upsert: true });
    
    console.log('[Pembayaran] Upload result:', { error: upErr, data: upData });
    if (upErr) throw new Error('Upload gagal: ' + upErr.message);

    console.log('[Pembayaran] Getting public URL...');
    const { data: pub } = window.sb.storage
      .from(window.SIDOTI_CONFIG.BUKTI_BUCKET)
      .getPublicUrl(path);
    
    const publicUrl = pub.publicUrl;
    console.log('[Pembayaran] Public URL:', publicUrl);

    console.log('[Pembayaran] Updating payment record with bukti:', publicUrl);
    const { error: updBukti, data: updData } = await window.sb
      .from('pembayaran')
      .update({ bukti: publicUrl })
      .eq('id_donasi', donasiId);
    
    console.log('[Pembayaran] Update result:', { error: updBukti, data: updData });
    if (updBukti) throw new Error('Update database gagal: ' + updBukti.message);

    showAlert('success', 'Bukti transfer berhasil diunggah. Menunggu verifikasi admin.');
    await loadDonasi();
  } catch (err) {
    console.error('[Pembayaran] Error detail:', err);
    showAlert('error', 'Gagal mengunggah bukti: ' + (err.message || 'kesalahan tidak diketahui'));
  } finally {
    btn.disabled = false;
    btn.textContent = pembayaranData && pembayaranData.bukti ? 'Unggah Ulang Bukti' : 'Kirim Bukti';
  }
}
