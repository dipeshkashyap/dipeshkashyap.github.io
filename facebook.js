/* =========================================================
   FACEBOOK PAGE — DIPESH KASHYAP
   Interaction Controller
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const FACEBOOK_CONFIG = {

    profileURL:
        "https://www.facebook.com/",

    animationThreshold:
        0.12

};


/* =========================================================
   DOM
========================================================= */

const facebookDOM = {

    header:
        document.getElementById("siteHeader"),

    menuToggle:
        document.getElementById("menuToggle"),

    mainNav:
        document.getElementById("mainNav"),

    currentYear:
        document.getElementById("currentYear"),

    aboutCards:
        document.querySelectorAll(
            ".facebook-about-card"
        ),

    profileCard:
        document.querySelector(
            ".facebook-profile-card"
        ),

    revealElements:
        document.querySelectorAll(
            ".facebook-profile, " +
            ".facebook-about, " +
            ".facebook-connect"
        )

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeFacebookPage
);


function initializeFacebookPage() {

    setCurrentYear();

    initializeNavigation();

    initializeRevealAnimations();

    initializeAboutCards();

    initializeProfileInteraction();

    initializeExternalLinks();

    initializeHeader();

    initializeKeyboardSupport();

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function setCurrentYear() {

    if (!facebookDOM.currentYear) {
        return;
    }

    facebookDOM.currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeNavigation() {

    const toggle =
        facebookDOM.menuToggle;

    const nav =
        facebookDOM.mainNav;


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

    if (facebookDOM.mainNav) {

        facebookDOM.mainNav.classList.remove(
            "open"
        );

    }


    if (facebookDOM.menuToggle) {

        facebookDOM.menuToggle.classList.remove(
            "active"
        );

        facebookDOM.menuToggle.setAttribute(
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
        facebookDOM.revealElements;


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
                    FACEBOOK_CONFIG
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
   ABOUT CARDS
========================================================= */

function initializeAboutCards() {

    facebookDOM.aboutCards.forEach(
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
        facebookDOM.profileCard;


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
        facebookDOM.header;


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
   KEYBOARD SUPPORT
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

window.DipeshFacebook = {

    openProfile() {

        window.open(
            FACEBOOK_CONFIG.profileURL,
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
            "Facebook page resource issue:",
            event.message
        );

    }
);


/* =========================================================
   END
========================================================= */