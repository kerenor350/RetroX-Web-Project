const profileImage = localStorage.getItem("selectedPersonaImage");
const role = localStorage.getItem("role");

let currentMovieId = "";

if (profileImage) {
    document.querySelector(".profile-img").src = profileImage;
}

fetch("/movies/all")
    .then(response => response.json())
    .then(movies => {

        const container = document.getElementById("movies-container");

        movies.forEach(movie => {

            const card = document.createElement("div");
            card.className = "movie-card";

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
>

<h2>${movie.title}</h2>

<button
    class="add-btn"
    onclick="addMovie('${movie.title}','${movie.image}')">

    ➕ Add to My List

</button>

${adminButtons}

`;

            container.appendChild(card);

        });

    });

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