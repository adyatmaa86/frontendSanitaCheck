// ===== Apply saved theme immediately (prevent FOUC) =====
(function() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.documentElement.setAttribute('data-bs-theme', saved);
})();

// API Configuration
// =========================================================================
// API YANG DIAMBIL DARI BACKEND LARAVEL:
// 1. GET [API_BASE_URL]/fasilitas          -> Mengambil daftar semua fasilitas aktif beserta inspeksi terakhirnya.
// 2. GET [API_BASE_URL]/fasilitas/{id}/inspeksi -> Mengambil detail fasilitas dan seluruh riwayat inspeksi sanitasi terkait.
// 3. GET [API_BASE_URL]/fasilitas/status/{status} -> Memfilter daftar fasilitas berdasarkan status kebersihan (bersih/perlu dibersihkan/buruk).
// =========================================================================
const DEFAULT_API_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')
    ? 'http://127.0.0.1:8000/api'
    : 'https://sagitapoy.dyt.my.id/api';
let API_BASE_URL = localStorage.getItem('sanitacheck_api_url') || DEFAULT_API_URL;

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function fetchWithTimeout(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
}

// Ensure API URL is set in UI
document.addEventListener('DOMContentLoaded', () => {
    // Setup Theme Toggle in Navbar
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const updateIcon = (theme) => {
            const icon = themeToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        };

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        updateIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            document.documentElement.setAttribute('data-bs-theme', next);
            localStorage.setItem('theme', next);
            updateIcon(next);
        });
    }

    // Determine current page and run appropriate handlers
    const path = window.location.pathname;
    if (path.includes('facilities.php')) {
        loadFacilitiesPage();
    } else if (path.includes('detail.php')) {
        loadDetailPage();
    } else {
        loadHomePage();
    }
});

function goToDetail(id) {
    localStorage.setItem('selected_facility_id', id);
    window.location.href = 'detail.php';
}

// ----------------------------------------------------
// Home Page Handler
// ----------------------------------------------------
let homeFacilities = [];
let currentHomeIndex = 0;

function filterHomeFacilities(status) {
    if (!homeFacilities.length) return;
    currentHomeIndex = 0;
    renderHomeFacilities(homeFacilities, status);
}

function loadHomePage() {
    const facilitiesGrid = document.getElementById('facilities-grid');
    if (!facilitiesGrid) return;

    // Show Spinner Loading
    facilitiesGrid.innerHTML = `
        <div class="col-12 text-center py-5 my-3">
            <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem; border-width: 0.25em;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-3 text-muted small">Memuat data fasilitas...</div>
        </div>
    `;

    fetchWithTimeout(`${API_BASE_URL}/fasilitas`)
        .then(res => res.json())
        .then(response => {
            if (response.status === 'success') {
                homeFacilities = response.data;
                currentHomeIndex = 0;
                renderHomeFacilities(homeFacilities);
                calculateHomeStats(homeFacilities);
                setupNavAutocomplete();
            } else {
                console.error('Gagal memuat data dari server.');
            }
        })
        .catch(err => {
            console.error(err);
        });
}

