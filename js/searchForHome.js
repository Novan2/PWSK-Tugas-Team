/**
 * js/search.js
 * Bertanggung jawab menangkap input dari form navbar di semua halaman
 */

document.addEventListener("submit", (e) => {
    // Memastikan kita menangkap form dengan ID 'searchForm'
    if (e.target && e.target.id === "searchForm") {
        e.preventDefault();

        const input = e.target.querySelector("#search-box");
        const keyword = input.value.trim();

        if (keyword) {
            // Cek lokasi file saat ini
            const currentPath = window.location.pathname;

            if (currentPath.includes("kategori.html")) {
                /** * JIKA DI HALAMAN KATEGORI:
                 * Tidak perlu pindah halaman, cukup panggil fungsi loadBooks 
                 * yang ada di kategori.js atau databuku.js
                 **/
                console.log("Mencari di halaman kategori:", keyword);

                // Jika loadBooks adalah function global, panggil langsung
                if (typeof searchBooks === "function") {
                    searchBooks(keyword);
                } else {
                    // Fallback: reload dengan param baru agar loadData() menangkap keyword
                    window.location.search = `PWSK-Tugas-Team/kategori.html?search=${encodeURIComponent(keyword)}`;
                }

            } else {
                /** * JIKA DI HALAMAN INDEX / LAINNYA:
                 * Pindah ke halaman kategori dengan membawa parameter search
                 *
                 * GITHUB PAGES FIX:
                 * Gunakan path 'kategori.html' atau './kategori.html' (relatif),
                 * jangan '/kategori.html' (absolut ke root domain).
                 **/
                console.log("Redirect ke halaman kategori...");

                // Gunakan URL API untuk membangun full URL secara robust
                // Ini akan menangani path relatif terhadap halaman saat ini (baik itu root / atau /index.html)
                // sehingga aman untuk GitHub Pages dengan subdirectory.
                const targetUrl = new URL("kategori.html", window.location.href);
                targetUrl.searchParams.set("search", keyword);

                window.location.href = targetUrl.toString();
            }
        }
    }
});
// Fungsi untuk memetakan data buku dari API ke format yang diinginkan
// export const mapBookData = (item) => {
//   const volumeInfo = item.volumeInfo || {};
//   const sale = item.saleInfo || {};
//   const access = item.accessInfo || {};
//     return {
//     id: item.id || null,
//     title: volumeInfo.title || null,
//     subtitle: volumeInfo.subtitle || null,
//     authors: Array.isArray(volumeInfo.authors) ? volumeInfo.authors : [],
//     publisher: volumeInfo.publisher || null,
//     publishedDate: volumeInfo.publishedDate || null,
//     description: volumeInfo.description || null,
//     pageCount: volumeInfo.pageCount || null,
//     categories: Array.isArray(volumeInfo.categories) ? volumeInfo.categories : [],
//     image: volumeInfo.imageLinks?.thumbnail || null,
//     price: sale.saleability === "FOR_SALE" ? sale.listPrice?.amount || null : null,
//     currencyCode: sale.saleability === "FOR_SALE" ? sale.listPrice?.currencyCode || null : null,
//     isEbook: sale.isEbook || false,
//     previewLink: volumeInfo.previewLink || null,
//     infoLink: volumeInfo.infoLink || null,
//     webReaderLink: access.webReaderLink || null,
//   };
// }