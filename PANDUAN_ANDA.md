# 📋 PANDUAN UNTUK ANDA - Bagian Yang Harus Dilakukan

Ini adalah panduan **langkah demi langkah** untuk semua tugas yang **HANYA BISA ANDA LAKUKAN** (bukan yang bisa saya automasi).

---

## 🎯 Tugas Anda: 6 Langkah Utama

### ✅ LANGKAH 1: Buat GitHub Repository

**Mengapa?** Untuk menyimpan kode di cloud dan trigger CI/CD

**Cara:**

1. Buka browser, pergi ke https://github.com/new

2. Isi form:
   - **Repository name**: `sidoti` (atau nama lain sesuka Anda)
   - **Description**: `Sistem Donasi Panti Asuhan (SIDOTI) - Tugas RPL`
   - **Visibility**: Pilih **Public** (agar dosen bisa lihat)
   - **Initialize this repository with**: Kosongkan semua (jangan centang)
   - **Add .gitignore**: (skip, sudah ada di lokal)
   - **Add a license**: (skip)

3. Klik **"Create repository"**

4. **Catat URL repository** → biasanya: `https://github.com/aziz-oss-dotcom/sidoti.git`

**Hasil yang harus ada:**
- Repository kosong di GitHub
- Halaman utama menunjukkan "This repository is empty"

**Screenshot**: Ambil screenshot halaman repo GitHub Anda ✅

---

### ✅ LANGKAH 2: Setup Git Lokal & Push Kode

**Mengapa?** Untuk connect local folder ke GitHub dan upload kode Anda

**Cara di PowerShell:**

**Step 2.1: Buka PowerShell di folder project**

```powershell
# Buka PowerShell
# Cd ke folder project
cd c:\code

# Cek apakah folder sudah adalah git repository
git status
```

Jika muncul error `fatal: not a git repository`, lanjut ke **Step 2.2**

Jika sukses, lanjut ke **Step 2.3**

---

**Step 2.2: Inisialisasi Git (JIKA BELUM ADA)**

```powershell
# Asumsikan Anda di c:\code

# 1. Initialize git
git init

# 2. Configure git (replace dengan nama & email Anda)
git config user.name "Nama Anda"
git config user.email "email@anda.com"

# 3. Add semua file
git add .

# 4. Initial commit
git commit -m "Initial commit: SIDOTI project setup"
```

---

**Step 2.3: Connect ke GitHub & Push**

```powershell
# 1. Add remote repository
# Ganti USERNAME dengan username GitHub Anda
git remote add origin https://github.com/USERNAME/sidoti.git

# 2. Rename branch ke 'main' (jika branch masih 'master')
git branch -M main

# 3. Push ke GitHub
git push -u origin main
```

**PERHATIAN:**
- Saat push, GitHub akan minta login
- Pilih: **Authenticate with token**
- Kunjungi: https://github.com/settings/tokens/new
- Generate Personal Access Token (dengan scope: repo, workflow)
- Copy token, paste di PowerShell

---

**Setelah push berhasil:**

```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (42/42), done.
Writing objects: 100% (45/45), 5.32 MiB, done.
Total 45 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Blablabla...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Hasil yang harus ada:**
- Folder c:\code terhubung ke GitHub
- Kode muncul di repository GitHub Anda
- Branch: `main`

**Screenshot**: 
- PowerShell output sukses
- GitHub repo sudah tidak kosong (lihat file muncul)

✅

---

### ✅ LANGKAH 3: Buat Pull Request untuk Trigger CI

**Mengapa?** Untuk test CI Pipeline dengan membuat PR (seperti dev team nyata)

**Cara:**

**Step 3.1: Buat Branch Baru di Lokal**

```powershell
cd c:\code

# 1. Buat branch baru (dari main)
git checkout -b feature/test-ci

# 2. Buat file test atau ubah sesuatu kecil
# Contoh: Buat file baru bernama TEST_CI.txt
# Atau edit README.md, tambah satu baris

# Cara mudah: Buka folder c:\code di Explorer, buat file TEST_CI.txt kosong

# 3. Add dan commit
git add .
git commit -m "test: trigger CI workflow"

