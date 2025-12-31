// about.js — interaksi sederhana untuk About page

// Set tahun di footer
(function setYear(){
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;
})();

// Reveal sections on scroll (simple, dependency-free)
(function revealOnScroll(){
  const sections = document.querySelectorAll('.about-page section');
  if(!sections.length) return;

  function reveal(){
    const windowBottom = window.scrollY + window.innerHeight;
    sections.forEach(s=>{
      const rect = s.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if(windowBottom > top + 60){
        s.classList.add('visible');
      }
    });
  }

  // initial reveal
  reveal();
  window.addEventListener('scroll', reveal, {passive:true});
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
