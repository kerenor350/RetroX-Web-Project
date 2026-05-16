const movies = [

    {
        title: "Midnight Circuit",
        likes: 120,
        image: "assets/midnight-circuit.png"
    },

    {
        title: "Desert Signal",
        likes: 90,
        image: "assets/desert-signal.png"
    },

    {
        title: "The Last Lighthouse",
        likes: 75,
        image: "assets/last-lighthouse.png"
    },

    {
        title: "Neon Chase",
        likes: 60,
        image: "assets/neon-chase.png"
    }

];

movies.sort((a, b) =>
    a.title.localeCompare(b.title)
);

const feedContainer =
document.querySelector("#feed-container");

movies.forEach(movie => {

    feedContainer.innerHTML += `

    <div class="movie-card">

        <img
            src="${movie.image}"
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

    </div>
    
    `;
});

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