# 4. Push branch ke GitHub
git push origin feature/test-ci
```

**Output yang diharapkan:**
```
remote: Create a pull request for 'feature/test-ci' on GitHub by visiting:
remote:      https://github.com/USERNAME/sidoti/pull/new/feature/test-ci
```

---

**Step 3.2: Buat Pull Request di GitHub**

1. Buka repository GitHub Anda
2. Akan muncul notifikasi **"Compare & pull request"** button
   - Klik button tersebut
   - ATAU manual: Tab **"Pull requests"** → **"New pull request"**

3. Isi form:
   - **Base**: main (branch tujuan)
   - **Compare**: feature/test-ci (branch anda)
   - **Title**: `test: trigger CI workflow`
   - **Description**: Biarkan kosong atau isi deskripsi singkat

4. Klik **"Create pull request"**

---

**Step 3.3: Lihat CI Berjalan**

1. Scroll ke bawah di halaman PR
2. Lihat section **"Checks"** atau **"Status checks"**
3. Tunggu sampai workflow muncul (tunggu ~30 detik)
4. Workflow akan show status:
   - 🟡 Running (sedang berjalan)
   - ✅ Passed (sukses)
   - ❌ Failed (gagal)

**Hasil yang harus ada:**
- PR terbuka di GitHub
- CI workflow trigger & selesai
- Status: ✅ Passed atau ❌ Failed

**Screenshot**: 
- Halaman PR menunjukkan workflow running/passed/failed
- URL: `https://github.com/USERNAME/sidoti/pull/1` (atau nomor lain)

✅

---

### ✅ LANGKAH 4: Lihat CI Gagal (Error Case)

**Mengapa?** Untuk dokumentasi error dan perbaikan

**Cara:**

Saya akan membuat file test yang gagal. Anda tinggal:

**Step 4.1: Pull File Test yang Gagal (dari saya)**

Nanti saya akan push file test yang gagal ke branch baru. Anda tinggal:

```powershell
cd c:\code

# 1. Update lokal untuk lihat branch baru
git fetch origin

# 2. Checkout ke branch dengan error
git checkout feature/error-example

# 3. Lihat file yang error
# (lihat output error message di lokal)

# 4. Push lagi (jika belum dipush)
git push origin feature/error-example
```

---

**Step 4.2: Buat PR untuk Error Branch**

Sama seperti LANGKAH 3, tapi:
- Base: main
- Compare: feature/error-example
- Title: `test: demonstrate CI failure (intentional error)`

---

**Step 4.3: Lihat CI Gagal**

Di halaman PR, lihat **"Checks"** section:
- Status akan show: ❌ Failed
- Klik **"Details"** untuk lihat error message

**Error yang akan terlihat contohnya:**
```
● SIDOTI Tests › should format rupiah correctly

  Expected: 'Rp100000'
  Received: 'Rp 100.000'
  
  5 | it('should format rupiah correctly', () => {
  6 |   const result = formatRupiah(100000);
  7 |   expect(result).toBe('Rp100000');
    |                        ^
```

**Hasil yang harus ada:**
- PR dengan error
- CI status: ❌ Failed
- Error message terlihat di workflow logs

**Screenshot**: 
- Halaman PR dengan ❌ Failed status
- Details halaman menunjukkan error message
- URL logs

✅

---

### ✅ LANGKAH 5: Push Fix dan Lihat CI Sukses

**Mengapa?** Untuk dokumentasi perbaikan error

**Cara:**

**Step 5.1: Saya Push File Fix**

Nanti saya akan push fix ke branch yang sama (feature/error-example). Anda tinggal:

```powershell
cd c:\code

# 1. Pull file yang sudah di-fix
git fetch origin
git pull origin feature/error-example

# 2. Lihat file sekarang sudah benar
# (bisa check lokal apakah error sudah hilang)
```

---

**Step 5.2: PR Akan Auto Re-run CI**

Setelah push fix, GitHub otomatis:
1. Re-run CI workflow
2. Kali ini akan ✅ Passed

Anda tinggal tunggu dan lihat di halaman PR yang sama.

---

**Step 5.3: Lihat CI Sukses**

Di halaman PR, lihat **"Checks"** section:
- Status akan update: ✅ Passed
- Error sudah hilang

**Hasil yang harus ada:**
- PR yang sama sekarang status ✅ Passed
- Workflow logs menunjukkan: "All checks passed"

**Screenshot**: 
- Halaman PR dengan ✅ Passed status
- Workflow logs menunjukkan success
- Timestamp menunjukkan run lebih baru dari error case

✅

---

### ✅ LANGKAH 6: Merge PR dan Dokumentasi Final

**Mengapa?** Untuk finalisasi dan kumpulkan semua bukti

**Cara:**

**Step 6.1: Merge PR ke Main**

1. Di halaman PR dengan status ✅ Passed
2. Scroll ke bawah
3. Klik **"Merge pull request"** button
4. Klik **"Confirm merge"**

```
GitHub akan show:
Pull request successfully merged and closed.
You can now safely delete the branch.
```

---

**Step 6.2: Check GitHub Actions History**

1. Di repository GitHub Anda
2. Tab **"Actions"**
3. Lihat workflow history:
   - ✅ Workflow sukses (dari main branch)
   - ❌ Workflow gagal (dari error branch)
   - ✅ Workflow sukses setelah fix (dari error branch)

**Hasil yang harus ada:**
- Minimal 3 workflow runs terlihat di history
- Mix dari ✅ dan ❌ status

