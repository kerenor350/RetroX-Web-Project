const Movie = require("../models/movie.model");
const WatchHistory = require("../models/watchHistory.model");
const User = require("../models/userModel");
const Persona = require("../models/persona.model");
const logger = require("../utils/logger");

const CATEGORIES = ["Action", "Comedy", "Sci-Fi", "Drama"];

function escapeRegex(value) {

    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}

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

        logger.error("searchMoviesByFilters failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

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

        logger.error("searchMoviesByPersona failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

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

        logger.error("getMostWatchedByCategory failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

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

        logger.error("getViewsByPersona failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function getLikesByCategory(req, res) {

    try {

        const results = await Movie.aggregate([

            {
                $group: {
                    _id: "$category",
                    totalLikes: { $sum: "$likes" },
                    avgLikes: { $avg: "$likes" },
                    itemCount: { $sum: 1 }
                }
            },

            { $sort: { totalLikes: -1 } }

        ]);

        res.json({

            success: true,
            groupBy: "likes-by-category",
            results

        });

    }

    catch (error) {

        logger.error("getLikesByCategory failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function searchUsers(req, res) {

    try {

        const {
            q,
            role,
            minPersonas
        } = req.query;

        if (!q?.trim()) {

            return res.status(400).json({

                success: false,
                message: "Required parameter: q (username search)."

            });

        }

        const filter = {

            username: {
                $regex: escapeRegex(q.trim()),
                $options: "i"
            }

        };

        if (role && role !== "all") {

            filter.role = role;

        }

        const users = await User.find(filter)
            .select("username role createdAt")
            .sort({ username: 1 });

        const results = await Promise.all(

            users.map(async (user) => {

                const personas = await Persona.find({
                    owner: user.username
                }).select("name");

                const personaNames = personas.map(
                    persona => persona.name
                );

                const viewCount = personaNames.length
                    ? await WatchHistory.countDocuments({
                        persona: { $in: personaNames }
                    })
                    : 0;

                const myListCount = await Movie.countDocuments({
                    listOwner: user.username
                });

                return {

                    username: user.username,
                    role: user.role,
                    joinedAt: user.createdAt,
                    personaCount: personas.length,
                    personas: personaNames,
                    viewCount,
                    myListCount

                };

            })

        );

        let filtered = results;

        if (
            minPersonas !== undefined &&
            minPersonas !== ""
        ) {

            filtered = results.filter(
                user =>
                    user.personaCount >= Number(minPersonas)
            );

        }

        res.json({

            success: true,
            searchType: "users-by-filters",
            params: {
                q: q.trim(),
                role: role || "all",
                minPersonas:
                    minPersonas === "" || minPersonas === undefined
                        ? null
                        : Number(minPersonas)
            },
            count: filtered.length,
            users: filtered

        });

    }

    catch (error) {

        logger.error("searchUsers failed", error);

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
    getViewsByPersona,
    getLikesByCategory,
    searchUsers

};
