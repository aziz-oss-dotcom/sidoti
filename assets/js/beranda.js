// =====================================================
// SIDOTI - Halaman Beranda
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();
  loadStats();
  loadPantiPreview();
});

// Statistik publik (memakai RPC ringkasan_publik)
async function loadStats() {
  if (!window.sb) return;
  try {
    const { data, error } = await window.sb.rpc('ringkasan_publik');
    if (error) throw error;
    if (data && data.length) {
      const r = data[0];
      document.getElementById('stat-total').textContent = formatRupiah(r.total_donasi);
      document.getElementById('stat-donatur').textContent = Number(r.jumlah_donatur).toLocaleString('id-ID');
      document.getElementById('stat-panti').textContent = Number(r.jumlah_panti).toLocaleString('id-ID');
    }
  } catch (err) {
    console.error('[Beranda] Gagal memuat statistik:', err);
  }
}

// Pratinjau beberapa panti untuk Beranda
async function loadPantiPreview() {
  const list = document.getElementById('panti-list');
  if (!window.sb) {
    list.innerHTML = '<p class="text-muted">Klien Supabase belum siap.</p>';
    return;
  }
  try {
    const { data, error } = await window.sb
      .from('panti')
      .select('id, nama_panti, deskripsi, kota, kategori, target_dana, foto')
      .order('created_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    if (!data || !data.length) {
      list.innerHTML = '<p class="text-muted">Belum ada panti yang terdaftar.</p>';
      return;
    }

    list.innerHTML = '';
    for (const p of data) {
      const terkumpul = await hitungTerkumpul(p.id);
      const persen = p.target_dana > 0 ? Math.min(100, (terkumpul / p.target_dana) * 100) : 0;
      
      // Render kartu panti sesuai design system
      const card = document.createElement('div');
      card.className = 'card';
      card.style.overflow = 'hidden';
      card.innerHTML = `
        <!-- Banner gambar -->
        <div style="
          height: 160px;
          background: linear-gradient(135deg, #E8F0F8 0%, #D4E3F7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: -20px -24px 16px -24px;
          font-size: 48px;
        ">
          ${p.foto 
            ? `<img src="${escapeHtml(p.foto)}" alt="${escapeHtml(p.nama_panti)}" style="width: 100%; height: 100%; object-fit: cover;" />`
            : '<span>🏛️</span>'}
        </div>

        <!-- Kategori pill -->
        <div style="font-size: 11px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
          ${escapeHtml(p.kategori || 'Panti Asuhan')}
        </div>

        <!-- Judul panti -->
        <h3 class="card-title">${escapeHtml(p.nama_panti)}</h3>

        <!-- Lokasi -->
        <div style="font-size: 13px; color: var(--slate-light); margin-bottom: 16px;">
          ${escapeHtml(p.kota || '-')}, Indonesia
        </div>

        <!-- Progress bar -->
        <div style="margin-bottom: 12px;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${persen}%"></div>
          </div>
        </div>

        <!-- Terkumpul & target -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
        ">
          <div style="font-weight: 700; color: var(--primary); font-size: 14px;">
            ${formatRupiah(terkumpul)}
          </div>
          <div style="font-size: 13px; color: var(--slate-light);">
            dari ${formatRupiah(p.target_dana)}
          </div>
        </div>

        <!-- Tombol donasi -->
        <a href="/donasi.html?panti=${p.id}" class="btn btn-primary lg">→ Donasi</a>
      `;
      list.appendChild(card);
    }
  } catch (err) {
    console.error('[Beranda] Gagal memuat panti:', err);
    list.innerHTML = '<p class="text-muted">Gagal memuat data panti.</p>';
  }
}

async function hitungTerkumpul(pantiId) {
  try {
    const { data } = await window.sb.rpc('panti_terkumpul', { p_panti_id: pantiId });
    return Number(data) || 0;
  } catch {
    return 0;
  }
}
