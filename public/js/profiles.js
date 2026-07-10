// ===========================
// Avatar Picker
// ===========================

const PERSONA_AVATARS = [
    "assets/man1.jpg",
    "assets/girl1.jpg",
    "assets/woman1.jpg",
    "assets/woman2.jpg"
];

let selectedAvatar = PERSONA_AVATARS[0];

function avatarSrc(path) {
    return encodeURI(`/${path}`);
}

function renderAvatarPicker(avatars) {

    const container = document.getElementById("avatarOptions");

    if (!container || !avatars.length) {
        return;
    }

    selectedAvatar = avatars[0];

    container.innerHTML = avatars.map((avatar, index) => `
        <button
            type="button"
            class="avatar-option${index === 0 ? " selected" : ""}"
            data-avatar="${avatar}"
            title="Select avatar"
            aria-label="Select avatar">
            <img src="${avatarSrc(avatar)}" alt="">
        </button>
    `).join("");

    container.querySelectorAll(".avatar-option").forEach(button => {

        button.addEventListener("click", () => {

            selectedAvatar = button.dataset.avatar;

            container.querySelectorAll(".avatar-option").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

        });

    });

}

document.addEventListener("DOMContentLoaded", () => {
    renderAvatarPicker(PERSONA_AVATARS);
});

// ===========================
// Load Personas
// ===========================

fetch("/personas")
    .then(response => response.json())
    .then(personas => {

        const container =
            document.querySelector(".profiles");

        container.innerHTML = "";

        personas.forEach(persona => {

            container.innerHTML += `

<div class="profile">

    <img
        src="${avatarSrc(persona.image)}"
        width="180"
        onclick="selectPersona('${persona.name}','${persona.image}')"
        alt="${persona.name}"
    >

    <p class="name">
        ${persona.name}
    </p>

    <div class="profile-actions">

        <div class="profile-edit-row">

            <input
                id="name-${persona._id}"
                type="text"
                value="${persona.name}"
                aria-label="Persona name"
            >

            <button
                class="profile-save-btn"
                onclick="updatePersona('${persona._id}')"
                title="Save name">

                Save

            </button>

        </div>

        <button
            class="profile-delete-btn"
            onclick="deletePersona('${persona._id}')"
            title="Remove profile">

            <span class="profile-delete-icon" aria-hidden="true">✕</span>
            Remove

        </button>

    </div>

</div>

`;

        });

    });


// ===========================
// Add Persona
// ===========================

document
    .querySelector("#addPersonaBtn")
    .addEventListener("click", () => {

        const name =
            document
                .querySelector("#personaName")
                .value
                .trim();

        if (name === "") {

            alert("Please enter a persona name");
            return;

        }

        fetch("/personas", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                image: selectedAvatar
            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.success) {

                location.reload();

            } else {

                alert(data.message);

            }

        });

    });


// ===========================
// Update Persona
// ===========================

async function updatePersona(id){

    const newName =
        document
            .getElementById("name-" + id)
            .value
            .trim();

    if(newName === ""){

        alert("Please enter a name");
        return;

    }

    const response =
        await fetch("/personas/" + id, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                name: newName

            })

        });

    const result =
        await response.json();

    if(result.success){

        alert("Persona updated successfully");

        location.reload();

    }

    else{

        alert(result.message);

    }

}


// ===========================
// Delete Persona
// ===========================

async function deletePersona(id){

    const confirmDelete =
        confirm("Are you sure you want to delete this profile?");

    if(!confirmDelete){

        return;

    }

    const response =
        await fetch("/personas/" + id, {

            method: "DELETE"

        });

    const result =
        await response.json();

    if(result.success){

        alert(result.message);

        location.reload();

    }

    else{

        alert(result.message);

    }

}


// ===========================
// Select Persona
// ===========================

function selectPersona(name, image){

    localStorage.setItem(
        "selectedPersona",
        name
    );

    localStorage.setItem(
        "selectedPersonaImage",
        image
    );

    window.location.href = "/main";

}
document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

function logout(){

    fetch("/logout",{

        method:"POST"

    })

    .then(response=>response.json())

    .then(result=>{

        if(result.success){

            localStorage.clear();

            window.location.href="/";

        }

    });

}
