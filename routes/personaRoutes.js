const express = require("express");

const router = express.Router();

const personaController =
    require("../controllers/personaController");

const {
    checkLogin
} = require("../middleware/authMiddleware");

// ===========================
// Get Personas
// ===========================

router.get(

    "/personas/avatars",

    checkLogin,

    personaController.getPersonaAvatars

);

router.get(

    "/personas",

    checkLogin,

    personaController.getAllPersonas

);

// ===========================
// Add Persona
// ===========================

router.post(

    "/personas",

    checkLogin,

    personaController.addPersona

);

// ===========================
// Update Persona
// ===========================

router.put(

    "/personas/:id",

    checkLogin,

    personaController.updatePersona

);

// ===========================
// Delete Persona
// ===========================

router.delete(

    "/personas/:id",

    checkLogin,

    personaController.deletePersona

);

module.exports = router;