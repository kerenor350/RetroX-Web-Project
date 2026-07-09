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
        src="${persona.image}"
        width="180"
        onclick="selectPersona('${persona.name}','${persona.image}')"
    >

    <p class="name">
        ${persona.name}
    </p>

    <input
        id="name-${persona._id}"
        type="text"
        value="${persona.name}"
    >

    <button
        onclick="updatePersona('${persona._id}')">

        💾 Save

    </button>

    <button
        class="delete-btn"
        onclick="deletePersona('${persona._id}')">

        🗑 Delete

    </button>

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
                name
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