/*
  Kategori page features (for assignment rubric):
  - Responsive grid layout (CSS Grid) for katalog, rekomendasi, terlaris.
  - Search (title + description), category filter (affects rekomendasi), and "No results" messaging.
  - Detail modal (single modal) with accessible close/ESC and focus management.
  - Clean code comments and keyboard-friendly interactions.
*/

let allBooks = [];
let activeCategory = "all";

const booksData = [
  {
    "judul": "Pengantar Ilmu Data",
    "deskripsi": "Dasar-dasar ilmu data meliputi pengolahan data, analisis, dan visualisasi untuk pemula.",
    "harga": 85000,
    "gambar": "./img/1.jpeg"
  },
  {
    "judul": "Pemrograman Python Dasar",
    "deskripsi": "Panduan praktis belajar Python dari nol hingga memahami logika pemrograman.",
    "harga": 90000
  },
  {
    "judul": "Algoritma dan Struktur Data",
    "deskripsi": "Pembahasan konsep algoritma dan struktur data untuk meningkatkan efisiensi program.",
    "harga": 120000
  },
  {
    "judul": "Dasar-Dasar Kecerdasan Buatan",
    "deskripsi": "Pengantar AI, machine learning, dan penerapannya dalam kehidupan nyata.",
    "harga": 135000
  },
  {
    "judul": "Analisis Data dengan Python",
    "deskripsi": "Teknik analisis data menggunakan library Python seperti Pandas dan NumPy.",
    "harga": 140000
  },
  {
    "judul": "Machine Learning untuk Pemula",
    "deskripsi": "Konsep dasar machine learning lengkap dengan studi kasus sederhana.",
    "harga": 150000
  },
  {
    "judul": "Deep Learning Praktis",
    "deskripsi": "Pengenalan deep learning dan neural network untuk analisis data lanjutan.",
    "harga": 165000
  },
  {
    "judul": "Statistika Terapan",
    "deskripsi": "Statistika yang difokuskan pada penerapan di bidang penelitian dan bisnis.",
    "harga": 110000
  },
  {
    "judul": "Metodologi Penelitian Ilmiah",
    "deskripsi": "Panduan menyusun penelitian ilmiah dari perumusan masalah hingga kesimpulan.",
    "harga": 95000
  },
  {
    "judul": "Manajemen Proyek Modern",
    "deskripsi": "Konsep dan teknik manajemen proyek berbasis praktik industri.",
    "harga": 125000
  },
  {
    "judul": "Sistem Informasi Manajemen",
    "deskripsi": "Pemanfaatan sistem informasi untuk pengambilan keputusan organisasi.",
    "harga": 115000
  },
  {
    "judul": "Basis Data Relasional",
    "deskripsi": "Dasar perancangan dan pengelolaan basis data menggunakan SQL.",
    "harga": 100000
  },
  {
    "judul": "Keamanan Sistem Informasi",
    "deskripsi": "Prinsip dan teknik dasar dalam menjaga keamanan data dan sistem.",
    "harga": 145000
  },
  {
    "judul": "Jaringan Komputer",
    "deskripsi": "Konsep jaringan komputer dari dasar hingga implementasi sederhana.",
    "harga": 105000
  },
  {
    "judul": "Pemrograman Web Dasar",
    "deskripsi": "Belajar membangun website menggunakan HTML, CSS, dan JavaScript.",
    "harga": 95000
  },
  {
    "judul": "Framework Web Modern",
    "deskripsi": "Pengantar framework web modern untuk pengembangan aplikasi dinamis.",
    "harga": 130000
  },
  {
    "judul": "Desain UI/UX",
    "deskripsi": "Prinsip desain antarmuka dan pengalaman pengguna yang efektif.",
    "harga": 120000
  },
  {
    "judul": "Digital Marketing",
    "deskripsi": "Strategi pemasaran digital menggunakan media sosial dan platform online.",
    "harga": 110000
  },
  {
    "judul": "E-Commerce dan Bisnis Digital",
    "deskripsi": "Konsep dan praktik bisnis digital di era teknologi informasi.",
    "harga": 125000
  },
  {
    "judul": "Akuntansi Dasar",
    "deskripsi": "Pengantar akuntansi untuk memahami laporan keuangan.",
    "harga": 90000
  },
  {
    "judul": "Manajemen Keuangan",
    "deskripsi": "Teknik pengelolaan keuangan untuk individu dan organisasi.",
    "harga": 115000
  },
  {
    "judul": "Ekonomi Mikro",
    "deskripsi": "Pembahasan konsep dasar ekonomi mikro dan perilaku pasar.",
    "harga": 100000
  },
  {
    "judul": "Ekonomi Makro",
    "deskripsi": "Analisis ekonomi makro seperti inflasi, pertumbuhan, dan kebijakan fiskal.",
    "harga": 100000
  },
  {
    "judul": "Hukum Bisnis",
    "deskripsi": "Dasar-dasar hukum yang berkaitan dengan aktivitas bisnis.",
    "harga": 105000
  },
  {
    "judul": "Etika Profesi",
    "deskripsi": "Pembahasan etika dan tanggung jawab profesional di dunia kerja.",
    "harga": 85000
  },
  {
    "judul": "Kepemimpinan dan Organisasi",
    "deskripsi": "Konsep kepemimpinan dan pengelolaan organisasi secara efektif.",
    "harga": 110000
  },
  {
    "judul": "Manajemen Sumber Daya Manusia",
    "deskripsi": "Strategi pengelolaan SDM untuk meningkatkan kinerja organisasi.",
    "harga": 120000
  },
  {
    "judul": "Teknik Pengambilan Keputusan",
    "deskripsi": "Metode dan alat bantu dalam pengambilan keputusan strategis.",
    "harga": 95000
  },
  {
    "judul": "Inovasi dan Kreativitas",
    "deskripsi": "Cara mengembangkan inovasi dan kreativitas dalam organisasi.",
    "harga": 105000
  },
  {
    "judul": "Pengantar Teknologi Informasi",
    "deskripsi": "Gambaran umum teknologi informasi dan perannya di berbagai bidang.",
    "harga": 85000
  }
];

