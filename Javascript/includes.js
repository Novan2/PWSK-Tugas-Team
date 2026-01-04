(function () {
  /**
   * Memuat file HTML eksternal ke dalam elemen dengan atribut data-include-src
   */
  async function loadIncludes() {
    const nodes = document.querySelectorAll('[data-include-src]');

    for (const node of nodes) {
      const src = node.getAttribute('data-include-src');
      if (!src) continue;

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Gagal memuat ${src}: ${response.status}`);
        
        const html = await response.text();
        node.innerHTML = html;

        // --- OPTIONAL: Penyesuaian Path Otomatis ---
        // Jika file yang di-include punya link/gambar relatif, 
        // kita bisa menyesuaikannya di sini jika diperlukan.
        
        // Eksekusi script di dalam HTML yang baru dimuat
        const scripts = node.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
          oldScript.remove();
        });

      } catch (err) {
        console.error("Error Includes:", err);
        node.innerHTML = `<div style="color:red; padding:10px; border:1px dashed red;">
          Gagal memuat file: ${src}. Pastikan file tersedia dan gunakan Live Server.
        </div>`;
      }
    }
  }

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();