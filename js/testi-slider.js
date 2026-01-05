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
    const containerWidth = slider.parentElement.offsetWidth;
    const cardWidth = cards[currentIndex].offsetWidth;
    const centerOffset = (containerWidth / 2) - (cardWidth / 2);
    const cardRect = cards[currentIndex].offsetLeft;
    const finalOffset = centerOffset - cardRect;

    slider.style.transform = `translateX(${finalOffset}px)`;
    cards.forEach((card, index) => {
        card.classList.toggle("active", index === currentIndex);
    });
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