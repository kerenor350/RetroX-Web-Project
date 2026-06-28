const Persona =
    require("../models/persona.model");

async function getAllPersonas(req, res) {

    const personas =
        await Persona.find();

    res.json(personas);

}

async function addPersona(req, res) {

    const name = req.body.name?.trim();

    if (!name) {

        return res.status(400).json({
            success: false,
            message: "Persona name is required."
        });

    }

    const exists = await Persona.findOne({
        name: name
    });

    if (exists) {

        return res.status(400).json({
            success: false,
            message: "Persona already exists."
        });

    }

    const newPersona = await Persona.create({

        name: name,
        image: "assets/man1.jpg"

    });

    res.json({
        success: true,
        persona: newPersona
    });

}

module.exports = {
    getAllPersonas,
    addPersona
};