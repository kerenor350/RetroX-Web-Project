const persona = localStorage.getItem("selectedPersona");
const profileImage = localStorage.getItem("selectedPersonaImage");

if (!persona) {
    window.location.href = "/";
}

if (profileImage) {
    document.querySelector(".profile-img").src = profileImage;
}

document.getElementById("currentPersona").textContent =
    `Welcome ${persona}`;

let feedData = {};
let selectedMovie = "";
let currentMovie = "";
let currentPersona = persona;
let currentVideo = "";
let detailMovie = null;

const CATEGORY_ROW_IDS = {
    Action: "category-action",
    Comedy: "category-comedy",
    "Sci-Fi": "category-scifi",
    Drama: "category-drama"
};

loadFeed();
initAdvancedSearch();
loadAnalytics();

async function loadFeed() {

    try {

        const response = await fetch(`/feed/${encodeURIComponent(persona)}`);

        if (!response.ok) {
            throw new Error("Failed to load feed");
        }

        feedData = await response.json();

        renderContinueWatching(feedData.continueWatching || []);
        renderMovieRow("recommendations", feedData.recommendations || []);
        renderMovieRow(
            "top-popular-row",
            feedData.topPopular || [],
            { showRank: true }
        );

        Object.entries(CATEGORY_ROW_IDS).forEach(([category, rowId]) => {
            renderMovieRow(
                rowId,
                feedData.categories?.[category] || []
            );
        });

        renderMovieRow("my-list", feedData.myList || []);

        activateSearch();

    } catch (error) {

        console.error(error);
        alert("Could not load your personal feed.");

    }

}

function renderContinueWatching(movies) {

    const section = document.getElementById("continue-watching-section");
    const row = document.getElementById("continue-watching");

    row.innerHTML = "";

    if (!movies.length) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";

    movies.forEach(movie => {
        row.appendChild(createFeedCard(movie, { showProgress: true }));
    });

}

function renderMovieRow(rowId, movies, options = {}) {

    const row = document.getElementById(rowId);

    if (!row) {
        return;
    }

    row.innerHTML = "";

    if (!movies.length) {
        row.innerHTML = `<p class="empty-row">No content available yet.</p>`;
        return;
    }

    movies.forEach((movie, index) => {
        row.appendChild(
            createFeedCard(movie, {
                rank: options.showRank ? index + 1 : null
            })
        );
    });

}

function createFeedCard(movie, options = {}) {

    const card = document.createElement("div");
    card.className = "feed-card";
    card.dataset.title = movie.title;
    card.dataset.movieId = movie._id;

    const video = movie.video || "assets/demo.mp4";
    const progressPercent = movie.progress?.percent || 0;

    card.innerHTML = `
        ${options.rank ? `<span class="rank-badge">${options.rank}</span>` : ""}
        <img
            src="/${movie.image}"
            alt="${escapeHtml(movie.title)}"
            class="feed-card-img"
        >
        ${options.showProgress && progressPercent > 0 ? `
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width:${progressPercent}%"
                ></div>
            </div>
        ` : ""}
        <div class="feed-card-overlay">
            <span class="feed-card-title">${escapeHtml(movie.title)}</span>
            <span class="feed-card-likes">❤️ ${movie.likes || 0}</span>
        </div>
    `;

    card.addEventListener("click", () => {
        openDetailModal(movie);
    });

    card._movieData = movie;
    card._video = video;

    return card;

}

function escapeHtml(text) {

    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;

}

function getReviewsForMovie(movieTitle) {

    return feedData.reviewsByMovie?.[movieTitle] || [];

}

function likesToStars(likes) {

    const count = Math.min(5, Math.max(1, Math.round(likes / 40)));
    return "★".repeat(count) + "☆".repeat(5 - count);

}

function openDetailModal(movie) {

    detailMovie = movie;

    document.getElementById("detailImage").src = `/${movie.image}`;
    document.getElementById("detailTitle").textContent = movie.title;
    document.getElementById("detailCategory").textContent =
        movie.category || "General";
    document.getElementById("detailStars").textContent =
        likesToStars(movie.likes || 0);
    document.getElementById("detailLikes").textContent =
        `${movie.likes || 0} likes`;
    document.getElementById("detailDescription").textContent =
        movie.description || "No description available.";
    document.getElementById("detailLikesCount").textContent =
        movie.likes || 0;

    const watchBtn = document.getElementById("detailWatchBtn");
    watchBtn.onclick = () => {
        closeDetailModal();
        openVideo(movie.title, movie.video || "assets/demo.mp4");
    };

    const reviewBtn = document.getElementById("detailReviewBtn");
    reviewBtn.onclick = () => {
        openReviewForm(movie.title);
    };

    const likeBtn = document.getElementById("detailLikeBtn");
    likeBtn.onclick = () => likeMovie(movie._id, likeBtn);

    renderDetailReviews(movie.title);

    document.getElementById("detailModal").style.display = "flex";

}

