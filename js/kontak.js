document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById("contact-form");
    const modalSuccess = document.getElementById("success-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Mencegah reload halaman
            validateAndSubmit();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            closeModal();
        });
    }

    // Tutup modal jika klik di luar konten
    window.addEventListener("click", (e) => {
        if (e.target === modalSuccess) {
            closeModal();
        }
    });

    function validateAndSubmit() {
        // Ambil nilai input
        const name = document.getElementById("name").value.trim();
        const company = document.getElementById("company").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validasi Sederhana
        if (!name || !company || !phone || !email || !subject || !message) {
            showAlert("Semua field harus diisi!", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showAlert("Alamat email tidak valid!", "error");
            return;
        }

        // Jika valid, tampilkan modal sukses
        showModal();
        contactForm.reset();
    }

    function showModal() {
        if (modalSuccess) {
            modalSuccess.style.display = "flex";
        }
    }

    function closeModal() {
        if (modalSuccess) {
            modalSuccess.style.display = "none";
        }
    }

    function showAlert(message, type) {
        const alertMessage = document.getElementById("alert-message");
        if (alertMessage) {
            alertMessage.textContent = message;
            alertMessage.className = "alert " + type;
            alertMessage.style.display = "block";

            setTimeout(() => {
                alertMessage.style.display = "none";
            }, 3000);
        }
    }
});
