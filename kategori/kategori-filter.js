/*
  kategori-filter.js
  Menangani filtering dan pencarian buku
*/

console.log("kategori-filter.js loaded");

// Variabel untuk menyimpan kategori aktif
let activeCategory = "all";

// Fungsi untuk filter rekomendasi berdasarkan kategori
function filterRekomendasi(chosen) {
  let filtered = allBooks;
  if (chosen !== 'all') {
    filtered = allBooks.filter(b => b.kategori === chosen);
  }
  // Re-render rekomendasi dengan data yang sudah difilter
  renderRekomendasi();
}

// Fungsi untuk pencarian buku berdasarkan judul dan deskripsi
function searchBooks(query) {
  if (!query || query.trim() === '') {
    renderKategori(allBooks);
    return;
  }

  const lowerQ = query.toLowerCase();
  const results = allBooks.filter(book => {
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
      const normalizedUrl = `${window.location.pathname}${query ? '?' + query : ''}${window.location.hash}`;
      window.history.replaceState(null, "", normalizedUrl);
    }
  }
  
  if (!keyword) return false;

  // Reset kategori ke ALL
  activeCategory = "all";
  document.querySelectorAll(".kategori-filter button")
    .forEach(b => b.classList.remove("active"));

  const allBtn = document.querySelector(".kategori-filter button[data-filter='all']");
  if (allBtn) allBtn.classList.add("active");

  // Jalankan pencarian
  searchBooks(keyword);

  return true;
}

// Event listener untuk tombol filter kategori
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(".kategori-filter button").forEach(btn => {
    btn.addEventListener("click", () => {
      // Hapus class 'active' dari semua tombol
      document
        .querySelectorAll(".kategori-filter button")
        .forEach(b => b.classList.remove("active"));

      // Tambahkan class 'active' ke tombol yang diklik
      btn.classList.add("active");
      
      // Simpan kategori aktif dan filter
      const chosen = btn.dataset.filter || 'all';
      activeCategory = chosen;
      filterRekomendasi(chosen);
      
      // Render grid utama sesuai pilihan kategori
      const gridFiltered = (chosen === 'all') ? allBooks : allBooks.filter(b => b.kategori === chosen);
      console.log(`Filter: ${chosen}, Hasil: ${gridFiltered.length} buku`);
      renderKategori(gridFiltered);

      // Update modal active state
      const modal = document.getElementById('moreCategoriesModal');
      if (modal) {
        modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('active'));
        const modalBtn = modal.querySelector(`button[data-filter='${btn.dataset.filter}']`);
        if (modalBtn) modalBtn.classList.add('active');
      }
    });
  });
});
