// =====================================================
// SIDOTI - Konfigurasi Supabase
// =====================================================
// Ganti nilai di bawah dengan URL dan anon key dari proyek
// Supabase Anda (Project Settings > API).
// =====================================================
const SUPABASE_URL = 'https://dfabdiuakgghfbptownb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmYWJkaXVha2dnaGZicHRvd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDE2NjMsImV4cCI6MjEwOTExNzY2M30.5TXpwSOh6HGHlXXbZxgwd7A2koiV0BCzmbdI9HiuwEE';

// Nama bucket Storage untuk menyimpan bukti transfer.
const BUKTI_BUCKET = 'bukti-transfer';

// Expose konfigurasi secara global.
window.SIDOTI_CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY, BUKTI_BUCKET };
