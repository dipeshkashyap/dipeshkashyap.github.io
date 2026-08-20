/* =========================================================
   INSTAGRAM PAGE — DIPESH KASHYAP
   Interaction Controller
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const INSTAGRAM_CONFIG = {

    profileURL:
        "https://www.instagram.com/",

    animationThreshold:
        0.12

};


/* =========================================================
   DOM
========================================================= */

const instagramDOM = {

    header:
        document.getElementById("siteHeader"),

    menuToggle:
        document.getElementById("menuToggle"),

    mainNav:
        document.getElementById("mainNav"),

    currentYear:
        document.getElementById("currentYear"),

    contentCards:
        document.querySelectorAll(
            ".instagram-content-card"
        ),

    profileCard:
        document.querySelector(
            ".instagram-profile-card"
        ),

    revealElements:
        document.querySelectorAll(
            ".instagram-profile, " +
            ".instagram-content, " +
            ".instagram-connect"
        )

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeInstagramPage
);


function initializeInstagramPage() {

    setCurrentYear();

    initializeNavigation();

    initializeRevealAnimations();

    initializeContentCards();

    initializeProfileInteraction();

    initializeExternalLinks();

    initializeHeader();

    initializeKeyboardSupport();

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function setCurrentYear() {

    if (!instagramDOM.currentYear) {
        return;
    }

    instagramDOM.currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeNavigation() {

    const toggle =
        instagramDOM.menuToggle;

    const nav =
        instagramDOM.mainNav;


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
                closeNavigation
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

                closeNavigation();

            }

        }
    );

}


function closeNavigation() {

    if (instagramDOM.mainNav) {

        instagramDOM.mainNav.classList.remove(
            "open"
        );

    }


    if (instagramDOM.menuToggle) {

        instagramDOM.menuToggle.classList.remove(
            "active"
        );

        instagramDOM.menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initializeRevealAnimations() {

    const elements =
        instagramDOM.revealElements;


    if (!elements.length) {
        return;
    }


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        elements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

        return;

    }


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
                threshold:
                    INSTAGRAM_CONFIG
                        .animationThreshold,

                rootMargin:
                    "0px 0px -40px 0px"
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
   CONTENT CARDS
========================================================= */

function initializeContentCards() {

    instagramDOM.contentCards.forEach(
        (card, index) => {

            card.style.setProperty(
                "--card-index",
                index
            );


            card.addEventListener(
                "mousemove",
                event => {

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
                        ) / 50;


                    const rotateY =
                        (
                            centerX - x
                        ) / 50;


                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-8px)`;

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
   PROFILE INTERACTION
========================================================= */

function initializeProfileInteraction() {

    const card =
        instagramDOM.profileCard;


    if (!card) {
        return;
    }


    card.addEventListener(
        "mousemove",
        event => {

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


            const percentX =
                (x / rect.width) * 100;


            const percentY =
                (y / rect.height) * 100;


            card.style.setProperty(
                "--mouse-x",
                `${percentX}%`
            );


            card.style.setProperty(
                "--mouse-y",
                `${percentY}%`
            );

        }
    );

}


/* =========================================================
   EXTERNAL LINKS
========================================================= */

function initializeExternalLinks() {

    document
        .querySelectorAll(
            'a[href^="http"]'
        )
        .forEach(
            link => {

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
   HEADER
========================================================= */

function initializeHeader() {

    const header =
        instagramDOM.header;


    if (!header) {
        return;
    }


    function updateHeader() {

        if (
            window.scrollY > 30
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    updateHeader();


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

function initializeKeyboardSupport() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeNavigation();

            }

        }
    );

}


/* =========================================================
   PUBLIC API
========================================================= */

window.DipeshInstagram = {

    openProfile() {

        window.open(
            INSTAGRAM_CONFIG.profileURL,
            "_blank",
            "noopener,noreferrer"
        );

    },

    closeMenu() {

        closeNavigation();

    }

};


/* =========================================================
   ERROR MONITOR
========================================================= */

window.addEventListener(
    "error",
    event => {

        console.warn(
            "Instagram page resource issue:",
            event.message
        );

    }
);


/* =========================================================
   END
========================================================= */