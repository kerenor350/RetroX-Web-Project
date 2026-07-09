const Movie = require("../models/movie.model");
const logger = require("../utils/logger");

const IMDB_LOOKUP = {

    "Midnight Circuit": { title: "The Matrix", year: "1999" },
    "Desert Signal": { title: "Arrival", year: "2016" },
    "Neon Chase": { title: "Drive", year: "2011" },
    "The Last Lighthouse": { title: "The Lighthouse", year: "2019" },
    "Laugh Track": { title: "The Truman Show", year: "1998" },
    "Star Drift": { title: "Interstellar", year: "2014" },
    "Family Reunion": { title: "Knives Out", year: "2019" },
    "Broken Promises": { title: "Manchester by the Sea", year: "2016" },
    "Iron Horizon": { title: "Edge of Tomorrow", year: "2014" },
    "Quantum Loop": { title: "Looper", year: "2012" },
    "The Quiet Room": { title: "Good Will Hunting", year: "1997" },
    "Office Chaos": { title: "Office Space", year: "1999" }

};

async function fetchFromOmdb(params) {

    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
        throw new Error("OMDB_API_KEY is missing in .env file.");
    }

    const query = new URLSearchParams({
        apikey: apiKey,
        plot: "short",
        ...params
    });

    const response = await fetch(
        `https://www.omdbapi.com/?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error("IMDB service unavailable.");
    }

    const raw = await response.json();

    if (raw.Response === "False") {
        throw new Error(raw.Error || "Movie not found on IMDB.");
    }

    return raw;

}

async function getImdbInfo(req, res) {

    try {

        const movieTitle = req.query.movieTitle?.trim();
        const title = req.query.title?.trim();
        const year = req.query.year;

        let omdbParams = {};

        if (movieTitle) {

            const mapped = IMDB_LOOKUP[movieTitle];

            if (!mapped) {
                omdbParams = { t: movieTitle };
            } else {
                omdbParams = {
                    t: mapped.title,
                    y: mapped.year
                };
            }

        } else if (title) {

            omdbParams = { t: title };

            if (year) {
                omdbParams.y = year;
            }

        } else {

            return res.status(400).json({

                success: false,
                message: "movieTitle or title is required."

            });

        }

        const raw = await fetchFromOmdb(omdbParams);

        const imdbRating = (raw.Ratings || []).find(
            item => item.Source === "Internet Movie Database"
        );

        logger.info(
            `IMDB data fetched for ${movieTitle || title}: ${raw.Title}`
        );

        res.json({

            success: true,
            source: "OMDb API (IMDB data)",
            retroxTitle: movieTitle || null,
            imdb: {
                title: raw.Title,
                year: raw.Year,
                rated: raw.Rated,
                runtime: raw.Runtime,
                genre: raw.Genre,
                director: raw.Director,
                actors: raw.Actors,
                plot: raw.Plot,
                imdbRating: imdbRating?.Value || raw.imdbRating,
                imdbVotes: raw.imdbVotes,
                imdbId: raw.imdbID,
                poster: raw.Poster !== "N/A" ? raw.Poster : null,
                imdbUrl: raw.imdbID
                    ? `https://www.imdb.com/title/${raw.imdbID}/`
                    : null
            }

        });

    }

    catch (error) {

        logger.error("getImdbInfo failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function geocodeAddress(address) {

    const url =
        "https://nominatim.openstreetmap.org/search" +
        `?q=${encodeURIComponent(address)}&format=json&limit=1`;

    const response = await fetch(url, {

        headers: {
            "User-Agent": "RetroX-WebDev-Project"
        }

    });

    if (!response.ok) {
        throw new Error("Geocoding service unavailable.");
    }

    const results = await response.json();

    if (!results.length) {
        throw new Error("Address not found.");
    }

    return {
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
        displayName: results[0].display_name
    };

}

async function getAllLocations(req, res) {

    try {

        const movies = await Movie.find({

            lat: { $ne: null },
            lng: { $ne: null }

        }).select("title address city lat lng category image");

        res.json({

            success: true,
            locations: movies

        });

    }

    catch (error) {

        logger.error("getAllLocations failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

async function updateLocation(req, res) {

    try {

        const { address, city } = req.body;

        if (!address || !address.trim()) {

            return res.status(400).json({

                success: false,
                message: "Address is required."

            });

        }

        const geocoded = await geocodeAddress(
            city ? `${address}, ${city}` : address
        );

        const movie = await Movie.findByIdAndUpdate(

            req.params.id,

            {
                address: address.trim(),
                city: city?.trim() || "",
                lat: geocoded.lat,
                lng: geocoded.lng
            },

            { returnDocument: "after" }

        );

        if (!movie) {

            return res.status(404).json({

                success: false,
                message: "Movie not found."

            });

        }

        logger.info(
            `Location updated for movie ${movie.title}: ${geocoded.displayName}`
        );

        res.json({

            success: true,
            message: "Location updated successfully.",
            location: {
                id: movie._id,
                title: movie.title,
                address: movie.address,
                city: movie.city,
                lat: movie.lat,
                lng: movie.lng,
                geocodedName: geocoded.displayName
            }

        });

    }

    catch (error) {

        logger.error("updateLocation failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getImdbInfo,
    getAllLocations,
    updateLocation

};
