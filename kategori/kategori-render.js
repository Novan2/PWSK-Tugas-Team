/*
  kategori-render.js
  Menangani rendering grid katalog buku
*/

console.log("kategori-render.js loaded");

// Fungsi untuk render grid katalog buku
function renderKategori(books) {
  const grid = document.getElementById('kategoriGrid');
  if (!grid) return;
  
  grid.innerHTML = '';

  // Jika tidak ada hasil
  if (books.length === 0) {
    grid.innerHTML = '<div class="no-results">Tidak ada buku yang ditemukan.</div>';
    return;
  }

  // Loop setiap buku untuk membuat card
  books.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'kategori-card';
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="Sampul ${book.judul}">
      </div>
      <div class="stock-badge ${book.stock === 0 ? 'out' : (book.stock < 4 ? 'low' : '')}">
        Stok: ${book.stock}
      </div>
      <div class="card-info">
        <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
        <div class="card-author">${book.penulis || 'Penulis tidak diketahui'}</div>
        <p class="price">${formatRp(book.harga)}</p>
      </div>
    `;

    grid.appendChild(card);

    // Event klik card untuk buka modal detail
    card.addEventListener('click', () => openDetailModal(book));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetailModal(book);
      }
    });
  });
}
