// Array global untuk menyimpan semua buku
let allBooks = [];

// Cache per kategori agar tidak memanggil API berulang kali
const categoryCache = {};

// Pemetaan kategori ke query Google Books
const categoryQueries = {
  all: "all books",
  fiksi: "subject:fiction",
  nonfiksi: "subject:nonfiction",
  komik: "subject:comics",
  biografi: "subject:biography",
  sains: "subject:science",
  psikologi: "subject:psychology",
  anak: "subject:children",
  bahasa: "subject:language",
  fotografi: "subject:photography",
  sejarah: "subject:history",
  referensi: "subject:reference",
  lainnya: "books",
};

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

// Normalisasi objek buku menjadi bentuk yang dipakai UI
function normalizeBooks(rawBooks, fallbackKategori) {
  return rawBooks.map((book) => {
    const rawHarga = Number(book.harga || 0);
    const finalHarga =
      rawHarga > 0 ? rawHarga : Math.floor(Math.random() * 80001) + 20000;

    const resolvedKategori =
      book.kategori || (fallbackKategori && fallbackKategori !== "all"
        ? fallbackKategori
        : "lainnya");

    return {
      judul: book.judul || "Judul tidak tersedia",
      deskripsi: book.deskripsi || "",
      harga: finalHarga,
      penulis: book.penulis || "Penulis tidak diketahui",
      kategori: resolvedKategori,
      stock: Math.floor(Math.random() * 13),
      gambar:
        book.gambar ||
        "https://via.placeholder.com/400x600/90AB8B/EBF4DD?text=No+Cover",
    };
  });
}

// Ambil data buku dari Google Books dengan keyword atau kategori
async function fetchBooksFromApi({ keyword, category = "all" }) {
  const chosenCategory = category || "all";
  const query = keyword?.trim()
    ? keyword.trim()
    : categoryQueries[chosenCategory] || categoryQueries.all;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&orderBy=newest&maxResults=40`;

  const res = await fetch(url);
  const data = await res.json();

  return (data.items || []).map((item) => ({
    judul: item.volumeInfo.title,
    deskripsi: item.volumeInfo.description || "Deskripsi tidak tersedia",
    penulis: item.volumeInfo.authors?.join(", ") || "Penulis tidak diketahui",
    harga: item.saleInfo?.retailPrice?.amount || 0,
    gambar:
      item.volumeInfo.imageLinks?.thumbnail ||
      item.volumeInfo.imageLinks?.smallThumbnail,
    kategori: mapKategori(item.volumeInfo.categories?.[0]),
  }));
}

// Load awal halaman; jika ada query pencarian pakai keyword, jika tidak pakai kategori default
async function loadData(initialCategory = "all") {
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

  let src = [];

  if (keyword) {
    try {
      src = await fetchBooksFromApi({ keyword });
      const titleEl = document.querySelector(".kategori-header h1");
      if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;
    } catch (e) {
      console.error("Gagal mengambil data dari API", e);
    }
  }

  if (src.length === 0) {
    try {
      src = await fetchBooksFromApi({ category: initialCategory });
    } catch (error) {
      console.error("Gagal mengambil data Google Books:", error);
      src = [];
    }
  }

  allBooks = normalizeBooks(src, keyword ? undefined : initialCategory);

  if (!categoryCache[initialCategory]) {
    categoryCache[initialCategory] = allBooks;
  }

  return allBooks;
}

// Ambil data baru berdasarkan kategori yang dipilih (dengan cache)
async function loadCategoryData(category = "all") {
  const chosen = category || "all";

  if (categoryCache[chosen]) {
    allBooks = categoryCache[chosen];
    return allBooks;
  }

  try {
    const fetched = await fetchBooksFromApi({ category: chosen });
    const normalized = normalizeBooks(fetched, chosen);
    categoryCache[chosen] = normalized;
    allBooks = normalized;
    return normalized;
  } catch (error) {
    console.error(`Gagal memuat kategori ${chosen}:`, error);
    return allBooks;
  }
}
