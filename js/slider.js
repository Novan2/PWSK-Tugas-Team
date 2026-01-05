const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-button.left");
const nextBtn = document.querySelector(".carousel-button.right");
const firstDot = document.querySelector('.dot[data-index="first"]');
const lastDot  = document.querySelector('.dot[data-index="last"]');

if (!carousel || !track || !prevBtn || !nextBtn || !firstDot || !lastDot) {
  throw new Error("Elemen carousel / tombol / dot tidak ditemukan");
}

// ==== UTIL ====
function getGapPx() {
  const gap = getComputedStyle(track).gap;
  const n = parseFloat(gap);
  return Number.isFinite(n) ? n : 0;
}

function getItemWidth() {
  const item = track.querySelector(".book-card");
  if (!item) return 300;
  return item.getBoundingClientRect().width + getGapPx();
}

function maxScrollLeft() {
  return Math.max(0, carousel.scrollWidth - carousel.clientWidth);
}

// ==== DOT CONTROL ====
function setActive(which) {
  firstDot.classList.toggle("active", which === "first");
  lastDot.classList.toggle("active", which === "last");
}

function updateDots() {
  const maxLeft = maxScrollLeft();
  const left = carousel.scrollLeft;

  // Jika tidak ada overflow, selalu first
  if (maxLeft <= 0) {
    setActive("first");
    return;
  }

  // Toleransi supaya tidak sensitif terhadap rounding / smooth scroll
  const EPS = 30;

  if (left >= maxLeft - EPS) setActive("last");
  else setActive("first");
}

// ==== ACTIONS ====
function scrollToFirst() {
  carousel.scrollTo({ left: 0, behavior: "smooth" });
}

function scrollToLast() {
  carousel.scrollTo({ left: maxScrollLeft(), behavior: "smooth" });
}

function scrollByOneCard(dir = 1) {
  carousel.scrollBy({ left: dir * getItemWidth(), behavior: "smooth" });
}

// ==== EVENTS ====
nextBtn.addEventListener("click", () => scrollByOneCard(1));
prevBtn.addEventListener("click", () => scrollByOneCard(-1));

firstDot.addEventListener("click", scrollToFirst);
lastDot.addEventListener("click", scrollToLast);

carousel.addEventListener("scroll", () => {
  requestAnimationFrame(updateDots);
});

window.addEventListener("resize", () => {
  requestAnimationFrame(updateDots);
});

// ==== INIT STABIL UNTUK KONTEN DINAMIS ====
function initCarouselUI() {
  // Paksa default first
  setActive("first");

  // Paksa posisi awal
  carousel.scrollLeft = 0;

  // Sinkronkan setelah layout stabil
  requestAnimationFrame(updateDots);
}

// Jalankan saat DOM siap (lebih aman daripada langsung eksekusi)
window.addEventListener("load", initCarouselUI);

// Observasi perubahan isi track (karena buku di-render dinamis dari API)
const observer = new MutationObserver(() => {
  // Setelah item muncul/berubah, reset ke awal dan update dot
  initCarouselUI();
});
observer.observe(track, { childList: true, subtree: false });
