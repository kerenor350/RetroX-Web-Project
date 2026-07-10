const express = require("express");

const router = express.Router();

const searchController =
    require("../controllers/searchController");

const {
    checkLogin,
    checkAdmin
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

    checkAdmin,

    searchController.getMostWatchedByCategory

);

router.get(

    "/analytics/views-by-persona",

    checkAdmin,

    searchController.getViewsByPersona

);

router.get(

    "/analytics/likes-by-category",

    checkAdmin,

    searchController.getLikesByCategory

);

router.get(

    "/analytics/search-users",

    checkAdmin,

    searchController.searchUsers

);

module.exports = router;
