/*
  kategori-modal.js
  Menangani modal detail buku dan modal kategori lainnya
*/

console.log("kategori-modal.js loaded");

// Fungsi untuk membuka modal detail buku
function openDetailModal(book) {
  const modal = document.getElementById('bookDetailModal');
  const img = document.getElementById('detailImage');
  const title = document.getElementById('detailTitle');
  const authorEl = document.getElementById('detailAuthor');
  const desc = document.getElementById('detailDesc');
  const price = document.getElementById('detailPrice');
  const stockEl = document.getElementById('detailStock');
  const qtyInput = document.getElementById('qtyInput');
  const subtotalEl = document.getElementById('detailSubtotal');
  const buyBtn = document.getElementById('buyNowBtn');
  const addCartBtn = document.getElementById('addToCartBtn');

  // Isi konten modal dengan data buku yang dipilih
  img.src = book.gambar;
  img.alt = book.judul;
  title.textContent = book.judul;
  authorEl.textContent = 'Penulis: ' + (book.penulis || 'Penulis tidak tersedia');
  desc.textContent = book.deskripsi || 'Deskripsi tidak tersedia.';
  price.textContent = formatRp(book.harga);
  stockEl.textContent = 'Stok: ' + (typeof book.stock === 'number' ? book.stock : '—');
  stockEl.classList.toggle('out', book.stock === 0);

  // Reset quantity & subtotal
  if (qtyInput) qtyInput.value = 1;
  if (subtotalEl) subtotalEl.textContent = formatRp(book.harga);

  // Tampilkan modal
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  // Fokus ke tombol close untuk accessibility
  const close = modal.querySelector('.modal-close');
  close.focus();

  // Set buy button dataset
  if (buyBtn) {
    buyBtn.dataset.idx = allBooks.indexOf(book);
    buyBtn.style.display = '';
  }
  if (addCartBtn) addCartBtn.dataset.idx = allBooks.indexOf(book);
  
  // Disable purchase buttons if out of stock
  const outOfStock = (book.stock === 0);
  if (buyBtn) {
    buyBtn.disabled = outOfStock;
    buyBtn.textContent = outOfStock ? 'Habis' : 'Beli Sekarang';
  }
  if (addCartBtn) {
    addCartBtn.disabled = outOfStock;
    addCartBtn.textContent = outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang';
  }
}

// Event listener untuk modal detail buku
(function initDetailModal() {
  const modal = document.getElementById('bookDetailModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const qtyInput = document.getElementById('qtyInput');
  const subtotalEl = document.getElementById('detailSubtotal');
  const priceEl = document.getElementById('detailPrice');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const addCartBtn = document.getElementById('addToCartBtn');
  const stockEl = document.getElementById('detailStock');

  // Tutup modal
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  // Event klik tombol close
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Event klik overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Event keyboard ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Update subtotal saat quantity berubah
  if (qtyInput && subtotalEl && priceEl) {
    qtyInput.addEventListener('input', () => {
      const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      const raw = priceEl.textContent.replace(/[^0-9]/g, '');
      const price = parseInt(raw, 10);
      if (!isNaN(price)) {
        subtotalEl.textContent = formatRp(price * qty);
      }
    });
  }

  // Tombol "Tambah ke Keranjang"
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      const idx = addCartBtn.dataset.idx ? parseInt(addCartBtn.dataset.idx, 10) : null;
      if (idx === null) return alert('Tidak ada buku yang dipilih.');
      const book = allBooks[idx];
      const qty = Math.max(1, parseInt((qtyInput && qtyInput.value) || 1, 10));
      if (qty > (book.stock || 0)) return alert('Stok tidak mencukupi.');
      alert(`${qty} eksemplar "${book.judul}" ditambahkan ke keranjang.`);
      closeModal();
    });
  }

  // Tombol "Beli Sekarang"
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const idx = buyNowBtn.dataset.idx ? parseInt(buyNowBtn.dataset.idx, 10) : null;
      if (idx === null) return alert('Tidak ada buku yang dipilih.');
      const book = allBooks[idx];
      const qty = Math.max(1, parseInt((qtyInput && qtyInput.value) || 1, 10));
      if (qty > (book.stock || 0)) return alert('Stok tidak mencukupi.');
      const proceed = confirm(`Konfirmasi pembelian:\n${book.judul}\nJumlah: ${qty}\nTotal: ${formatRp(book.harga * qty)}\n\nLanjutkan ke pembayaran?`);
      if (!proceed) return;
      
      // Simulate payment processing
      buyNowBtn.disabled = true;
      buyNowBtn.textContent = 'Memproses...';
      setTimeout(() => {
        // Decrement stock
        book.stock = Math.max(0, (book.stock || 0) - qty);
        
        // Update stock display if modal open
        if (stockEl) {
          stockEl.textContent = 'Stok: ' + book.stock;
          stockEl.classList.toggle('out', book.stock === 0);
        }
        
        alert('Pembayaran berhasil. Terima kasih!');
        buyNowBtn.disabled = false;
        buyNowBtn.textContent = 'Beli Sekarang';
        closeModal();
        
        // Re-render grids to reflect stock change
        renderKategori(allBooks);
        renderTerlaris();
      }, 900);
    });
  }
})();

// Event listener untuk modal kategori lainnya
(function initMoreCategoriesModal() {
  const modal = document.getElementById('moreCategoriesModal');
  const openBtn = document.getElementById('btnMoreCategories');
  const closeBtn = modal?.querySelector('.modal-close');

  if (!modal || !openBtn) return;

  // Buka modal
  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    if (closeBtn) closeBtn.focus();
  }

  // Tutup modal
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
  }

  // Event klik tombol buka
  openBtn.addEventListener('click', openModal);

  // Event klik tombol close
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Event klik overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Event keyboard ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Event klik kategori di dalam modal
  modal.querySelectorAll('.mega-col button, .mega-left button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Trigger filter yang sama dengan tombol utama
      const filterValue = btn.dataset.filter;
      const mainBtn = document.querySelector(`.kategori-filter button[data-filter='${filterValue}']`);
      if (mainBtn) mainBtn.click();

      closeModal();
    });
  });

  // Toggle tab 'Buku' dan 'Non Buku' di modal
  modal.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      modal.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });

  // Efek dimming dan highlight saat hover/focus kategori di modal
  const modalContent = modal.querySelector('.modal-content.mega-menu');
  modal.querySelectorAll('.mega-col button, .mega-left button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      modalContent.classList.add('dimmed');
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('highlight'));
      btn.classList.add('highlight');
    });
    btn.addEventListener('mouseleave', () => {
      modalContent.classList.remove('dimmed');
      btn.classList.remove('highlight');
    });
    btn.addEventListener('focus', () => {
      modalContent.classList.add('dimmed');
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('highlight'));
      btn.classList.add('highlight');
    });
    btn.addEventListener('blur', () => {
      modalContent.classList.remove('dimmed');
      btn.classList.remove('highlight');
    });
  });

  // Hapus efek dimming saat mouse keluar dari modal content
  modalContent.addEventListener('mouseleave', () => {
    modalContent.classList.remove('dimmed');
    modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('highlight'));
  });
})();
