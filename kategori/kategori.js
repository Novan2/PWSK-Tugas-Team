/*
  Kategori page features (for assignment rubric):
  - Responsive grid layout (CSS Grid) for katalog, rekomendasi, terlaris.
  - Search (title + description), category filter (affects rekomendasi), and "No results" messaging.
  - Detail modal (single modal) with accessible close/ESC and focus management.
  - Clean code comments and keyboard-friendly interactions.
*/

console.log("kategori.js loaded");

const params = new URLSearchParams(window.location.search);
console.log("Search param:", params.get("search"));

async function loadData() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");

  const resolveImage = (g) => {
    if (!g) return "https://via.placeholder.com/200x280/90AB8B/EBF4DD?text=Buku";
    if (g.startsWith('http') || g.startsWith('//')) return g;
    // Menyesuaikan path untuk file lokal di folder kategori
    return '../' + g.replace(/^\.\//, '');
  };

  // Mengembalikan Promise agar .then() bisa digunakan
  return (async () => {
    let src = [];
    
    if (keyword) {
      console.log("Mencari di Google Books API:", keyword);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=40`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        src = (data.items || []).map(item => ({
          judul: item.volumeInfo.title,
          deskripsi: item.volumeInfo.description,
          penulis: item.volumeInfo.authors?.join(', '),
          harga: item.saleInfo?.retailPrice?.amount || 0,
          gambar: item.volumeInfo.imageLinks?.thumbnail
        }));
        
        const titleEl = document.querySelector('.kategori-header h1');
        if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;
      } catch (e) {
        console.error("Gagal mengambil data dari API", e);
      }
    } 
    
    if (src.length === 0) {
  // Fungsi untuk mapping kategori dari Google Books ke bahasa Indonesia
  function mapKategori(googleCategory) {
    if (!googleCategory) return 'lainnya';
    const cat = googleCategory.toLowerCase();
    
    // Mapping kategori English ke Indonesia
    if (cat.includes('fiction') || cat.includes('novel')) return 'fiksi';
    if (cat.includes('biography') || cat.includes('memoir')) return 'biografi';
    if (cat.includes('comic') || cat.includes('graphic novel')) return 'komik';
    if (cat.includes('science') || cat.includes('technology')) return 'sains';
    if (cat.includes('history')) return 'sejarah';
    if (cat.includes('psychology')) return 'psikologi';
    if (cat.includes('children') || cat.includes('juvenile')) return 'anak';
    if (cat.includes('language') || cat.includes('foreign')) return 'bahasa';
    if (cat.includes('photography') || cat.includes('art')) return 'fotografi';
    if (cat.includes('reference')) return 'referensi';
    if (cat.includes('business') || cat.includes('economics')) return 'nonfiksi';
    
    return 'lainnya';
  }
  
  // Ambil data dari Google Books API
  try {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=all&orderBy=newest&maxResults=40');
    const apiData = await response.json();
    if (apiData.items) {
      src = apiData.items.map(item => ({
        judul: item.volumeInfo.title,
        deskripsi: item.volumeInfo.description || 'Deskripsi tidak tersedia',
        penulis: item.volumeInfo.authors?.join(', ') || 'Penulis tidak diketahui',
        harga: item.saleInfo?.retailPrice?.amount || (Math.floor(Math.random() * 80001) + 20000),
        gambar: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail,
        kategori: mapKategori(item.volumeInfo.categories?.[0])
      }));
    }
  } catch (error) {
    console.error('Gagal mengambil data Google Books:', error);
    src = typeof booksData !== 'undefined' ? booksData : [];
  }
}

    // MAP: Langsung mengembalikan objek (tanpa async di dalam map)
    allBooks = src.map(book => {
      let rawHarga = Number(book.harga || 0);
      let finalHarga = rawHarga > 0 ? rawHarga : (Math.floor(Math.random() * 80001) + 20000);
      
      return {
        judul: book.judul || 'Judul tidak tersedia',
        deskripsi: book.deskripsi || '',
        harga: finalHarga,
        penulis: book.penulis || 'Penulis tidak diketahui',
        kategori: book.kategori || 'lainnya',
        stock: Math.floor(Math.random() * 13),
        gambar: book.gambar || 'https://via.placeholder.com/400x600/90AB8B/EBF4DD?text=No+Cover'
      };
    });
    
    // Debug: Tampilkan kategori yang tersimpan
    console.log('Kategori tersimpan:', [...new Set(allBooks.map(b => b.kategori))]);
    console.log('Total buku:', allBooks.length);

    // Jalankan render grid utama segera
    if (typeof renderKategori === 'function') {
        renderKategori(allBooks);
    }
    
    return allBooks; 
  })();
}

// Utility: format number to Indonesian Rupiah string
function formatRp(n) {
  return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
}

// Fungsi untuk mengambil kategori secara acak
function getRandomCategory() {
  const categories = ["fiksi", "nonfiksi", "komik", "biografi", "sains", "sejarah", "psikologi", "anak", "bahasa", "fotografi", "lainnya"];
  // Pilih kategori random dari array
  return categories[Math.floor(Math.random() * categories.length)];
}

// Fungsi debounce untuk menunda eksekusi (dipakai untuk search agar tidak terlalu sering dipanggil)
function debounce(fn, wait = 220) {
  let t = null;
  return function(...args) {
    if (t) clearTimeout(t);
    // Tunggu beberapa milidetik sebelum menjalankan fungsi
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Fungsi untuk menampilkan daftar buku ke dalam grid kategori
// @param {Array} data - array objek buku yang akan ditampilkan
function renderKategori(data) {
  const grid = document.getElementById("kategoriGrid");
  grid.innerHTML = ""; // Kosongkan grid terlebih dahulu

  // update count badge under header for user feedback
  const header = document.querySelector('.kategori-header');
  if (header) {
    let cntEl = document.getElementById('kategoriCount');
    if (!cntEl) {
      cntEl = document.createElement('div');
      cntEl.id = 'kategoriCount';
      cntEl.style.marginTop = '10px';
      cntEl.style.color = '#23492b';
      cntEl.style.fontWeight = '600';
      header.appendChild(cntEl);
    }
    cntEl.textContent = 'Menampilkan 0 buku';
  }

  const noResultsEl = document.getElementById('noResults');
  // Jika tidak ada data, tampilkan pesan 'tidak ada hasil'
  if (!data || data.length === 0) {
    if (noResultsEl) noResultsEl.style.display = 'block';
    // update count
    const cntEl2 = document.getElementById('kategoriCount');
    if (cntEl2) cntEl2.textContent = 'Menampilkan 0 buku';
    return;
  }
  // Sembunyikan pesan jika ada data
  if (noResultsEl) noResultsEl.style.display = 'none';

  // update count
  const cntEl3 = document.getElementById('kategoriCount');
  if (cntEl3) cntEl3.textContent = `Menampilkan ${data.length} buku`;

  // Loop setiap buku dan buat card untuk ditampilkan
  data.forEach((book) => {
    const idxAll = allBooks.indexOf(book);
    const card = document.createElement("div");
    card.className = "kategori-card";

    card.innerHTML = `
  <div class="image-container" style="background-image: url('${book.gambar}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
  <div class="stock-badge ${book.stock === 0 ? 'out' : (book.stock < 4 ? 'low' : '')}">Stok: ${book.stock}</div>
  <div class="card-info">
    <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
    <div class="card-author">${book.penulis || '-'}</div>
    <p class="price">Rp ${book.harga.toLocaleString()}</p>
  </div>
`;

    grid.appendChild(card);
    // make the whole card clickable (image/title area)
    card.tabIndex = 0;
    card.addEventListener('click', () => openDetailModal(allBooks[idxAll]));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetailModal(allBooks[idxAll]); }
    });
  });

}

// Fungsi untuk mencari buku berdasarkan judul atau deskripsi
function searchBooks(query) {
  // Filter buku yang judulnya atau deskripsinya mengandung keyword pencarian
  const filtered = allBooks.filter(book =>
    book.judul.toLowerCase().includes(query.toLowerCase()) ||
    book.deskripsi.toLowerCase().includes(query.toLowerCase())
  );
  // Render hasil pencarian
  renderKategori(filtered);
}

// Ambil keyword search dari URL (?search=...)
function applySearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("search");

  if (!keyword) return false;

  // Reset kategori ke ALL
  activeCategory = "all";
  document.querySelectorAll(".kategori-filter button")
    .forEach(b => b.classList.remove("active"));

  const allBtn = document.querySelector(".kategori-filter button[data-filter='all']");
  if (allBtn) allBtn.classList.add("active");

  // Jalankan pencarian
  searchBooks(keyword);

  return true;
}


// Event listener untuk tombol filter kategori
document.querySelectorAll(".kategori-filter button").forEach(btn => {
  btn.addEventListener("click", () => {
    // Hapus class 'active' dari semua tombol
    document
      .querySelectorAll(".kategori-filter button")
      .forEach(b => b.classList.remove("active"));

    // Tambahkan class 'active' ke tombol yang diklik
    btn.classList.add("active");
    // Simpan kategori aktif dan filter rekomendasi + grid berdasarkan kategori
    const chosen = btn.dataset.filter || 'all';
    activeCategory = chosen;
    filterRekomendasi(chosen);
    // Render grid utama sesuai pilihan kategori
    const gridFiltered = (chosen === 'all') ? allBooks : allBooks.filter(b => b.kategori === chosen);
    console.log(`Filter: ${chosen}, Hasil: ${gridFiltered.length} buku`);
    renderKategori(gridFiltered);

    // update modal active state if modal contains the same category button
    const modal = document.getElementById('moreCategoriesModal');
    if (modal) {
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('active'));
      const modalBtn = modal.querySelector(`button[data-filter='${btn.dataset.filter}']`);
      if (modalBtn) modalBtn.classList.add('active');
    }
  });
});

// Search is provided by the site header; local search input removed.
// If you want to re-enable page-local search, recreate an input with id="searchInput"
// and reattach a debounced listener that calls `searchBooks(query)`.

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

  // reset quantity & subtotal
  if (qtyInput) qtyInput.value = 1;
  if (subtotalEl) subtotalEl.textContent = formatRp(book.harga);

  // Tampilkan modal
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  // Fokus ke tombol close untuk accessibility
  const close = modal.querySelector('.modal-close');
  close.focus();

  // set buy button dataset
  if (buyBtn) {
    buyBtn.dataset.idx = allBooks.indexOf(book);
    buyBtn.style.display = '';
  }
  if (addCartBtn) addCartBtn.dataset.idx = allBooks.indexOf(book);
  // disable purchase buttons if out of stock
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

// Setup event listener untuk modal detail buku
(function setupDetailModal() {
  const modal = document.getElementById('bookDetailModal');
  if (!modal) return;
  const close = modal.querySelector('.modal-close');
  // Tombol close untuk menutup modal
  close.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  // Klik di luar konten modal untuk menutup
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
  // Tekan tombol ESC untuk menutup modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Purchase controls: quantity, subtotal, add-to-cart, buy-now
  const qtyMinus = modal.querySelector('#qtyMinus');
  const qtyPlus = modal.querySelector('#qtyPlus');
  const qtyInput = modal.querySelector('#qtyInput');
  const subtotalEl = modal.querySelector('#detailSubtotal');
  const buyNowBtn = modal.querySelector('#buyNowBtn');
  const addToCartBtn = modal.querySelector('#addToCartBtn');
  const stockEl = modal.querySelector('#detailStock');

  function getIdxFromBtn() {
    const idx = buyNowBtn && buyNowBtn.dataset && buyNowBtn.dataset.idx ? parseInt(buyNowBtn.dataset.idx, 10) : null;
    return Number.isInteger(idx) ? idx : null;
  }

  function updateSubtotalForIdx(idx) {
    if (idx === null) return;
    const book = allBooks[idx];
    const qty = Math.max(1, Math.min(parseInt(qtyInput.value || 1, 10), book.stock || 0));
    qtyInput.value = qty;
    const total = (book.harga || 0) * qty;
    if (subtotalEl) subtotalEl.textContent = formatRp(total);
  }

  if (qtyPlus) qtyPlus.addEventListener('click', () => {
    const idx = getIdxFromBtn();
    if (idx === null) return;
    const book = allBooks[idx];
    let qty = parseInt(qtyInput.value || 1, 10);
    qty = Math.min(qty + 1, Math.max(1, book.stock || 0));
    qtyInput.value = qty;
    updateSubtotalForIdx(idx);
  });

  if (qtyMinus) qtyMinus.addEventListener('click', () => {
    const idx = getIdxFromBtn();
    if (idx === null) return;
    let qty = parseInt(qtyInput.value || 1, 10);
    qty = Math.max(1, qty - 1);
    qtyInput.value = qty;
    updateSubtotalForIdx(idx);
  });

  if (qtyInput) qtyInput.addEventListener('input', () => {
    const idx = getIdxFromBtn();
    if (idx === null) return;
    const book = allBooks[idx];
    let qty = parseInt(qtyInput.value || 1, 10);
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    qty = Math.min(qty, Math.max(0, book.stock || 0));
    qtyInput.value = qty;
    updateSubtotalForIdx(idx);
  });

  if (addToCartBtn) addToCartBtn.addEventListener('click', () => {
    const idx = addToCartBtn.dataset.idx ? parseInt(addToCartBtn.dataset.idx, 10) : null;
    if (idx === null) return alert('Tidak ada buku yang dipilih.');
    const book = allBooks[idx];
    const qty = Math.max(1, parseInt((qtyInput && qtyInput.value) || 1, 10));
    if (qty > (book.stock || 0)) return alert('Stok tidak mencukupi.');
    const cartRaw = localStorage.getItem('cart');
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    const existing = cart.find(i => i.idx === idx);
    if (existing) existing.qty = Math.min((existing.qty || 0) + qty, book.stock || existing.qty + qty);
    else cart.push({ idx, judul: book.judul, harga: book.harga, qty });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Berhasil ditambahkan ke keranjang.');
  });

  if (buyNowBtn) buyNowBtn.addEventListener('click', () => {
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
      // decrement stock
      book.stock = Math.max(0, (book.stock || 0) - qty);
      // update stock display if modal open
      if (stockEl) {
        stockEl.textContent = 'Stok: ' + book.stock;
        stockEl.classList.toggle('out', book.stock === 0);
      }
      alert('Pembayaran berhasil. Terima kasih!');
      buyNowBtn.disabled = false;
      buyNowBtn.textContent = 'Beli Sekarang';
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      // re-render grids to reflect stock change (optional)
      renderKategori(allBooks);
      renderTerlaris();
    }, 900);
  });
})();

// Fungsi untuk menampilkan buku rekomendasi dalam bentuk carousel
function renderRekomendasi() {
  const track = document.getElementById('rekomendasiTrack');
  if (!track) return;
  const dotsContainer = document.getElementById('rekomendasiDots');
  track.innerHTML = ''; // Kosongkan track carousel
  dotsContainer.innerHTML = ''; // Kosongkan dots navigasi

  // Ambil 5 buku pertama untuk ditampilkan sebagai rekomendasi
  const rekomendasiBooks = allBooks.slice(0, 5);

  // Loop setiap buku untuk membuat slide carousel
  rekomendasiBooks.forEach((book, index) => {
    const idxAll = allBooks.indexOf(book);
    const slide = document.createElement('div');
    slide.className = 'carousel-card';

    slide.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="${book.judul}" onerror="this.onerror=null;this.src='https://via.placeholder.com/260x280/90AB8B/EBF4DD?text=No+Cover'">
      </div>
      <div class="rank">${index + 1}</div>
      <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
      <div class="card-author">${book.penulis || '-'}</div>
      <p class="price">Rp ${book.harga.toLocaleString()}</p>
      <div class="stock-badge ${book.stock === 0 ? 'out' : (book.stock < 4 ? 'low' : '')}">Stok: ${book.stock}</div>
      <div class="card-actions"></div>
    `;

    track.appendChild(slide);

    // make whole slide clickable
    slide.tabIndex = 0;
    slide.addEventListener('click', () => openDetailModal(allBooks[idxAll]));
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetailModal(allBooks[idxAll]); }
    });

    // Buat dot navigasi untuk setiap slide
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Slide ke ${index + 1}`);
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });

  

  // Inisialisasi fungsi carousel (navigasi, autoplay, dll)
  initRekomCarousel();
}

// State untuk carousel rekomendasi (slide aktif, jumlah slide, lebar, gap)
let rekState = {
  current: 0, // Index slide yang sedang ditampilkan
  slides: 0, // Total jumlah slide
  slideWidth: 0, // Lebar satu slide
  gap: 20 // Jarak antar slide
};

// Fungsi untuk inisialisasi carousel: navigasi, autoplay, keyboard, dan wheel
// Carousel dimulai dari slide tengah
function initRekomCarousel() {
  const track = document.getElementById('rekomendasiTrack');
  const slides = Array.from(track.children);
  const dots = Array.from(document.getElementById('rekomendasiDots').children);
  const prev = document.getElementById('rekPrev');
  const next = document.getElementById('rekNext');

  rekState.slides = slides.length;
  rekState.current = Math.floor(rekState.slides / 2); // Mulai dari slide tengah

  function measure() {
    if (!slides[0]) return;
    rekState.slideWidth = slides[0].offsetWidth;
    const cs = getComputedStyle(track);
    rekState.gap = parseInt(cs.gap || 20, 10);
    update();
  }

  // Fungsi untuk update posisi carousel berdasarkan slide aktif
  function update() {
    const viewport = track.parentElement; // .carousel
    // Hitung offset agar slide aktif berada di tengah viewport
    const centerOffset = (viewport.offsetWidth / 2) - (rekState.slideWidth / 2);
    const translate = centerOffset - rekState.current * (rekState.slideWidth + rekState.gap);
    track.style.transform = `translateX(${translate}px)`;

    // Tambahkan class 'is-center' ke slide yang sedang aktif
    slides.forEach((s, i) => s.classList.toggle('is-center', i === rekState.current));

    // Update dots navigasi (active state)
    dots.forEach((d, i) => {
      const active = i === rekState.current;
      d.classList.toggle('active', active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });

    // Update disabled state tombol prev/next (untuk accessibility)
    if (prev) {
      const pDisabled = rekState.current === 0;
      prev.disabled = pDisabled;
      prev.setAttribute('aria-disabled', pDisabled);
    }
    if (next) {
      const nDisabled = rekState.current === rekState.slides - 1;
      next.disabled = nDisabled;
      next.setAttribute('aria-disabled', nDisabled);
    }
  }

  // Event listener untuk tombol prev (previous)
  prev.onclick = () => {
    rekState.current = Math.max(0, rekState.current - 1);
    update();
  };
  // Event listener untuk tombol next
  next.onclick = () => {
    rekState.current = Math.min(rekState.slides - 1, rekState.current + 1);
    update();
  };

  // Event listener untuk dot navigasi (klik dot untuk pindah ke slide tertentu)
  dots.forEach(d => d.addEventListener('click', (e) => {
    rekState.current = parseInt(e.currentTarget.dataset.index, 10);
    update();
  }));

  // Fungsi untuk menampilkan hint keyboard saat user navigasi dengan keyboard
  function showKeyboardHint() {
    const hint = document.getElementById('rekKeyboardHint');
    const wrapper = document.querySelector('.rekom-carousel');
    if (!hint || !wrapper) return;
    hint.classList.add('visible');
    // Sembunyikan hint setelah 2.2 detik
    window.clearTimeout(showKeyboardHint._t);
    showKeyboardHint._t = window.setTimeout(() => hint.classList.remove('visible'), 2200);
  }

  // Hapus event listener lama jika ada, lalu tambahkan yang baru
  if (rekState._keydownHandler) document.removeEventListener('keydown', rekState._keydownHandler);
  rekState._keydownHandler = (e) => {
    // Arrow Left: ke slide sebelumnya
    if (e.key === 'ArrowLeft') { prev.click(); showKeyboardHint(); }
    // Arrow Right: ke slide berikutnya
    if (e.key === 'ArrowRight') { next.click(); showKeyboardHint(); }
  };
  document.addEventListener('keydown', rekState._keydownHandler);

  // Autoplay: carousel berjalan otomatis setiap 3.5 detik
  const autoplayDelay = 3500; // ms
  let autoTimer = null;
  let autoplayActive = true;

  // Fungsi untuk memulai autoplay carousel
  function startAutoplay() {
    stopAutoplay();
    if (!autoplayActive) return;
    const wrapper = document.querySelector('.rekom-carousel');
    if (wrapper) wrapper.classList.remove('paused');
    // Otomatis pindah slide setiap interval
    autoTimer = window.setInterval(() => {
      // Loop kembali ke slide pertama jika sudah di akhir
      if (rekState.current >= rekState.slides - 1) rekState.current = 0; else rekState.current += 1;
      update();
    }, autoplayDelay);
  }

  // Fungsi untuk menghentikan autoplay carousel
  function stopAutoplay() {
    if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; }
    const wrapper = document.querySelector('.rekom-carousel');
    if (wrapper) wrapper.classList.add('paused');
  }

  // Pause autoplay saat user interaksi, lalu resume setelah beberapa detik
  function resetAutoplay() {
    stopAutoplay();
    window.clearTimeout(resetAutoplay._t);
    resetAutoplay._t = window.setTimeout(() => {
      autoplayActive = true;
      startAutoplay();
    }, 3500);
  }

  // Pause autoplay saat hover/focus, dan support navigasi dengan scroll/wheel
  const wrapperEl = document.querySelector('.rekom-carousel');
  if (wrapperEl) {
    // Pause saat mouse enter
    wrapperEl.addEventListener('mouseenter', stopAutoplay);
    // Resume autoplay saat mouse leave
    wrapperEl.addEventListener('mouseleave', () => { autoplayActive = true; startAutoplay(); });
    // Pause saat user focus ke carousel (keyboard navigation)
    wrapperEl.addEventListener('focusin', () => { stopAutoplay(); showKeyboardHint(); });
    // Resume saat focus keluar
    wrapperEl.addEventListener('focusout', () => { autoplayActive = true; startAutoplay(); });

    // Navigasi carousel dengan scroll wheel/trackpad
    let wheelTimeout = null;
    // Hapus handler lama jika ada
    if (rekState._wheelHandler) wrapperEl.removeEventListener('wheel', rekState._wheelHandler, { passive: false });
    rekState._wheelHandler = function(e) {
      // Deteksi arah scroll (vertical atau horizontal)
      const primaryDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      // Abaikan gerakan kecil
      if (Math.abs(primaryDelta) < 8) return;

      // Prevent page scroll saat navigasi carousel
      e.preventDefault();

      // Throttle: abaikan event wheel yang terlalu cepat
      if (wheelTimeout) return;

      // Scroll down/right: next slide
      if (primaryDelta > 0) {
        next.click();
      } else {
        // Scroll up/left: prev slide
        prev.click();
      }

      // Pause dan resume autoplay setelah interaksi
      resetAutoplay();

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 300);
    };
    wrapperEl.addEventListener('wheel', rekState._wheelHandler, { passive: false });
  }

  // Pause autoplay saat tab/halaman tidak terlihat (user pindah tab)
  if (rekState._visibilityHandler) document.removeEventListener('visibilitychange', rekState._visibilityHandler);
  rekState._visibilityHandler = () => { if (document.hidden) stopAutoplay(); else { autoplayActive = true; startAutoplay(); } };
  document.addEventListener('visibilitychange', rekState._visibilityHandler);

  // Saat user klik prev/next/dots, anggap sebagai interaksi manual
  prev.addEventListener('click', resetAutoplay);
  next.addEventListener('click', resetAutoplay);
  dots.forEach(d => d.addEventListener('click', resetAutoplay));

  // Re-measure saat window di-resize
  if (rekState._resizeHandler) window.removeEventListener('resize', rekState._resizeHandler);
  rekState._resizeHandler = measure;
  window.addEventListener('resize', rekState._resizeHandler);

  // Ukur lebar slide dan mulai autoplay
  measure();
  startAutoplay();
}


// Fungsi untuk menampilkan buku terlaris dalam grid
function renderTerlaris() {
  const grid = document.getElementById("terlarisGrid");
  if (!grid) return; // Guard clause agar tidak error jika ID tidak ada
  
  grid.innerHTML = ""; 
  const terlarisBooks = allBooks.slice(0, 8); // Mengambil 8 buku teratas

  terlarisBooks.forEach((book) => {
    const idxAll = allBooks.indexOf(book);
    const card = document.createElement("div");
    card.className = "terlaris-card";

    card.innerHTML = `
  <div class="image-container" style="background-image: url('${book.gambar}');">
  </div>
  <div class="card-info">
    <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
    <div class="card-author">${book.penulis || '-'}</div>
    <p class="price">Rp ${book.harga.toLocaleString()}</p>
  </div>
`;

    grid.appendChild(card);
    // make terlaris card clickable
    card.tabIndex = 0;
    card.addEventListener('click', () => openDetailModal(allBooks[idxAll]));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetailModal(allBooks[idxAll]); }
    });
  });
  
} 

// Setup modal 'Lainnya' untuk kategori tambahan
(function setupModal() {
  const moreBtn = document.querySelector('.lainnya-btn');
  const modal = document.getElementById('moreCategoriesModal');
  if (!moreBtn || !modal) return;

  const modalClose = modal.querySelector('.modal-close');

  // Fungsi untuk membuka modal kategori
  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    moreBtn.classList.add('open');
    moreBtn.setAttribute('aria-expanded', 'true');
  }
  // Fungsi untuk menutup modal kategori
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    moreBtn.classList.remove('open');
    moreBtn.setAttribute('aria-expanded', 'false');
  }

  // Toggle modal saat tombol 'Lainnya' diklik
  moreBtn.addEventListener('click', (e) => {
    if (modal.classList.contains('open')) closeModal(); else openModal();
  });
  // Tombol X untuk menutup modal
  modalClose.addEventListener('click', closeModal);

  // Klik di luar konten modal untuk menutup
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Tekan ESC untuk menutup modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Event listener untuk semua tombol kategori di dalam modal
  modal.querySelectorAll('.mega-col button, .mega-left button').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      // Update active state di modal
      modal.querySelectorAll('.mega-col button, .mega-left button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update tombol filter di bagian atas jika ada
      document.querySelectorAll('.kategori-filter button').forEach(b => b.classList.remove('active'));
      const topBtn = document.querySelector(`.kategori-filter button[data-filter='${category}']`);
      if (topBtn) topBtn.classList.add('active');

      // Set kategori aktif, filter rekomendasi, dan render grid utama
      activeCategory = category || 'all';
      filterRekomendasi(category);
      const gridFiltered = (category === 'all') ? allBooks : allBooks.filter(b => b.kategori === category);
      renderKategori(gridFiltered);
      closeModal();
    });
  });


// Fungsi untuk filter carousel rekomendasi berdasarkan kategori
function filterRekomendasi(category) {
  const track = document.getElementById('rekomendasiTrack');
  const dotsContainer = document.getElementById('rekomendasiDots');
  track.innerHTML = ''; // Kosongkan carousel
  dotsContainer.innerHTML = ''; // Kosongkan dots

  // Filter buku berdasarkan kategori, atau ambil semua jika 'all'
  const filtered = category === 'all'
    ? allBooks.slice(0, 5)
    : allBooks.filter(b => b.kategori === category).slice(0, 5);

  filtered.forEach((book, index) => {
    const idxAll = allBooks.indexOf(book);
    const slide = document.createElement('div');
    slide.className = 'carousel-card';

    slide.innerHTML = `
      <div class="image-container">
        <img src="${book.gambar}" alt="${book.judul}">
      </div>
      <div class="rank">${index + 1}</div>
      <h3 class="card-title" title="${book.judul}">${book.judul}</h3>
      <p class="price">Rp ${book.harga.toLocaleString()}</p>
      <div class="card-actions"></div>
    `;

    track.appendChild(slide);
    // make slide clickable
    slide.tabIndex = 0;
    slide.addEventListener('click', () => openDetailModal(allBooks[idxAll]));
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetailModal(allBooks[idxAll]); }
    });

    // create dot
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Slide ke ${index + 1}`);
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });

  

  // Re-inisialisasi carousel agar ukuran dan posisi benar
  initRekomCarousel();
}

  // Toggle tab 'Buku' dan 'Non Buku' di modal
  modal.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      modal.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      // Bisa digunakan untuk switch konten berdasarkan tab
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

// --- BAGIAN INISIALISASI ---

loadData()
  .then(() => {
    console.log("Data berhasil dimuat, memulai proses inisialisasi...");

    // 1. Cek Parameter Pencarian dari URL
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("search");

    if (keyword) {
      // Jika ada keyword, jalankan fungsi pencarian
      searchBooks(keyword);
      
      // Update judul halaman agar user tahu mereka sedang melihat hasil cari
      const titleEl = document.querySelector('.kategori-header h1');
      if (titleEl) titleEl.innerText = `Hasil Pencarian: "${keyword}"`;
    } else {
      // Jika tidak ada pencarian, tampilkan semua kategori (default: all)
      if (typeof renderKategori === 'function') {
        renderKategori(allBooks);
      }
    }

    // 2. Render Komponen Tambahan (Terlaris & Rekomendasi)
    if (typeof renderTerlaris === 'function') {
      renderTerlaris();
    }
    
    if (typeof renderRekomendasi === 'function') {
      renderRekomendasi();
    }

    console.log("Inisialisasi Halaman Selesai.");
  })
  .catch((err) => {
    console.error("Gagal melakukan inisialisasi halaman:", err);
  });