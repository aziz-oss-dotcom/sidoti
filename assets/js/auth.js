// Ambil user yang sedang login (atau null bila belum login)
async function getCurrentUser() {
  if (!window.sb) return null;
  try {
    const { data: { user } } = await window.sb.auth.getUser();
    return user || null;
  } catch (err) {
    console.error('[SIDOTI] Gagal mengambil user:', err);
    return null;
  }
}

// Ambil profil donatur dari tabel `donatur` untuk user yang login
async function getCurrentDonatur() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await window.sb
    .from('donatur')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) {
    console.error('[SIDOTI] Gagal mengambil profil donatur:', error);
    return null;
  }
  return data;
}

// Wajib login donatur. Alihkan ke /login bila belum.
async function requireDonatur() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/login.html?redirect=' +
      encodeURIComponent(window.location.pathname + window.location.search);
    return null;
  }
  return user;
}

// Wajib admin. Alihkan bila bukan admin.
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/admin/login.html';
    return null;
  }
  const { data, error } = await window.sb.rpc('is_admin');
  if (error || !data) {
    alert('Akses ditolak. Halaman ini hanya untuk admin.');
    window.location.href = '/';
    return null;
  }
  return user;
}

// Logout dan kembali ke beranda
async function logout() {
  if (!window.sb) {
    window.location.href = '/';
    return;
  }
  try {
    await window.sb.auth.signOut();
  } catch (err) {
    console.error('[SIDOTI] Gagal logout:', err);
  }
  window.location.href = '/';
}

// =====================================================
// Util format
// =====================================================
function formatRupiah(num) {
  const n = Number(num) || 0;
  return 'Rp' + n.toLocaleString('id-ID');
}

function formatTanggal(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (e) {
    return iso;
  }
}

function formatTanggalWaktu(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return iso;
  }
}

// Status badge kelas CSS
function statusBadgeClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'berhasil': case 'verified': return 'badge-success';
    case 'gagal': case 'rejected':    return 'badge-danger';
    case 'menunggu': case 'pending':   return 'badge-warning';
    default: return 'badge-muted';
  }
}

// Escape HTML untuk mencegah XSS saat menampilkan data
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: get initials dari nama (ambil 2 huruf pertama)
function getInitials(fullName) {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(' ');
  return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

// =====================================================
// Navbar dinamis (dirender ke elemen dengan id="navbar")
// ===================================================== 
async function renderNavbar() {
  const el = document.getElementById('navbar');
  if (!el) return;
  const user = await getCurrentUser();
  let admin = false;
  let donatur = null;
  if (user) {
    const { data } = await window.sb.rpc('is_admin');
    admin = !!data;
    if (!admin) {
      donatur = await getCurrentDonatur();
    }
  }

  const pubLinks = `
    <a href="/panti.html" class="nav-link">Info Panti</a>
    <a href="/laporan.html" class="nav-link">Laporan</a>`;

  let akunLink = '';
  if (!user) {
    akunLink = `<a href="/login.html" class="btn btn-primary btn-sm">Masuk</a>`;
  } else if (admin) {
    akunLink = `
      <a href="/admin/" class="nav-link">Admin</a>
      <button id="btn-logout" class="btn btn-ghost btn-sm">Keluar</button>`;
  } else {
    const userName = donatur?.full_name || user.email?.split('@')[0] || 'Donatur';
    const initials = getInitials(userName);
    akunLink = `
      <a href="/riwayat.html" class="nav-link">Riwayat Donasi</a>
      <a href="/donasi.html" class="btn btn-primary btn-sm">+ Donasi</a>
      <div class="nav-avatar">
        <div class="avatar-circle">${escapeHtml(initials)}</div>
        <div class="avatar-text">
          <div class="avatar-name">${escapeHtml(userName)}</div>
          <div class="avatar-role">Donatur</div>
        </div>
      </div>
      <button id="btn-logout" class="btn btn-ghost btn-sm">Keluar</button>`;
  }

  el.innerHTML = `
    <div class="nav-brand">
      <a href="/">
        <span class="brand-mark">🤝</span>
        <div class="brand-mark-text">
          <div>SIDOTI</div>
          <div class="brand-sub">Sistem Donasi Panti Asuhan</div>
        </div>
      </a>
    </div>
    <nav class="nav-links">${pubLinks}${akunLink}</nav>`;

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', logout);
}