function renderDetailReviews(movieTitle) {

    const container = document.getElementById("detailReviewsList");
    const reviews = getReviewsForMovie(movieTitle);

    if (!reviews.length) {
        container.innerHTML =
            `<p class="no-reviews">No reviews yet. Be the first to write one!</p>`;
        return;
    }

    container.innerHTML = reviews.map(post => {

        const created = new Date(post.createdAt)
            .toLocaleDateString("he-IL");

        return `
            <div class="review-card" id="post-${post._id}">
                <h4>${escapeHtml(post.title)}</h4>
                <p>${escapeHtml(post.content)}</p>
                <p class="review-author">👤 ${escapeHtml(post.author)}</p>
                <p class="review-date">📅 ${created}</p>
                <button
                    class="delete-review-btn"
                    onclick="deleteReview('${post._id}')"
                >
                    🗑 Delete Review
                </button>
            </div>
        `;

    }).join("");

}

function closeDetailModal() {

    document.getElementById("detailModal").style.display = "none";
    detailMovie = null;

}

function updateLikeDisplay(movieId, likes) {

    if (detailMovie?._id?.toString() === movieId.toString()) {

        document.getElementById("detailLikesCount").textContent = likes;
        document.getElementById("detailLikes").textContent =
            `${likes} likes`;
        document.getElementById("detailStars").textContent =
            likesToStars(likes);

        detailMovie.likes = likes;

    }

    document
        .querySelectorAll(`.feed-card[data-movie-id="${movieId}"]`)
        .forEach(card => {

            const likesEl = card.querySelector(".feed-card-likes");

            if (likesEl) {
                likesEl.textContent = `❤️ ${likes}`;
            }

        });

}

async function likeMovie(movieId, button) {

    if (!movieId) {
        return;
    }

    try {

        const response = await fetch(`/movies/${movieId}/like`, {
            method: "POST"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Could not save like.");
            return;
        }

        animateLike(button, result.likes);
        updateLikeDisplay(movieId, result.likes);

    } catch (error) {

        console.error(error);
        alert("Could not save like.");

    }

}

function animateLike(button, likes) {

    button.classList.add("liked");

    const countEl = button.querySelector("#detailLikesCount");

    if (countEl) {
        countEl.textContent = likes;
    }

    const heart = button.querySelector(".heart");
    heart.classList.add("heart-animation");

    setTimeout(() => {
        button.classList.remove("liked");
        heart.classList.remove("heart-animation");
    }, 1000);

}

function openReviewForm(movie) {

    selectedMovie = movie;

    document.getElementById("reviewModal").style.display = "flex";

}

function closeReviewForm() {

    document.getElementById("reviewModal").style.display = "none";

}

document
    .getElementById("publishReview")
    .addEventListener("click", publishReview);

async function publishReview() {

    const title = document.getElementById("reviewTitle").value.trim();
    const content = document.getElementById("reviewContent").value.trim();
    const author = localStorage.getItem("selectedPersona");

    if (!title || !content) {
        alert("Please fill in both title and content.");
        return;
    }

    const response = await fetch("/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            content,
            author,
            movie: selectedMovie
        })
    });

    const result = await response.json();

    if (result.success) {

        alert("Review published!");

        closeReviewForm();
        document.getElementById("reviewTitle").value = "";
        document.getElementById("reviewContent").value = "";

        if (!feedData.reviewsByMovie[selectedMovie]) {
            feedData.reviewsByMovie[selectedMovie] = [];
        }

        feedData.reviewsByMovie[selectedMovie].unshift(result.post);

        if (detailMovie?.title === selectedMovie) {
            renderDetailReviews(selectedMovie);
        }

    } else {

        alert(result.message);

    }

}

async function deleteReview(id) {

    if (!confirm("Delete this review?")) {
        return;
    }

    const response = await fetch("/posts/" + id, {
        method: "DELETE"
    });

    const result = await response.json();

    if (result.success) {

        for (const title of Object.keys(feedData.reviewsByMovie || {})) {
            feedData.reviewsByMovie[title] =
                feedData.reviewsByMovie[title]
                    .filter(post => post._id !== id);
        }

        if (detailMovie) {
            renderDetailReviews(detailMovie.title);
        }

    } else {

        alert(result.message);

    }

}

function activateSearch() {

    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", function () {

        const value = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".feed-card");

        cards.forEach(card => {

            const title = (card.dataset.title || "").toLowerCase();
            card.style.display = title.includes(value) ? "block" : "none";

        });

    });

}

function initAdvancedSearch() {

    document
        .getElementById("search1-btn")
        .addEventListener("click", runSearch1);

    document
        .getElementById("search2-btn")
        .addEventListener("click", runSearch2);

}

function getSearchParams(prefix) {

    const category =
        document.getElementById(`${prefix}-category`).value;
    const year =
        document.getElementById(`${prefix}-year`).value;
    const minLikes =
        document.getElementById(`${prefix}-minLikes`).value;

    if (!category) {
        alert("Please select a category.");
        return null;
    }

    if (!year) {
        alert("Please enter a year.");
        return null;
    }

    if (minLikes === "") {
        alert("Please enter a minimum rating.");
        return null;
    }

    return { category, year, minLikes };

}

