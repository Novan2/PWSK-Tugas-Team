/**
 * js/databuku.js
 * Pusat pengaturan data buku dari Google Books API
**/

// 1. Helper: Mendapatkan Cover Resolusi Tinggi
function getHighResCover(info) {
  const url = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
  if (!url) return "https://via.placeholder.com/400x600?text=No+Cover";
  // Mengubah thumbnail biasa menjadi resolusi lebih tinggi
  return url.replace(/zoom=\d+/i, "zoom=1"); 
}

// 2. Helper: Membatasi Jumlah Kata Judul
function separateWords(title, maxWords = 4) {
  if (!title) return "";
  const words = title.split(" ");
  return words.length <= maxWords ? title : words.slice(0, maxWords).join(" ") + "...";
}

// 3. FUNGSI UTAMA: Mengambil Data dari API
// Dibuat Global (tanpa export) agar kategori.js bisa memanggilnya
async function loadBooksFromAPI(query = "all") {
  const searchQuery = query.trim() === "" ? "all" : query;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&orderBy=newest&maxResults=15`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    // Kembalikan data mentah agar bisa diolah oleh script yang memanggil (index atau kategori)
    return data.items || [];
  } catch (error) {
    console.error("Gagal memuat buku:", error);
    return [];
  }
}

// 4. FUNGSI DISPLAY: Khusus untuk Carousel di Index
function displayCarouselBooks(items) {
  const track = document.getElementById("carousel-track");
  if (!track) return; // Keluar jika bukan di halaman index

  track.innerHTML = ""; 

  items.forEach((item, i) => {
    const info = item.volumeInfo || {};
    const sale = item.saleInfo || {};
    const thumbnail = getHighResCover(info);
    const title = separateWords(info.title, 4);

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    // Menggunakan img tag lebih baik untuk SEO dan Loading daripada background-image
    bookCard.innerHTML = `
      <div class="card-img-wrapper" style="background-image: url('${thumbnail}')"></div>
      <h4>${title}</h4>
      <p class="author">${info.authors?.join(", ") || "Penulis Unknown"}</p>
      <div class="rank-number">${i + 1}</div>
    `;
    track.appendChild(bookCard);
  });
}

// 5. INISIALISASI UNTUK INDEX
document.addEventListener('DOMContentLoaded', () => {
  // Hanya jalankan loadBooks jika ada elemen carousel (berarti di index.html)
  const isIndexPage = document.getElementById("carousel-track");
  
  if (isIndexPage) {
    loadBooksFromAPI("all").then(books => {
      displayCarouselBooks(books);
    });
  }
});