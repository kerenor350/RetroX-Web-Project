const moviesByPersona =
    require("../models/movieModel");

const personas = require("../models/personaModel");

function getAllPersonas(req, res) {

    res.json(personas);

}

function addPersona(req, res) {

    const name = req.body.name?.trim();

    if (!name) {

        return res.status(400).json({
            success: false,
            message: "Persona name is required."
        });

    }

    const exists = personas.find(
        persona => persona.name === name
    );

    if (exists) {

        return res.status(400).json({
            success: false,
            message: "Persona already exists."
        });

    }

    const newPersona = {

        id: personas.length + 1,
        name: name,
        image: "assets/man1.jpg"

    };

    personas.push(newPersona);

    res.json({
        success: true,
        persona: newPersona
    });

}

module.exports = {
    getAllPersonas,
    addPersona
};