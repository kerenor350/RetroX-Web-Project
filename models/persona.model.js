const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    image: {
        type: String,
        required: true
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Persona",
    personaSchema
);