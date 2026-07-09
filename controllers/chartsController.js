const WatchHistory = require("../models/watchHistory.model");
const logger = require("../utils/logger");

async function getCategoryViewsChart(req, res) {

    try {

        const results = await WatchHistory.aggregate([

            {
                $group: {
                    _id: "$movie",
                    viewCount: { $sum: 1 }
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
                    totalViews: { $sum: "$viewCount" }
                }
            },

            { $sort: { totalViews: -1 } }

        ]);

        res.json({

            success: true,
            chart: "category-views",
            data: results.map(item => ({
                label: item._id,
                value: item.totalViews
            }))

        });

    }

    catch (error) {

        logger.error("getCategoryViewsChart failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function getPersonaViewsChart(req, res) {

    try {

        const results = await WatchHistory.aggregate([

            {
                $group: {
                    _id: "$persona",
                    totalViews: { $sum: 1 },
                    watchTime: { $sum: "$currentTime" }
                }
            },

            { $sort: { totalViews: -1 } }

        ]);

        res.json({

            success: true,
            chart: "persona-views",
            data: results.map(item => ({
                label: item._id,
                value: item.totalViews,
                watchTime: item.watchTime
            }))

        });

    }

    catch (error) {

        logger.error("getPersonaViewsChart failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getCategoryViewsChart,
    getPersonaViewsChart

};
