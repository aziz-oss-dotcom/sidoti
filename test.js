import assert from 'assert';

// Test utilities untuk SIDOTI
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

function validateDonationAmount(amount) {
  return amount >= 10000;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Test Suite
console.log('🧪 Running SIDOTI Tests...\n');

// Test 1: Format Rupiah
console.log('Test 1: Format Rupiah');
try {
  const result = formatRupiah(100000);
  assert(result.includes('100'), 'Rupiah format should contain the amount');
  console.log('✅ PASS: formatRupiah(100000) =', result);
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

// Test 2: Validate Donation Amount (valid)
console.log('\nTest 2: Validate Donation Amount - Valid');
try {
  const isValid = validateDonationAmount(50000);
  assert.strictEqual(isValid, true, 'Amount 50000 should be valid (>= 10000)');
  console.log('✅ PASS: validateDonationAmount(50000) = true');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

// Test 3: Validate Donation Amount (invalid - too low)
console.log('\nTest 3: Validate Donation Amount - Invalid');
try {
  const isValid = validateDonationAmount(5000);
  assert.strictEqual(isValid, false, 'Amount 5000 should be invalid (< 10000)');
  console.log('✅ PASS: validateDonationAmount(5000) = false');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

// Test 4: Email Validation (valid)
console.log('\nTest 4: Email Validation - Valid');
try {
  const isValid = validateEmail('donatur@example.com');
  assert.strictEqual(isValid, true, 'Valid email format should return true');
  console.log('✅ PASS: validateEmail("donatur@example.com") = true');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

// Test 5: Email Validation (invalid)
console.log('\nTest 5: Email Validation - Invalid');
try {
  const isValid = validateEmail('invalid-email');
  assert.strictEqual(isValid, false, 'Invalid email format should return false');
  console.log('✅ PASS: validateEmail("invalid-email") = false');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

// Test 6: Minimum donation amount check
console.log('\nTest 6: Minimum Donation Check');
try {
  const minAmount = 10000;
  assert.strictEqual(validateDonationAmount(minAmount), true, 'Minimum amount should be valid');
  assert.strictEqual(validateDonationAmount(minAmount - 1), false, 'Below minimum should be invalid');
  console.log('✅ PASS: Minimum donation amount is', minAmount);
} catch (error) {
  console.log('❌ FAIL:', error.message);
  throw error;
}

console.log('\n🎉 All tests passed! SIDOTI CI Pipeline working correctly.\n');
