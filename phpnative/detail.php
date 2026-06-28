<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta name="description" content="Detail status sanitasi fasilitas umum – SanitaCheck."/>
    <title>Detail Sanitasi - SanitaCheck</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts & Material Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>
    <!-- Separated CSS -->
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
                    <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="facilities.php">Facilities</a></li>
                    <li class="nav-item"><a class="nav-link" href="laporan.php">Lapor</a></li>
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

    <!-- ===================== MAIN CONTENT ===================== -->
    <main class="container py-4" id="detail-container">
        <!-- Back Button -->
        <a href="facilities.php" class="d-inline-flex align-items-center gap-2 fw-bold text-decoration-none mb-4" style="color: var(--sc-primary); font-size: 0.875rem;">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">arrow_back</span>
            Kembali ke Daftar
        </a>

        <!-- Facility Info Block -->
        <div class="card border-0 rounded-4 shadow-sm mb-4" style="background: var(--sc-surface); border: 1px solid var(--sc-border) !important;">
            <div class="card-body p-4">
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 border-bottom pb-3 mb-3">
                    <div>
                        <h1 class="h2 fw-bold mb-1" id="detail-facility-name" style="color: var(--sc-text);">Loading...</h1>
                        <p class="text-capitalize mb-2" style="color: var(--sc-muted); font-size: 0.875rem;" id="detail-facility-meta">Loading...</p>
                    </div>
                    <!-- Status Badge -->
                    <div id="detail-status-badge" class="px-3 py-2 rounded-pill fw-bold d-flex align-items-center gap-1" style="font-size: 0.82rem; background: #f1f5f9; color: var(--sc-muted);">
                        <span class="material-symbols-outlined" style="font-size: 1rem;">schedule</span> Loading...
                    </div>
                </div>

                <div id="detail-image-container" class="mb-3 d-none"></div>

                <!-- Health Recommendation Banner -->
                <div id="health-recommendation-card" class="mb-3">
                    <!-- Appended via app.js -->
                </div>

                <!-- Report Action Button -->
                <div id="report-action-container" class="d-none pt-2 border-top d-flex justify-content-end" style="border-color: var(--sc-border) !important;">
                    <div class="dropdown">
                        <button id="report-wa-btn" class="btn btn-sm d-inline-flex align-items-center fw-bold px-3 py-2 rounded-3 text-danger bg-danger bg-opacity-10 border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 0.8rem; gap: 0.375rem;">
                            <span class="material-symbols-outlined" style="font-size: 1.15rem;">chat</span>
                            Laporkan ke Petugas
                        </button>
                        <ul id="report-wa-dropdown" class="dropdown-menu dropdown-menu-end shadow-sm rounded-3 border" style="min-width: 200px;">
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Inspection History Timeline -->
        <div class="mt-4">
            <h2 class="fw-bold mb-4" style="font-size: 1.25rem; color: var(--sc-text);">Riwayat Inspeksi Sanitasi</h2>
            <div class="position-relative ps-2" id="inspection-timeline">
                <div class="text-center py-5" style="color: var(--sc-muted);">Menghubungkan ke API...</div>
            </div>
        </div>
    </main>

    <footer class="sc-footer text-center py-4">
        <div class="container">
            <div class="brand mb-1">SanitaCheck</div>
            <div class="copy text-muted small">© 2026 SanitaCheck. Kelompok 5 - UAS Praktek P Naseh.</div>
        </div>
    </footer>

    <!-- Bootstrap 5 Bundle JS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Separated JS -->
    <script src="assets/app.js"></script>
</body>
</html>
