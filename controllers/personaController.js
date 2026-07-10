const Persona =
    require("../models/persona.model");
const logger = require("../utils/logger");
const {
    PERSONA_AVATARS,
    isValidPersonaAvatar
} = require("../utils/personaAvatars");

// =====================================
// Get Personas
// =====================================

async function getAllPersonas(req, res) {

    try {

        const personas =
            await Persona.find({

                owner: req.session.username

            });

        res.json(personas);

    }

    catch (error) {

        logger.error("getAllPersonas failed", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// Add Persona
// =====================================

async function addPersona(req, res) {

    try {

        const name =
            req.body.name?.trim();

        const image =
            req.body.image?.trim() || PERSONA_AVATARS[0];

        if (!name) {

            return res.status(400).json({

                success: false,
                message: "Persona name is required."

            });

        }

        if (!isValidPersonaAvatar(image)) {

            return res.status(400).json({

                success: false,
                message: "Please choose a valid profile image."

            });

        }

        const exists =
            await Persona.findOne({

                name,

                owner: req.session.username

            });

        if (exists) {

            return res.status(400).json({

                success: false,
                message: "Persona already exists."

            });

        }

        const newPersona =
            await Persona.create({

                name,

                image,

                owner: req.session.username

            });

        res.json({

            success: true,

            persona: newPersona

        });

    }

    catch (error) {

        logger.error("addPersona failed", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// =====================================
// Update Persona
// =====================================

async function updatePersona(req, res) {

    try {

        const persona =
            await Persona.findOneAndUpdate(

                {

                    _id: req.params.id,

                    owner: req.session.username

                },

                {

                    name: req.body.name

                },

                {

                    new: true

                }

            );

        if (!persona) {

            return res.status(404).json({

                success: false,

                message: "Persona not found."

            });

        }

        res.json({

            success: true,

            persona

        });

    }

    catch (error) {

        logger.error("updatePersona failed", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// =====================================
// Delete Persona
// =====================================

async function deletePersona(req, res) {

    try {

        const persona =
            await Persona.findOneAndDelete({

                _id: req.params.id,

                owner: req.session.username

            });

        if (!persona) {

            return res.status(404).json({

                success: false,

                message: "Persona not found."

            });

        }

        res.json({

            success: true,

            message: "Persona deleted successfully."

        });

    }

    catch (error) {

        logger.error("deletePersona failed", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// =====================================
// Get Persona Avatars
// =====================================

async function getPersonaAvatars(req, res) {

    res.json({

        success: true,

        avatars: PERSONA_AVATARS

    });

}

module.exports = {

    getAllPersonas,

    getPersonaAvatars,

    addPersona,

    updatePersona,

    deletePersona

};
