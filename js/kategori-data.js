// Array global untuk menyimpan semua buku
let allBooks = [];

// Pemetaan kategori dari Google Books ke kategori lokal
function mapKategori(googleCategory) {
  if (!googleCategory) return "lainnya";
  const cat = googleCategory.toLowerCase();

  if (cat.includes("fiction") || cat.includes("novel")) return "fiksi";
  if (cat.includes("biography") || cat.includes("memoir")) return "biografi";
  if (cat.includes("comic") || cat.includes("graphic novel")) return "komik";
  if (cat.includes("science") || cat.includes("technology")) return "sains";
  if (cat.includes("history")) return "sejarah";
  if (cat.includes("psychology")) return "psikologi";
  if (cat.includes("children") || cat.includes("juvenile")) return "anak";
  if (cat.includes("language") || cat.includes("foreign")) return "bahasa";
  if (cat.includes("photography") || cat.includes("art")) return "fotografi";
  if (cat.includes("reference")) return "referensi";
  if (cat.includes("business") || cat.includes("economics")) return "nonfiksi";

  return "lainnya";
}

// Format Rupiah
function formatRp(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

async function loadData() {
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

  return (async () => {
    let src = [];

    if (keyword) {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=40`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        src = (data.items || []).map((item) => ({
          judul: item.volumeInfo.title,
          deskripsi: item.volumeInfo.description,
          penulis: item.volumeInfo.authors?.join(", "),
          harga: item.saleInfo?.retailPrice?.amount || 0,
          gambar: item.volumeInfo.imageLinks?.thumbnail,
        }));

        const titleEl = document.querySelector(".kategori-header h1");
        if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;
      } catch (e) {
        console.error("Gagal mengambil data dari API", e);
      }
    }

    if (src.length === 0) {
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=all&orderBy=newest&maxResults=40",
        );
        const apiData = await response.json();
        if (apiData.items) {
          src = apiData.items.map((item) => ({
            judul: item.volumeInfo.title,
            deskripsi:
              item.volumeInfo.description || "Deskripsi tidak tersedia",
            penulis:
              item.volumeInfo.authors?.join(", ") || "Penulis tidak diketahui",
            harga:
              item.saleInfo?.retailPrice?.amount ||
              Math.floor(Math.random() * 80001) + 20000,
            gambar:
              item.volumeInfo.imageLinks?.thumbnail ||
              item.volumeInfo.imageLinks?.smallThumbnail,
            kategori: mapKategori(item.volumeInfo.categories?.[0]),
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil data Google Books:", error);
        src = [];
      }
    }

    allBooks = src.map((book) => {
      let rawHarga = Number(book.harga || 0);
      let finalHarga =
        rawHarga > 0 ? rawHarga : Math.floor(Math.random() * 80001) + 20000;

      return {
        judul: book.judul || "Judul tidak tersedia",
        deskripsi: book.deskripsi || "",
        harga: finalHarga,
        penulis: book.penulis || "Penulis tidak diketahui",
        kategori: book.kategori || "lainnya",
        stock: Math.floor(Math.random() * 13),
        gambar:
          book.gambar ||
          "https://via.placeholder.com/400x600/90AB8B/EBF4DD?text=No+Cover",
      };
    });

    return allBooks;
  })();
}
