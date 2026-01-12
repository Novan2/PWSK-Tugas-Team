/*
  kategori-filter.js
  Menangani filtering dan pencarian buku
*/

console.log("kategori-filter.js loaded");

// Variabel untuk menyimpan kategori aktif
let activeCategory = "all";

const categoryLabelMap = {
  all: "Semua",
  fiksi: "Fiksi",
  nonfiksi: "Non Fiksi",
  komik: "Komik",
  biografi: "Biografi",
  sains: "Sains",
  psikologi: "Psikologi",
  anak: "Buku Anak",
  bahasa: "Bahasa",
  fotografi: "Fotografi",
  sejarah: "Sejarah",
  referensi: "Referensi",
  lainnya: "Lainnya",
};

// Fungsi untuk filter rekomendasi berdasarkan kategori
function filterRekomendasi(chosen) {
  let filtered = allBooks;
  if (chosen !== "all") {
    filtered = allBooks.filter((b) => b.kategori === chosen);
  }
  // Re-render rekomendasi dengan data yang sudah difilter
  renderRekomendasi();
}

// Fungsi untuk pencarian buku berdasarkan judul dan deskripsi
function searchBooks(query) {
  if (!query || query.trim() === "") {
    renderKategori(allBooks);
    return;
  }

  const lowerQ = query.toLowerCase();
  const results = allBooks.filter((book) => {
    return (
      (book.judul && book.judul.toLowerCase().includes(lowerQ)) ||
      (book.deskripsi && book.deskripsi.toLowerCase().includes(lowerQ))
    );
  });

  renderKategori(results);
}

// Fungsi untuk menangani parameter pencarian dari URL
function handleSearchParam() {
  const params = new URLSearchParams(window.location.search);
  let keyword = params.get("search");

  if (!keyword) {
    const legacyKeyword = params.get("q");
    if (legacyKeyword) {
      keyword = legacyKeyword;
      params.set("search", legacyKeyword);
      params.delete("q");
      const query = params.toString();
      const normalizedUrl = `${window.location.pathname}${query ? "?" + query : ""}${window.location.hash}`;
      window.history.replaceState(null, "", normalizedUrl);
    }
  }

  if (!keyword) return false;

  // Reset kategori ke ALL
  activeCategory = "all";
  document
    .querySelectorAll(".kategori-filter button")
    .forEach((b) => b.classList.remove("active"));

  const allBtn = document.querySelector(
    ".kategori-filter button[data-filter='all']",
  );
  if (allBtn) allBtn.classList.add("active");

  // Jalankan pencarian
  searchBooks(keyword);

  return true;
}

function updateModalActiveState(btn) {
  const modal = document.getElementById("moreCategoriesModal");
  if (!modal || !btn) return;
  modal
    .querySelectorAll(".mega-col button, .mega-left button")
    .forEach((b) => b.classList.remove("active"));
  const modalBtn = modal.querySelector(
    `button[data-filter='${btn.dataset.filter}']`,
  );
  if (modalBtn) modalBtn.classList.add("active");
}

function updateHeaderForCategory(chosen) {
  const titleEl = document.querySelector(".kategori-header h1");
  if (!titleEl) return;
  if (chosen === "all") {
    titleEl.innerText = "Kategori Buku";
    return;
  }
  const label = categoryLabelMap[chosen] || chosen;
  titleEl.innerText = `Kategori: ${label}`;
}

async function fetchAndRenderCategory(chosen, btn) {
  const grid = document.getElementById("kategoriGrid");
  if (grid) {
    grid.innerHTML = '<div class="no-results">Memuat data...</div>';
  }

  let books = allBooks;
  if (typeof loadCategoryData === "function") {
    books = await loadCategoryData(chosen);
  } else {
    books =
      chosen === "all"
        ? allBooks
        : allBooks.filter((b) => b.kategori === chosen);
  }

  renderKategori(books);
  if (typeof renderRekomendasi === "function") renderRekomendasi();
  if (typeof renderTerlaris === "function") renderTerlaris();
  updateModalActiveState(btn);
  updateHeaderForCategory(chosen);
}

// Event listener untuk tombol filter kategori
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".kategori-filter button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      // Hapus class 'active' dari semua tombol
      document
        .querySelectorAll(".kategori-filter button")
        .forEach((b) => b.classList.remove("active"));

      // Tambahkan class 'active' ke tombol yang diklik
      btn.classList.add("active");

      const chosen = btn.dataset.filter || "all";
      activeCategory = chosen;
      await fetchAndRenderCategory(chosen, btn);
    });
  });
});
