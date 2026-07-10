const Movie = require("../models/movie.model");
const WatchHistory = require("../models/watchHistory.model");
const Post = require("../models/postModel");
const logger = require("../utils/logger");

const CATEGORIES = ["Action", "Comedy", "Sci-Fi", "Drama"];

async function enrichWithProgress(persona, movies) {

    const history = await WatchHistory.find({ persona });

    const progressMap = {};

    history.forEach(item => {
        progressMap[item.movie] = item;
    });

    return movies.map(movie => {

        const progress = progressMap[movie.title];

        return {
            ...movie.toObject(),
            progress: progress
                ? {
                    currentTime: progress.currentTime,
                    duration: progress.duration,
                    completed: progress.completed,
                    percent: progress.duration
                        ? Math.round(
                            (progress.currentTime / progress.duration) * 100
                        )
                        : 0
                }
                : null
        };

    });

}

async function getPersonalFeed(req, res) {

    try {

        const persona = req.params.persona;

        const [
            continueHistory,
            allMovies,
            topPopular,
            posts
        ] = await Promise.all([

            WatchHistory.find({
                persona,
                completed: false
            }).sort({ updatedAt: -1 }),

            Movie.find(),

            Movie.find()
                .sort({ likes: -1 })
                .limit(10),

            Post.find().sort({ createdAt: -1 })

        ]);

        const movieByTitle = {};

        allMovies.forEach(movie => {
            movieByTitle[movie.title] = movie;
        });

        const continueWatching = continueHistory
            .map(item => {

                const movie = movieByTitle[item.movie];

                if (!movie) {
                    return null;
                }

                return {
                    ...movie.toObject(),
                    progress: {
                        currentTime: item.currentTime,
                        duration: item.duration,
                        completed: item.completed,
                        percent: item.duration
                            ? Math.round(
                                (item.currentTime / item.duration) * 100
                            )
                            : 0
                    }
                };

            })
            .filter(Boolean);

        const watchedTitles = new Set(
            (await WatchHistory.find({ persona }))
                .map(item => item.movie)
        );

        const watchedCategories = {};

        watchedTitles.forEach(title => {

            const movie = movieByTitle[title];

            if (movie?.category) {
                watchedCategories[movie.category] =
                    (watchedCategories[movie.category] || 0) + 1;
            }

        });

        const sortedCategories = Object.entries(watchedCategories)
            .sort((a, b) => b[1] - a[1])
            .map(([category]) => category);

        let recommendations = [];

        if (sortedCategories.length > 0) {

            recommendations = allMovies
                .filter(movie =>
                    sortedCategories.includes(movie.category) &&
                    !watchedTitles.has(movie.title)
                )
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 10);

        }

        if (recommendations.length < 6) {

            const existing = new Set(
                recommendations.map(movie => movie.title)
            );

            const fallback = allMovies
                .filter(movie =>
                    !watchedTitles.has(movie.title) &&
                    !existing.has(movie.title)
                )
                .sort((a, b) => b.likes - a.likes);

            recommendations = [
                ...recommendations,
                ...fallback.slice(0, 10 - recommendations.length)
            ];

        }

        const categories = {};

        for (const category of CATEGORIES) {

            categories[category] = allMovies
                .filter(movie => movie.category === category)
                .sort((a, b) => b.likes - a.likes);

        }

        const myList = allMovies
            .filter(movie => movie.persona === persona)
            .sort((a, b) => a.title.localeCompare(b.title));

        const reviewsByMovie = {};

        posts.forEach(post => {

            if (!reviewsByMovie[post.movie]) {
                reviewsByMovie[post.movie] = [];
            }

            reviewsByMovie[post.movie].push(post);

        });

        res.json({

            persona,
            continueWatching,
            recommendations: await enrichWithProgress(
                persona,
                recommendations
            ),
            topPopular: await enrichWithProgress(
                persona,
                topPopular
            ),
            categories: Object.fromEntries(

                await Promise.all(

                    Object.entries(categories).map(
                        async ([key, movies]) => [
                            key,
                            await enrichWithProgress(persona, movies)
                        ]
                    )

                )

            ),
            myList: await enrichWithProgress(persona, myList),
            reviewsByMovie

        });

    }

    catch (error) {

        logger.error("getPersonalFeed failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getPersonalFeed

};
