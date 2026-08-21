document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    const mediaQuery = window.matchMedia("(min-width: 768px)");

    function openMenu() {
        hamburger.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("aria-hidden", "false");
        mobileMenu.classList.add("is-open");
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        hamburger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    }

    function toggleMenu() {
        const isOpen = hamburger.getAttribute("aria-expanded") === "true";
        isOpen ? closeMenu() : openMenu();
    }

    hamburger.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
            closeMenu();
        }
    });

    mediaQuery.addEventListener("change", (e) => {
        if (e.matches) {
            closeMenu();
        }
    });
});