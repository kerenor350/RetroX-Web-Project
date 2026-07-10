const WatchHistory =
    require("../models/watchHistory.model");
const logger = require("../utils/logger");

// =====================================
// Save / Update progress
// =====================================

async function saveProgress(req, res) {

    try {

        const {

            persona,
            movie,
            currentTime,
            duration

        } = req.body;

        const completed =
            currentTime >= duration - 2;

        const history =
            await WatchHistory.findOneAndUpdate(

                {

                    persona,
                    movie

                },

                {

                    persona,
                    movie,
                    currentTime,
                    duration,
                    completed

                },

                {

                    upsert: true,
                    new: true

                }

            );

        res.json({

            success: true,

            history

        });

    }

    catch (error) {

        logger.error("saveProgress failed", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// =====================================
// Get progress
// =====================================

async function getProgress(req, res) {

    try {

        const {

            persona,
            movie

        } = req.params;

        const history =
            await WatchHistory.findOne({

                persona,

                movie

            });

        res.json(history);

    }

    catch (error) {

        logger.error("getProgress failed", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// =====================================
// Continue Watching List
// =====================================

async function getContinueWatching(req, res) {

    try {

        const persona =
            req.params.persona;

        const history =
            await WatchHistory.find({

                persona,

                completed: false

            });

        res.json(history);

    }

    catch (error) {

        logger.error("getContinueWatching failed", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

module.exports = {

    saveProgress,

    getProgress,

    getContinueWatching

};
