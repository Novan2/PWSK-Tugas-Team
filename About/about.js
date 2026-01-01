// about.js — interaksi sederhana untuk About page

// Set tahun di footer
(function setYear(){
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;
})();

// Reveal sections on scroll using IntersectionObserver with a scroll fallback
(function revealOnScroll(){
  const sections = document.querySelectorAll('.about-page section');
  if(!sections.length) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    sections.forEach(s => obs.observe(s));
  } else {
    // fallback
    const onScroll = () => {
      const windowBottom = window.scrollY + window.innerHeight;
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if(windowBottom > top + 60) s.classList.add('visible');
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

// Small accessibility enhancement: focus outline for keyboard users
(function addKeyboardOutline(){
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.body.classList.add('show-focus-outlines');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();
