require("dotenv").config();

const mongoose = require("mongoose");
const Movie = require("./models/movie.model");

async function seedMovies() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        // מוחק את כל הסרטים הקיימים
        await Movie.deleteMany({});

        // מכניס את כל הסרטים מחדש
        await Movie.insertMany([

            {
                title: "Midnight Circuit",
                likes: 120,
                image: "assets/midnight-circuit.png",
                persona: "Dave"
            },

            {
                title: "Desert Signal",
                likes: 90,
                image: "assets/desert-signal.png",
                persona: "Dave"
            },

            {
                title: "Neon Chase",
                likes: 60,
                image: "assets/neon-chase.png",
                persona: "Allen"
            },

            {
                title: "The Last Lighthouse",
                likes: 75,
                image: "assets/last-lighthouse.png",
                persona: "Marry"
            },

            {
                title: "Neon Chase",
                likes: 60,
                image: "assets/neon-chase.png",
                persona: "Jessica"
            },

            {
                title: "The Last Lighthouse",
                likes: 75,
                image: "assets/last-lighthouse.png",
                persona: "Jessica"
            }

        ]);

        console.log("Movies inserted successfully");

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

}

seedMovies();