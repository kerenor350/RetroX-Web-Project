const moviesByPersona = require("../models/movieModel");

function getMovies(req, res) {

    const persona = req.params.persona;

    res.json(
        moviesByPersona[persona] || []
    );

}

module.exports = {
    getMovies
};