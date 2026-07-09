console.log("Persona:", localStorage.getItem("selectedPersona"));
const profileImage =
    localStorage.getItem("selectedPersonaImage");

if (profileImage) {
    document.querySelector(".profile-img").src =
        profileImage;
}
const persona =
    localStorage.getItem("selectedPersona");

if (!persona) {
    window.location.href = "/";
}

document.querySelector("#currentPersona")
    .textContent =
    `Welcome ${persona}`;

fetch(`/movies/${persona}`)
    .then(response => response.json())
    .then(movies => {
         console.log("Movies:", movies);
        movies.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        const feedContainer =
            document.querySelector("#feed-container");

        movies.forEach(movie => {

            feedContainer.innerHTML += `

            <div class="movie-card"
             id="movie-${movie._id}"
             >

                <img
                    src="/${movie.image}"
                    alt="${movie.title}"
                    class="movie-img"
                >

                <h2>${movie.title}</h2>

                <button class="like-btn">

                    <span class="heart">
                        ❤️
                    </span>

                    <span class="likes-count">
                        ${movie.likes}
                    </span>

                </button>
                <button
    class="review-btn"
    onclick="openReviewForm('${movie.title}')">

    ✍️ Write Review

</button>
                <button
    class="delete-btn"
    onclick="deleteMovie('${movie._id}')"
>
    🗑 Delete
</button>
<div
    class="reviews"
    id="reviews-${movie.title}">
</div>

            </div>

            `;
        });

        activateLikeButtons();

        activateSearch();
        loadReviews();

    });



function activateLikeButtons() {

    const buttons =
    document.querySelectorAll(".like-btn");

    buttons.forEach(button => {

        button.addEventListener("click", function(){

            button.classList.add("liked");

            const likes =
            button.querySelector(".likes-count");

            likes.textContent =
            parseInt(likes.textContent) + 1;

            const heart =
            button.querySelector(".heart");

            heart.classList.add("heart-animation");

            setTimeout(() => {

                button.classList.remove("liked");

                heart.classList.remove("heart-animation");

            },1000);

        });

    });

}

function activateSearch() {

    const searchInput =
    document.querySelector("#search-input");

    searchInput.addEventListener("input", function(){

        const value =
        searchInput.value.toLowerCase();

        const cards =
        document.querySelectorAll(".movie-card");

        cards.forEach(card => {

            const text =
            card.textContent.toLowerCase();

            if(text.includes(value)){

                card.style.display = "block";
            }

            else{

                card.style.display = "none";
            }

        });

    });

}
document
.querySelector("#logoutBtn")
.addEventListener("click", logout);

function logout(){

    fetch("/logout",{

        method:"POST"

    })
    .then(response => response.json())
    .then(data=>{

        if(data.success){

            window.location.href="/";

        }
        else{

            alert(data.message);

        }

    });

}
async function deleteMovie(id) {

     const confirmDelete = confirm(
        "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
        return;
    }
    
    const response = await fetch(

        "/movies/" + id,

        {
            method: "DELETE"
        }

    );

    const result =
        await response.json();

    if (result.success) {

        document
            .getElementById(
                "movie-" + id
            )
            .remove();

    }

    else {

        alert(result.message);

    }

}
let selectedMovie = "";

function openReviewForm(movie){

    selectedMovie = movie;

    document
        .getElementById("reviewModal")
        .style.display="flex";

}

function closeReviewForm(){

    document
        .getElementById("reviewModal")
        .style.display="none";

}
document
    .getElementById("publishReview")
    .addEventListener("click", publishReview);

async function publishReview() {
    console.log("Publish clicked");
    

    const title =
        document.getElementById("reviewTitle").value;

    const content =
        document.getElementById("reviewContent").value;

    const author =
        localStorage.getItem("selectedPersona");

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

    const result =
        await response.json();

    if(result.success){

        alert("Review published!");

        closeReviewForm();

        document.getElementById("reviewTitle").value="";
        document.getElementById("reviewContent").value="";

    }

    else{

        alert(result.message);

    }

};

async function loadReviews() {

    const response =
        await fetch("/posts");

    const posts =
        await response.json();

    posts.forEach(post => {

        const container =
            document.getElementById(
                "reviews-" + post.movie
            );

        if (!container)
            return;
      const created = new Date(post.createdAt)
    .toLocaleDateString("he-IL");

    const updated = new Date(post.updatedAt)
    .toLocaleDateString("he-IL");
     container.innerHTML += `

<div
    class="review-card"
    id="post-${post._id}">

    <h4>${post.title}</h4>

    <p>${post.content}</p>

    <p class="review-author">
    👤 ${post.author}
</p>

<p class="review-date">
    📅 ${created}
</p>

<p class="review-date">
    ✏️ Updated: ${updated}
</p>

    <br>

    <button
        class="delete-review-btn"
        onclick="deleteReview('${post._id}')">

        🗑 Delete Review

    </button>

</div>

`});
}
async function deleteReview(id) {

    const confirmDelete =
        confirm("Delete this review?");

    if (!confirmDelete)
        return;

    const response =
        await fetch("/posts/" + id, {

            method: "DELETE"

        });

    const result =
        await response.json();

    if (result.success) {

        document
            .getElementById("post-" + id)
            .remove();

    }

    else {

        alert(result.message);

    }

}function goHome() {

    window.location.href = "/main";

}

function goMovies() {

    window.location.href = "/movies";

}