const profileImage = localStorage.getItem("selectedPersonaImage");
const role = localStorage.getItem("role");

let currentMovieId = "";
let allMovies = [];

if (profileImage) {
    document.querySelector(".profile-img").src = profileImage;
}

loadAllMovies();
initMoviesSearch();

async function loadAllMovies() {

    try {

        const response = await fetch("/movies/all");
        allMovies = await response.json();
        renderMovies(allMovies);
        updateSearchCount(allMovies.length, "all");

    } catch (error) {

        console.error(error);
        alert("Could not load movies.");

    }

}

function renderMovies(movies) {

    const container = document.getElementById("movies-container");
    container.innerHTML = "";

    if (!movies.length) {
        container.innerHTML =
            `<p class="empty-row">No movies found.</p>`;
        return;
    }

    movies.forEach(movie => {

        const card = document.createElement("div");
        card.className = "movie-card";
        card.dataset.title = movie.title.toLowerCase();
        card.dataset.category = movie.category || "";
        card.dataset.year = movie.year || "";
        card.dataset.likes = movie.likes || 0;

        const adminButtons = role === "admin" ? `

<button
    class="edit-btn"
    onclick="openEditMovie(
        '${movie._id}',
        '${movie.title}',
        '${movie.image}'
    )">

    ✏️ Edit Movie

</button>

<button
    class="delete-btn"
    onclick="deleteMovie('${movie._id}')">

    🗑 Delete Movie

</button>

` : "";

        card.innerHTML = `

<img
    src="/${movie.image}"
    class="movie-img"
    alt="${movie.title}"
>

<h2>${movie.title}</h2>

<p class="movie-meta">
    ${movie.category || "General"} · ${movie.year || "N/A"} · ❤️ ${movie.likes || 0}
</p>

<button
    class="add-btn"
    onclick="addMovie('${movie.title}','${movie.image}')">

    ➕ Add to My List

</button>

${adminButtons}

`;

        container.appendChild(card);

    });

}

function updateSearchCount(count, mode) {

    const label = document.getElementById("movies-search-count");

    if (mode === "all") {
        label.textContent = `Showing all ${count} movie(s)`;
        return;
    }

    label.textContent = `Found ${count} movie(s)`;

}

function initMoviesSearch() {

    document
        .getElementById("movies-search-btn")
        .addEventListener("click", runMoviesSearch);

    document
        .getElementById("movies-reset-btn")
        .addEventListener("click", () => {
            document.getElementById("movies-category").value = "";
            document.getElementById("movies-year").value = "";
            document.getElementById("movies-minLikes").value = "";
            document.getElementById("search-input").value = "";
            renderMovies(allMovies);
            updateSearchCount(allMovies.length, "all");
        });

    document
        .getElementById("search-input")
        .addEventListener("input", filterByTitle);

}

async function runMoviesSearch() {

    const category = document.getElementById("movies-category").value;
    const year = document.getElementById("movies-year").value;
    const minLikes = document.getElementById("movies-minLikes").value;

    if (!category) {
        alert("Please select a category.");
        return;
    }

    if (!year) {
        alert("Please enter a year.");
        return;
    }

    if (minLikes === "") {
        alert("Please enter a minimum rating.");
        return;
    }

    const params = new URLSearchParams({
        category,
        year,
        minLikes
    });

    try {

        const response = await fetch(`/search/movies?${params}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Search failed.");
            return;
        }

        renderMovies(result.movies || []);
        updateSearchCount(result.count, "search");

    } catch (error) {

        console.error(error);
        alert("Search failed.");

    }

}

function filterByTitle() {

    const value =
        document.getElementById("search-input").value.toLowerCase().trim();
    const cards = document.querySelectorAll(".movie-card");

    cards.forEach(card => {

        const title = card.dataset.title || "";
        card.style.display = title.includes(value) ? "flex" : "none";

    });

}

async function addMovie(title, image) {

    const persona = localStorage.getItem("selectedPersona");

    const response = await fetch("/movies", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            title,
            image,
            likes: 0,
            persona

        })

    });

    const result = await response.json();

    if (response.ok) {

        alert("Movie added successfully!");

        window.location.href = "/main";

    } else {

        alert(result.message);

    }

}

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

function logout() {

    fetch("/logout", {

        method: "POST"

    })
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                window.location.href = "/";

            }

        });

}

function openEditMovie(id, title, image) {

    currentMovieId = id;

    document.getElementById("editMovieTitle").value = title;
    document.getElementById("editMovieImage").value = image;

    document.getElementById("editMovieModal").style.display = "flex";

}

function closeEditMovie() {

    document.getElementById("editMovieModal").style.display = "none";

}

async function saveMovie() {

    const title =
        document.getElementById("editMovieTitle").value;

    const image =
        document.getElementById("editMovieImage").value;

    const response = await fetch(

        "/movies/" + currentMovieId,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                title,
                image

            })

        }

    );

    const result = await response.json();

    if (result.success) {

        closeEditMovie();

        alert(result.message);

        location.reload();

    } else {

        alert(result.message);

    }

}

async function deleteMovie(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete)
        return;

    const response = await fetch("/movies/" + id, {

        method: "DELETE"

    });

    const result = await response.json();

    if (result.success) {

        alert(result.message);

        location.reload();

    } else {

        alert(result.message);

    }

}
