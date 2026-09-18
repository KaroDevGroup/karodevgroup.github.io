document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================================
           STACKED SECTION SCROLL EFFECT
           ========================================================= */

        const sections =
            document.querySelectorAll(
                ".stack-section"
            );


        function updateStackScroll() {

            const windowHeight =
                window.innerHeight;


            sections.forEach(
                (section, index) => {

                    const rect =
                        section.getBoundingClientRect();


                    const progress =
                        Math.min(
                            Math.max(
                                -rect.top /
                                windowHeight,
                                0
                            ),
                            1
                        );


                    const scale =
                        1 -
                        (
                            progress *
                            0.06
                        );


                    const brightness =
                        1 -
                        (
                            progress *
                            0.35
                        );


                    const blur =
                        progress *
                        2;


                    section.style.transform =
                        `scale(${scale}) translateZ(0)`;


                    section.style.filter =
                        `brightness(${brightness}) blur(${blur}px)`;


                    section.style.zIndex =
                        index + 1;

                }
            );

        }



        /* =========================================================
           COVER BANNER SCROLL EFFECT
           ========================================================= */

        const coverBanner =
            document.getElementById(
                "coverBanner"
            );


        const coverSection =
            document.querySelector(
                ".cover-banner-section"
            );


        function updateCoverBanner() {

            if (
                !coverBanner ||
                !coverSection
            ) {
                return;
            }


            const sectionRect =
                coverSection
                    .getBoundingClientRect();


            const sectionHeight =
                coverSection
                    .offsetHeight;


            const viewportHeight =
                window.innerHeight;


            const scrollDistance =
                sectionHeight -
                viewportHeight;


            const traveled =
                Math.max(
                    0,
                    -sectionRect.top
                );


            let progress =
                scrollDistance > 0
                    ? traveled /
                      scrollDistance
                    : 0;


            progress =
                Math.min(
                    Math.max(
                        progress,
                        0
                    ),
                    1
                );


            coverBanner
                .style
                .setProperty(
                    "--cover-progress",
                    progress.toFixed(4)
                );


            document.body
                .classList
                .toggle(
                    "cover-docked",
                    progress > 0.82
                );

        }



        /* =========================================================
           MAIN SCROLL UPDATE
           ========================================================= */

        function updateScrollEffects() {

            updateStackScroll();

            updateCoverBanner();

        }


        window.addEventListener(
            "scroll",
            updateScrollEffects,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateScrollEffects,
            {
                passive: true
            }
        );


        updateScrollEffects();



        /* =========================================================
           REVEAL ANIMATIONS
           ========================================================= */

        const revealElements =
            document.querySelectorAll(
                `
                .feature-card,
                .download-card,
                .security-card,
                .github-section
                `
            );


        revealElements.forEach(
            element => {

                element
                    .classList
                    .add(
                        "reveal"
                    );

            }
        );


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry
                                    .target
                                    .classList
                                    .add(
                                        "visible"
                                    );


                                observer
                                    .unobserve(
                                        entry.target
                                    );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );



        /* =========================================================
           MOBILE NAVIGATION
           ========================================================= */

        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        const navLinks =
            document.getElementById(
                "navLinks"
            );


        if (
            mobileMenuButton &&
            navLinks
        ) {

            /* -----------------------------------------------------
               TOGGLE MENU
               ----------------------------------------------------- */

            mobileMenuButton
                .addEventListener(
                    "click",
                    () => {

                        const isOpen =
                            navLinks
                                .classList
                                .toggle(
                                    "active"
                                );


                        mobileMenuButton
                            .classList
                            .toggle(
                                "active",
                                isOpen
                            );


                        mobileMenuButton
                            .setAttribute(
                                "aria-expanded",
                                isOpen
                                    ? "true"
                                    : "false"
                            );

                    }
                );


            /* -----------------------------------------------------
               CLOSE AFTER LINK CLICK
               ----------------------------------------------------- */

            navLinks
                .querySelectorAll(
                    "a"
                )
                .forEach(
                    link => {

                        link
                            .addEventListener(
                                "click",
                                () => {

                                    navLinks
                                        .classList
                                        .remove(
                                            "active"
                                        );


                                    mobileMenuButton
                                        .classList
                                        .remove(
                                            "active"
                                        );


                                    mobileMenuButton
                                        .setAttribute(
                                            "aria-expanded",
                                            "false"
                                        );

                                }
                            );

                    }
                );


            /* -----------------------------------------------------
               CLOSE WHEN RETURNING TO DESKTOP
               ----------------------------------------------------- */

            window.addEventListener(
                "resize",
                () => {

                    if (
                        window.innerWidth >
                        850
                    ) {

                        navLinks
                            .classList
                            .remove(
                                "active"
                            );


                        mobileMenuButton
                            .classList
                            .remove(
                                "active"
                            );


                        mobileMenuButton
                            .setAttribute(
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
           REDUCED MOTION SUPPORT
           ========================================================= */

        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        if (
            prefersReducedMotion.matches
        ) {

            sections.forEach(
                section => {

                    section.style.transform =
                        "none";

                    section.style.filter =
                        "none";

                }
            );


            if (coverBanner) {

                coverBanner
                    .style
                    .setProperty(
                        "--cover-progress",
                        "0"
                    );

            }

        }

    }
);