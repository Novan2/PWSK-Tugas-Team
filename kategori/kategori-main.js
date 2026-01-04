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
      // Jika ada keyword, jalankan fungsi pencarian
      searchBooks(keyword);
      
      // Update judul halaman agar user tahu mereka sedang melihat hasil cari
      const titleEl = document.querySelector('.kategori-header h1');
      if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;
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
