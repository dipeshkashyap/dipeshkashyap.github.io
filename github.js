/* =========================================================
   GITHUB PAGE — DIPESH KASHYAP
   Dynamic GitHub API Integration
   ========================================================= */

"use strict";


/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const GITHUB_USERNAME = "dipeshkashyap";

const GITHUB_API = "https://api.github.com";

const REPOSITORY_LIMIT = 100;


/* =========================================================
   2. DOM ELEMENTS
   ========================================================= */

const elements = {

    avatar:
        document.getElementById("githubAvatar"),

    name:
        document.getElementById("githubName"),

    username:
        document.getElementById("githubUsername"),

    bio:
        document.getElementById("githubBio"),

    repoCount:
        document.getElementById("repoCount"),

    followerCount:
        document.getElementById("followerCount"),

    followingCount:
        document.getElementById("followingCount"),

    gistCount:
        document.getElementById("gistCount"),

    statRepositories:
        document.getElementById("statRepositories"),

    statStars:
        document.getElementById("statStars"),

    statForks:
        document.getElementById("statForks"),

    statLanguages:
        document.getElementById("statLanguages"),

    repositoryGrid:
        document.getElementById("repositoryGrid"),

    repositoryLoading:
        document.getElementById("repositoryLoading"),

    repositoryError:
        document.getElementById("repositoryError"),

    repositoryEmpty:
        document.getElementById("repositoryEmpty"),

    repoSearch:
        document.getElementById("repoSearch"),

    languageFilter:
        document.getElementById("languageFilter"),

    sortRepositories:
        document.getElementById("sortRepositories"),

    retryRepositories:
        document.getElementById("retryRepositories"),

    currentYear:
        document.getElementById("currentYear")

};


/* =========================================================
   3. APPLICATION STATE
   ========================================================= */

const state = {

    profile: null,

    repositories: [],

    filteredRepositories: [],

    languages: new Set(),

    loading: false

};


/* =========================================================
   4. INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeGitHubPage();

});


async function initializeGitHubPage() {

    setCurrentYear();

    setupEventListeners();

    await loadGitHubData();

}


/* =========================================================
   5. EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

    if (elements.repoSearch) {

        elements.repoSearch.addEventListener(
            "input",
            applyRepositoryFilters
        );

    }


    if (elements.languageFilter) {

        elements.languageFilter.addEventListener(
            "change",
            applyRepositoryFilters
        );

    }


    if (elements.sortRepositories) {

        elements.sortRepositories.addEventListener(
            "change",
            applyRepositoryFilters
        );

    }


    if (elements.retryRepositories) {

        elements.retryRepositories.addEventListener(
            "click",
            loadGitHubData
        );

    }

}


/* =========================================================
   6. LOAD GITHUB DATA
   ========================================================= */

async function loadGitHubData() {

    if (state.loading) {
        return;
    }

    state.loading = true;

    showLoading();

    hideError();


    try {

        const profile =
            await fetchGitHubProfile();

        const repositories =
            await fetchGitHubRepositories();


        state.profile = profile;

        state.repositories = repositories;


        updateProfile(profile);

        calculateStatistics(repositories);

        buildLanguageFilter(repositories);

        applyRepositoryFilters();


        hideLoading();


    } catch (error) {

        console.error(
            "GitHub API Error:",
            error
        );

        showError();

    } finally {

        state.loading = false;

    }

}


/* =========================================================
   7. FETCH PROFILE
   ========================================================= */

async function fetchGitHubProfile() {

    const response = await fetch(
        `${GITHUB_API}/users/${GITHUB_USERNAME}`,
        {
            headers: {
                "Accept":
                    "application/vnd.github+json"
            }
        }
    );


    if (!response.ok) {

        throw new Error(
            `GitHub profile request failed: ${response.status}`
        );

    }


    return await response.json();

}


/* =========================================================
   8. FETCH REPOSITORIES
   ========================================================= */

async function fetchGitHubRepositories() {

    const url =
        `${GITHUB_API}/users/` +
        `${GITHUB_USERNAME}/repos` +
        `?per_page=${REPOSITORY_LIMIT}` +
        `&sort=updated` +
        `&direction=desc`;


    const response = await fetch(
        url,
        {
            headers: {
                "Accept":
                    "application/vnd.github+json"
            }
        }
    );


    if (!response.ok) {

        throw new Error(
            `GitHub repository request failed: ${response.status}`
        );

    }


    const repositories =
        await response.json();


    return repositories.filter(
        repository =>
            !repository.fork
    );

}


/* =========================================================
   9. UPDATE PROFILE
   ========================================================= */

