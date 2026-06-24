<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta name="description" content="Daftar lengkap fasilitas umum yang terdaftar di SanitaCheck beserta status sanitasinya."/>
    <title>Daftar Fasilitas - SanitaCheck</title>
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
                    <li class="nav-item"><a class="nav-link active" href="facilities.php">Facilities</a></li>
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

    <!-- Main Content Canvas -->
    <main class="container py-5 py-md-4">
        <div class="mb-4 text-center text-md-start">
            <h1 class="fw-bold mb-2">Daftar Fasilitas Umum</h1>
            <p class="text-muted small">Lihat kelayakan sanitasi dan riwayat kebersihan fasilitas terdekat.</p>
        </div>

        <!-- Filter Controls -->
        <div class="card p-3 rounded-3 mb-3 shadow-sm" style="background: var(--sc-surface); border: 1px solid var(--sc-border) !important;">
            <div class="row g-3">
                <!-- Search bar -->
                <div class="col-12 col-md-6 position-relative">
                    <span class="material-symbols-outlined position-absolute top-50 translate-middle-y ms-3 text-muted">search</span>
                    <input type="text" id="search-input" oninput="filterFacilities()" class="form-control ps-5 border rounded-3" style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);" placeholder="Cari nama tempat..."/>
                </div>

                <!-- Type filter -->
                <div class="col-6 col-md-3">
                    <select id="type-filter" onchange="filterFacilities()" class="form-select border rounded-3" style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);">
                        <option value="" style="background: var(--sc-surface); color: var(--sc-text);">Semua Jenis</option>
                    </select>
                </div>

                <!-- Status filter -->
                <div class="col-6 col-md-3">
                    <select id="status-filter" onchange="filterFacilities()" class="form-select border rounded-3" style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);">
                        <option value="" style="background: var(--sc-surface); color: var(--sc-text);">Semua Status</option>
                        <option value="bersih" style="background: var(--sc-surface); color: var(--sc-text);">Bersih</option>
                        <option value="perlu dibersihkan" style="background: var(--sc-surface); color: var(--sc-text);">Perlu Dibersihkan</option>
                        <option value="buruk" style="background: var(--sc-surface); color: var(--sc-text);">Buruk</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Filter Info & Reset Button -->
        <div class="d-flex justify-content-between align-items-center mb-3 px-1">
            <div class="small text-muted d-none d-md-block" id="results-count">Menghitung fasilitas...</div>
            <button id="reset-filter-btn" onclick="resetAllFilters()" class="btn btn-sm py-1 px-2 border rounded-3 d-flex align-items-center gap-1 ms-auto ms-md-0" style="background: var(--sc-surface); border-color: var(--sc-border) !important; color: var(--sc-text); display: none !important; font-size: 0.8rem;">
                <span class="material-symbols-outlined" style="font-size: 1rem;">restart_alt</span> Reset Filter
            </button>
        </div>

        <!-- Facilities List -->
        <div class="d-flex flex-column gap-3" id="facilities-list">
            <div class="text-center py-5 text-muted">Menghubungkan ke API Laravel...</div>
        </div>

        <!-- Pagination Container -->
        <div id="pagination-container" class="d-flex justify-content-center mt-4"></div>
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
