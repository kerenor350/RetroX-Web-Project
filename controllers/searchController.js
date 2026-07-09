const Movie = require("../models/movie.model");
const WatchHistory = require("../models/watchHistory.model");

const CATEGORIES = ["Action", "Comedy", "Sci-Fi", "Drama"];

// =====================================
// Search 1: category + year + minLikes
// =====================================

async function searchMoviesByFilters(req, res) {

    try {

        const {
            category,
            year,
            minLikes
        } = req.query;

        if (!category || !year || minLikes === undefined || minLikes === "") {

            return res.status(400).json({

                success: false,
                message:
                    "Required parameters: category, year, minLikes."

            });

        }

        if (!CATEGORIES.includes(category)) {

            return res.status(400).json({

                success: false,
                message: "Invalid category."

            });

        }

        const movies = await Movie.find({

            category,
            year: Number(year),
            likes: { $gte: Number(minLikes) }

        }).sort({ likes: -1 });

        res.json({

            success: true,
            searchType: "movies-by-filters",
            params: {
                category,
                year: Number(year),
                minLikes: Number(minLikes)
            },
            count: movies.length,
            movies

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// Search 2: persona my-list + category + year + minLikes
// persona is sent automatically from the client
// =====================================

async function searchMoviesByPersona(req, res) {

    try {

        const {
            persona,
            category,
            year,
            minLikes
        } = req.query;

        if (!persona || !category || !year || minLikes === undefined || minLikes === "") {

            return res.status(400).json({

                success: false,
                message:
                    "Required parameters: category, year, minLikes."

            });

        }

        if (!CATEGORIES.includes(category)) {

            return res.status(400).json({

                success: false,
                message: "Invalid category."

            });

        }

        const movies = await Movie.find({

            persona: persona.trim(),
            category,
            year: Number(year),
            likes: { $gte: Number(minLikes) }

        }).sort({ likes: -1 });

        res.json({

            success: true,
            searchType: "my-list-by-filters",
            params: {
                persona: persona.trim(),
                category,
                year: Number(year),
                minLikes: Number(minLikes)
            },
            count: movies.length,
            movies

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// GroupBy 1: most watched by category
// =====================================

async function getMostWatchedByCategory(req, res) {

    try {

        const results = await WatchHistory.aggregate([

            {
                $group: {
                    _id: "$movie",
                    viewCount: { $sum: 1 },
                    completedCount: {
                        $sum: {
                            $cond: ["$completed", 1, 0]
                        }
                    }
                }
            },

            {
                $lookup: {
                    from: "movies",
                    localField: "_id",
                    foreignField: "title",
                    as: "movieInfo"
                }
            },

            { $unwind: "$movieInfo" },

            {
                $group: {
                    _id: "$movieInfo.category",
                    totalViews: { $sum: "$viewCount" },
                    uniqueMovies: { $sum: 1 },
                    completedViews: { $sum: "$completedCount" }
                }
            },

            { $sort: { totalViews: -1 } }

        ]);

        res.json({

            success: true,
            groupBy: "category",
            results

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// GroupBy 2: view count by persona
// =====================================

async function getViewsByPersona(req, res) {

    try {

        const results = await WatchHistory.aggregate([

            {
                $group: {
                    _id: "$persona",
                    viewCount: { $sum: 1 },
                    completedCount: {
                        $sum: {
                            $cond: ["$completed", 1, 0]
                        }
                    },
                    totalWatchTime: { $sum: "$currentTime" }
                }
            },

            { $sort: { viewCount: -1 } }

        ]);

        res.json({

            success: true,
            groupBy: "persona",
            results

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    searchMoviesByFilters,
    searchMoviesByPersona,
    getMostWatchedByCategory,
    getViewsByPersona

};
