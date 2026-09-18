document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================================
           ELEMENTS
           ========================================================= */

        const stage =
            document.getElementById(
                "galleryScrollStage"
            );


        const galleryWindow =
            document.querySelector(
                ".gallery-window"
            );


        const columns =
            document.querySelectorAll(
                ".gallery-column"
            );


        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        const navLinks =
            document.getElementById(
                "navLinks"
            );


        const lightbox =
            document.getElementById(
                "shotLightbox"
            );


        const lightboxImage =
            document.getElementById(
                "lightboxImage"
            );


        const lightboxClose =
            document.getElementById(
                "lightboxClose"
            );


        const shots =
            document.querySelectorAll(
                ".code-shot"
            );


        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        let ticking = false;



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



        /* =========================================================
           REVERSE SCROLLING COLUMNS
           ========================================================= */

        function updateColumns() {

            ticking = false;


            if (
                !stage ||
                !galleryWindow ||
                columns.length === 0
            ) {
                return;
            }


            /*
             * Mobile uses normal document flow.
             */

            if (
                window.innerWidth <= 750 ||
                reducedMotion.matches
            ) {

                columns.forEach(
                    column => {

                        column.style.transform =
                            "none";

                    }
                );


                return;
            }


            const stageRect =
                stage.getBoundingClientRect();


            const stageScrollableDistance =
                stage.offsetHeight -
                window.innerHeight;


            const distanceScrolled =
                -stageRect.top;


            const progress =
                clamp(
                    distanceScrolled /
                    stageScrollableDistance,
                    0,
                    1
                );


            const visibleHeight =
                galleryWindow.clientHeight;


            columns.forEach(
                column => {

                    const direction =
                        column.dataset.direction;


                    const overflow =
                        Math.max(
                            column.scrollHeight -
                            visibleHeight,
                            0
                        );


                    /*
                     * OUTER COLUMNS
                     *
                     * Start at top.
                     * Travel upward until the
                     * bottom of the column is shown.
                     */

                    if (
                        direction === "up"
                    ) {

                        const y =
                            -(overflow * progress);


                        column.style.transform =
                            `translate3d(
                                0,
                                ${y}px,
                                0
                            )`;

                    }


                    /*
                     * CENTER COLUMN
                     *
                     * Starts at the bottom of
                     * its content and travels
                     * downward toward zero.
                     */

                    if (
                        direction === "down"
                    ) {

                        const y =
                            -overflow +
                            (
                                overflow *
                                progress
                            );


                        column.style.transform =
                            `translate3d(
                                0,
                                ${y}px,
                                0
                            )`;

                    }

                }
            );

        }



        /* =========================================================
           REQUEST ANIMATION FRAME
           ========================================================= */

        function requestGalleryUpdate() {

            if (ticking) {
                return;
            }


            ticking = true;


            window.requestAnimationFrame(
                updateColumns
            );

        }



        /* =========================================================
           SCROLL / RESIZE
           ========================================================= */

        window.addEventListener(
            "scroll",
            requestGalleryUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestGalleryUpdate,
            {
                passive: true
            }
        );


        /*
         * Images change the total column
         * height as they finish loading.
         */

        document
            .querySelectorAll(
                ".code-shot img"
            )
            .forEach(
                image => {

                    image.addEventListener(
                        "load",
                        requestGalleryUpdate
                    );

                }
            );


        updateColumns();



        /* =========================================================
           MOBILE NAVIGATION
           ========================================================= */

        if (
            mobileMenuButton &&
            navLinks
        ) {

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


            navLinks
                .querySelectorAll(
                    "a"
                )
                .forEach(
                    link => {

                        link.addEventListener(
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
           SCREENSHOT LIGHTBOX
           ========================================================= */

        function openLightbox(
            imagePath
        ) {

            if (
                !lightbox ||
                !lightboxImage
            ) {
                return;
            }


            lightboxImage.src =
                imagePath;


            lightbox.classList.add(
                "active"
            );


            lightbox.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";

        }



        function closeLightbox() {

            if (!lightbox) {
                return;
            }


            lightbox.classList.remove(
                "active"
            );


            lightbox.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.style.overflow =
                "";


            /*
             * Delay clearing the image
             * until the fade-out ends.
             */

            window.setTimeout(
                () => {

                    if (
                        lightboxImage &&
                        !lightbox
                            .classList
                            .contains(
                                "active"
                            )
                    ) {

                        lightboxImage.src =
                            "";

                    }

                },
                250
            );

        }



        shots.forEach(
            shot => {

                shot.addEventListener(
                    "click",
                    () => {

                        const imagePath =
                            shot.dataset.image;


                        if (imagePath) {

                            openLightbox(
                                imagePath
                            );

                        }

                    }
                );

            }
        );


        if (lightboxClose) {

            lightboxClose.addEventListener(
                "click",
                closeLightbox
            );

        }


        if (lightbox) {

            lightbox.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        lightbox
                    ) {

                        closeLightbox();

                    }

                }
            );

        }


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightbox();

                }

            }
        );

    }
);