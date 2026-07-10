require("dotenv").config();

const mongoose = require("mongoose");
const Movie = require("./models/movie.model");

const locations = {

    "Midnight Circuit": {
        address: "Shibuya Crossing",
        city: "Tokyo, Japan",
        lat: 35.6595,
        lng: 139.7004
    },

    "Desert Signal": {
        address: "Camelback Mountain Trail",
        city: "Phoenix, USA",
        lat: 33.4484,
        lng: -112.0740
    },

    "Neon Chase": {
        address: "Nathan Road",
        city: "Hong Kong",
        lat: 22.3193,
        lng: 114.1694
    },

    "The Last Lighthouse": {
        address: "Portland Head Light",
        city: "Maine, USA",
        lat: 43.6231,
        lng: -70.2080
    },

    "Laugh Track": {
        address: "Sunset Boulevard",
        city: "Los Angeles, USA",
        lat: 34.0928,
        lng: -118.3287
    },

    "Star Drift": {
        address: "Kennedy Space Center",
        city: "Florida, USA",
        lat: 28.5729,
        lng: -80.6490
    },

    "Family Reunion": {
        address: "Central Park",
        city: "New York, USA",
        lat: 40.7829,
        lng: -73.9654
    },

    "Broken Promises": {
        address: "Charles Bridge",
        city: "Prague, Czech Republic",
        lat: 50.0865,
        lng: 14.4115
    },

    "Iron Horizon": {
        address: "Reichstag Building",
        city: "Berlin, Germany",
        lat: 52.5186,
        lng: 13.3762
    },

    "Quantum Loop": {
        address: "CERN Science Gateway",
        city: "Geneva, Switzerland",
        lat: 46.2044,
        lng: 6.1432
    },

    "The Quiet Room": {
        address: "Hyde Park",
        city: "London, UK",
        lat: 51.5074,
        lng: -0.1278
    },

    "Office Chaos": {
        address: "Marina Bay Sands",
        city: "Singapore",
        lat: 1.2834,
        lng: 103.8607
    }

};

function withLocation(movie) {

    const location = locations[movie.title] || {};

    return {
        ...movie,
        ...location
    };

}

async function seedMovies() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        await Movie.deleteMany({});

        await Movie.insertMany([

            withLocation({
                title: "Midnight Circuit",
                likes: 120,
                year: 2023,
                image: "assets/midnight-circuit.png",
                persona: "Dave",
                category: "Action",
                description: "A rogue agent races through neon-lit streets to stop a digital conspiracy."
            }),

            withLocation({
                title: "Desert Signal",
                likes: 90,
                year: 2021,
                image: "assets/desert-signal.png",
                persona: "Dave",
                category: "Sci-Fi",
                description: "Strange transmissions from the desert reveal an alien presence on Earth."
            }),

            withLocation({
                title: "Neon Chase",
                likes: 145,
                year: 2024,
                image: "assets/neon-chase.png",
                persona: "Allen",
                category: "Action",
                description: "High-speed pursuit through a cyberpunk city where every turn is a trap."
            }),

            withLocation({
                title: "The Last Lighthouse",
                likes: 175,
                year: 2020,
                image: "assets/last-lighthouse.png",
                persona: "Marry",
                category: "Drama",
                description: "A keeper's solitude turns into a battle for hope as storms close in."
            }),

            withLocation({
                title: "Laugh Track",
                likes: 110,
                year: 2022,
                image: "assets/neon-chase.png",
                persona: "Allen",
                category: "Comedy",
                description: "A failed comedian discovers fame through the most embarrassing live stream ever."
            }),

            withLocation({
                title: "Star Drift",
                likes: 200,
                year: 2024,
                image: "assets/desert-signal.png",
                persona: "Jessica",
                category: "Sci-Fi",
                description: "A crew adrift in deep space must choose between home and the unknown."
            }),

            withLocation({
                title: "Family Reunion",
                likes: 85,
                year: 2019,
                image: "assets/last-lighthouse.png",
                persona: "Jessica",
                category: "Comedy",
                description: "Chaos erupts when three generations collide at a small-town wedding."
            }),

            withLocation({
                title: "Broken Promises",
                likes: 130,
                year: 2021,
                image: "assets/midnight-circuit.png",
                persona: "Marry",
                category: "Drama",
                description: "Two siblings reunite to uncover the truth behind their father's disappearance."
            }),

            withLocation({
                title: "Iron Horizon",
                likes: 165,
                year: 2023,
                image: "assets/neon-chase.png",
                persona: "Dave",
                category: "Action",
                description: "Elite soldiers defend the last human colony against an endless siege."
            }),

            withLocation({
                title: "Quantum Loop",
                likes: 155,
                year: 2022,
                image: "assets/desert-signal.png",
                persona: "Allen",
                category: "Sci-Fi",
                description: "A scientist trapped in a time loop must rewrite history to save humanity."
            }),

            withLocation({
                title: "The Quiet Room",
                likes: 95,
                year: 2020,
                image: "assets/last-lighthouse.png",
                persona: "Jessica",
                category: "Drama",
                description: "A therapist and her patient navigate grief in a world that refuses to pause."
            }),

            withLocation({
                title: "Office Chaos",
                likes: 105,
                year: 2022,
                image: "assets/midnight-circuit.png",
                persona: "Marry",
                category: "Comedy",
                description: "Interns turn a corporate retreat into an unforgettable disaster."
            }),

            withLocation({
                title: "Neon Chase",
                likes: 60,
                year: 2024,
                image: "assets/neon-chase.png",
                persona: "Jessica",
                category: "Action",
                description: "High-speed pursuit through a cyberpunk city where every turn is a trap."
            }),

            withLocation({
                title: "The Last Lighthouse",
                likes: 75,
                year: 2020,
                image: "assets/last-lighthouse.png",
                persona: "Jessica",
                category: "Drama",
                description: "A keeper's solitude turns into a battle for hope as storms close in."
            })

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
