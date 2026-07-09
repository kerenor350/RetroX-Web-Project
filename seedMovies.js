require("dotenv").config();

const mongoose = require("mongoose");
const Movie = require("./models/movie.model");

async function seedMovies() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        await Movie.deleteMany({});

        await Movie.insertMany([

            {
                title: "Midnight Circuit",
                likes: 120,
                year: 2023,
                image: "assets/midnight-circuit.png",
                persona: "Dave",
                category: "Action",
                description: "A rogue agent races through neon-lit streets to stop a digital conspiracy."
            },

            {
                title: "Desert Signal",
                likes: 90,
                year: 2021,
                image: "assets/desert-signal.png",
                persona: "Dave",
                category: "Sci-Fi",
                description: "Strange transmissions from the desert reveal an alien presence on Earth."
            },

            {
                title: "Neon Chase",
                likes: 145,
                year: 2024,
                image: "assets/neon-chase.png",
                persona: "Allen",
                category: "Action",
                description: "High-speed pursuit through a cyberpunk city where every turn is a trap."
            },

            {
                title: "The Last Lighthouse",
                likes: 175,
                year: 2020,
                image: "assets/last-lighthouse.png",
                persona: "Marry",
                category: "Drama",
                description: "A keeper's solitude turns into a battle for hope as storms close in."
            },

            {
                title: "Laugh Track",
                likes: 110,
                year: 2022,
                image: "assets/neon-chase.png",
                persona: "Allen",
                category: "Comedy",
                description: "A failed comedian discovers fame through the most embarrassing live stream ever."
            },

            {
                title: "Star Drift",
                likes: 200,
                year: 2024,
                image: "assets/desert-signal.png",
                persona: "Jessica",
                category: "Sci-Fi",
                description: "A crew adrift in deep space must choose between home and the unknown."
            },

            {
                title: "Family Reunion",
                likes: 85,
                year: 2019,
                image: "assets/last-lighthouse.png",
                persona: "Jessica",
                category: "Comedy",
                description: "Chaos erupts when three generations collide at a small-town wedding."
            },

            {
                title: "Broken Promises",
                likes: 130,
                year: 2021,
                image: "assets/midnight-circuit.png",
                persona: "Marry",
                category: "Drama",
                description: "Two siblings reunite to uncover the truth behind their father's disappearance."
            },

            {
                title: "Iron Horizon",
                likes: 165,
                year: 2023,
                image: "assets/neon-chase.png",
                persona: "Dave",
                category: "Action",
                description: "Elite soldiers defend the last human colony against an endless siege."
            },

            {
                title: "Quantum Loop",
                likes: 155,
                year: 2022,
                image: "assets/desert-signal.png",
                persona: "Allen",
                category: "Sci-Fi",
                description: "A scientist trapped in a time loop must rewrite history to save humanity."
            },

            {
                title: "The Quiet Room",
                likes: 95,
                year: 2020,
                image: "assets/last-lighthouse.png",
                persona: "Jessica",
                category: "Drama",
                description: "A therapist and her patient navigate grief in a world that refuses to pause."
            },

            {
                title: "Office Chaos",
                likes: 105,
                year: 2022,
                image: "assets/midnight-circuit.png",
                persona: "Marry",
                category: "Comedy",
                description: "Interns turn a corporate retreat into an unforgettable disaster."
            },

            {
                title: "Neon Chase",
                likes: 60,
                year: 2024,
                image: "assets/neon-chase.png",
                persona: "Jessica",
                category: "Action",
                description: "High-speed pursuit through a cyberpunk city where every turn is a trap."
            },

            {
                title: "The Last Lighthouse",
                likes: 75,
                year: 2020,
                image: "assets/last-lighthouse.png",
                persona: "Jessica",
                category: "Drama",
                description: "A keeper's solitude turns into a battle for hope as storms close in."
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
