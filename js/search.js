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
                /** * JIKA DI HALAMAN INDEX / LAINNYA:
                 * Pindah ke halaman kategori dengan membawa parameter search
                 **/
                console.log("Redirect ke halaman kategori...");
                
                // Gunakan path relatif yang aman menuju folder kategori
                // Jika index.html sejajar dengan folder kategori/
                window.location.href = `?search=${encodeURIComponent(keyword)}`;
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