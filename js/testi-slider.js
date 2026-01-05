document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("testi-slider");
    const cards = document.querySelectorAll(".testi-card");
    const dots = document.querySelectorAll(".dot");
    const nextBtn = document.querySelector(".carousel-button.right");
    const prevBtn = document.querySelector(".carousel-button.left");

    let currentIndex = 0;
    const totalSlides = cards.length;
    let autoPlayInterval;

    function updateSlider() {
        // 1. Geser track seperti kereta api
        // Kita hitung lebar kartu + gap (kira-kira 380px)
        const cardWidth = cards[0].offsetWidth + 30; 
        const offset = -(currentIndex * cardWidth);
        slider.style.transform = `translateX(${offset}px)`;

        // 2. Update Class Active untuk efek kartu fokus
        cards.forEach((card, index) => {
            card.classList.toggle("active", index === currentIndex);
        });

        // 3. Update Dots
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function moveNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function movePrev() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event Listeners
    nextBtn.addEventListener("click", () => { moveNext(); resetTimer(); });
    prevBtn.addEventListener("click", () => { movePrev(); resetTimer(); });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
            resetTimer();
        });
    });

    // Auto Play
    function startTimer() {
        autoPlayInterval = setInterval(moveNext, 3000);
    }

    function resetTimer() {
        clearInterval(autoPlayInterval);
        startTimer();
    }

    // Pause saat kursor masuk
    slider.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
    slider.addEventListener("mouseleave", startTimer);

    // Jalankan pertama kali
    updateSlider();
    startTimer();
});