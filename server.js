const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

console.log("MY SERVER FILE");

const PORT = 3000;

app.use(express.json());

app.use(session({

    secret: "mySecretKey",

    resave: false,

    saveUninitialized: false

}));


// מאפשר גישה לקבצים סטטיים
app.use(express.static(__dirname));


function checkLogin(req, res, next) {

    if (req.session.loggedIn) {

        next();

    } else {

        res.status(401).json({
            success: false,
            message: "Please login first."
        });

    }

}

const users = [

    {
        username: "keren",
        password: "1234"
    },

    {
        username: "admin",
        password: "admin"
    }

];
const personas = [

    {
        id: 1,
        name: "Dave",
        image: "assets/man1.jpg"
    },

    {
        id: 2,
        name: "Allen",
        image: "assets/girl1.jpg"
    },

    {
        id: 3,
        name: "Marry",
        image: "assets/woman1 (1).jpg"
    },

    {
        id: 4,
        name: "Jessica",
        image: "assets/woman2.jpg"
    }

];



const moviesByPersona = {

    Dave: [

        {
            title: "Midnight Circuit",
            likes: 120,
            image: "assets/midnight-circuit.png"
        },

        {
            title: "Desert Signal",
            likes: 90,
            image: "assets/desert-signal.png"
        }

    ],

    Allen: [

        {
            title: "Neon Chase",
            likes: 60,
            image: "assets/neon-chase.png"
        }

    ],

    Marry: [

        {
            title: "The Last Lighthouse",
            likes: 75,
            image: "assets/last-lighthouse.png"
        }

    ],

    Jessica: [

        {
            title: "Neon Chase",
            likes: 60,
            image: "assets/neon-chase.png"
        },

        {
            title: "The Last Lighthouse",
            likes: 75,
            image: "assets/last-lighthouse.png"
        }

    ]

};



// עמוד הבית
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "loginPage.html")
    );
});



app.post("/login", (req, res) => {

    const { username, password } = req.body;
    // Server-side validation

if (!username || username.trim().length < 3) {

    return res.json({
        success: false,
        message: "Username must be at least 3 characters long."
    });

}

if (!password || password.trim().length < 4) {

    return res.json({
        success: false,
        message: "Password must be at least 4 characters long."
    });

}

    const user = users.find(user =>
        user.username === username &&
        user.password === password
    );

    if (user) {


        req.session.loggedIn = true;
req.session.username = username;
        res.json({
            success: true,
            message: "Login successful"
        });

    } else {

        res.json({
            success: false,
            message: "Invalid username or password"
        });

    }

});
app.get("/movies/:persona", checkLogin, (req, res) => {

    const persona =
        req.params.persona;

    res.json(
        moviesByPersona[persona] || []
    );

});
console.log("Personas route loaded");

// קבלת כל הפרסונות
app.get("/personas", checkLogin, (req, res) => {

    res.json(personas);

});

// הוספת פרסונה חדשה
app.post("/personas", checkLogin, (req, res) => {

    const name = req.body.name?.trim();

    if (!name) {

        return res.status(400).json({
            success: false,
            message: "Persona name is required."
        });

    }

    const exists = personas.find(
        persona => persona.name === name
    );

    if (exists) {

        return res.status(400).json({
            success: false,
            message: "Persona already exists."
        });

    }

    const newPersona = {

        id: personas.length + 1,
        name: name,
        image: "assets/man1.jpg"

    };

    personas.push(newPersona);

    moviesByPersona[newPersona.name] = [

        {
            title: "Welcome Movie",
            likes: 0,
            image: "assets/midnight-circuit.png"
        }

    ];

    res.json({
        success: true,
        persona: newPersona
    });

});
 

app.get("/test", (req, res) => {
    res.send("WORKS");
});

app.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Could not logout."
            });
        }

        res.json({
            success: true,
            message: "Logged out successfully."
        });

    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});