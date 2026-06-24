# SanitaCheck 🏥✨

> **Platform Pemantauan Kebersihan dan Sanitasi Fasilitas Umum secara Real-Time.**  
> Proyek Front-End UAS Praktek P Naseh - Semester 4 (Kelompok 5).

---

## 📋 Tentang SanitaCheck

**SanitaCheck** adalah platform inovatif yang dirancang untuk memantau status sanitasi dan kebersihan berbagai fasilitas umum secara langsung (*real-time*). Sistem ini menghubungkan petugas kebersihan di lapangan dengan masyarakat luas untuk memastikan kenyamanan dan mencegah risiko penularan penyakit di fasilitas publik.

Aplikasi front-end ini dibangun menggunakan pendekatan **PHP Native & Vanilla JavaScript** yang efisien, dengan integrasi langsung ke **Laravel API** sebagai *backend engine* data.

---

## 🚀 Fitur Utama

1. **Dashboard Statistik Sanitasi Real-Time**
   - Ringkasan data otomatis: *Total Fasilitas*, *Fasilitas Bersih*, *Tingkat Kepatuhan* (dengan cincin persentase SVG dinamis), dan *Butuh Tindakan*.
2. **Recent Inspeksi & Filter Dinamis**
   - Menampilkan daftar inspeksi fasilitas terbaru dengan filter status interaktif (*Semua*, *Bersih*, *Perlu Dibersihkan*, dan *Buruk*).
   - Dilengkapi navigasi slider responsif serta dukungan gesture *swipe* pada perangkat mobile.
3. **Pencarian Autocomplete Pintar (Navbar)**
   - Fitur pencarian instan pada navbar dengan saran otomatis (*autocomplete dropdown*) lengkap dengan foto fasilitas, lokasi, dan indikator status sanitasi.
4. **Halaman Fasilitas Komprehensif**
   - Pencarian berdasarkan nama, lokasi, atau petugas.
   - Filter tingkat lanjut berdasarkan jenis fasilitas dan status kebersihan.
   - Sistem *custom pagination* yang dioptimalkan baik untuk tampilan desktop maupun mobile.
5. **Detail Fasilitas & WhatsApp Dispatcher**
   - Riwayat lengkap lini masa (*timeline*) inspeksi sanitasi dari waktu ke waktu.
   - Analisis otomatis dan rekomendasi tindakan pencegahan risiko kesehatan.
   - Tombol **Lapor Petugas (WhatsApp)** untuk langsung mengirim pesan pre-filled terformat kepada petugas terkait guna penanganan cepat.
6. **Dual Theme (Mode Gelap & Terang)**
   - Transisi tema modern bebas kedipan (*prevent FOUC*) yang mengingat preferensi pengguna melalui `localStorage`.

---

## 🛠️ Arsitektur & Teknologi

### Front-End Stack
- **Bahasa Utama**: HTML5, PHP Native (sebagai visual templates/routing)
- **Styling & UI**: Bootstrap 5 (CSS & JS Bundle via CDN) & Custom Vanilla CSS
- **Logika & API Client**: Vanilla JavaScript (Async/Await, AbortController, LocalStorage)
- **Icons & Fonts**: Google Fonts (Inter) & Material Symbols Outlined

### Struktur Direktori
```text
frontend/
├── phpnative/
│   ├── assets/
│   │   ├── 1.jpeg           # Asset gambar utama hero
│   │   ├── app.js           # Seluruh logika interaksi UI, state, & Fetching API
│   │   ├── style.css        # Desain kustom, tema gelap, dan animasi
│   │   └── tabBG.png        # Icon tab website (favicon)
│   ├── detail.php           # Halaman informasi detail & riwayat inspeksi
│   ├── facilities.php       # Halaman direktori pencarian & filter fasilitas
│   └── index.php            # Dashboard utama / Beranda aplikasi
└── README.md                # Dokumentasi proyek
```

---

## 🔌 Integrasi API Backend

Front-end berinteraksi secara dinamis dengan Laravel Backend API. Konfigurasi endpoint diatur secara pintar pada [app.js](file:///d:/matkul%20smt%204/praktek%20p%20naseh%20/UAS/frontend/phpnative/assets/app.js):

- **Local Endpoint**: `http://127.0.0.1:8000/api` (aktif otomatis saat diakses melalui localhost)
- **Production Endpoint**: `https://sagitapoy.dyt.my.id/api`

### Endpoint yang digunakan:
1. `GET /api/fasilitas` - Mengambil daftar seluruh fasilitas aktif beserta inspeksi terakhirnya.
2. `GET /api/fasilitas/{id}/inspeksi` - Mengambil detail lengkap fasilitas tertentu beserta seluruh riwayat inspeksi sanitasi terkait.
3. `GET /api/fasilitas/status/{status}` - Memfilter fasilitas berdasarkan status kebersihan.

---

## ⚙️ Petunjuk Penggunaan

### 1. Prasyarat (Prerequisites)
Pastikan web server lokal Anda (seperti Apache/XAMPP/Laragon) aktif dan mendukung PHP.

### 2. Konfigurasi
Aplikasi secara otomatis mendeteksi jika dijalankan di localhost dan mengarah ke API lokal. Jika ingin menggunakan endpoint tertentu secara kustom, Anda dapat mengatur `sanitacheck_api_url` pada `localStorage` browser Anda:
```javascript
localStorage.setItem('sanitacheck_api_url', 'http://alamat-api-kamu.test/api');
```

### 3. Menjalankan Aplikasi
Pindahkan direktori `frontend` ke dalam root web server Anda (misal `htdocs` atau `www`), lalu buka browser dan akses alamat foldernya:
```text
http://localhost/UAS/frontend/phpnative/index.php
```

---

*Dibuat dengan 💚 oleh Kelompok 5 untuk UAS Praktek P Naseh.*
