document.addEventListener(
    "DOMContentLoaded",
    () => {

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

        }



        /* =========================================================
           CARD DEPTH
           ========================================================= */

        const cards =
            document.querySelectorAll(
                ".security-stack-card"
            );


        function updateCards() {

            if (
                window.innerWidth <=
                800
            ) {
                return;
            }


            cards.forEach(
                (card, index) => {

                    const rect =
                        card.getBoundingClientRect();


                    const stickyTop =
                        105 +
                        (
                            index *
                            20
                        );


                    const distance =
                        rect.top -
                        stickyTop;


                    const progress =
                        Math.min(
                            Math.max(
                                -distance / 500,
                                0
                            ),
                            1
                        );


                    const scale =
                        1 -
                        (
                            progress *
                            0.018
                        );


                    const brightness =
                        1 -
                        (
                            progress *
                            0.09
                        );


                    card.style.transform =
                        `scale(${scale})`;


                    card.style.filter =
                        `brightness(${brightness})`;

                }
            );

        }


        window.addEventListener(
            "scroll",
            updateCards,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth <=
                    800
                ) {

                    cards.forEach(
                        card => {

                            card.style.transform =
                                "";

                            card.style.filter =
                                "";

                        }
                    );

                }


                updateCards();

            },
            {
                passive: true
            }
        );


        updateCards();

    }
);