<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta name="description" content="Laporkan masalah sanitasi fasilitas umum melalui SanitaCheck."/>
    <title>Laporan Sanitasi - SanitaCheck</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="assets/style.css"/>
    <link rel="icon" type="image/png" href="assets/tabBG.png"/>
</head>
<body>

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
                    <li class="nav-item"><a class="nav-link active" href="laporan.php">Lapor</a></li>
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

    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">

                <div class="mb-4 text-center text-md-start">
                    <h1 class="fw-bold mb-2">Laporkan Sanitasi</h1>
                    <p class="text-muted small">Gunakan form ini untuk melaporkan kondisi sanitasi fasilitas umum yang perlu ditindaklanjuti.</p>
                </div>

                <div class="card p-4 p-md-5 rounded-4 shadow-sm border" style="background: var(--sc-surface); border-color: var(--sc-border) !important;">
                    <form id="form-laporan" novalidate>

                        <div class="mb-3">
                            <label for="nama-pelapor" class="form-label fw-semibold small">Nama Pelapor</label>
                            <input type="text" class="form-control border rounded-3" id="nama-pelapor" name="nama_pelapor" required style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);">
                        </div>

                        <div class="mb-3">
                            <label for="nomor-telepon" class="form-label fw-semibold small">Nomor Telepon</label>
                            <input type="tel" class="form-control border rounded-3" id="nomor-telepon" name="no_telp" required style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);" placeholder="08xxxxxxxxxx">
                        </div>

                        <div class="mb-3">
                            <label for="fasilitas" class="form-label fw-semibold small">Fasilitas</label>
                            <select class="form-select border rounded-3" id="fasilitas" name="fasilitas_id" required style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);">
                                <option value="" style="background: var(--sc-surface); color: var(--sc-text);">Memuat data fasilitas...</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="keluhan" class="form-label fw-semibold small">Keluhan</label>
                            <textarea class="form-control border rounded-3" id="keluhan" name="keluhan" rows="4" required style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);" placeholder="Jelaskan kondisi sanitasi yang perlu dilaporkan..."></textarea>
                        </div>

                        <div class="mb-4">
                            <label for="foto-bukti" class="form-label fw-semibold small">Foto Bukti</label>
                            <input type="file" class="form-control border rounded-3" id="foto-bukti" name="foto_bukti" accept="image/*" style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text);">
                            <div class="form-text text-muted small">Ukuran maksimal 2MB. Format: JPG, PNG.</div>
                        </div>

                        <div id="form-status" class="d-none mb-3 p-3 rounded-3 small fw-semibold"></div>

                        <button type="submit" id="btn-kirim" class="btn-sc-primary w-100 justify-content-center">
                            <span class="material-symbols-outlined" style="font-size:1.1rem;">send</span>
                            Kirim Laporan
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </main>

    <footer class="sc-footer text-center py-4">
        <div class="container">
            <div class="brand mb-1">SanitaCheck</div>
            <div class="copy text-muted small">© 2026 SanitaCheck. Kelompok 5 - UAS Praktek P Naseh.</div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/app.js"></script>
    <script>
        (function() {
            const DEFAULT_API_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
                ? 'http://127.0.0.1:8000/api'
                : 'https://sagitapoy.dyt.my.id/api';
            const API_BASE_URL = localStorage.getItem('sanitacheck_api_url') || DEFAULT_API_URL;

            const selectFasilitas = document.getElementById('fasilitas');
            const form = document.getElementById('form-laporan');
            const btnKirim = document.getElementById('btn-kirim');
            const formStatus = document.getElementById('form-status');

            fetch(API_BASE_URL + '/fasilitas')
                .then(res => res.json())
                .then(response => {
                    if (response.status === 'success' && Array.isArray(response.data)) {
                        selectFasilitas.innerHTML = '<option value="" style="background: var(--sc-surface); color: var(--sc-text);">Pilih fasilitas...</option>';
                        response.data.forEach(f => {
                            const opt = document.createElement('option');
                            opt.value = f.id;
                            opt.textContent = f.nama_fasilitas + ' - ' + (f.lokasi || '');
                            selectFasilitas.appendChild(opt);
                        });
                    } else {
                        selectFasilitas.innerHTML = '<option value="" style="background: var(--sc-surface); color: var(--sc-text);">Gagal memuat data</option>';
                    }
                })
                .catch(() => {
                    selectFasilitas.innerHTML = '<option value="" style="background: var(--sc-surface); color: var(--sc-text);">Gagal memuat data</option>';
                });

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const nama = document.getElementById('nama-pelapor').value.trim();
                const noTelp = document.getElementById('nomor-telepon').value.trim();
                const fasilitasId = document.getElementById('fasilitas').value;
                const keluhan = document.getElementById('keluhan').value.trim();
                const fotoInput = document.getElementById('foto-bukti');
                const file = fotoInput.files[0];

                if (!nama || !noTelp || !fasilitasId || !keluhan) {
                    showStatus('Harap isi semua field yang wajib.', 'danger');
                    return;
                }

                if (file && file.size > 2 * 1024 * 1024) {
                    showStatus('Ukuran foto maksimal 2MB.', 'danger');
                    return;
                }

                const formData = new FormData();
                formData.append('nama_pelapor', nama);
                formData.append('no_telp', noTelp);
                formData.append('fasilitas_id', fasilitasId);
                formData.append('keluhan', keluhan);
                if (file) {
                    formData.append('foto_bukti', file);
                }

                btnKirim.disabled = true;
                btnKirim.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Mengirim...';

                fetch(API_BASE_URL + '/laporan', {
                    method: 'POST',
                    body: formData,
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        showStatus('Laporan berhasil dikirim. Terima kasih!', 'success');
                        form.reset();
                    } else {
                        showStatus(data.message || 'Gagal mengirim laporan.', 'danger');
                    }
                })
                .catch(() => {
                    showStatus('Gagal terhubung ke server. Coba lagi.', 'danger');
                })
                .finally(() => {
                    btnKirim.disabled = false;
                    btnKirim.innerHTML = '<span class="material-symbols-outlined" style="font-size:1.1rem;">send</span> Kirim Laporan';
                });
            });

            function showStatus(msg, type) {
                formStatus.className = 'mb-3 p-3 rounded-3 small fw-semibold alert alert-' + type;
                formStatus.textContent = msg;
                formStatus.classList.remove('d-none');
            }
        })();
    </script>

</body>
</html>
