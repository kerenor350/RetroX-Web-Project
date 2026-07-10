const express = require("express");

const router = express.Router();

const movieController =
    require("../controllers/movieController");

const {
    checkLogin,
    checkAdmin
} = require("../middleware/authMiddleware");

router.get(
    "/movies/all",
    checkLogin,
    movieController.getAllMovies
);

router.get(
    "/movies/:persona",
    checkLogin,
    movieController.getMovies
);

router.post(
    "/movies/catalog",
    checkAdmin,
    movieController.createCatalogItem
);

router.post(
    "/movies/my-list",
    checkLogin,
    movieController.addToMyList
);

router.delete(
    "/movies/my-list/:id",
    checkLogin,
    movieController.removeFromMyList
);

router.post(
    "/movies/:id/like",
    checkLogin,
    movieController.likeMovie
);

router.put(
    "/movies/:id",
    checkAdmin,
    movieController.updateMovie
);

router.delete(
    "/movies/:id",
    checkAdmin,
    movieController.deleteMovie
);

module.exports = router;
