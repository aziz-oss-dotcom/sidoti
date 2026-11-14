// =====================================================
// SIDOTI - Login Admin
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  document.getElementById('form-admin-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btn-login');
    btn.disabled = true; btn.textContent = 'Memproses...';

    try {
      const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Cek apakah user ini admin
      const { data: isAdmin, error: errAdmin } = await window.sb.rpc('is_admin');
      if (errAdmin || !isAdmin) {
        // Bukan admin, logout supaya tidak tertinggal sesi non-admin
        await window.sb.auth.signOut();
        throw new Error('Akun ini bukan admin.');
      }

      window.location.href = '/admin/';
    } catch (err) {
      showAlert('error', 'Login gagal: ' + (err.message || 'kredensial salah'));
    } finally {
      btn.disabled = false; btn.textContent = 'Masuk';
    }
  });
});

function showAlert(type, msg) {
  document.getElementById('alert-box').innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}
function clearAlert() {
  document.getElementById('alert-box').innerHTML = '';
}