function renderHomeFacilities(facilities, filterStatus = 'all') {
    const grid = document.getElementById('facilities-grid');
    grid.innerHTML = '';

    let list = facilities;
    if (filterStatus !== 'all') {
        list = facilities.filter(f => f.cleanliness_status === filterStatus);
    }

    const itemsToShow = list.slice(0, 3);

    itemsToShow.forEach((f, idx) => {
        let statusBadge = '';
        if (f.cleanliness_status === 'bersih') {
            statusBadge = `<span class="position-absolute top-0 end-0 m-3 sc-badge clean"><span class="material-symbols-outlined" style="font-size: 16px;">check_circle</span> Bersih</span>`;
        } else if (f.cleanliness_status === 'perlu dibersihkan') {
            statusBadge = `<span class="position-absolute top-0 end-0 m-3 sc-badge attention"><span class="material-symbols-outlined" style="font-size: 16px;">warning</span> Perlu Dibersihkan</span>`;
        } else {
            statusBadge = `<span class="position-absolute top-0 end-0 m-3 sc-badge poor"><span class="material-symbols-outlined" style="font-size: 16px;">error</span> Buruk</span>`;
        }

        const latestDate = f.latest_inspection ? new Date(f.latest_inspection.tanggal_inspeksi).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Belum pernah';

        const laravelDomain = API_BASE_URL.replace(/\/api$/, '');
        const photoPath = buildPhotoUrl(f.foto_after || f.foto_before, laravelDomain);
        const photoHtml = photoPath 
            ? `<img src="${photoPath}" alt="${escapeHtml(f.nama_fasilitas)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%2394a3b8&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><rect x=&quot;2&quot; y=&quot;2&quot; width=&quot;20&quot; height=&quot;20&quot; rx=&quot;2&quot; ry=&quot;2&quot;/><circle cx=&quot;8.5&quot; cy=&quot;8.5&quot; r=&quot;1.5&quot;/><polyline points=&quot;21 15 16 10 5 21&quot;/></svg>'; this.style.padding='2rem'; this.style.backgroundColor='var(--sc-bg)';"/>`
            : `<span class="material-symbols-outlined display-4 text-primary text-opacity-25">medical_services</span>`;

        const card = document.createElement('div');
        card.className = `col-md-4 mb-4 home-fac-col${idx === currentHomeIndex ? ' active' : ''}`;
        card.innerHTML = `
            <a href="javascript:void(0)" onclick="goToDetail(${f.id})" class="fac-card h-100 shadow-sm border" style="background: var(--sc-surface); border-color: var(--sc-border) !important;">
                <div class="fac-img bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style="height: 180px;">
                    ${photoHtml}
                    ${statusBadge}
                </div>
                <div class="fac-card-body p-4">
                    <h5 class="fac-name fw-bold text-dark mb-1" style="color: var(--sc-text) !important;">${escapeHtml(f.nama_fasilitas)}</h5>
                    <div class="fac-location text-muted small d-flex align-items-center gap-1 mb-2 text-capitalize" style="color: var(--sc-muted) !important;">
                        <span class="material-symbols-outlined" style="font-size: 18px">location_on</span> ${escapeHtml(f.jenis_fasilitas)} • ${escapeHtml(f.lokasi)}
                    </div>
                    <div class="fac-location text-muted small d-flex align-items-center gap-1 text-capitalize" style="color: var(--sc-muted) !important; font-size: 0.78rem;">
                        <span class="material-symbols-outlined" style="font-size: 18px">person</span> Petugas: ${escapeHtml(f.nama_petugas) || 'Tidak ada'}
                    </div>
                </div>
                <div class="fac-card-footer border-top p-3 d-flex align-items-center justify-content-between" style="border-color: var(--sc-border) !important;">
                    <span class="last-audit text-muted small">Inspeksi: ${escapeHtml(latestDate)}</span>
                    <span class="view-report text-primary small fw-bold">Lihat Detail</span>
                </div>
            </a>
        `;
        grid.appendChild(card);
    });

    if (itemsToShow.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5 text-muted">Tidak ada fasilitas dengan status ini.</div>`;
        const controls = document.getElementById('home-slider-controls');
        if (controls) controls.style.display = 'none';
    } else {
        const controls = document.getElementById('home-slider-controls');
        if (controls) controls.style.display = 'flex';
        setupHomeSliderControls(itemsToShow.length);
        setupHomeSwipe();
    }
}

let _swipeInitialized = false;

function setupHomeSwipe() {
    if (_swipeInitialized) return;
    const grid = document.getElementById('facilities-grid');
    if (!grid) return;

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    grid.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = false;
    }, { passive: true });

    grid.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const touch = e.touches[0];
        const diffX = Math.abs(touch.clientX - startX);
        const diffY = Math.abs(touch.clientY - startY);
        if (diffX > diffY && diffX > 10) {
            isSwiping = true;
        }
    }, { passive: true });

    grid.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const touch = e.changedTouches[0];
        const diffX = touch.clientX - startX;
        const cards = document.querySelectorAll('.home-fac-col');
        if (cards.length <= 1) return;

        if (diffX < -50) {
            cards[currentHomeIndex].classList.remove('active');
            currentHomeIndex = (currentHomeIndex + 1) % cards.length;
            cards[currentHomeIndex].classList.add('active');
        } else if (diffX > 50) {
            cards[currentHomeIndex].classList.remove('active');
            currentHomeIndex = (currentHomeIndex - 1 + cards.length) % cards.length;
            cards[currentHomeIndex].classList.add('active');
        }

        startX = 0;
        startY = 0;
        isSwiping = false;
    }, { passive: true });

    _swipeInitialized = true;
}

function setupHomeSliderControls(count) {
    const prevBtn = document.getElementById('prev-facility');
    const nextBtn = document.getElementById('next-facility');
    if (!prevBtn || !nextBtn) return;

    // Remove old listeners
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newPrevBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.home-fac-col');
        if (cards.length <= 1) return;
        cards[currentHomeIndex].classList.remove('active');
        currentHomeIndex = (currentHomeIndex - 1 + cards.length) % cards.length;
        cards[currentHomeIndex].classList.add('active');
    });

    newNextBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.home-fac-col');
        if (cards.length <= 1) return;
        cards[currentHomeIndex].classList.remove('active');
        currentHomeIndex = (currentHomeIndex + 1) % cards.length;
        cards[currentHomeIndex].classList.add('active');
    });
}

