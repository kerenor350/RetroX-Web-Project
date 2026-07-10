const Movie = require("../models/movie.model");
const Persona = require("../models/persona.model");
const logger = require("../utils/logger");

const CATEGORIES = ["Action", "Comedy", "Sci-Fi", "Drama"];

async function getMovies(req, res) {

    try {

        const persona = req.params.persona;

        const movies = await Movie.find({
            persona: persona
        });

        res.json(movies);

    } catch (error) {

        logger.error("getMovies failed", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function createCatalogItem(req, res) {

    try {

        const {
            title,
            image,
            category,
            year,
            description,
            contentType,
            persona
        } = req.body;

        if (!title?.trim() || !image?.trim()) {

            return res.status(400).json({

                success: false,
                message: "Title and image are required."

            });

        }

        if (!category || !CATEGORIES.includes(category)) {

            return res.status(400).json({

                success: false,
                message: "Valid category is required."

            });

        }

        if (!year) {

            return res.status(400).json({

                success: false,
                message: "Year is required."

            });

        }

        const movie = new Movie({

            title: title.trim(),
            image: image.trim(),
            category,
            year: Number(year),
            description: description?.trim() || "",
            contentType: contentType === "Series" ? "Series" : "Movie",
            persona: persona?.trim() || "Catalog",
            likes: 0

        });

        await movie.save();

        logger.info(`Admin created ${movie.contentType}: ${movie.title}`);

        res.status(201).json({

            success: true,
            message: `${movie.contentType} created successfully.`,
            movie

        });

    } catch (error) {

        logger.error("createCatalogItem failed", error);

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

}

async function addToMyList(req, res) {

    try {

        const { title, image, persona } = req.body;

        if (!title?.trim() || !image?.trim() || !persona?.trim()) {

            return res.status(400).json({

                success: false,
                message: "Title, image, and persona are required."

            });

        }

        const ownedPersona = await Persona.findOne({

            name: persona.trim(),
            owner: req.session.username

        });

        if (!ownedPersona) {

            return res.status(403).json({

                success: false,
                message: "You can only add movies to your own profiles."

            });

        }

        const duplicate = await Movie.findOne({

            title: title.trim(),
            persona: persona.trim()

        });

        if (duplicate) {

            return res.status(400).json({

                success: false,
                message: "This title is already in your list."

            });

        }

        const source = await Movie.findOne({ title: title.trim() }).sort({ likes: -1 });

        const movie = new Movie({

            title: title.trim(),
            image: image.trim(),
            persona: persona.trim(),
            likes: 0,
            category: source?.category || "Drama",
            year: source?.year || new Date().getFullYear(),
            description: source?.description || "",
            contentType: source?.contentType || "Movie",
            listOwner: req.session.username

        });

        await movie.save();

        logger.info(
            `${req.session.username} added ${movie.title} to ${persona} list`
        );

        res.status(201).json({

            success: true,
            message: "Added to My List.",
            movie

        });

    } catch (error) {

        logger.error("addToMyList failed", error);

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

}

async function removeFromMyList(req, res) {

    try {

        const persona = req.body.persona?.trim();

        if (!persona) {

            return res.status(400).json({

                success: false,
                message: "Persona is required."

            });

        }

        const ownedPersona = await Persona.findOne({

            name: persona,
            owner: req.session.username

        });

        if (!ownedPersona) {

            return res.status(403).json({

                success: false,
                message: "Invalid profile for this user."

            });

        }

        const movie = await Movie.findById(req.params.id);

        if (!movie || movie.persona !== persona) {

            return res.status(404).json({

                success: false,
                message: "Movie not found in your list."

            });

        }

        await Movie.findByIdAndDelete(req.params.id);

        logger.info(
            `${req.session.username} removed ${movie.title} from ${persona} list`
        );

        res.json({

            success: true,
            message: "Removed from My List."

        });

    } catch (error) {

        logger.error("removeFromMyList failed", error);

        res.status(500).json({

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

        logger.info(`Admin deleted catalog item: ${movie.title}`);

        res.json({

            success: true,
            message: "Movie deleted successfully"

        });

    } catch (error) {

        logger.error("deleteMovie failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function updateMovie(req, res) {

    try {

        const update = {

            title: req.body.title,
            image: req.body.image

        };

        if (req.body.category) {
            update.category = req.body.category;
        }

        if (req.body.year) {
            update.year = Number(req.body.year);
        }

        if (req.body.description !== undefined) {
            update.description = req.body.description;
        }

        if (req.body.contentType) {
            update.contentType = req.body.contentType;
        }

        const movie = await Movie.findByIdAndUpdate(

            req.params.id,

            update,

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

        logger.info(`Admin updated catalog item: ${movie.title}`);

        res.json({

            success: true,
            message: "Movie updated successfully",
            movie

        });

    } catch (error) {

        logger.error("updateMovie failed", error);

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

        logger.error("getAllMovies failed", error);

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

        logger.error("likeMovie failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getMovies,
    getAllMovies,
    createCatalogItem,
    addToMyList,
    removeFromMyList,
    updateMovie,
    deleteMovie,
    likeMovie

};