function updateProfile(profile) {

    if (!profile) {
        return;
    }


    if (elements.avatar) {

        elements.avatar.src =
            profile.avatar_url ||
            `https://github.com/${GITHUB_USERNAME}.png`;

        elements.avatar.alt =
            `${profile.login || GITHUB_USERNAME} GitHub profile`;

    }


    if (elements.name) {

        elements.name.textContent =
            profile.name ||
            profile.login ||
            "Dipesh Kashyap";

    }


    if (elements.username) {

        elements.username.textContent =
            `@${profile.login || GITHUB_USERNAME}`;

    }


    if (elements.bio) {

        elements.bio.textContent =
            profile.bio ||
            "Developer • Learner • Builder";

    }


    if (elements.repoCount) {

        animateNumber(
            elements.repoCount,
            profile.public_repos || 0
        );

    }


    if (elements.followerCount) {

        animateNumber(
            elements.followerCount,
            profile.followers || 0
        );

    }


    if (elements.followingCount) {

        animateNumber(
            elements.followingCount,
            profile.following || 0
        );

    }


    if (elements.gistCount) {

        animateNumber(
            elements.gistCount,
            profile.public_gists || 0
        );

    }

}


/* =========================================================
   10. CALCULATE STATISTICS
   ========================================================= */

function calculateStatistics(repositories) {

    let totalStars = 0;

    let totalForks = 0;

    const languages = new Set();


    repositories.forEach(repository => {

        totalStars +=
            Number(repository.stargazers_count) || 0;


        totalForks +=
            Number(repository.forks_count) || 0;


        if (repository.language) {

            languages.add(
                repository.language
            );

        }

    });


    if (elements.statRepositories) {

        animateNumber(
            elements.statRepositories,
            repositories.length
        );

    }


    if (elements.statStars) {

        animateNumber(
            elements.statStars,
            totalStars
        );

    }


    if (elements.statForks) {

        animateNumber(
            elements.statForks,
            totalForks
        );

    }


    if (elements.statLanguages) {

        animateNumber(
            elements.statLanguages,
            languages.size
        );

    }

}


/* =========================================================
   11. LANGUAGE FILTER
   ========================================================= */

function buildLanguageFilter(repositories) {

    if (!elements.languageFilter) {
        return;
    }


    const languages =
        new Set();


    repositories.forEach(repository => {

        if (repository.language) {

            languages.add(
                repository.language
            );

        }

    });


    state.languages =
        languages;


    elements.languageFilter.innerHTML = "";


    const allOption =
        document.createElement("option");

    allOption.value = "all";

    allOption.textContent =
        "All Languages";

    elements.languageFilter.appendChild(
        allOption
    );


    [...languages]
        .sort((a, b) =>
            a.localeCompare(b)
        )
        .forEach(language => {

            const option =
                document.createElement("option");

            option.value =
                language;

            option.textContent =
                language;

            elements.languageFilter.appendChild(
                option
            );

        });

}


/* =========================================================
   12. FILTER + SORT
   ========================================================= */

function applyRepositoryFilters() {

    const searchTerm =
        elements.repoSearch
            ? elements.repoSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedLanguage =
        elements.languageFilter
            ? elements.languageFilter.value
            : "all";


    const selectedSort =
        elements.sortRepositories
            ? elements.sortRepositories.value
            : "updated";


    let repositories =
        [...state.repositories];


    /* Search */

    if (searchTerm) {

        repositories =
            repositories.filter(repository => {

                const name =
                    repository.name
                        ?.toLowerCase() || "";

                const description =
                    repository.description
                        ?.toLowerCase() || "";

                const language =
                    repository.language
                        ?.toLowerCase() || "";


                return (
                    name.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    language.includes(searchTerm)
                );

            });

    }


    /* Language */

    if (
        selectedLanguage &&
        selectedLanguage !== "all"
    ) {

        repositories =
            repositories.filter(
                repository =>
                    repository.language ===
                    selectedLanguage
            );

    }


    /* Sorting */

    repositories.sort(
        (a, b) => {

            switch (selectedSort) {

                case "stars":

                    return (
                        b.stargazers_count -
                        a.stargazers_count
                    );


                case "forks":

                    return (
                        b.forks_count -
                        a.forks_count
                    );


                case "name":

                    return a.name.localeCompare(
                        b.name
                    );


                case "updated":

                default:

                    return (
                        new Date(
                            b.updated_at
                        ) -
                        new Date(
                            a.updated_at
                        )
                    );

            }

        }
    );


    state.filteredRepositories =
        repositories;


    renderRepositories(repositories);

}


/* =========================================================
   13. RENDER REPOSITORIES
   ========================================================= */

function renderRepositories(repositories) {

    if (!elements.repositoryGrid) {
        return;
    }


    elements.repositoryGrid.innerHTML = "";


    if (!repositories.length) {

        showEmptyState();

        return;

    }


    hideEmptyState();


    const fragment =
        document.createDocumentFragment();


    repositories.forEach(
        (repository, index) => {

            const card =
                createRepositoryCard(
                    repository
                );


            card.style.animationDelay =
                `${Math.min(index * 60, 600)}ms`;


            fragment.appendChild(card);

        }
    );


    elements.repositoryGrid.appendChild(
        fragment
    );

}


