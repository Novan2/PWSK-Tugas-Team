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
  const categories = ["fiksi", "nonfiksi", "komik", "biografi"];
  return categories[Math.floor(Math.random() * categories.length)];
}

function renderKategori(data) {
  const grid = document.getElementById("kategoriGrid");
  grid.innerHTML = "";

  data.forEach(book => {
    const card = document.createElement("div");
    card.className = "kategori-card";

    card.innerHTML = `
      <img src="${book.gambar}" alt="${book.judul}">
      <h3>${book.judul}</h3>
      <p class="book-description">${book.deskripsi}</p>
      <p>Rp ${book.harga.toLocaleString()}</p>
    `;

    grid.appendChild(card);
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
    filterKategori(btn.dataset.filter);
  });
});

/* SEARCH EVENT */
document.getElementById("searchInput").addEventListener("input", (e) => {
  searchBooks(e.target.value);
});

function renderRekomendasi() {
  const grid = document.getElementById("rekomendasiGrid");
  grid.innerHTML = "";

  // Ambil 6 buku pertama untuk rekomendasi
  const rekomendasiBooks = allBooks.slice(0, 6);

  rekomendasiBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.gambar}" alt="${book.judul}">
      <h3>${book.judul}</h3>
      <p class="book-description">${book.deskripsi}</p>
      <p>Rp ${book.harga.toLocaleString()}</p>
    `;

    grid.appendChild(card);
  });
}

function renderTerlaris() {
  const grid = document.getElementById("terlarisGrid");
  grid.innerHTML = "";

  // Ambil 8 buku pertama untuk terlaris
  const terlarisBooks = allBooks.slice(0, 8);

  terlarisBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "terlaris-card";

    card.innerHTML = `
      <img src="${book.gambar}" alt="${book.judul}">
      <h3>${book.judul}</h3>
    `;

    grid.appendChild(card);
  });
}

/* LOAD DATA */
loadData().then(() => {
  renderRekomendasi();
  renderTerlaris();
});
