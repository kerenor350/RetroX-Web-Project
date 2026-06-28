const express = require("express");

const router = express.Router();

const movieController =
    require("../controllers/movieController");

router.get(
    "/movies/:persona",
    movieController.getMovies
);

module.exports = router;