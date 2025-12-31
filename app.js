/**
 * Load books from Google Books API with pagination.
 
 * @param {Object} params
 * @param {string} params.q               - Query string, e.g. "all" or "intitle:excel"
 * @param {number} [params.startIndex=0]  - Pagination offset
 * @param {number} [params.maxResults=10] - Max results per request (1..40)
 * @param {string} [params.orderBy]       - "relevance" | "newest"
 * @param {string} [params.langRestrict]  - e.g. "id", "en"
 * @param {string} [params.apiKey]        - Optional API key
 * @param {AbortSignal} [params.signal]   - Optional abort signal (for cancel request)
 *
 * @returns {Promise<{ totalItems: number, startIndex: number, items: Array }>}
 */

const normalizeBookItem = (item) => {
  const { id, volumeInfo: info = {}, saleInfo: sale = {}, accessInfo: access = {} } = item;

  return {
    id: id ?? null,
    title: info.title ?? null,
    subtitle: info.subtitle ?? null,
    authors: Array.isArray(info.authors) ? info.authors : [],
    publisher: info.publisher ?? null,
    publishedDate: info.publishedDate ?? null,
    description: info.description ?? null,
    pageCount: info.pageCount ?? null,
    categories: Array.isArray(info.categories) ? info.categories : [],
    language: info.language ?? null,

    // Images
    thumbnail: info.imageLinks?.thumbnail ?? null,
    smallThumbnail: info.imageLinks?.smallThumbnail ?? null,

    // Links
    previewLink: info.previewLink ?? null,
    infoLink: info.infoLink ?? null,
    canonicalVolumeLink: info.canonicalVolumeLink ?? null,

    // Commercial / Access
    saleability: sale.saleability ?? null,
    isEbook: sale.isEbook ?? null,
    listPrice: sale.listPrice ?? null,
    retailPrice: sale.retailPrice ?? null,
    buyLink: sale.buyLink ?? null,

    viewability: access.viewability ?? null,
    publicDomain: access.publicDomain ?? null,
    pdfAvailable: access.pdf?.isAvailable ?? false,
    epubAvailable: access.epub?.isAvailable ?? false,
    webReaderLink: access.webReaderLink ?? null,
    accessViewStatus: access.accessViewStatus ?? null,
  };
};

// Fungsi untuk mendapatkan URL cover resolusi tinggi
export function getHighResCover(info) {
  const url =
  info.imageLinks?.thumbnail ||
  info.imageLinks?.smallThumbnail;

  if (!url) {
  return "https://via.placeholder.com/400x600?text=No+Cover";
  }

  return url.replace(/zoom=\d/, "zoom=5");
}

// Contoh penggunaan: Load 10 buku terbaru dan tampilkan di carousel
const carouselTrack = document.getElementById("carousel-track");

export async function loadTop10NewestBooks() {
  const url =
    "https://www.googleapis.com/books/v1/volumes" +
    "?q=all" +
    "&orderBy=newest" +
    "&maxResults=10";

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    const items = data.items ?? [];

    // const pricedBooks = items.filter(item => {
    // const sale = item.saleInfo;
    // return (
    //   sale &&
    //   sale.saleability === "FOR_SALE" &&
    //   sale.retailPrice &&
    //   typeof sale.retailPrice.amount === "number"
    //   );
    // });

    // ngilangin isi lama
    carouselTrack.innerHTML = "";

    // render hanya 10 teratas yang punya harga
    // pricedBooks.slice(0, 10).forEach((item) => {
    //   const info = item.volumeInfo ?? {};
    //   const sale = item.saleInfo ?? {};

    //   const title = info.title ?? "Judul tidak tersedia";
    //   const authors = info.authors?.join(", ") ?? "Penulis tidak diketahui";
    //   const thumbnail = getHighResCover(info);

    //   const priceText = `${sale.retailPrice.amount} ${sale.retailPrice.currencyCode}`;

    //   const bookCard = document.createElement("div");
    //   bookCard.className = "book-card";
    //   bookCard.style.backgroundImage = `url("${thumbnail}")`;

    //   bookCard.innerHTML = `
    //     <h4>${title}</h4>
    //     <p class="author">${authors}</p>
    //     <p class="price">${priceText}</p>
    //   `;

    //   carouselTrack.appendChild(bookCard);
    // });

    // // kalau hasilnya kosong, kasih pesan yang masuk akal
    // if (pricedBooks.length === 0) {
    //   carouselTrack.innerHTML =
    //     "<p style='color:#b00'>Tidak ada buku berharga pada hasil pencarian ini.</p>";
    // }

    items.forEach((item) => {
      const info = item.volumeInfo ?? {};
      const sale = item.saleInfo ?? {};

      const title = info.title ?? "Judul tidak tersedia";
      const authors = info.authors?.join(", ") ?? "Penulis tidak diketahui";
      const thumbnail = getHighResCover(info);

      // let priceText = "Tidak dijual"; // versi sebelumnya
      let priceText = "Gratis";
      if (sale.saleability === "FOR_SALE" && sale.retailPrice) {
        priceText = `${sale.retailPrice.amount} ${sale.retailPrice.currencyCode}`;
      } else if (sale.saleability === "FREE") {
        priceText = "Gratis";
      }

      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.style.backgroundImage = `url("${thumbnail}")`;

      bookCard.innerHTML = `
        <h4>${title}</h4>
        <p class="author">${authors}</p>
        <p class="price">${priceText}</p>
      `;

      carouselTrack.appendChild(bookCard);
    });
  } catch (error) {
    console.error("Gagal memuat buku:", error);
    carouselTrack.innerHTML =
      "<p style='color:red'>Gagal memuat buku terbaru</p>";
  }
}
loadTop10NewestBooks();