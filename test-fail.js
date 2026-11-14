import assert from 'assert';

// Test dengan intentional error untuk dokumentasi CI failure

function formatRupiah(amount) {
  // ❌ WRONG: Return format yang berbeda dengan yang diharapkan
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function validateDonationAmount(amount) {
  return amount >= 10000;
}

console.log('🧪 Running SIDOTI Tests (WITH INTENTIONAL ERROR)...\n');

// Test 1: Format Rupiah - AKAN GAGAL
console.log('Test 1: Format Rupiah - INTENTIONAL FAILURE');
try {
  const result = formatRupiah(100000);
  // ❌ Expect format tanpa spasi: 'Rp100000'
  // ❌ Tapi function return: 'Rp 100.000'
  assert.strictEqual(result, 'Rp100000', 'Rupiah format should be Rp100000 without space');
  console.log('✅ PASS: formatRupiah(100000) =', result);
} catch (error) {
  console.log('❌ FAIL:', error.message);
  console.log('   Expected: Rp100000');
  console.log('   Received:', formatRupiah(100000));
  throw error;
}

// Tidak akan sampai ke sini karena test 1 sudah fail
console.log('\nTest 2: Validate Donation Amount');
try {
  const isValid = validateDonationAmount(50000);
  assert.strictEqual(isValid, true);
  console.log('✅ PASS: validateDonationAmount(50000) = true');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

console.log('\n❌ Tests failed - CI Pipeline detected error!\n');