function loadData() {
  // Tambahkan kategori dummy untuk sementara
  allBooks = booksData.map(book => ({
    ...book,
    kategori: getRandomCategory(),
    gambar: book.gambar ? "../" + book.gambar : "https://via.placeholder.com/200x280/90AB8B/EBF4DD?text=Buku" // placeholder gambar
  }));
  renderKategori(allBooks);
}

function getRandomCategory() {
  const categories = ["fiksi", "nonfiksi", "komik", "biografi", "sains", "sejarah", "psikologi", "anak", "bahasa", "fotografi", "lainnya"];
  return categories[Math.floor(Math.random() * categories.length)];
}

function renderKategori(data) {
  const grid = document.getElementById("kategoriGrid");
  grid.innerHTML = "";

  const noResultsEl = document.getElementById('noResults');
  if (!data || data.length === 0) {
    if (noResultsEl) noResultsEl.style.display = 'block';
    return;
  }
  if (noResultsEl) noResultsEl.style.display = 'none';

  data.forEach((book) => {
    const idxAll = allBooks.indexOf(book);
    const card = document.createElement("div");
    card.className = "kategori-card";

    card.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="${book.judul}">
      </div>
      <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
      <p class="price">Rp ${book.harga.toLocaleString()}</p>
      <div class="card-actions">
        <button class="detail-btn" data-idx="${idxAll}">Lihat Detail</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // attach detail buttons (scoped to grid)
  document.querySelectorAll('#kategoriGrid .detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.idx, 10);
      openDetailModal(allBooks[idx]);
    });
  });
} 

function filterKategori(category) {
  activeCategory = category;

  const filtered =
    category === "all"
      ? allBooks
      : allBooks.filter(b => b.kategori === category);

  renderKategori(filtered);
}

function searchBooks(query) {
  const filtered = allBooks.filter(book =>
    book.judul.toLowerCase().includes(query.toLowerCase()) ||
    book.deskripsi.toLowerCase().includes(query.toLowerCase())
  );
  renderKategori(filtered);
}

/* EVENT BUTTON */
document.querySelectorAll(".kategori-filter button").forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".kategori-filter button")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    // When a category is selected, only filter the rekomendasi section (option A)
    filterRekomendasi(btn.dataset.filter);

    // update modal active state if modal contains the same category button
    const modal = document.getElementById('moreCategoriesModal');
    if (modal) {
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('active'));
      const modalBtn = modal.querySelector(`button[data-filter='${btn.dataset.filter}']`);
      if (modalBtn) modalBtn.classList.add('active');
    }
  });
});

/* SEARCH EVENT */
document.getElementById("searchInput").addEventListener("input", (e) => {
  searchBooks(e.target.value);
});

/* DETAIL MODAL */
function openDetailModal(book) {
  const modal = document.getElementById('bookDetailModal');
  const img = document.getElementById('detailImage');
  const title = document.getElementById('detailTitle');
  const desc = document.getElementById('detailDesc');
  const price = document.getElementById('detailPrice');

  img.src = book.gambar;
  img.alt = book.judul;
  title.textContent = book.judul;
  desc.textContent = book.deskripsi || 'Deskripsi tidak tersedia.';
  price.textContent = 'Rp ' + book.harga.toLocaleString();

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  // focus management
  const close = modal.querySelector('.modal-close');
  close.focus();
}

