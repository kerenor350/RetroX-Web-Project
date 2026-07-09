const express = require("express");
const path = require("path");
const session = require("express-session");
const watchHistoryRoutes =
    require("./routes/watchHistoryRoutes");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const personaRoutes = require("./routes/personaRoutes");
const movieRoutes = require("./routes/movieRoutes");
const postRoutes = require("./routes/postRoutes");
const feedRoutes = require("./routes/feedRoutes");
const searchRoutes = require("./routes/searchRoutes");

const {
    checkLoginPage
} = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(session({

    secret: "mySecretKey",

    resave: false,

    saveUninitialized: false

}));

app.use(express.static(path.join(__dirname, "public")));

// ===========================
// Routes
// ===========================

app.use(authRoutes);
app.use(personaRoutes);
app.use(movieRoutes);
app.use(postRoutes);
app.use(feedRoutes);
app.use(searchRoutes);
app.use(watchHistoryRoutes);

// ===========================
// Pages
// ===========================

app.get("/", (req, res) => {

    res.sendFile(

        path.join(
            __dirname,
            "views",
            "loginPage.html"
        )

    );

});

app.get(
    "/profiles",
    checkLoginPage,
    (req, res) => {

        res.sendFile(

            path.join(
                __dirname,
                "views",
                "profiles.html"
            )

        );

    }
);

app.get(
    "/main",
    checkLoginPage,
    (req, res) => {

        res.sendFile(

            path.join(
                __dirname,
                "views",
                "mainPage.html"
            )

        );

    }
);

app.get(
    "/movies",
    checkLoginPage,
    (req, res) => {

        res.sendFile(

            path.join(
                __dirname,
                "views",
                "movies.html"
            )

        );

    }
);

app.get("/test", (req, res) => {

    res.send("WORKS");

});

async function startServer() {

    await connectDB();

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });

}

startServer();