const express = require("express");

const router = express.Router();

const feedController =
    require("../controllers/feedController");

const {
    checkLogin
} = require("../middleware/authMiddleware");

router.get(

    "/feed/:persona",

    checkLogin,

    feedController.getPersonalFeed

);

module.exports = router;
