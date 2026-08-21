document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("concert-carousel");
    const nextConcert = document.getElementById("next-concert");
    const sectionConcerts = document.getElementById("concerts");
    const btnPrev = document.getElementById("carousel-prev");
    const btnNext = document.getElementById("carousel-next");

    if (!carousel) return;

    function getScrollStep() {
        const card = carousel.querySelector(".concert-card");
        const gap = parseFloat(window.getComputedStyle(carousel).gap) || 24;
        return card ? card.offsetWidth + gap : 400;
    }

    btnPrev?.addEventListener("click", () => {
        carousel.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });

    btnNext?.addEventListener("click", () => {
        carousel.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });


    carousel.addEventListener("scroll", () => {
        sessionStorage.setItem("carousel_scroll_pos", `${carousel.scrollLeft}`);
    }, { passive: true });

    const savedScroll = sessionStorage.getItem("carousel_scroll_pos");

    if (savedScroll !== null) {
        carousel.scrollLeft = parseFloat(savedScroll);
        return;
    }


    if (!nextConcert || !sectionConcerts) return;

    const targetLeft = nextConcert.offsetLeft - (carousel.offsetWidth - nextConcert.offsetWidth) / 2;

    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 24;
    const step = nextConcert.offsetWidth + gap;

    // Pré-positionnement 2 cartes avant la cible
    carousel.scrollLeft = Math.max(0, targetLeft - (step * 2));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                carousel.scrollTo({
                    left: targetLeft,
                    behavior: "smooth"
                });
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.35
    });

    observer.observe(sectionConcerts);
});