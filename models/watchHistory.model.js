const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema({

    persona: {

        type: String,

        required: true

    },

    movie: {

        type: String,

        required: true

    },

    currentTime: {

        type: Number,

        default: 0

    },

    duration: {

        type: Number,

        default: 0

    },

    completed: {

        type: Boolean,

        default: false

    }

}, {

    timestamps: true

});

watchHistorySchema.index(

    {

        persona: 1,

        movie: 1

    },

    {

        unique: true

    }

);

module.exports = mongoose.model(

    "WatchHistory",

    watchHistorySchema

);