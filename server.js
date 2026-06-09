const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

app.use(express.json());


// מאפשר גישה לקבצים סטטיים
app.use(express.static(__dirname));

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



// עמוד הבית
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "loginPage.html")
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const user = users.find(user =>
        user.username === username &&
        user.password === password
    );

    if (user) {

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
app.get("/movies", (req, res) => {

    res.json(movies);

});