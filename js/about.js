document.addEventListener("DOMContentLoaded", () => {
  const storeList = document.querySelector(".store-list");
  const moreButtonContainer = document.querySelector(".more-buttons");
  const moreButton = document.querySelector(".more-button");
  const searchInput = document.querySelector('input[name="search-store"]');

  let allStores = [];
  let itemsDisplayed = 0;
  const itemsPerLoad = 4;

  if (!storeList) return;

  // --- HELPERS ---
  // Fungsi untuk mendapatkan path root yang dinamis
  const getBasePath = () => {
    let path = window.location.pathname;
    // Jika path berakhiran .html, hapus filenamenya
    if (path.endsWith(".html")) {
      return path.substring(0, path.lastIndexOf("/") + 1);
    }
    // Jika path tidak berakhiran slash (misal /about), kita asumsikan itu file, jadi ambil parent dir
    if (!path.endsWith("/")) {
      return path.substring(0, path.lastIndexOf("/") + 1);
    }
    return path;
  };

  const basePath = getBasePath();

  // --- FUNGSI UTAMA UNTUK MERENDER KARTU ---
  const renderStores = (storesToRender, isSearch = false) => {
    // Jika bukan pencarian, kita update counter itemsDisplayed
    if (!isSearch) {
      itemsDisplayed += storesToRender.length;
    }

    storesToRender.forEach(store => {
      const article = document.createElement("article");
      article.className = "store-cards";
      // Gunakan basePath untuk image agar aman di GitHub Pages
      article.innerHTML = `
          <div class="store-card">
            <img class="store-thumb" src="${basePath}media/img2.jpg" alt="Ikon On-Book">
          </div>
          <div class="store-card-body">
            <h3 class="store-name">${store.name}</h3>
            <p class="store-address">${store.address}</p>
            <p class="store-hours">${store.hours || ''}</p>
            <div class="store-card-right">
                <span class="glyphicon glyphicon-map-marker store-pin" aria-hidden="true"></span>
                <a class="store-link" href="${store.mapsUrl}" target="_blank">
                    Jelajahi Toko Ini
                </a>
            </div>
          </div>
        `;
      storeList.appendChild(article);
    });

    // Logika menampilkan/menyembunyikan tombol
    if (isSearch || itemsDisplayed >= allStores.length) {
      moreButtonContainer.style.display = "none";
    } else {
      moreButtonContainer.style.display = "flex";
    }
  };

  // --- FUNGSI RESET KE TAMPILAN AWAL ---
  const resetToDefault = () => {
    storeList.innerHTML = "";
    itemsDisplayed = 0;
    const initialItems = allStores.slice(0, itemsPerLoad);
    renderStores(initialItems);
  };

  // --- FETCH DATA ---
  // Gunakan basePath untuk fetch juga
  const dataUrl = basePath + "data/place.json";
  console.log("Fetching stores from:", dataUrl);

  fetch(dataUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(stores => {
      allStores = stores;
      resetToDefault();
    })
    .catch(error => {
      console.error("Error fetching stores:", error);
      storeList.innerHTML = `<p style="text-align:center; color:red;">Gagal memuat data toko.<br>Error: ${error.message}</p>`;
    });

  // --- EVENT: TOMBOL LOAD MORE ---
  moreButton.addEventListener("click", () => {
    const nextItems = allStores.slice(itemsDisplayed, itemsDisplayed + itemsPerLoad);
    renderStores(nextItems);
  });

  // --- EVENT: PENCARIAN ---
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm !== "") {
      const filteredStores = allStores.filter(store =>
        store.name.toLowerCase().includes(searchTerm) ||
        store.address.toLowerCase().includes(searchTerm)
      );

      storeList.innerHTML = "";
      if (filteredStores.length > 0) {
        // Gunakan true untuk menandakan ini mode pencarian
        renderStores(filteredStores, true);
      } else {
        storeList.innerHTML = "<p class='not-found'>Toko tidak ditemukan.</p>";
        moreButtonContainer.style.display = "none";
      }
    } else {
      resetToDefault();
    }
  });
});