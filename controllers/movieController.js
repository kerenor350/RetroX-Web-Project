const Movie = require("../models/movie.model");

async function getMovies(req, res) {

    try {

        const persona = req.params.persona;

        const movies = await Movie.find({
            persona: persona
        });

        res.json(movies);

    }

    catch (error) {

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

    }

    catch (error) {

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

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}



async function getAllMovies(req, res) {

    try {

        const movies = await Movie.aggregate([
    {
        $group: {
            _id: "$title",
            title: { $first: "$title" },
            image: { $first: "$image" },
            likes: { $first: "$likes" }
        }
    }
]);

        res.json(movies);

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
    deleteMovie
};