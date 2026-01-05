// Mendapatkan Cover Resolusi Tinggi
function getHighResCover(info) {
  const url = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
  if (!url) return "https://via.placeholder.com/400x600?text=No+Cover";
  return url.replace(/zoom=\d+/i, "zoom=1");
}

// Membatasi Jumlah Kata Judul
function separateWords(title, maxWords = 4) {
  if (!title) return "";
  const words = title.split(" ");
  return words.length <= maxWords ? title : words.slice(0, maxWords).join(" ") + "...";
}

// Mengambil Data dari API
async function loadBooksFromAPI(query = "all") {
  const searchQuery = query.trim() === "" ? "all" : query;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&orderBy=newest&maxResults=10`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    return data.items || [];
  } catch (error) {
    console.error("Gagal memuat buku:", error);
    return [];
  }
}

// Menampilkan buku di Carousel index
function displayCarouselBooks(items) {
  const track = document.getElementById("carousel-track");
  if (!track) return;

  track.innerHTML = "";

  items.forEach((item, i) => {
    const info = item.volumeInfo || {};
    const sale = item.saleInfo || {};
    const thumbnail = getHighResCover(info);
    const title = separateWords(info.title, 4);

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.style.backgroundImage = `url('${thumbnail}')`;
    bookCard.innerHTML = `
      <div class="rank-number">${i + 1}</div>
    `;
    track.appendChild(bookCard);
  });
}

// Inisialisasi buku terlaris
document.addEventListener('DOMContentLoaded', () => {
  const isIndexPage = document.getElementById("carousel-track");

  if (isIndexPage) {
    loadBooksFromAPI("all").then(books => {
      displayCarouselBooks(books);
    });
  }
});