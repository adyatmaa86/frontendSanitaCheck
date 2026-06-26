<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="description" content="SanitaCheck – Platform pemantauan kebersihan dan sanitasi fasilitas umum secara real-time."/>
    <title>SanitaCheck – Monitoring Kebersihan & Sanitasi Fasilitas Umum</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts & Material Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/style.css"/>

    <link rel="icon" type="image/png" href="assets/tabBG.png"/>
</head>
<body>

    <!-- ===================== NAVBAR ===================== -->
    <nav class="sc-navbar navbar navbar-expand-lg fixed-top px-0">
        <div class="container">
            <a class="navbar-brand" href="index.php">SanitaCheck</a>
            <button class="navbar-toggler border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false">
                <span class="material-symbols-outlined navbar-toggler-open">menu</span>
                <span class="material-symbols-outlined navbar-toggler-close">close</span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-lg-4 me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link active" href="index.php">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="facilities.php">Facilities</a></li>
                </ul>
                <div class="d-flex align-items-center gap-3 mt-2 mt-lg-0 justify-content-end">
                    <div class="search-box d-none d-lg-flex align-items-center position-relative" style="padding: 0.25rem 0.75rem; min-width: 220px;">
                        <span class="material-symbols-outlined" style="font-size:1rem;">search</span>
                        <input type="text" id="nav-search-input" autocomplete="off" placeholder="Cari fasilitas..." style="border: none; background: transparent; outline: none; font-size: 0.82rem; color: var(--sc-text); width: 100%; padding: 0;">
                        <div id="nav-search-autocomplete" class="autocomplete-dropdown"></div>
                    </div>
                    <button type="button" id="theme-toggle" class="btn-theme-toggle" title="Ubah Tema">
                        <span class="material-symbols-outlined">dark_mode</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- ===================== HERO ===================== -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center g-5">
                <!-- Left Content -->
                <div class="col-lg-6 text-center text-lg-start">
                    <div class="hero-badge mx-auto mx-lg-0">
                        <span class="dot"></span>
                        Platform Monitoring Sanitasi Fasilitas Umum
                    </div>
                    <h1 class="hero-title">
                        Monitoring Kebersihan & Sanitasi <span class="highlight">Fasilitas Umum</span> Secara Real-Time
                    </h1>
                    
                    <!-- Mobile Image (d-block d-lg-none) -->
                    <div class="hero-img-wrap animate-float d-block d-lg-none my-4 mx-auto" style="max-width: 440px;">
                        <img src="assets/1.jpeg" alt="Fasilitas medis steril modern" loading="lazy"/>
                        <div class="hero-badge-float">
                            <span class="material-symbols-outlined" style="font-size:0.9rem;color:#0e7a3a;">check_circle</span>
                            Terpantau Real-Time
                        </div>
                        <div class="hero-live-badge">
                            <span class="material-symbols-outlined" style="font-size:0.85rem;">trending_up</span>
                            Data Inspeksi Live
                        </div>
                    </div>

                    <p class="hero-subtitle mx-auto mx-lg-0">
                        Mencatat inspeksi sanitasi berkala, menganalisis status kelayakan kebersihan, dan memberikan rekomendasi pencegahan risiko kesehatan bagi masyarakat.
                    </p>
                    <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                        <a href="facilities.php" class="btn-sc-primary">
                            Lihat Fasilitas
                        </a>
                        <a href="javascript:void(0)" onclick="document.getElementById('inspections').scrollIntoView({behavior: 'smooth'})" class="btn-sc-outline">
                            <span class="material-symbols-outlined" style="font-size:1rem;">play_circle</span>
                            Lihat Inspeksi
                        </a>
                    </div>
                </div>
                <!-- Right Image -->
                <div class="col-lg-6 d-none d-lg-block">
                    <div class="hero-img-wrap animate-float">
                        <img src="assets/1.jpeg" alt="Fasilitas medis steril modern" loading="lazy"/>
                        <div class="hero-badge-float">
                            <span class="material-symbols-outlined" style="font-size:0.9rem;color:#0e7a3a;">check_circle</span>
                            Terpantau Real-Time
                        </div>
                        <div class="hero-live-badge">
                            <span class="material-symbols-outlined" style="font-size:0.85rem;">trending_up</span>
                            Data Inspeksi Live
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===================== BENCHMARKS ===================== -->
    <section class="benchmarks-section" id="benchmarks">
        <div class="container">
            <div class="text-center mb-5">
                <div class="section-label">RINGKASAN DATA</div>
                <h2>Statistik Sanitasi Fasilitas</h2>
                <p class="section-sub">Data real-time dari seluruh fasilitas yang terdaftar di SanitaCheck</p>
            </div>
            <div class="row g-4">
                <div class="col-6 col-lg-3">
                    <div class="stat-card h-100">
                        <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                            <span class="material-symbols-outlined" style="font-size:1.1rem;">domain</span>
                        </div>
                        <div class="stat-value text-primary" id="stat-total-facilities">—</div>
                        <div class="stat-label">Total Fasilitas</div>
                        <div class="stat-sub">Fasilitas terdaftar</div>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="stat-card h-100">
                        <div class="stat-icon" style="background:#f0fdf4;color:#16a34a;">
                            <span class="material-symbols-outlined" style="font-size:1.1rem;">task_alt</span>
                        </div>
                        <div class="stat-value" style="color:#16a34a;" id="stat-clean-count">—</div>
                        <div class="stat-label">Fasilitas Bersih</div>
                        <div class="stat-sub">Status layak & higienis</div>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="stat-card h-100 d-flex align-items-center justify-content-between">
                        <div>
                            <div class="stat-icon" style="background:#fefce8;color:#ca8a04;">
                                <span class="material-symbols-outlined" style="font-size:1.1rem;">verified_user</span>
                            </div>
                            <div class="stat-value" style="color:#ca8a04;" id="stat-compliance-rate">—</div>
                            <div class="stat-label">Tingkat Kepatuhan</div>
                            <div class="stat-sub">Persentase bersih</div>
                        </div>
                        <div class="position-relative d-none d-sm-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                            <svg class="w-100 h-100" viewBox="0 0 36 36">
                                <path style="stroke: var(--sc-border); stroke-width: 3.5; fill: none;" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path id="compliance-svg-ring" style="stroke: var(--sc-warning); stroke-width: 3.5; stroke-dasharray: 0, 100; stroke-linecap: round; fill: none; transition: stroke-dasharray 0.8s ease;" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="stat-card h-100">
                        <div class="stat-icon" style="background:#fff1f2;color:#e11d48;">
                            <span class="material-symbols-outlined" style="font-size:1.1rem;">warning</span>
                        </div>
                        <div class="stat-value" style="color:#e11d48;" id="stat-attention-facilities">—</div>
                        <div class="stat-label">Butuh Tindakan</div>
                        <div class="stat-sub">Fasilitas butuh tindakan</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===================== RECENT INSPECTIONS ===================== -->
    <section class="inspections-section" id="inspections">
        <div class="container">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div class="text-center text-md-start">
                    <h2 class="mb-1">Inspeksi Fasilitas Terbaru</h2>
                    <p class="text-muted mb-0" style="font-size:0.875rem;">Data terbaru dari fasilitas yang terdaftar di SanitaCheck</p>
                </div>
                <div class="filter-tabs d-flex gap-2" id="filter-tabs">
                    <button class="btn active" data-filter="all">Semua</button>
                    <button class="btn" data-filter="bersih">Bersih</button>
                    <button class="btn" data-filter="perlu dibersihkan">Perlu Dibersihkan</button>
                    <button class="btn" data-filter="buruk">Perlu Diperbaiki</button>
                </div>
            </div>

            <div class="position-relative">
                <div class="row g-4" id="facilities-grid">
                    <div class="col-12 text-center py-5" style="color: var(--sc-muted);">
                        <span class="material-symbols-outlined" style="font-size:2.5rem;opacity:0.4;">sync</span>
                        <div class="mt-2 small">Memuat data fasilitas dari server...</div>
                    </div>
                </div>
                
                <!-- Navigation Buttons for Mobile Slider (overlay on card) -->
                <div id="home-slider-controls" class="d-md-none" style="position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: none; align-items: center; justify-content: space-between; pointer-events: none; z-index: 5; padding: 0 6px;">
                    <button type="button" id="prev-facility" class="btn btn-sm rounded-circle p-2" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; pointer-events: auto; background: var(--sc-surface); box-shadow: 0 2px 8px rgba(0,0,0,0.12); border: 1px solid var(--sc-border); color: var(--sc-text);">
                        <span class="material-symbols-outlined" style="font-size:1.2rem;">chevron_left</span>
                    </button>
                    <button type="button" id="next-facility" class="btn btn-sm rounded-circle p-2" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; pointer-events: auto; background: var(--sc-surface); box-shadow: 0 2px 8px rgba(0,0,0,0.12); border: 1px solid var(--sc-border); color: var(--sc-text);">
                        <span class="material-symbols-outlined" style="font-size:1.2rem;">chevron_right</span>
                    </button>
                </div>
            </div>

            <div class="text-center mt-4">
                <a href="facilities.php" class="btn-sc-outline">
                    <span class="material-symbols-outlined" style="font-size:1rem;">grid_view</span>
                    Lihat Semua Fasilitas
                </a>
            </div>
        </div>
    </section>

    <!-- ===================== CARA KERJA ===================== -->
    <section class="find-section" id="cara-kerja">
        <div class="container">
            <div class="text-center mb-5">
                <div class="section-label">ALUR SISTEM</div>
                <h2>Cara Kerja SanitaCheck</h2>
                <p class="section-sub mx-auto">Tiga langkah sederhana untuk memastikan fasilitas umum tetap bersih dan aman</p>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="stat-card text-center">
                        <div class="stat-icon mx-auto bg-primary bg-opacity-10 text-primary" style="width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;">
                            <span class="material-symbols-outlined" style="font-size:1.5rem;">assignment</span>
                        </div>
                        <h5 class="fw-bold mt-3 mb-2" style="color:var(--sc-text);">1. Inspeksi Lapangan</h5>
                        <p class="small mb-0" style="color:var(--sc-muted);">Petugas melakukan inspeksi sanitasi berkala di setiap fasilitas umum, mencatat kondisi kebersihan, ketersediaan air & sabun.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card text-center">
                        <div class="stat-icon mx-auto" style="background:#f0fdf4;color:#16a34a;width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;">
                            <span class="material-symbols-outlined" style="font-size:1.5rem;">monitoring</span>
                        </div>
                        <h5 class="fw-bold mt-3 mb-2" style="color:var(--sc-text);">2. Analisis Otomatis</h5>
                        <p class="small mb-0" style="color:var(--sc-muted);">Sistem secara otomatis menganalisis data inspeksi dan menentukan status kelayakan: Bersih, Perlu Dibersihkan, atau Perlu Diperbaiki.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card text-center">
                        <div class="stat-icon mx-auto" style="background:#fefce8;color:#ca8a04;width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;">
                            <span class="material-symbols-outlined" style="font-size:1.5rem;">health_and_safety</span>
                        </div>
                        <h5 class="fw-bold mt-3 mb-2" style="color:var(--sc-text);">3. Rekomendasi Kesehatan</h5>
                        <p class="small mb-0" style="color:var(--sc-muted);">Memberikan rekomendasi pencegahan risiko kesehatan kepada masyarakat berdasarkan hasil analisis sanitasi terkini.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="sc-footer text-center py-4">
        <div class="container">
            <div class="brand mb-1">SanitaCheck</div>
            <div class="copy text-muted small">© 2026 SanitaCheck. Kelompok 5 - UAS Praktek P Naseh.</div>
        </div>
    </footer>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Separated JS -->
    <script src="assets/app.js"></script>
    <script>
        // Filter tabs logic — memanggil fungsi di app.js untuk re-render dari data API
        document.querySelectorAll('#filter-tabs .btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#filter-tabs .btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                if (typeof filterHomeFacilities === 'function') {
                    filterHomeFacilities(filter);
                }
            });
        });
    </script>
</body>
</html>
