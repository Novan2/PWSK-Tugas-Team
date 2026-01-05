class HeroSlider {
  constructor(selectors) {
    this.carousel = document.querySelector(selectors.carousel);
    this.track = document.querySelector(selectors.track);
    this.prevBtn = document.querySelector(selectors.prevBtn);
    this.nextBtn = document.querySelector(selectors.nextBtn);
    this.firstDot = document.querySelector(selectors.firstDot);
    this.lastDot = document.querySelector(selectors.lastDot);

    if (!this.carousel || !this.track) {
      return;
    }

    this.config = {
      scrollBehavior: "smooth",
      debounceTime: 50,
    };

    this.updateDots = this.debounce(this.updateDots.bind(this), this.config.debounceTime);
    this.init = this.init.bind(this);
    this.init();
  }

  // Membatasi frekuensi pemanggilan event
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
    const item = this.track.firstElementChild || this.track.querySelector(".book-card");
    if (!item) return 300;
    return item.getBoundingClientRect().width + this.getGapPx();
  }

  getMaxScrollLeft() {
    return Math.max(0, this.carousel.scrollWidth - this.carousel.clientWidth);
  }

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

  setActiveDot(which) {
    if (this.firstDot) this.firstDot.classList.toggle("active", which === "first");
    if (this.lastDot) this.lastDot.classList.toggle("active", which === "last");
  }

  updateDots() {
    if (!this.firstDot || !this.lastDot) return;

    const maxLeft = this.getMaxScrollLeft();
    const currentLeft = this.carousel.scrollLeft;

    if (maxLeft <= 0) {
      this.setActiveDot("first");
      return;
    }

    const EPS = 30;
    if (currentLeft >= maxLeft - EPS) {
      this.setActiveDot("last");
    } else {
      this.setActiveDot("first");
    }
  }

  attachEvents() {
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.scrollByOne(1));
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.scrollByOne(-1));
    if (this.firstDot) this.firstDot.addEventListener("click", () => this.scrollToFirst());
    if (this.lastDot) this.lastDot.addEventListener("click", () => this.scrollToLast());

    this.carousel.addEventListener("scroll", this.updateDots);
    window.addEventListener("resize", this.updateDots);
  }

  initObserver() {
    // Reset ke awal jika konten berubah
    this.observer = new MutationObserver(() => {
      this.scrollToFirst();
      this.updateDots();
    });

    this.observer.observe(this.track, { childList: true, subtree: false });
  }

  init() {
    this.scrollToFirst();
    this.updateDots();
    this.attachEvents();
    this.initObserver();
  }
}

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