function calculateHomeStats(facilities) {
    const totalCount = facilities.length;
    const cleanCount = facilities.filter(f => f.cleanliness_status === 'bersih').length;
    const attentionCount = facilities.filter(f => f.cleanliness_status === 'perlu dibersihkan').length;
    const poorCount = facilities.filter(f => f.cleanliness_status === 'buruk').length;

    const complianceRate = totalCount > 0 ? Math.round((cleanCount / totalCount) * 100) : 100;

    // Set stats in elements if they exist
    safeSetText('stat-total-facilities', totalCount);
    safeSetText('stat-clean-count', cleanCount);
    safeSetText('stat-compliance-rate', `${complianceRate}%`);
    safeSetText('stat-attention-facilities', attentionCount + poorCount);

    // Update SVG progress ring
    const ring = document.getElementById('compliance-svg-ring');
    if (ring) {
        ring.style.strokeDasharray = `${complianceRate}, 100`;
    }
}

// ----------------------------------------------------
// Facilities Page Handler
// ----------------------------------------------------
let allFacilities = [];
let currentPage = 1;

function loadFacilitiesPage() {
    const listContainer = document.getElementById('facilities-list');
    if (!listContainer) return;

    // Show Spinner Loading
    listContainer.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center py-5 my-3">
            <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem; border-width: 0.25em;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <span class="mt-3 text-muted small">Memuat data fasilitas...</span>
        </div>
    `;

    fetchWithTimeout(`${API_BASE_URL}/fasilitas`)
        .then(res => res.json())
        .then(response => {
            if (response.status === 'success') {
                allFacilities = response.data;
                
                // Populate unique categories dynamically in filter
                populateTypeFilter(allFacilities);

                // Parse URL parameter ?search=...
                const urlParams = new URLSearchParams(window.location.search);
                const searchParam = urlParams.get('search');
                if (searchParam) {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) {
                        searchInput.value = searchParam;
                    }
                }

                currentPage = 1;
                renderFacilitiesList(allFacilities);
                setupNavAutocomplete();
                
                // If search query in URL, trigger filter immediately
                if (searchParam) {
                    filterFacilities(true);
                }
            } else {
                console.error('Gagal memuat daftar fasilitas.');
            }
        })
        .catch(err => {
            console.error(err);
        });
}

function populateTypeFilter(facilities) {
    const typeFilter = document.getElementById('type-filter');
    if (!typeFilter) return;
    const currentVal = typeFilter.value;
    const types = [...new Set(facilities.map(f => f.jenis_fasilitas))];
    typeFilter.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Semua Jenis';
    typeFilter.appendChild(defaultOpt);
    types.forEach(t => {
        if (t) {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            opt.className = 'text-capitalize';
            typeFilter.appendChild(opt);
        }
    });
    typeFilter.value = currentVal;
}

function renderFacilitiesList(list) {
    const container = document.getElementById('facilities-list');
    container.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const pageSize = isMobile ? 1 : 5;
    const totalPages = Math.ceil(list.length / pageSize);

    if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
    }

    const paginatedList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    paginatedList.forEach(f => {
        let statusBadge = '';
        if (f.cleanliness_status === 'bersih') {
            statusBadge = `<span class="sc-badge clean"><span class="bg-success rounded-circle" style="width: 6px; height: 6px;"></span> Bersih</span>`;
        } else if (f.cleanliness_status === 'perlu dibersihkan') {
            statusBadge = `<span class="sc-badge attention"><span class="bg-warning rounded-circle" style="width: 6px; height: 6px;"></span> Perlu Dibersihkan</span>`;
        } else {
            statusBadge = `<span class="sc-badge poor"><span class="bg-danger rounded-circle" style="width: 6px; height: 6px;"></span> Buruk</span>`;
        }

        const laravelDomain = API_BASE_URL.replace(/\/api$/, '');
        const photoPath = buildPhotoUrl(f.foto_after || f.foto_before, laravelDomain);
        const photoHtml = photoPath 
            ? `<img src="${photoPath}" alt="${escapeHtml(f.nama_fasilitas)}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%2394a3b8&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><rect x=&quot;2&quot; y=&quot;2&quot; width=&quot;20&quot; height=&quot;20&quot; rx=&quot;2&quot; ry=&quot;2&quot;/><circle cx=&quot;8.5&quot; cy=&quot;8.5&quot; r=&quot;1.5&quot;/><polyline points=&quot;21 15 16 10 5 21&quot;/></svg>'; this.style.padding='0.5rem'; this.style.backgroundColor='var(--sc-bg)';"/>`
            : `<span class="material-symbols-outlined fs-4">domain</span>`;

        const card = document.createElement('a');
        card.href = 'javascript:void(0)';
        card.setAttribute('onclick', `goToDetail(${f.id})`);
        card.className = 'd-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between p-4 rounded-4 shadow-sm text-decoration-none transition-all gap-3 border fac-list-item';
        card.style.background = 'var(--sc-surface)';
        card.style.borderColor = 'var(--sc-border)';
        card.style.color = 'var(--sc-text)';
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        card.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-3 text-primary overflow-hidden" style="width: 48px; height: 48px;">
                    ${photoHtml}
                </div>
                <div>
                    <h3 class="h6 fw-bold mb-1" style="color: var(--sc-text) !important;">${escapeHtml(f.nama_fasilitas)}</h3>
                    <p class="text-muted small mb-0 text-capitalize" style="color: var(--sc-muted) !important;">${escapeHtml(f.jenis_fasilitas)} • ${escapeHtml(f.lokasi)} • Petugas: ${escapeHtml(f.nama_petugas) || 'Tidak ada'}</p>
                </div>
            </div>
            <div class="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-between justify-content-md-end">
                ${statusBadge}
                <span class="material-symbols-outlined text-muted" style="color: var(--sc-muted) !important;">chevron_right</span>
            </div>
        `;
        container.appendChild(card);
    });

    if (list.length === 0) {
        container.innerHTML = `<div class="text-center py-5 text-muted">Tidak ditemukan fasilitas yang cocok dengan pencarian.</div>`;
    }

    // Update count indicator
    const countEl = document.getElementById('results-count');
    if (countEl) {
        if (list.length > 0) {
            const startItem = (currentPage - 1) * pageSize + 1;
            const endItem = Math.min(currentPage * pageSize, list.length);
            countEl.textContent = `Menampilkan ${startItem}-${endItem} dari ${list.length} fasilitas`;
        } else {
            countEl.textContent = `Menampilkan 0 dari 0 fasilitas`;
        }
    }

    // Render pagination controls
    renderPaginationControls(list.length, pageSize, totalPages);

    // Check if reset button should be shown
    const q = document.getElementById('search-input')?.value || '';
    const t = document.getElementById('type-filter')?.value || '';
    const s = document.getElementById('status-filter')?.value || '';
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
        if (q || t || s) {
            resetBtn.style.setProperty('display', 'flex', 'important');
        } else {
            resetBtn.style.setProperty('display', 'none', 'important');
        }
    }
}

