/*
  kategori-main.js
  File utama untuk inisialisasi halaman kategori
  Mengintegrasikan semua modul: data, filter, modal, carousel, render
*/

console.log("kategori-main.js loaded");

// Inisialisasi halaman setelah semua data dimuat
loadData()
  .then(() => {
    console.log("Data berhasil dimuat, memulai proses inisialisasi...");

    // 1. Cek Parameter Pencarian dari URL
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("search");

    if (keyword) {
      // Panggil searchBooks, bukan langsung render
      searchBooks(keyword);

      // Update judul
      const titleEl = document.querySelector('.kategori-header h1');
      if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;

      // Reset tombol kategori ke "Semua" agar grid tidak ter-filter kategori
      const filterButtons = document.querySelectorAll('.kategori-filter button');
      filterButtons.forEach(b => b.classList.remove('active'));
      const allBtn = document.querySelector('.kategori-filter button[data-filter="all"]');
      if (allBtn) allBtn.classList.add('active');
      // Pastikan state kategori aktif juga di-reset
      if (typeof activeCategory !== 'undefined') {
        activeCategory = 'all';
      }
    } else {
      // Jika tidak ada pencarian, tampilkan semua kategori (default: all)
      if (typeof renderKategori === 'function') {
        renderKategori(allBooks);
      }
    }

    // 2. Render Komponen Tambahan (Terlaris & Rekomendasi)
    if (typeof renderTerlaris === 'function') {
      renderTerlaris();
    }
    
    if (typeof renderRekomendasi === 'function') {
      renderRekomendasi();
    }

    console.log("Inisialisasi selesai.");
  })
  .catch(err => {
    console.error("Gagal memuat data:", err);
  });
