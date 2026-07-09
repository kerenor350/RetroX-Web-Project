const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema({

    name: {

        type: String,

        required: true,

        trim: true

    },

    image: {

        type: String,

        required: true,

        default: "assets/man1.jpg"

    },

    owner: {

        type: String,

        required: true,

        index: true

    }

}, {

    timestamps: true

});

module.exports = mongoose.model(

    "Persona",

    personaSchema

);