const express = require("express");

const router = express.Router();

const searchController =
    require("../controllers/searchController");

const {
    checkLogin
} = require("../middleware/authMiddleware");

router.get(

    "/search/movies",

    checkLogin,

    searchController.searchMoviesByFilters

);

router.get(

    "/search/persona-movies",

    checkLogin,

    searchController.searchMoviesByPersona

);

router.get(

    "/analytics/most-watched-by-category",

    checkLogin,

    searchController.getMostWatchedByCategory

);

router.get(

    "/analytics/views-by-persona",

    checkLogin,

    searchController.getViewsByPersona

);

module.exports = router;
