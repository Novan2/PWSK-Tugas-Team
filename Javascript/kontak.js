document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Menghentikan form agar tidak reload

    // Ambil nilai input
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();

    // Ambil elemen error
    const namaErr = document.getElementById('namaError');
    const emailErr = document.getElementById('emailError');
    const pesanErr = document.getElementById('pesanError');

    let valid = true;

    // Validasi Nama
    if (nama.length < 3) {
        namaErr.style.display = 'block';
        valid = false;
    } else {
        namaErr.style.display = 'none';
    }

    // Validasi Email (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailErr.style.display = 'block';
        valid = false;
    } else {
        emailErr.style.display = 'none';
    }

    // Validasi Pesan
    if (pesan === "") {
        pesanErr.style.display = 'block';
        valid = false;
    } else {
        pesanErr.style.display = 'none';
    }

    // Jika semua valid
    if (valid) {
        alert("Pesan Berhasil Terkirim!\n\nNama: " + nama + "\nEmail: " + email);
        
        // Reset form setelah sukses
        document.getElementById('contactForm').reset();
    }
});