document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================================
           ELEMENTS
           ========================================================= */

        const stage =
            document.getElementById(
                "featureCarousel"
            );


        const track =
            document.getElementById(
                "carouselTrack"
            );


        const slides =
            document.querySelectorAll(
                ".feature-slide"
            );


        const markers =
            document.querySelectorAll(
                ".carousel-marker"
            );


        const prevButton =
            document.getElementById(
                "carouselPrev"
            );


        const nextButton =
            document.getElementById(
                "carouselNext"
            );


        const currentSlideNumber =
            document.getElementById(
                "currentSlideNumber"
            );


        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        const navLinks =
            document.getElementById(
                "navLinks"
            );


        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        let activeSlide =
            0;


        let scrollDriven =
            true;


        let ticking =
            false;



        /* =========================================================
           HELPERS
           ========================================================= */

        function clamp(
            value,
            min,
            max
        ) {

            return Math.min(
                Math.max(
                    value,
                    min
                ),
                max
            );

        }



        function formatSlideNumber(
            index
        ) {

            return String(
                index + 1
            ).padStart(
                2,
                "0"
            );

        }



        /* =========================================================
           SET ACTIVE SLIDE
           ========================================================= */

        function setActiveSlide(
            index
        ) {

            index =
                clamp(
                    index,
                    0,
                    slides.length - 1
                );


            activeSlide =
                index;


            if (track) {

                track.style.transform =
                    `translate3d(
                        -${index * 100}%,
                        0,
                        0
                    )`;

            }


            slides.forEach(
                (slide, slideIndex) => {

                    slide.classList.toggle(
                        "active",
                        slideIndex === index
                    );

                }
            );


            markers.forEach(
                (marker, markerIndex) => {

                    marker.classList.toggle(
                        "active",
                        markerIndex === index
                    );

                }
            );


            if (currentSlideNumber) {

                currentSlideNumber.textContent =
                    formatSlideNumber(
                        index
                    );

            }

        }



        /* =========================================================
           SCROLL-DRIVEN CAROUSEL
           ========================================================= */

        function updateCarouselFromScroll() {

            ticking =
                false;


            if (
                !stage ||
                window.innerWidth <= 850 ||
                reducedMotion.matches ||
                !scrollDriven
            ) {
                return;
            }


            const rect =
                stage.getBoundingClientRect();


            const scrollDistance =
                stage.offsetHeight -
                window.innerHeight;


            if (
                scrollDistance <= 0
            ) {
                return;
            }


            const traveled =
                clamp(
                    -rect.top,
                    0,
                    scrollDistance
                );


            const progress =
                traveled /
                scrollDistance;


            const rawIndex =
                Math.round(
                    progress *
                    (
                        slides.length -
                        1
                    )
                );


            setActiveSlide(
                rawIndex
            );

        }



        function requestScrollUpdate() {

            if (ticking) {
                return;
            }


            ticking =
                true;


            window.requestAnimationFrame(
                updateCarouselFromScroll
            );

        }



        window.addEventListener(
            "scroll",
            requestScrollUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            () => {

                scrollDriven =
                    true;


                requestScrollUpdate();

            },
            {
                passive: true
            }
        );



        /* =========================================================
           MARKER CONTROLS
           ========================================================= */

        markers.forEach(
            marker => {

                marker.addEventListener(
                    "click",
                    () => {

                        const target =
                            Number(
                                marker.dataset.slideTarget
                            );


                        if (
                            Number.isNaN(target)
                        ) {
                            return;
                        }


                        /*
                         * On desktop, clicking a marker
                         * moves the actual page scroll
                         * position so the scroll-driven
                         * animation remains synchronized.
                         */

                        if (
                            stage &&
                            window.innerWidth > 850 &&
                            !reducedMotion.matches
                        ) {

                            const stageTop =
                                window.scrollY +
                                stage.getBoundingClientRect().top;


                            const scrollDistance =
                                stage.offsetHeight -
                                window.innerHeight;


                            const targetProgress =
                                target /
                                (
                                    slides.length -
                                    1
                                );


                            window.scrollTo({
                                top:
                                    stageTop +
                                    (
                                        scrollDistance *
                                        targetProgress
                                    ),
                                behavior:
                                    "smooth"
                            });

                        }

                        else {

                            setActiveSlide(
                                target
                            );

                        }

                    }
                );

            }
        );



        /* =========================================================
           PREVIOUS / NEXT
           ========================================================= */

        function goToSlide(
            target
        ) {

            target =
                clamp(
                    target,
                    0,
                    slides.length - 1
                );


            if (
                stage &&
                window.innerWidth > 850 &&
                !reducedMotion.matches
            ) {

                const stageTop =
                    window.scrollY +
                    stage.getBoundingClientRect().top;


                const scrollDistance =
                    stage.offsetHeight -
                    window.innerHeight;


                const targetProgress =
                    target /
                    (
                        slides.length -
                        1
                    );


                window.scrollTo({
                    top:
                        stageTop +
                        (
                            scrollDistance *
                            targetProgress
                        ),
                    behavior:
                        "smooth"
                });

            }

            else {

                setActiveSlide(
                    target
                );

            }

        }



        if (prevButton) {

            prevButton.addEventListener(
                "click",
                () => {

                    goToSlide(
                        activeSlide - 1
                    );

                }
            );

        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    goToSlide(
                        activeSlide + 1
                    );

                }
            );

        }



        /* =========================================================
           KEYBOARD SUPPORT
           ========================================================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    goToSlide(
                        activeSlide - 1
                    );

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    goToSlide(
                        activeSlide + 1
                    );

                }

            }
        );



        /* =========================================================
           MOBILE NAVIGATION
           ========================================================= */

        if (
            mobileMenuButton &&
            navLinks
        ) {

            mobileMenuButton.addEventListener(
                "click",
                () => {

                    const isOpen =
                        navLinks.classList.toggle(
                            "active"
                        );


                    mobileMenuButton.classList.toggle(
                        "active",
                        isOpen
                    );


                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        isOpen
                            ? "true"
                            : "false"
                    );

                }
            );


            navLinks
                .querySelectorAll("a")
                .forEach(
                    link => {

                        link.addEventListener(
                            "click",
                            () => {

                                navLinks.classList.remove(
                                    "active"
                                );


                                mobileMenuButton.classList.remove(
                                    "active"
                                );


                                mobileMenuButton.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                            }
                        );

                    }
                );


            window.addEventListener(
                "resize",
                () => {

                    if (
                        window.innerWidth >
                        850
                    ) {

                        navLinks.classList.remove(
                            "active"
                        );


                        mobileMenuButton.classList.remove(
                            "active"
                        );


                        mobileMenuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                },
                {
                    passive: true
                }
            );

        }



        /* =========================================================
           INITIAL STATE
           ========================================================= */

        setActiveSlide(
            0
        );


        updateCarouselFromScroll();

    }
);