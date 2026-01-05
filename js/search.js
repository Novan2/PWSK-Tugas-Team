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
            // Redirect ke halaman kategori dengan parameter search
            // window.location.href = `?search=${encodeURIComponent(keyword)}`; 
            // ^ Note: logic ini mungkin perlu disesuaikan jika struktur folder berubah
            window.location.href = `?search=${encodeURIComponent(keyword)}`;
        }
    }
});