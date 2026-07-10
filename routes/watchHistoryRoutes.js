const express = require("express");

const router = express.Router();

const watchHistoryController =
    require("../controllers/watchHistoryController");

const {
    checkLogin
} = require("../middleware/authMiddleware");

// =====================================
// Save Progress
// =====================================

router.post(

    "/watch-history",

    checkLogin,

    watchHistoryController.saveProgress

);

// =====================================
// Get Progress
// =====================================

router.get(

    "/watch-history/:persona/:movie",

    checkLogin,

    watchHistoryController.getProgress

);

// =====================================
// Continue Watching
// =====================================

router.get(

    "/continue-watching/:persona",

    checkLogin,

    watchHistoryController.getContinueWatching

);

module.exports = router;