function renderPaginationControls(totalItems, pageSize, totalPages) {
    const pagContainer = document.getElementById('pagination-container');
    if (!pagContainer) return;
    pagContainer.innerHTML = '';

    if (totalPages <= 1) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        pagContainer.className = 'd-flex justify-content-center gap-3 mt-4 w-100';
        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        pagContainer.innerHTML = `
            <button class="btn btn-sc-outline rounded-pill px-4 d-flex align-items-center gap-2" ${prevDisabled} onclick="changePage(${currentPage - 1})">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">chevron_left</span> Geser
            </button>
            <button class="btn btn-sc-outline rounded-pill px-4 d-flex align-items-center gap-2" ${nextDisabled} onclick="changePage(${currentPage + 1})">
                Geser <span class="material-symbols-outlined" style="font-size: 1.1rem;">chevron_right</span>
            </button>
        `;
    } else {
        pagContainer.className = 'd-flex justify-content-center mt-4';
        let html = `<nav aria-label="Page navigation"><ul class="pagination shadow-sm rounded-3">`;
        
        // Prev & First
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)" onclick="changePage(1)"><span class="material-symbols-outlined" style="font-size:1.15rem; vertical-align:middle;">first_page</span></a></li>`;
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})"><span class="material-symbols-outlined" style="font-size:1.15rem; vertical-align:middle;">chevron_left</span></a></li>`;

        // Loop page numbers
        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a></li>`;
        }

        // Next & Last
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})"><span class="material-symbols-outlined" style="font-size:1.15rem; vertical-align:middle;">chevron_right</span></a></li>`;
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)" onclick="changePage(${totalPages})"><span class="material-symbols-outlined" style="font-size:1.15rem; vertical-align:middle;">last_page</span></a></li>`;
        
        html += `</ul></nav>`;
        pagContainer.innerHTML = html;
    }
}

window.changePage = function(page) {
    if (page < 1) page = 1;
    currentPage = page;
    filterFacilities(false);
};

