const express = require("express");

const router = express.Router();

const movieController =
    require("../controllers/movieController");

router.get(
    "/movies/:persona",
    movieController.getMovies
);

router.post(
    "/movies",
    movieController.createMovie
);
router.delete(
    "/movies/:id",
    movieController.deleteMovie
);
module.exports = router;