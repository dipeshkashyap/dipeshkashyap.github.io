/* =========================================================
   LINKEDIN PAGE — DIPESH KASHYAP
   Interaction + Animation Controller
   ========================================================= */

"use strict";


/* =========================================================
   1. CONFIG
   ========================================================= */

const LINKEDIN_URL =
    "https://www.linkedin.com/in/dipeshkashyap/";


/* =========================================================
   2. DOM
   ========================================================= */

const linkedinDOM = {

    header:
        document.getElementById("siteHeader"),

    menuToggle:
        document.getElementById("menuToggle"),

    mainNav:
        document.getElementById("mainNav"),

    currentYear:
        document.getElementById("currentYear"),

    revealElements:
        document.querySelectorAll(
            ".linkedin-profile, " +
            ".linkedin-about, " +
            ".linkedin-skills, " +
            ".linkedin-experience, " +
            ".linkedin-education, " +
            ".linkedin-projects, " +
            ".linkedin-cta"
        ),

    skillCards:
        document.querySelectorAll(
            ".linkedin-skill-card"
        ),

    projectCards:
        document.querySelectorAll(
            ".linkedin-project-card"
        ),

    timelineCards:
        document.querySelectorAll(
            ".timeline-card"
        )

};


/* =========================================================
   3. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeLinkedInPage
);


function initializeLinkedInPage() {

    setCurrentYear();

    initializeMobileNavigation();

    initializeRevealAnimations();

    initializeCardInteractions();

    initializeExternalLinks();

    initializeHeaderBehavior();

    initializeKeyboardSupport();

}


/* =========================================================
   4. CURRENT YEAR
   ========================================================= */

function setCurrentYear() {

    if (!linkedinDOM.currentYear) {
        return;
    }

    linkedinDOM.currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   5. MOBILE NAVIGATION
   ========================================================= */

function initializeMobileNavigation() {

    const toggle =
        linkedinDOM.menuToggle;

    const nav =
        linkedinDOM.mainNav;


    if (!toggle || !nav) {
        return;
    }


    toggle.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle(
                    "open"
                );


            toggle.classList.toggle(
                "active",
                isOpen
            );


            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    nav.querySelectorAll("a").forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "open"
                    );

                    toggle.classList.remove(
                        "active"
                    );

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !nav.contains(event.target) &&
                !toggle.contains(event.target)
            ) {

                nav.classList.remove(
                    "open"
                );

                toggle.classList.remove(
                    "active"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   6. REVEAL ANIMATIONS
   ========================================================= */

function initializeRevealAnimations() {

    const elements =
        linkedinDOM.revealElements;


    if (!elements.length) {
        return;
    }


    /*
     * Respect reduced-motion preference.
     */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

        return;

    }


    /*
     * Intersection Observer
     */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -50px 0px"
            }
        );


    elements.forEach(
        element => {

            element.classList.add(
                "reveal-ready"
            );

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   7. CARD INTERACTIONS
   ========================================================= */

function initializeCardInteractions() {

    initializeSkillCards();

    initializeProjectCards();

    initializeTimelineCards();

}


/* =========================================================
   8. SKILL CARDS
   ========================================================= */

function initializeSkillCards() {

    linkedinDOM.skillCards.forEach(
        (card, index) => {

            card.style.setProperty(
                "--card-index",
                index
            );


            card.addEventListener(
                "mouseenter",
                () => {

                    card.classList.add(
                        "card-hover"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.classList.remove(
                        "card-hover"
                    );

                }
            );

        }
    );

}


/* =========================================================
   9. PROJECT CARDS
   ========================================================= */

function initializeProjectCards() {

    linkedinDOM.projectCards.forEach(
        card => {

            card.addEventListener(
                "mousemove",
                event => {

                    /*
                     * Disable tilt on touch devices.
                     */

                    if (
                        window.matchMedia(
                            "(hover: none)"
                        ).matches
                    ) {
                        return;
                    }


                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        (
                            y - centerY
                        ) / 35;


                    const rotateY =
                        (
                            centerX - x
                        ) / 35;


                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-7px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        }
    );

}


/* =========================================================
   10. TIMELINE CARDS
   ========================================================= */

function initializeTimelineCards() {

    linkedinDOM.timelineCards.forEach(
        card => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.classList.add(
                        "timeline-active"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.classList.remove(
                        "timeline-active"
                    );

                }
            );

        }
    );

}


/* =========================================================
   11. HEADER BEHAVIOR
   ========================================================= */

function initializeHeaderBehavior() {

    if (!linkedinDOM.header) {
        return;
    }


    let previousScroll =
        window.scrollY;


    window.addEventListener(
        "scroll",
        () => {

            const currentScroll =
                window.scrollY;


            if (currentScroll > 30) {

                linkedinDOM.header.classList.add(
                    "scrolled"
                );

            } else {

                linkedinDOM.header.classList.remove(
                    "scrolled"
                );

            }


            /*
             * Keep the header visible.
             * We don't hide it while scrolling.
             */

            previousScroll =
                currentScroll;

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   12. EXTERNAL LINK HANDLING
   ========================================================= */

function initializeExternalLinks() {

    const externalLinks =
        document.querySelectorAll(
            `a[href^="http"]`
        );


    externalLinks.forEach(
        link => {

            /*
             * Keep external links safe.
             */

            if (
                link.hostname !==
                window.location.hostname
            ) {

                link.setAttribute(
                    "target",
                    "_blank"
                );

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

            }

        }
    );

}


/* =========================================================
   13. KEYBOARD SUPPORT
   ========================================================= */

function initializeKeyboardSupport() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * ESC closes mobile navigation.
             */

            if (
                event.key === "Escape"
            ) {

                closeMobileNavigation();

            }

        }
    );

}


/* =========================================================
   14. CLOSE NAVIGATION
   ========================================================= */

function closeMobileNavigation() {

    if (linkedinDOM.mainNav) {

        linkedinDOM.mainNav.classList.remove(
            "open"
        );

    }


    if (linkedinDOM.menuToggle) {

        linkedinDOM.menuToggle.classList.remove(
            "active"
        );


        linkedinDOM.menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* =========================================================
   15. LINKEDIN PROFILE ACTION
   ========================================================= */

function openLinkedInProfile() {

    window.open(
        LINKEDIN_URL,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   16. PUBLIC API
   ========================================================= */

window.DipeshLinkedIn = {

    openProfile:
        openLinkedInProfile,

    closeMenu:
        closeMobileNavigation

};


/* =========================================================
   17. ERROR PROTECTION
   ========================================================= */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "LinkedIn page resource issue:",
            event.message
        );

    }
);


/* =========================================================
   END
   ========================================================= */