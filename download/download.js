document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================================
           ELEMENTS
           ========================================================= */

        const releaseStage =
            document.querySelector(
                ".release-stage"
            );


        const releaseConsole =
            document.getElementById(
                "releaseConsole"
            );


        const progressBar =
            document.getElementById(
                "downloadProgressBar"
            );


        const pipeline =
            document.querySelector(
                ".pipeline"
            );


        const pipelineLine =
            document.getElementById(
                "pipelineLine"
            );


        const pipelineSteps =
            document.querySelectorAll(
                ".pipeline-step"
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


        let ticking =
            false;



        /* =========================================================
           HELPER
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
           PAGE SCROLL PROGRESS
           ========================================================= */

        function updatePageProgress() {

            if (!progressBar) {
                return;
            }


            const scrollableHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;


            const progress =
                scrollableHeight > 0
                    ? window.scrollY /
                      scrollableHeight
                    : 0;


            progressBar.style.width =
                `${clamp(
                    progress * 100,
                    0,
                    100
                )}%`;

        }



        /* =========================================================
           RELEASE CONSOLE ASSEMBLY
           ========================================================= */

        function updateReleaseConsole() {

            if (
                !releaseStage ||
                !releaseConsole
            ) {
                return;
            }


            if (
                window.innerWidth <=
                850 ||
                reducedMotion.matches
            ) {

                releaseConsole.style.setProperty(
                    "--release-progress",
                    "1"
                );

                return;
            }


            const rect =
                releaseStage.getBoundingClientRect();


            const scrollDistance =
                releaseStage.offsetHeight -
                window.innerHeight;


            const traveled =
                Math.max(
                    0,
                    -rect.top
                );


            let progress =
                scrollDistance > 0
                    ? traveled /
                      scrollDistance
                    : 0;


            progress =
                clamp(
                    progress,
                    0,
                    1
                );


            /*
             * Finish most of the visual assembly
             * during the first ~65% of the sticky stage.
             */

            const assemblyProgress =
                clamp(
                    progress / 0.65,
                    0,
                    1
                );


            releaseConsole.style.setProperty(
                "--release-progress",
                assemblyProgress.toFixed(4)
            );

        }



        /* =========================================================
           PIPELINE
           ========================================================= */

        function updatePipeline() {

            if (
                !pipeline ||
                !pipelineLine
            ) {
                return;
            }


            const rect =
                pipeline.getBoundingClientRect();


            const viewportTrigger =
                window.innerHeight *
                0.72;


            const totalTravel =
                pipeline.offsetHeight +
                (
                    window.innerHeight *
                    0.35
                );


            const traveled =
                viewportTrigger -
                rect.top;


            const progress =
                clamp(
                    traveled /
                    totalTravel,
                    0,
                    1
                );


            pipelineLine.style.height =
                `${progress * 100}%`;


            pipelineSteps.forEach(
                step => {

                    const stepRect =
                        step.getBoundingClientRect();


                    const trigger =
                        window.innerHeight *
                        0.68;


                    step.classList.toggle(
                        "active",
                        stepRect.top <
                        trigger
                    );

                }
            );

        }



        /* =========================================================
           MASTER UPDATE
           ========================================================= */

        function updateScrollEffects() {

            ticking =
                false;


            updatePageProgress();

            updateReleaseConsole();

            updatePipeline();

        }



        function requestUpdate() {

            if (ticking) {
                return;
            }


            ticking =
                true;


            window.requestAnimationFrame(
                updateScrollEffects
            );

        }



        window.addEventListener(
            "scroll",
            requestUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestUpdate,
            {
                passive: true
            }
        );


        updateScrollEffects();



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

    }
);