async function runSearch1() {

    const params = getSearchParams("search1");

    if (!params) {
        return;
    }

    const query = new URLSearchParams(params);

    await executeSearch(
        `/search/movies?${query}`,
        "Search 1: Category + Year + Min Rating"
    );

}

async function runSearch2() {

    const params = getSearchParams("search2");

    if (!params) {
        return;
    }

    params.persona = persona;

    const query = new URLSearchParams(params);

    await executeSearch(
        `/search/persona-movies?${query}`,
        `Search 2: My List (${persona}) — Category + Year + Min Rating`
    );

}

async function executeSearch(url, title) {

    try {

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Search failed.");
            return;
        }

        document.getElementById("search-results-title").textContent = title;
        document.getElementById("search-results-count").textContent =
            `${result.count} result(s)`;

        renderSearchResults(result.movies || []);
        scrollToSection("search-section");

    } catch (error) {

        console.error(error);
        alert("Search failed.");

    }

}

function renderSearchResults(movies) {

    const container = document.getElementById("search-results");
    container.innerHTML = "";

    if (!movies.length) {
        container.innerHTML =
            `<p class="empty-row">No movies matched your search.</p>`;
        return;
    }

    movies.forEach(movie => {
        container.appendChild(createFeedCard(movie));
    });

}

async function loadAnalytics() {

    try {

        const [categoryRes, personaRes] = await Promise.all([

            fetch("/analytics/most-watched-by-category"),
            fetch("/analytics/views-by-persona")

        ]);

        const categoryData = await categoryRes.json();
        const personaData = await personaRes.json();

        renderCategoryAnalytics(categoryData.results || []);
        renderPersonaAnalytics(personaData.results || []);

    } catch (error) {

        console.error(error);

    }

}

function renderCategoryAnalytics(results) {

    const tbody = document.getElementById("analytics-by-category");
    tbody.innerHTML = "";

    if (!results.length) {
        tbody.innerHTML =
            `<tr><td colspan="4">No watch data yet.</td></tr>`;
        return;
    }

    results.forEach(row => {

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(row._id || "Unknown")}</td>
                <td>${row.totalViews}</td>
                <td>${row.uniqueMovies}</td>
                <td>${row.completedViews}</td>
            </tr>
        `;

    });

}

function renderPersonaAnalytics(results) {

    const tbody = document.getElementById("analytics-by-persona");
    tbody.innerHTML = "";

    if (!results.length) {
        tbody.innerHTML =
            `<tr><td colspan="4">No watch data yet.</td></tr>`;
        return;
    }

    results.forEach(row => {

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(row._id || "Unknown")}</td>
                <td>${row.viewCount}</td>
                <td>${row.completedCount}</td>
                <td>${Math.round(row.totalWatchTime || 0)}</td>
            </tr>
        `;

    });

}

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }

}

function goHome() {
    window.location.href = "/main";
}

function goMovies() {
    window.location.href = "/movies";
}

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

function logout() {

    fetch("/logout", { method: "POST" })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                localStorage.clear();
                window.location.href = "/";
            } else {
                alert(data.message);
            }

        });

}

async function openVideo(movie, video) {

    currentMovie = movie;
    currentVideo = video;
    currentPersona = localStorage.getItem("selectedPersona");

    document.getElementById("videoTitle").textContent = movie;

    const player = document.getElementById("moviePlayer");

    document.getElementById("videoModal").style.display = "flex";

    try {

        const response = await fetch(
            `/watch-history/${encodeURIComponent(currentPersona)}/${encodeURIComponent(movie)}`
        );

        const history = await response.json();

        player.onloadedmetadata = () => {

            if (history?.currentTime) {
                player.currentTime = history.currentTime;
            }

            player.play();

        };

        player.src = "/" + video;

    } catch (err) {

        console.log(err);
        player.src = "/" + video;
        player.play();

    }

}

async function closeVideo() {

    const player = document.getElementById("moviePlayer");
    const savedTime = player.currentTime;
    const savedDuration = player.duration;

    try {

        await fetch("/watch-history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                persona: currentPersona,
                movie: currentMovie,
                currentTime: savedTime,
                duration: savedDuration
            })
        });

    } catch (err) {

        console.log("Save error:", err);

    }

    player.pause();
    player.removeAttribute("src");
    player.load();

    document.getElementById("videoModal").style.display = "none";

    loadFeed();

}

document.getElementById("detailModal").addEventListener("click", (event) => {
    if (event.target.id === "detailModal") {
        closeDetailModal();
    }
});

document.getElementById("videoModal").addEventListener("click", (event) => {
    if (event.target.id === "videoModal") {
        closeVideo();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeDetailModal();
        closeVideo();
        closeReviewForm();
    }
});
