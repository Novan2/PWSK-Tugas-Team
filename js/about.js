document.addEventListener("DOMContentLoaded", () => {
  const storeList = document.querySelector(".store-list");
  const moreButtonContainer = document.querySelector(".more-buttons");
  const moreButton = document.querySelector(".more-button");
  const searchInput = document.querySelector('input[name="search-store"]');

  let allStores = [];
  let itemsDisplayed = 0;
  const itemsPerLoad = 4;

  if (!storeList) return;

  // --- FUNGSI UTAMA UNTUK MERENDER KARTU ---
  const renderStores = (storesToRender, isSearch = false) => {
    // Jika bukan pencarian, kita update counter itemsDisplayed
    if (!isSearch) {
      itemsDisplayed += storesToRender.length;
    }

    storesToRender.forEach(store => {
      const article = document.createElement("article");
      article.className = "store-cards";
      article.innerHTML = `
          <div class="store-card">
            <img class="store-thumb" src="./media/img2.jpg" alt="Ikon On-Book">
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
  // GITHUB PAGES FIX:
  // Gunakan path relatif dari root (HTML file), bukan dari file JS.
  // "data/place.json" akan bekerja jika HTML ada di root.
  fetch("data/place.json")
    .then(response => response.json())
    .then(stores => {
      allStores = stores;
      resetToDefault();
    })
    .catch(error => {
      console.error("Error:", error);
      storeList.innerHTML = "<p>Gagal memuat data toko.</p>";
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