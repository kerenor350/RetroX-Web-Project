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
            onclick="selectPersona('${persona.name}')"
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

    function selectPersona(name) {

    localStorage.setItem(
        "selectedPersona",
        name
    );

    window.location.href =
        "mainPage.html";
}