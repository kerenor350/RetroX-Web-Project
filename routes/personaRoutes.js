const express = require("express");

const router = express.Router();

const personaController =
    require("../controllers/personaController");

router.get(
    "/personas",
    personaController.getAllPersonas
);
router.post(
    "/personas",
    personaController.addPersona
);

module.exports = router;