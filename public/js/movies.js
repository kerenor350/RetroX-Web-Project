const profileImage =
    localStorage.getItem("selectedPersonaImage");

if (profileImage) {

    document.querySelector(".profile-img").src =
        profileImage;

}

fetch("/movies/all")
    .then(response => response.json())
    .then(movies => {

        console.log(movies);

        const container =
            document.getElementById("movies-container");

        movies.forEach(movie => {

            const card = document.createElement("div");

            card.className = "movie-card";

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
`;

            container.appendChild(card);

        });

    });

   async function addMovie(title, image) {

    const persona =
        localStorage.getItem("selectedPersona");

    const response = await fetch("/movies", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            title: title,
            image: image,
            likes: 0,
            persona: persona

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