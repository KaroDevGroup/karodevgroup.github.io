document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".stack-section");

    function updateStackScroll() {

        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {

            const rect = section.getBoundingClientRect();

            const progress = Math.min(
                Math.max(-rect.top / windowHeight, 0),
                1
            );

            const scale = 1 - (progress * 0.06);

            const brightness = 1 - (progress * 0.35);

            const blur = progress * 2;

            section.style.transform =
                `scale(${scale}) translateZ(0)`;

            section.style.filter =
                `brightness(${brightness}) blur(${blur}px)`;

            section.style.zIndex = index + 1;
        });
    }

    window.addEventListener(
        "scroll",
        updateStackScroll,
        { passive: true }
    );

    updateStackScroll();

});

const revealElements = document.querySelectorAll(
    ".feature-card, .download-card, .security-card, .github-section"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(element => {
    observer.observe(element);
});