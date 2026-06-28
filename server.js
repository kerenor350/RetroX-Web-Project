const express = require("express");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const personaRoutes = require("./routes/personaRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

console.log("MY SERVER FILE");

const PORT = 3000;

app.use(express.json());

app.use(session({

    secret: "mySecretKey",

    resave: false,

    saveUninitialized: false

}));


app.use(express.static(path.join(__dirname, "public")));
app.use(authRoutes);
app.use(personaRoutes);
app.use(movieRoutes);

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





// עמוד הבית
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "views", "loginPage.html")
    );
});
app.get("/profiles", (req, res) => {

    res.sendFile(
        path.join(__dirname, "views", "profiles.html")
    );

});
app.get("/main", (req, res) => {
    res.sendFile(
        path.join(__dirname, "views", "mainPage.html")
    );
});




console.log("Personas route loaded");



 

app.get("/test", (req, res) => {
    res.send("WORKS");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});