/*
  kategori-carousel.js
  Menangani carousel untuk rekomendasi dan terlaris
*/

console.log("kategori-carousel.js loaded");

// State untuk carousel rekomendasi
let rekState = {
  current: 0,
  slides: 0,
  slideWidth: 0,
  gap: 20
};

// Fungsi untuk menampilkan buku rekomendasi dalam bentuk carousel
function renderRekomendasi() {
  const track = document.getElementById('rekomendasiTrack');
  if (!track) return;
  
  const dotsContainer = document.getElementById('rekomendasiDots');
  track.innerHTML = '';
  dotsContainer.innerHTML = '';

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

    // Make whole slide clickable
    slide.tabIndex = 0;
    slide.addEventListener('click', () => openDetailModal(allBooks[idxAll]));
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        openDetailModal(allBooks[idxAll]); 
      }
    });

    // Buat dot navigasi untuk setiap slide
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Slide ke ${index + 1}`);
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });

  // Inisialisasi fungsi carousel
  initRekomCarousel();
}

// Fungsi untuk inisialisasi carousel rekomendasi
function initRekomCarousel() {
  const track = document.getElementById('rekomendasiTrack');
  const slides = Array.from(track.children);
  const dots = Array.from(document.getElementById('rekomendasiDots').children);
  const prev = document.getElementById('rekPrev');
  const next = document.getElementById('rekNext');

  rekState.slides = slides.length;
  if (rekState.slides === 0) return;

  // Compute slide width
  const firstSlide = slides[0];
  const style = window.getComputedStyle(firstSlide);
  rekState.slideWidth = firstSlide.offsetWidth + parseFloat(style.marginRight || 0);

  // Start from middle slide (index 2)
  rekState.current = 2;
  updateRekomCarousel();

  // Prev/Next buttons
  if (prev) {
    prev.addEventListener('click', () => {
      rekState.current = (rekState.current - 1 + rekState.slides) % rekState.slides;
      updateRekomCarousel();
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      rekState.current = (rekState.current + 1) % rekState.slides;
      updateRekomCarousel();
    });
  }

  // Dots navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      rekState.current = parseInt(dot.dataset.index, 10);
      updateRekomCarousel();
    });
  });

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rekState.current = (rekState.current - 1 + rekState.slides) % rekState.slides;
      updateRekomCarousel();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      rekState.current = (rekState.current + 1) % rekState.slides;
      updateRekomCarousel();
    }
  });

  // Mouse wheel navigation
  track.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      rekState.current = (rekState.current + 1) % rekState.slides;
    } else {
      rekState.current = (rekState.current - 1 + rekState.slides) % rekState.slides;
    }
    updateRekomCarousel();
  }, { passive: false });

  // Auto-play carousel
  setInterval(() => {
    rekState.current = (rekState.current + 1) % rekState.slides;
    updateRekomCarousel();
  }, 5000);
}

// Update posisi carousel rekomendasi
function updateRekomCarousel() {
  const track = document.getElementById('rekomendasiTrack');
  const slides = Array.from(track.children);
  const dots = Array.from(document.getElementById('rekomendasiDots').children);

  const offset = -rekState.current * rekState.slideWidth;
  track.style.transform = `translateX(${offset}px)`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === rekState.current);
  });

  // Update slide active state
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === rekState.current);
  });
}

// Fungsi untuk menampilkan buku terlaris dalam bentuk carousel
function renderTerlaris() {
  const track = document.getElementById('terlarisTrack');
  if (!track) return;
  
  const dotsContainer = document.getElementById('terlarisDots');
  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  // Ambil 5 buku pertama untuk ditampilkan sebagai terlaris
  const terlarisBooks = allBooks.slice(0, 5);

  terlarisBooks.forEach((book, index) => {
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
    
    // Make slide clickable
    slide.tabIndex = 0;
    slide.addEventListener('click', () => openDetailModal(allBooks[idxAll]));
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        openDetailModal(allBooks[idxAll]); 
      }
    });

    // Create dot
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