**Screenshot**: 
- GitHub Actions page menunjukkan history
- 3 workflow runs minimal

✅

---

**Step 6.3: Kumpulkan Semua Screenshot**

Saya akan membuat file dokumentasi. Anda tinggal provide screenshot dari:

1. **Repository Setup**
   - GitHub repo URL
   - Branch main dengan semua file

2. **Push Success**
   - PowerShell output `git push` sukses

3. **PR #1 - CI Success**
   - Halaman PR dengan status ✅ Passed

4. **PR #2 - CI Fail**
   - Halaman PR dengan status ❌ Failed
   - Details menunjukkan error message

5. **PR #2 - CI After Fix**
   - Halaman PR yang sama dengan status ✅ Passed
   - Timestamp lebih baru

6. **GitHub Actions History**
   - Tab Actions menunjukkan 3+ workflow runs

7. **PR Merged**
   - PR dengan status "Merged" atau "Closed"

---

## 📋 Checklist Anda

Centang setiap step setelah selesai:

```
[ ] LANGKAH 1: GitHub repo dibuat
[ ] LANGKAH 2: Git setup lokal + push ke main
[ ] LANGKAH 3: PR pertama dibuat & CI triggered
[ ] LANGKAH 4: Error case dibuat & CI fail (❌)
[ ] LANGKAH 5: Fix dibuat & CI pass (✅)
[ ] LANGKAH 6: PR merged, semua screenshot dikumpulkan
```

---

## ⚙️ Troubleshooting - Jika Ada Masalah

### ❌ Error: "fatal: not a git repository"
**Solusi:**
```powershell
cd c:\code
git init
git config user.name "Nama Anda"
git config user.email "email@anda.com"
```

### ❌ Error: "Permission denied" saat push
**Solusi:**
- Pastikan Anda sudah generate Personal Access Token
- GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Scope: repo, workflow
- Copy token, paste saat GitHub minta password

### ❌ Error: "branch already exists"
**Solusi:**
```powershell
git branch -D feature/test-ci  # Delete branch lokal
git checkout -b feature/test-ci  # Buat baru
```

### ❌ CI tidak trigger di PR
**Solusi:**
- Pastikan workflow file `.github/workflows/ci.yml` sudah di main branch
- Cek apakah ada typo di nama file atau format YAML
- Tunggu 5-10 detik, kadang GitHub lambat

### ❌ Tidak bisa merge PR
**Solusi:**
- Pastikan CI status ✅ Passed (baru bisa merge)
- Pastikan tidak ada conflict
- Klik refresh jika button tidak aktif

---

## 📞 Kontak Dosen / TAs

Jika ada pertanyaan tentang requirement:
- Tanyakan ke dosen tentang: acceptance criteria, deadline, format laporan
- Tanyakan ke TAs tentang: technical issues (jika workflow tidak berjalan)

---

## ✨ Tips Sukses

1. **Jangan langsung merge** semua PR. Step by step dulu untuk dokumentasi.

2. **Screenshot setiap step** untuk laporan akhir.

3. **Jika error tidak terlihat**, coba buat error yang lebih obvious:
   - Syntax error (typo di code)
   - Test assertion yang pasti gagal
   - Missing import statement

4. **Koordinasi dengan team** tentang siapa yang push error vs fix.

5. **Keep it simple** - jangan setup CI yang kompleks, minimal: npm install + npm test + npm run lint

---

## 🎯 Hasil Akhir Yang Diharapkan

Setelah selesai semua langkah:

✅ Repository GitHub dengan branch main
✅ CI workflow trigger otomatis di setiap PR
✅ Dokumentasi error & perbaikan (dengan screenshot)
✅ Minimal 3 workflow runs: Success → Fail → Success
✅ Semua PR di-merge ke main
✅ GitHub Actions history menunjukkan track record

**File yang akan ada:**
```
GitHub repo: https://github.com/USERNAME/sidoti
├── Branches: main, feature/test-ci, feature/error-example
├── Pull Requests: 2 closed (merged)
├── Actions: 3+ workflow runs
└── Files: Original SIDOTI project + workflow file
```

---

## 📝 Siap Mulai?

Berikut urutan yang disarankan:

1. ✅ Baca full panduan ini
2. ✅ Mulai LANGKAH 1 (buat GitHub repo)
3. ✅ Lanjut LANGKAH 2 (push kode)
4. ⏳ Tunggu saya buat workflow file
5. ✅ Mulai LANGKAH 3 (buat PR & trigger CI)
6. ⏳ Tunggu saya buat error case
7. ✅ Mulai LANGKAH 4-5 (lihat fail & fix)
8. ✅ Finish LANGKAH 6 (merge & dokumentasi)

**Kapan saya siap buat workflow file?** Bilang aja setelah Anda selesai LANGKAH 2! 🚀
