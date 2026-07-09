const Movie = require("../models/movie.model");

async function getMovies(req, res) {

    try {

        const persona = req.params.persona;

        const movies = await Movie.find({
            persona: persona
        });

        res.json(movies);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function createMovie(req, res) {

    try {

        const movie = new Movie(req.body);

        await movie.save();

        res.status(201).json(movie);

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

}

async function deleteMovie(req, res) {

    try {

        const movie = await Movie.findByIdAndDelete(
            req.params.id
        );

        if (!movie) {

            return res.status(404).json({

                success: false,
                message: "Movie not found"

            });

        }

        res.json({

            success: true,
            message: "Movie deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function updateMovie(req, res) {

    try {

        const movie = await Movie.findByIdAndUpdate(

            req.params.id,

            {
                title: req.body.title,
                image: req.body.image
            },

            {
                new: true
            }

        );

        if (!movie) {

            return res.status(404).json({

                success: false,
                message: "Movie not found"

            });

        }

        res.json({

            success: true,
            message: "Movie updated successfully",
            movie

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function getAllMovies(req, res) {

    try {

        const movies = await Movie.find();

        res.json(movies);

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function likeMovie(req, res) {

    try {

        const movie = await Movie.findByIdAndUpdate(

            req.params.id,

            {
                $inc: { likes: 1 }
            },

            {
                returnDocument: "after"
            }

        );

        if (!movie) {

            return res.status(404).json({

                success: false,
                message: "Movie not found"

            });

        }

        res.json({

            success: true,
            likes: movie.likes,
            movie

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getMovies,
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    likeMovie

};