(function setupDetailModal() {
  const modal = document.getElementById('bookDetailModal');
  if (!modal) return;
  const close = modal.querySelector('.modal-close');
  close.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  });
})();

function renderRekomendasi() {
  const grid = document.getElementById("rekomendasiGrid");
  grid.innerHTML = "";

  // Ambil 6 buku pertama untuk rekomendasi
  const rekomendasiBooks = allBooks.slice(0, 6);

  rekomendasiBooks.forEach((book) => {
    const idxAll = allBooks.indexOf(book);
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="${book.judul}">
      </div>
      <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
      <p class="price">Rp ${book.harga.toLocaleString()}</p>
      <div class="card-actions">
        <button class="detail-btn" data-idx="${idxAll}">Lihat Detail</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // attach detail buttons
  document.querySelectorAll('.rekomendasi-grid .detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.idx, 10);
      openDetailModal(allBooks[idx]);
    });
  });
} 

function renderTerlaris() {
  const grid = document.getElementById("terlarisGrid");
  grid.innerHTML = "";

  // Ambil 8 buku pertama untuk terlaris
  const terlarisBooks = allBooks.slice(0, 8);

  terlarisBooks.forEach((book) => {
    const idxAll = allBooks.indexOf(book);
    const card = document.createElement("div");
    card.className = "terlaris-card";

    card.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="${book.judul}">
      </div>
      <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
      <div class="card-actions">
        <button class="detail-btn" data-idx="${idxAll}">Lihat Detail</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // attach detail buttons
  document.querySelectorAll('.terlaris-grid .detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.idx, 10);
      openDetailModal(allBooks[idx]);
    });
  });
} 

// Modal: open/close and category clicks
(function setupModal() {
  const moreBtn = document.querySelector('.lainnya-btn');
  const modal = document.getElementById('moreCategoriesModal');
  if (!moreBtn || !modal) return;

  const modalClose = modal.querySelector('.modal-close');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    moreBtn.classList.add('open');
    moreBtn.setAttribute('aria-expanded', 'true');
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    moreBtn.classList.remove('open');
    moreBtn.setAttribute('aria-expanded', 'false');
  }

  moreBtn.addEventListener('click', (e) => {
    // toggle modal
    if (modal.classList.contains('open')) closeModal(); else openModal();
  });
  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // attach to both right-side links and left-nav buttons
  modal.querySelectorAll('.mega-col button, .mega-left button').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      // clear and add active class in modal
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // update active state on top filter buttons if exists
      document.querySelectorAll('.kategori-filter button').forEach(b => b.classList.remove('active'));
      const topBtn = document.querySelector(`.kategori-filter button[data-filter='${category}']`);
      if (topBtn) topBtn.classList.add('active');

      filterRekomendasi(category);
      closeModal();
    });
  });


// Filter function for rekomendasi (keeps behavior: filter rekomendasi only)
function filterRekomendasi(category) {
  const grid = document.getElementById("rekomendasiGrid");
  grid.innerHTML = "";

  const filtered = category === "all"
    ? allBooks.slice(0, 6)
    : allBooks.filter(b => b.kategori === category).slice(0, 6);

  filtered.forEach(book => {
    const idxAll = allBooks.indexOf(book);
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="${book.judul}">
      </div>
      <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
      <p class="price">Rp ${book.harga.toLocaleString()}</p>
      <div class="card-actions">
        <button class="detail-btn" data-idx="${idxAll}">Lihat Detail</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // attach detail buttons
  document.querySelectorAll('.rekomendasi-grid .detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.idx, 10);
      openDetailModal(allBooks[idx]);
    });
  });
}

  // tab toggle behavior (visual only for now)
  modal.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      modal.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      // Potential: could switch left-list content based on tab
    });
  });

  // Dimming/highlight effect: hover or focus a category to dim others
  const modalContent = modal.querySelector('.modal-content.mega-menu');
  modal.querySelectorAll('.mega-col button, .mega-left button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      modalContent.classList.add('dimmed');
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('highlight'));
      btn.classList.add('highlight');
    });
    btn.addEventListener('mouseleave', () => {
      modalContent.classList.remove('dimmed');
      btn.classList.remove('highlight');
    });
    btn.addEventListener('focus', () => {
      modalContent.classList.add('dimmed');
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('highlight'));
      btn.classList.add('highlight');
    });
    btn.addEventListener('blur', () => {
      modalContent.classList.remove('dimmed');
      btn.classList.remove('highlight');
    });
  });

  // ensure things clear when moving the mouse out of the content area
  modalContent.addEventListener('mouseleave', () => {
    modalContent.classList.remove('dimmed');
    modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('highlight'));
  });
})();

/* LOAD DATA */
loadData();
renderRekomendasi();
renderTerlaris();
