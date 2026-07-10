const express = require("express");
const path = require("path");
const session = require("express-session");
const watchHistoryRoutes =
    require("./routes/watchHistoryRoutes");
require("dotenv").config();

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const {
    notFoundHandler,
    errorHandler
} = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const personaRoutes = require("./routes/personaRoutes");
const movieRoutes = require("./routes/movieRoutes");
const postRoutes = require("./routes/postRoutes");
const feedRoutes = require("./routes/feedRoutes");
const searchRoutes = require("./routes/searchRoutes");
const chartsRoutes = require("./routes/chartsRoutes");

const {
    checkLoginPage
} = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(requestLogger);

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
app.use(chartsRoutes);
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

app.get(
    "/map",
    checkLoginPage,
    (req, res) => {

        res.sendFile(

            path.join(
                __dirname,
                "views",
                "map.html"
            )

        );

    }
);

app.get("/test", (req, res) => {

    res.send("WORKS");

});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {

    await connectDB();

    app.listen(PORT, () => {

        logger.info(`Server running on port ${PORT}`);

    });

}

startServer().catch((error) => {

    logger.error("Failed to start server", error);
    process.exit(1);

});
