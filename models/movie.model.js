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
    },

    category: {
        type: String,
        enum: ["Action", "Comedy", "Sci-Fi", "Drama"],
        default: "Drama"
    },

    year: {
        type: Number,
        default: 2022
    },

    description: {
        type: String,
        default: ""
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Movie",
    movieSchema
);