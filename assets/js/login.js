// =====================================================
// SIDOTI - Halaman Login & Registrasi
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  
  tabLogin.addEventListener('click', () => setTab('login'));
  tabRegister.addEventListener('click', () => setTab('register'));
  
  // Tab switcher di bawah
  document.getElementById('switch-tab').addEventListener('click', (e) => {
    e.preventDefault();
    const isLogin = document.getElementById('form-login').style.display !== 'none';
    setTab(isLogin ? 'register' : 'login');
  });

  formLogin.addEventListener('submit', onLogin);
  formRegister.addEventListener('submit', onRegister);
  document.getElementById('btn-google').addEventListener('click', onGoogleLogin);
  
  // Password toggle
  document.getElementById('toggle-password').addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('login-password');
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  });
});

function setTab(which) {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const switchTab = document.getElementById('switch-tab');
  const switchText = document.getElementById('switch-text');
  const isLogin = which === 'login';
  
  // Update tab active state
  tabLogin.style.background = isLogin ? 'var(--surface)' : 'transparent';
  tabLogin.style.color = isLogin ? 'var(--primary)' : 'var(--slate)';
  tabLogin.style.boxShadow = isLogin ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none';
  
  tabRegister.style.background = !isLogin ? 'var(--surface)' : 'transparent';
  tabRegister.style.color = !isLogin ? 'var(--primary)' : 'var(--slate)';
  tabRegister.style.boxShadow = !isLogin ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none';
  
  // Update form visibility
  formLogin.style.display = isLogin ? 'block' : 'none';
  formRegister.style.display = isLogin ? 'none' : 'block';
  
  // Update switch text
  switchText.textContent = isLogin ? 'Belum punya akun?' : 'Sudah punya akun?';
  switchTab.textContent = isLogin ? 'Daftar sekarang' : 'Masuk di sini';
  
  clearAlert();
}

function showAlert(type, msg) {
  const box = document.getElementById('alert-box');
  box.innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}

function clearAlert() {
  document.getElementById('alert-box').innerHTML = '';
}

function redirectAfterAuth() {
  const params = new URLSearchParams(window.location.search);
  const target = params.get('redirect');
  window.location.href = target || '/riwayat.html';
}

// -----------------------------------------------------
// Login email/password
// -----------------------------------------------------
async function onLogin(e) {
  e.preventDefault();
  clearAlert();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('btn-login');
  btn.disabled = true;
  btn.textContent = 'Memproses...';
  try {
    const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    redirectAfterAuth();
  } catch (err) {
    showAlert('error', 'Login gagal: ' + (err.message || 'email atau password salah'));
    btn.disabled = false;
    btn.textContent = 'Masuk';
  }
}

// -----------------------------------------------------
// Registrasi email/password
// -----------------------------------------------------
async function onRegister(e) {
  e.preventDefault();
  clearAlert();
  const nama = document.getElementById('reg-nama').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const btn = document.getElementById('btn-register');
  btn.disabled = true;
  btn.textContent = 'Memproses...';
  try {
    const { data, error } = await window.sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: nama, provider: 'email' } }
    });
    if (error) throw error;

    // Jika konfirmasi email diperlukan, Supabase tidak membuat sesi.
    if (!data.session) {
      showAlert('success',
        'Pendaftaran berhasil! Silakan cek email untuk verifikasi, lalu masuk.');
      setTab('login'); // beralih ke tab login
    } else {
      redirectAfterAuth();
    }
  } catch (err) {
    showAlert('error', 'Pendaftaran gagal: ' + (err.message || 'email sudah terdaftar'));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Daftar';
  }
}

// -----------------------------------------------------
// Login Google (OAuth via Supabase)
// -----------------------------------------------------
async function onGoogleLogin() {
  clearAlert();
  try {
    const { error } = await window.sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' }
    });
    if (error) throw error;
  } catch (err) {
    showAlert('error', 'Login Google gagal: ' + (err.message || 'terjadi kesalahan'));
  }
}
