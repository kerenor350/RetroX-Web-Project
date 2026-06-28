// טעינת הפרופילים מהשרת

fetch("/personas")
    .then(response => response.json())
    .then(personas => {

        const container =
            document.querySelector(".profiles");

        container.innerHTML = "";

        personas.forEach(persona => {

            container.innerHTML += `

            <div 
            class="profile"
            onclick="selectPersona('${persona.name}', '${persona.image}')"
>

    <img
        src="${persona.image}"
        width="180"
    >

    <p class="name">
        ${persona.name}
    </p>

    <input
        type="text"
        placeholder="Change name"
    >

</div>

            `;

        });

    });


// הוספת פרסונה חדשה

document
    .querySelector("#addPersonaBtn")
    .addEventListener("click", () => {

        const name =
            document
                .querySelector("#personaName")
                .value
                .trim();

        // בדיקה שהמשתמש הזין שם

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
                name: name
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

function selectPersona(name, image) {

    localStorage.setItem("selectedPersona", name);
    localStorage.setItem("selectedPersonaImage", image);

    window.location.href = "/main";
}