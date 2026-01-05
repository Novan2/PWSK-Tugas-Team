/*
  kategori-main.js
  File utama untuk inisialisasi halaman kategori
  Mengintegrasikan semua modul: data, filter, modal, carousel, render
*/

// Inisialisasi halaman setelah semua data dimuat
loadData()
  .then(() => {
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

    if (keyword) {
      searchBooks(keyword);

      const titleEl = document.querySelector(".kategori-header h1");
      if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;

      const filterButtons = document.querySelectorAll(
        ".kategori-filter button",
      );
      filterButtons.forEach((b) => b.classList.remove("active"));
      const allBtn = document.querySelector(
        '.kategori-filter button[data-filter="all"]',
      );
      if (allBtn) allBtn.classList.add("active");
      if (typeof activeCategory !== "undefined") {
        activeCategory = "all";
      }
    } else {
      if (typeof renderKategori === "function") {
        renderKategori(allBooks);
      }
    }

    if (typeof renderTerlaris === "function") {
      renderTerlaris();
    }

    if (typeof renderRekomendasi === "function") {
      renderRekomendasi();
    }
  })
  .catch((err) => {
    console.error("Gagal memuat data:", err);
  });
