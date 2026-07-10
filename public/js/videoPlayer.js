const videoModal =
    document.getElementById("videoModal");

const moviePlayer =
    document.getElementById("moviePlayer");

const movieSource =
    document.getElementById("movieSource");

const videoTitle =
    document.getElementById("videoTitle");

let currentMovie = "";
let currentPersona = "";

async function openVideo(title, videoPath) {

    currentMovie = title;

    currentPersona =
        localStorage.getItem("selectedPersona");

    videoTitle.textContent = title;

    movieSource.src = "/" + videoPath;

    moviePlayer.load();

    // Load previous progress

    const response =
        await fetch(

            `/watch-history/${currentPersona}/${title}`

        );

    const history =
        await response.json();

    videoModal.style.display = "flex";

    moviePlayer.onloadedmetadata = () => {

        if(history){

            moviePlayer.currentTime =
                history.currentTime;

        }

    };

}

async function saveProgress(){

    await fetch(

        "/watch-history",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                persona:currentPersona,

                movie:currentMovie,

                currentTime:moviePlayer.currentTime,

                duration:moviePlayer.duration

            })

        }

    );

}

async function closeVideo(){

    await saveProgress();

    moviePlayer.pause();

    videoModal.style.display="none";

}

moviePlayer.addEventListener(

    "pause",

    saveProgress

);

moviePlayer.addEventListener(

    "ended",

    saveProgress

);

videoModal.addEventListener("click",(event)=>{

    if(event.target===videoModal){

        closeVideo();

    }

});

document.addEventListener(

    "keydown",

    function(event){

        if(event.key==="Escape"){

            closeVideo();

        }

    }

);