// Monitor resize to auto-switch list page size layout (with debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const path = window.location.pathname;
        if (path.includes('facilities.php')) {
            filterFacilities(false);
        }
    }, 200);
});

function resetAllFilters() {
    const q = document.getElementById('search-input');
    const t = document.getElementById('type-filter');
    const s = document.getElementById('status-filter');
    if (q) q.value = '';
    if (t) t.value = '';
    if (s) s.value = '';

    // Clear URL Search Parameter without reload
    if (window.history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({path:newurl}, '', newurl);
    }

    filterFacilities(true);
}

function filterFacilities(resetPage = true) {
    if (resetPage) {
        currentPage = 1;
    }
    const searchInput = document.getElementById('search-input');
    const typeEl = document.getElementById('type-filter');
    const statusEl = document.getElementById('status-filter');
    if (!searchInput || !typeEl || !statusEl) return;
    const query = searchInput.value.toLowerCase();
    const typeFilter = typeEl.value;
    const statusFilter = statusEl.value;

    let filtered = allFacilities;

    if (query) {
        filtered = filtered.filter(f => 
            f.nama_fasilitas.toLowerCase().includes(query) || 
            f.lokasi.toLowerCase().includes(query) ||
            (f.nama_petugas && f.nama_petugas.toLowerCase().includes(query))
        );
    }

    if (typeFilter) {
        filtered = filtered.filter(f => f.jenis_fasilitas === typeFilter);
    }

    if (statusFilter) {
        filtered = filtered.filter(f => f.cleanliness_status === statusFilter);
    }

    renderFacilitiesList(filtered);
}

// ----------------------------------------------------
// Autocomplete Search (Navbar)
// ----------------------------------------------------
let _acIndex = -1;
let _acInputId = '';
let _acDropdownId = '';

function getAcData() {
    return allFacilities.length ? allFacilities : homeFacilities;
}

function setupNavAutocomplete() {
    _acInputId = 'nav-search-input';
    _acDropdownId = 'nav-search-autocomplete';
    const input = document.getElementById(_acInputId);
    const dropdown = document.getElementById(_acDropdownId);
    if (!input || !dropdown) return;

    input.removeEventListener('input', handleAcInput);
    input.removeEventListener('keydown', handleAcKeydown);
    document.removeEventListener('click', handleAcOutside);

    input.addEventListener('input', handleAcInput);
    input.addEventListener('keydown', handleAcKeydown);
    document.addEventListener('click', handleAcOutside);
}

function handleAcInput() {
    const input = document.getElementById(_acInputId);
    const dropdown = document.getElementById(_acDropdownId);
    const data = getAcData();
    const query = input.value.trim().toLowerCase();

    if (!query || !data.length) {
        dropdown.classList.remove('show');
        return;
    }

    const matches = data.filter(f =>
        f.nama_fasilitas.toLowerCase().startsWith(query)
    ).slice(0, 8);

    if (!matches.length) {
        dropdown.classList.remove('show');
        return;
    }

    _acIndex = -1;
    renderAcDropdown(matches);
    dropdown.classList.add('show');
}

function renderAcDropdown(items) {
    const dropdown = document.getElementById(_acDropdownId);
    const laravelDomain = API_BASE_URL.replace(/\/api$/, '');
    dropdown.innerHTML = items.map((f, i) => {
        const photoPath = buildPhotoUrl(f.foto_after || f.foto_before, laravelDomain);
        const photoHtml = photoPath
            ? `<img src="${photoPath}" alt="${escapeHtml(f.nama_fasilitas)}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%2394a3b8&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><rect x=&quot;2&quot; y=&quot;2&quot; width=&quot;20&quot; height=&quot;20&quot; rx=&quot;2&quot; ry=&quot;2&quot;/><circle cx=&quot;8.5&quot; cy=&quot;8.5&quot; r=&quot;1.5&quot;/><polyline points=&quot;21 15 16 10 5 21&quot;/></svg>'; this.style.padding='0.3rem'; this.style.backgroundColor='var(--sc-bg)';"/>`
            : `<span class="ac-icon material-symbols-outlined">domain</span>`;

        let badgeClass = 'ac-badge';
        let badgeText = '';
        if (f.cleanliness_status === 'bersih') {
            badgeClass += ' sc-badge clean';
            badgeText = 'Bersih';
        } else if (f.cleanliness_status === 'perlu dibersihkan') {
            badgeClass += ' sc-badge attention';
            badgeText = 'Perlu Dibersihkan';
        } else {
            badgeClass += ' sc-badge poor';
            badgeText = 'Buruk';
        }

        return `
            <div class="autocomplete-item" data-index="${i}" data-id="${f.id}">
                ${photoHtml}
                <div class="ac-info">
                    <div class="ac-name">${escapeHtml(f.nama_fasilitas)}</div>
                    <div class="ac-location">${escapeHtml(f.lokasi) || ''}</div>
                </div>
                <span class="${badgeClass}">${badgeText}</span>
            </div>
        `;
    }).join('');

    dropdown.onclick = (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (!item) return;
        const id = item.dataset.id;
        navSelectAcSuggestion(id);
    };
}

