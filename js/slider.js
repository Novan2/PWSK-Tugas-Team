class HeroSlider {
  constructor(selectors) {
    // 1. Select Elements
    this.carousel = document.querySelector(selectors.carousel);
    this.track = document.querySelector(selectors.track);
    this.prevBtn = document.querySelector(selectors.prevBtn);
    this.nextBtn = document.querySelector(selectors.nextBtn);
    // Dots bisa jadi opsional, tapi kita asumsikan ada sesuai struktur HTML saat ini
    this.firstDot = document.querySelector(selectors.firstDot);
    this.lastDot = document.querySelector(selectors.lastDot);

    // 2. Guard Clause: Jika elemen tidak ditemukan, stop tanpa error fatal
    if (!this.carousel || !this.track) {
      console.warn("HeroSlider: Elemen carousel tidak ditemukan. Slider dinonaktifkan.");
      return;
    }

    // 3. State & Config
    this.config = {
      scrollBehavior: "smooth",
      debounceTime: 50, // ms
    };

    // Binding methods agar context 'this' aman
    this.updateDots = this.debounce(this.updateDots.bind(this), this.config.debounceTime);
    this.init = this.init.bind(this);

    // 4. Initialize
    this.init();
  }

  // --- UTILITIES ---

  // Debounce function untuk membatasi frekuensi pemanggilan event (scroll/resize)
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  getGapPx() {
    const gap = window.getComputedStyle(this.track).gap;
    const n = parseFloat(gap);
    return Number.isFinite(n) ? n : 0;
  }

  getItemWidth() {
    // Ambil item pertama sebagai referensi lebar
    const item = this.track.firstElementChild || this.track.querySelector(".book-card");
    if (!item) return 300; // Fallback width
    return item.getBoundingClientRect().width + this.getGapPx();
  }

  getMaxScrollLeft() {
    return Math.max(0, this.carousel.scrollWidth - this.carousel.clientWidth);
  }

  // --- ACTIONS ---

  scrollTo(leftPosition) {
    this.carousel.scrollTo({
      left: leftPosition,
      behavior: this.config.scrollBehavior,
    });
  }

  scrollToFirst() {
    this.scrollTo(0);
  }

  scrollToLast() {
    this.scrollTo(this.getMaxScrollLeft());
  }

  scrollByOne(direction = 1) {
    this.carousel.scrollBy({
      left: direction * this.getItemWidth(),
      behavior: this.config.scrollBehavior,
    });
  }

  // --- UI UPDATES ---

  setActiveDot(which) {
    if (this.firstDot) this.firstDot.classList.toggle("active", which === "first");
    if (this.lastDot) this.lastDot.classList.toggle("active", which === "last");
  }

  updateDots() {
    if (!this.firstDot || !this.lastDot) return;

    const maxLeft = this.getMaxScrollLeft();
    const currentLeft = this.carousel.scrollLeft;

    // Jika konten tidak cukup lebar untuk di-scroll, anggap di posisi awal
    if (maxLeft <= 0) {
      this.setActiveDot("first");
      return;
    }

    // Toleransi EPS (epsilon) untuk menangani sub-pixel rendering atau rounding
    const EPS = 30;

    if (currentLeft >= maxLeft - EPS) {
      this.setActiveDot("last");
    } else {
      this.setActiveDot("first");
    }
  }

  // --- SETUP ---

  attachEvents() {
    // Tombol Navigasi
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.scrollByOne(1));
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.scrollByOne(-1));

    // Dots Navigasi
    if (this.firstDot) this.firstDot.addEventListener("click", () => this.scrollToFirst());
    if (this.lastDot) this.lastDot.addEventListener("click", () => this.scrollToLast());

    // Scroll & Resize (menggunakan version yang sudah di-debounce)
    this.carousel.addEventListener("scroll", this.updateDots);
    window.addEventListener("resize", this.updateDots);
  }

  initObserver() {
    // MutationObserver untuk mendeteksi perubahan konten (misal data dimuat dari API)
    // Saat konten berubah, kita perlu update UI dots lagi.
    this.observer = new MutationObserver(() => {
      this.scrollToFirst(); // Reset ke awal saat data berubah
      this.updateDots();
    });

    this.observer.observe(this.track, { childList: true, subtree: false });
  }

  init() {
    // Set state awal
    this.scrollToFirst();
    this.updateDots();

    // Pasang listeners
    this.attachEvents();
    this.initObserver();

    console.log("HeroSlider initialized.");
  }
}

// Instantiate Slider saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  new HeroSlider({
    carousel: ".carousel",
    track: ".carousel-track",
    prevBtn: ".carousel-button.left",
    nextBtn: ".carousel-button.right",
    firstDot: '.dot[data-index="first"]',
    lastDot: '.dot[data-index="last"]',
  });
});
