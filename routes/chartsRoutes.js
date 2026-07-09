const express = require("express");

const router = express.Router();

const chartsController =
    require("../controllers/chartsController");

const externalController =
    require("../controllers/externalController");

const {
    checkLogin,
    checkAdmin
} = require("../middleware/authMiddleware");

router.get(

    "/charts/category-views",

    checkAdmin,

    chartsController.getCategoryViewsChart

);

router.get(

    "/charts/persona-views",

    checkAdmin,

    chartsController.getPersonaViewsChart

);

router.get(

    "/external/imdb",

    checkLogin,

    externalController.getImdbInfo

);

router.get(

    "/locations",

    checkLogin,

    externalController.getAllLocations

);

router.put(

    "/locations/:id",

    checkLogin,

    externalController.updateLocation

);

module.exports = router;
