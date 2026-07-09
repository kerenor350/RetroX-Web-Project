const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    likes: {
        type: Number,
        default: 0
    },

    image: {
        type: String,
        required: true
    },

    persona: {
        type: String,
        required: true
    },

    video: {
        type: String,
        default: "assets/demo.mp4"
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Movie",
    movieSchema
);