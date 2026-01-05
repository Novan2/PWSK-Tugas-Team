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
            const currentPath = window.location.pathname;

            if (currentPath.includes("kategori.html")) {
                if (typeof searchBooks === "function") {
                    searchBooks(keyword);
                } else {
                    window.location.search = `?search=${encodeURIComponent(keyword)}`;
                }

            } else {
                let path = window.location.pathname;

                if (path.endsWith(".html")) {
                    path = path.substring(0, path.lastIndexOf("/") + 1);
                }

                if (!path.endsWith("/")) {
                    path += "/";
                }

                const targetUrl = window.location.origin + path + "kategori.html?search=" + encodeURIComponent(keyword);
                window.location.href = targetUrl;
            }
        }
    }
});