function handleAcKeydown(e) {
    const dropdown = document.getElementById(_acDropdownId);
    if (!dropdown.classList.contains('show')) return;
    const items = dropdown.querySelectorAll('.autocomplete-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        items.forEach(el => el.classList.remove('active'));
        _acIndex = (_acIndex + 1) % items.length;
        items[_acIndex].classList.add('active');
        items[_acIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items.forEach(el => el.classList.remove('active'));
        _acIndex = (_acIndex - 1 + items.length) % items.length;
        items[_acIndex].classList.add('active');
        items[_acIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (_acIndex >= 0 && items[_acIndex]) {
            items[_acIndex].click();
        }
    } else if (e.key === 'Escape') {
        dropdown.classList.remove('show');
    }
}

function handleAcOutside(e) {
    const dropdown = document.getElementById(_acDropdownId);
    const input = document.getElementById(_acInputId);
    if (!dropdown || !input) return;
    if (!dropdown.contains(e.target) && e.target !== input) {
        dropdown.classList.remove('show');
    }
}

function navSelectAcSuggestion(id) {
    const input = document.getElementById(_acInputId);
    const dropdown = document.getElementById(_acDropdownId);
    dropdown.classList.remove('show');
    input.value = '';
    goToDetail(id);
}

// ----------------------------------------------------
// Detail Page Handler
// ----------------------------------------------------
function loadDetailPage() {
    const id = localStorage.getItem('selected_facility_id');
    if (!id) {
        window.location.href = 'index.php';
        return;
    }

    fetchWithTimeout(`${API_BASE_URL}/fasilitas/${id}/inspeksi`)
        .then(res => res.json())
        .then(response => {
            if (response.status === 'success') {
                renderDetailHeader(response.facility);
                renderInspectionHistory(response.data);
                renderHealthRecommendation(response.facility.cleanliness_status, response.data[0]);
            } else {
                console.error('Fasilitas tidak ditemukan.');
            }
        })
        .catch(err => {
            console.error(err);
        });
}

function renderDetailHeader(fac) {
    safeSetText('detail-facility-name', fac.nama_fasilitas);
    safeSetText('detail-facility-meta', `${fac.jenis_fasilitas} • ${fac.lokasi} • Petugas: ${fac.nama_petugas || 'Tidak ada'}`);

    // WA Report button
    const reportContainer = document.getElementById('report-action-container');
    const waBtn = document.getElementById('report-wa-btn');
    if (reportContainer && waBtn) {
        const petugas = fac.nama_petugas || 'Petugas Kebersihan';
        const namafaskes = fac.nama_fasilitas;
        const lokasi = fac.lokasi;
        const msg = `Halo *${petugas}*, saya ingin melaporkan kondisi kebersihan/sanitasi di fasilitas *${namafaskes}* (${lokasi}). Harap segera dicek dan ditindaklanjuti. Terima kasih.`;
        
        let phone = fac.no_telp_petugas || '';
        // Clean phone number: remove all non-digits except +
        phone = phone.replace(/[^0-9+]/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
        } else if (phone.startsWith('+')) {
            phone = phone.substring(1);
        }
        
        if (phone) {
            waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        } else {
            waBtn.href = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        }
        reportContainer.classList.remove('d-none');
    }

    const badgeContainer = document.getElementById('detail-status-badge');
    if (badgeContainer) {
        if (fac.cleanliness_status === 'bersih') {
            badgeContainer.className = 'sc-badge clean text-sm fw-bold';
            badgeContainer.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px">check_circle</span> Bersih (Sangat Layak)`;
        } else if (fac.cleanliness_status === 'perlu dibersihkan') {
            badgeContainer.className = 'sc-badge attention text-sm fw-bold';
            badgeContainer.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px">warning</span> Perlu Dibersihkan`;
        } else {
            badgeContainer.className = 'sc-badge poor text-sm fw-bold';
            badgeContainer.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px">error</span> Buruk (Risiko Kesehatan)`;
        }
    }

    const imageContainer = document.getElementById('detail-image-container');
    if (imageContainer) {
        const laravelDomain = API_BASE_URL.replace(/\/api$/, '');
        const photoUrl = buildPhotoUrl(fac.foto_after || fac.foto_before, laravelDomain);
        if (photoUrl) {
            imageContainer.innerHTML = `
                <div class="detail-img-wrap border mb-3" style="border-color: var(--sc-border) !important;">
                    <img src="${photoUrl}" alt="${escapeHtml(fac.nama_fasilitas)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%2394a3b8&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><rect x=&quot;2&quot; y=&quot;2&quot; width=&quot;20&quot; height=&quot;20&quot; rx=&quot;2&quot; ry=&quot;2&quot;/><circle cx=&quot;8.5&quot; cy=&quot;8.5&quot; r=&quot;1.5&quot;/><polyline points=&quot;21 15 16 10 5 21&quot;/></svg>'; this.style.padding='2rem'; this.style.backgroundColor='var(--sc-bg)';"/>
                </div>
            `;
            imageContainer.classList.remove('d-none');
        } else {
            imageContainer.classList.add('d-none');
        }
    }
}

function renderInspectionHistory(inspections) {
    const timeline = document.getElementById('inspection-timeline');
    if (!timeline) return;

    timeline.innerHTML = '';

    if (inspections.length === 0) {
        timeline.innerHTML = `<div class="text-center py-5 text-muted">Belum ada riwayat inspeksi untuk fasilitas ini.</div>`;
        return;
    }

    const isMobile = window.innerWidth < 768;
    const initialLimit = 3;
    const showAll = inspections.length <= initialLimit;

    inspections.forEach((ins, index) => {
        const date = new Date(ins.tanggal_inspeksi).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
        
        let indicatorClasses = `position-absolute start-0 translate-middle-x rounded-circle border border-4 border-white shadow-sm `;
        if (ins.kondisi_kebersihan === 'baik') {
            indicatorClasses += 'bg-success';
        } else if (ins.kondisi_kebersihan === 'cukup') {
            indicatorClasses += 'bg-warning';
        } else {
            indicatorClasses += 'bg-danger';
        }

        const checkIcon = '<span class="material-symbols-outlined text-success" style="font-size: 1rem; vertical-align: middle;">check_circle</span>';
        const crossIcon = '<span class="material-symbols-outlined text-danger" style="font-size: 1rem; vertical-align: middle;">cancel</span>';

        const airIcon = ins.ketersediaan_air === 'tersedia' ? checkIcon : crossIcon;
        const sabunIcon = ins.ketersediaan_sabun === 'tersedia' ? checkIcon : crossIcon;
        const bauIcon = ins.bau_tidak_sedap === 'ya' ? crossIcon : checkIcon;

        let kebersihanBadge = '';
        if (ins.kondisi_kebersihan === 'baik') {
            kebersihanBadge = '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-0.5" style="font-size: 0.72rem;">Baik</span>';
        } else if (ins.kondisi_kebersihan === 'cukup') {
            kebersihanBadge = '<span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-0.5" style="font-size: 0.72rem;">Cukup</span>';
        } else {
            kebersihanBadge = '<span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-0.5" style="font-size: 0.72rem;">Buruk</span>';
        }

        const timelineItem = document.createElement('div');
        timelineItem.className = 'position-relative ps-4 pb-4 border-start last-border-none';
        timelineItem.style.borderLeft = '1px solid var(--sc-border)';
        if (!showAll && index >= initialLimit) {
            timelineItem.classList.add('inspection-history-hidden');
        }
        timelineItem.innerHTML = `
            <div class="${indicatorClasses}" style="width: 16px; height: 16px; top: 8px;"></div>
            <div class="p-3 p-sm-4 rounded-3 border" style="background: var(--sc-surface); border-color: var(--sc-border) !important; color: var(--sc-text);">
                <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-1 mb-2">
                    <span class="small fw-bold" style="color: var(--sc-muted);">${date}</span>
                    <span class="small" style="color: var(--sc-muted);">Petugas: ${ins.officer ? escapeHtml(ins.officer.name) : 'System'}</span>
                </div>
                <div class="row g-2 mb-2 p-2 rounded border" style="background: var(--sc-bg); border-color: var(--sc-border) !important; color: var(--sc-text); font-size: 0.8rem;">
                    <div class="col-6 col-sm-3 d-flex align-items-center gap-1">Kebersihan: ${kebersihanBadge}</div>
                    <div class="col-6 col-sm-3 d-flex align-items-center gap-1">Air Bersih: ${airIcon}</div>
                    <div class="col-6 col-sm-3 d-flex align-items-center gap-1">Sabun: ${sabunIcon}</div>
                    <div class="col-6 col-sm-3 d-flex align-items-center gap-1">Tidak Bau: ${bauIcon}</div>
                </div>
                <p class="mb-0 small fst-italic text-secondary" style="color: var(--sc-muted);">"${escapeHtml(ins.catatan) || 'Tidak ada catatan.'}"</p>
                <div class="mt-3 pt-2 border-top d-flex align-items-center justify-content-between small" style="border-color: var(--sc-border) !important;">
                    <span style="color: var(--sc-muted);">Tindak Lanjut: <strong class="text-capitalize" style="color: var(--sc-text);">${escapeHtml(ins.status_tindak_lanjut)}</strong></span>
                    ${index === 0 ? '<span class="badge bg-primary bg-opacity-10 text-primary fw-bold">Terbaru</span>' : ''}
                </div>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });

    if (!showAll) {
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'text-center mt-3';
        toggleWrapper.innerHTML = `
            <button id="toggle-history-btn" class="btn btn-sm d-inline-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-pill border" style="background: var(--sc-surface); border-color: var(--sc-border) !important; color: var(--sc-primary); transition: all 0.2s ease;">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">unfold_more</span>
                <span class="toggle-history-text">Lihat Riwayat Lainnya</span>
            </button>
        `;
        timeline.appendChild(toggleWrapper);

        document.getElementById('toggle-history-btn').addEventListener('click', function() {
            const hiddenItems = timeline.querySelectorAll('.inspection-history-hidden');
            const iconSpan = this.querySelector('.material-symbols-outlined');
            const textSpan = this.querySelector('.toggle-history-text');
            if (hiddenItems.length > 0) {
                hiddenItems.forEach(el => el.classList.remove('inspection-history-hidden'));
                iconSpan.textContent = 'unfold_less';
                if (textSpan) textSpan.textContent = 'Sembunyikan';
            } else {
                const allItems = timeline.querySelectorAll('.position-relative.ps-4.pb-4');
                const extraItems = Array.from(allItems).slice(initialLimit);
                extraItems.forEach(el => el.classList.add('inspection-history-hidden'));
                iconSpan.textContent = 'unfold_more';
                if (textSpan) textSpan.textContent = 'Lihat Riwayat Lainnya';
            }
        });
    }
}

function renderHealthRecommendation(status, latest) {
    const card = document.getElementById('health-recommendation-card');
    if (!card) return;

    let title = '';
    let text = '';
    let alertClass = '';

    if (status === 'bersih') {
        alertClass = 'border-start border-4 border-success text-success bg-success bg-opacity-10';
        title = 'Status Aman & Higienis';
        text = 'Fasilitas umum ini memenuhi semua standar kesehatan primer. Risiko penyebaran pathogen sangat rendah. Rekomendasi: Lakukan pemeliharaan rutin seperti biasa.';
    } else if (status === 'perlu dibersihkan') {
        alertClass = 'border-start border-4 border-warning text-warning bg-warning bg-opacity-10';
        title = 'Perhatian: Indikator Sanitasi Kurang';
        let detail = '';
        if (latest) {
            if (latest.ketersediaan_sabun === 'tidak') detail += 'Isi ulang sabun cuci tangan yang habis. ';
            if (latest.ketersediaan_air === 'tidak') detail += 'Perbaiki suplai air bersih segera. ';
        }
        text = `Ditemukan kekurangan minor pada sarana cuci tangan. ${detail}Rekomendasi: Petugas kebersihan harus segera merespon keluhan dalam waktu maksimal 2 jam.`;
    } else {
        alertClass = 'border-start border-4 border-danger text-danger bg-danger bg-opacity-10';
        title = 'Peringatan: Risiko Kontaminasi Tinggi';
        text = 'Kebersihan buruk dan berbau menyengat terdeteksi. Fasilitas ini berpotensi menjadi sarang kuman (coliform/E. coli). Rekomendasi: Tutup fasilitas sementara jika perlu, dan lakukan dekontaminasi/pembersihan menyeluruh segera!';
    }

    card.className = `p-4 rounded-3 ${alertClass}`;
    card.innerHTML = `
        <h5 class="fw-bold mb-2 d-flex align-items-center gap-2">
            <span class="material-symbols-outlined">health_and_safety</span>
            ${title}
        </h5>
        <p class="mb-0 small leading-relaxed opacity-90">${text}</p>
    `;
}

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------
function safeSetText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

function buildPhotoUrl(photoPath, laravelDomain) {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('uploads/')) {
        return `${laravelDomain}/${photoPath}`;
    }
    return `${laravelDomain}/storage/${photoPath}`;
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="col-12 bg-danger bg-opacity-10 border border-danger text-danger p-4 rounded-3 text-center shadow-sm">
                <span class="material-symbols-outlined fs-2 mb-2 text-danger">error</span>
                <p class="small fw-semibold mb-0">${message}</p>
            </div>
        `;
    }
}

