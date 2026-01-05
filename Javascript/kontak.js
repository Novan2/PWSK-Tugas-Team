function validateForm() {
    // Ambil nilai dari setiap input
    var name = document.getElementById("name").value;
    var company = document.getElementById("company").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    // Validasi: Cek apakah semua field sudah diisi
    if (name === "" || company === "" || phone === "" || email === "" || subject === "" || message === "") {
        showAlert("Semua field harus diisi!", "error");
        return false;
    }

    // Validasi Email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showAlert("Alamat email tidak valid!", "error");
        return false;
    }

    // Jika semua validasi lulus, tampilkan alert sukses
    showAlert("Pesan Anda telah dikirim dengan sukses!", "success");
    document.getElementById("contact-form").reset(); // Reset form setelah kirim
}

// Fungsi untuk menampilkan alert
function showAlert(message, type) {
    var alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    alertMessage.className = "alert " + type; // Menambahkan kelas berdasarkan tipe
    alertMessage.style.display = "block"; // Menampilkan alert

    // Menghilangkan alert setelah 5 detik
    setTimeout(function() {
        alertMessage.style.display = "none";
    }, 5000);
}