/* =========================================================
   14. CREATE REPOSITORY CARD
   ========================================================= */

function createRepositoryCard(repository) {

    const article =
        document.createElement("article");


    article.className =
        "repository-card";


    const safeName =
        escapeHTML(
            repository.name ||
            "Untitled Repository"
        );


    const description =
        escapeHTML(
            repository.description ||
            "No description provided."
        );


    const language =
        repository.language
            ? escapeHTML(repository.language)
            : "";


    const stars =
        Number(repository.stargazers_count) || 0;


    const forks =
        Number(repository.forks_count) || 0;


    const visibility =
        repository.private
            ? "Private"
            : "Public";


    const updated =
        formatDate(
            repository.updated_at
        );


    article.innerHTML = `

        <div class="repo-top">

            <i class="fa-brands fa-github repo-icon"></i>

            <span class="repo-visibility">
                ${visibility}
            </span>

        </div>


        <h3 class="repo-name">

            <a
                href="${repository.html_url}"
                target="_blank"
                rel="noopener noreferrer">

                ${safeName}

            </a>

        </h3>


        <p class="repo-description">
            ${description}
        </p>


        <div class="repo-meta">

            ${
                language
                    ? `
                        <span class="repo-language">
                            ${language}
                        </span>
                      `
                    : ""
            }


            <span>

                <i class="fa-solid fa-star"></i>

                ${stars}

            </span>


            <span>

                <i class="fa-solid fa-code-fork"></i>

                ${forks}

            </span>


            <span>

                <i class="fa-regular fa-clock"></i>

                ${updated}

            </span>

        </div>


        <div class="repo-actions">

            <a
                class="repo-action"
                href="${repository.html_url}"
                target="_blank"
                rel="noopener noreferrer">

                <i class="fa-brands fa-github"></i>

                Repository

            </a>


            ${
                repository.homepage
                    ? `
                        <a
                            class="repo-action"
                            href="${repository.homepage}"
                            target="_blank"
                            rel="noopener noreferrer">

                            <i class="fa-solid fa-arrow-up-right-from-square"></i>

                            Live Demo

                        </a>
                      `
                    : ""
            }

        </div>

    `;


    return article;

}


/* =========================================================
   15. DATE FORMATTER
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days < 1) {
        return "Today";
    }


    if (days === 1) {
        return "Yesterday";
    }


    if (days < 30) {
        return `${days}d ago`;
    }


    if (days < 365) {

        const months =
            Math.floor(days / 30);

        return `${months}mo ago`;

    }


    const years =
        Math.floor(days / 365);


    return `${years}y ago`;

}


/* =========================================================
   16. NUMBER ANIMATION
   ========================================================= */

function animateNumber(
    element,
    target
) {

    if (!element) {
        return;
    }


    const finalValue =
        Number(target) || 0;


    const duration =
        700;


    const startTime =
        performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.floor(
                finalValue * eased
            );


        element.textContent =
            currentValue.toLocaleString();


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            element.textContent =
                finalValue.toLocaleString();

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   17. LOADING STATE
   ========================================================= */

function showLoading() {

    if (elements.repositoryLoading) {

        elements.repositoryLoading.hidden =
            false;

    }


    if (elements.repositoryGrid) {

        elements.repositoryGrid.innerHTML =
            "";

    }


    hideEmptyState();

}


function hideLoading() {

    if (elements.repositoryLoading) {

        elements.repositoryLoading.hidden =
            true;

    }

}


/* =========================================================
   18. ERROR STATE
   ========================================================= */

function showError() {

    hideLoading();


    if (elements.repositoryError) {

        elements.repositoryError.hidden =
            false;

    }

}


function hideError() {

    if (elements.repositoryError) {

        elements.repositoryError.hidden =
            true;

    }

}


/* =========================================================
   19. EMPTY STATE
   ========================================================= */

function showEmptyState() {

    if (elements.repositoryEmpty) {

        elements.repositoryEmpty.hidden =
            false;

    }

}


function hideEmptyState() {

    if (elements.repositoryEmpty) {

        elements.repositoryEmpty.hidden =
            true;

    }

}


/* =========================================================
   20. CURRENT YEAR
   ========================================================= */

function setCurrentYear() {

    if (elements.currentYear) {

        elements.currentYear.textContent =
            new Date().getFullYear();

    }

}


/* =========================================================
   21. HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   22. GLOBAL ERROR PROTECTION
   ========================================================= */

window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "Unhandled GitHub error:",
            event.reason
        );

    }
);


/* =========================================================
   23. DEBUG ACCESS
   ========================================================= */

window.DipeshGitHub = {

    reload:
        loadGitHubData,

    state

};


/* =========================================================
   END
   ========================================================= */