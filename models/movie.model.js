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

    listOwner: {
        type: String,
        default: ""
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

    contentType: {
        type: String,
        enum: ["Movie", "Series"],
        default: "Movie"
    },

    year: {
        type: Number,
        default: 2022
    },

    description: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    lat: {
        type: Number,
        default: null
    },

    lng: {
        type: Number,
        default: null
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Movie",
    movieSchema
);
