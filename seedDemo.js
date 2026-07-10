require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/userModel");
const Persona = require("./models/persona.model");
const Movie = require("./models/movie.model");
const WatchHistory = require("./models/watchHistory.model");
const Post = require("./models/postModel");

const DEMO_PASSWORD = "retro1234";

const USERS = [
    { username: "anna", role: "user" },
    { username: "keren", role: "user" },
    { username: "david", role: "user" },
    { username: "maya", role: "user" },
    { username: "admin", role: "admin" }
];

const PERSONAS = [
    { name: "Dave", image: "assets/man1.jpg", owner: "david" },
    { name: "Allen", image: "assets/girl1.jpg", owner: "david" },
    { name: "Marry", image: "assets/woman1 (1).jpg", owner: "maya" },
    { name: "Jessica", image: "assets/woman2.jpg", owner: "maya" },
    { name: "Anna", image: "assets/woman2.jpg", owner: "anna" },
    { name: "Family", image: "assets/girl1.jpg", owner: "anna" },
    { name: "Keren", image: "assets/woman1 (1).jpg", owner: "keren" },
    { name: "Classic", image: "assets/man1.jpg", owner: "keren" }
];

const LOCATIONS = {

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
    },

    "Night Shift S1": {
        address: "Times Square",
        city: "New York, USA",
        lat: 40.7580,
        lng: -73.9855
    },

    "City Stories S2": {
        address: "Eiffel Tower",
        city: "Paris, France",
        lat: 48.8584,
        lng: 2.2945
    },

    "Retro Detectives S1": {
        address: "Old Town Square",
        city: "Krakow, Poland",
        lat: 50.0619,
        lng: 19.9368
    },

    "Campus Life S3": {
        address: "Sapir College",
        city: "Sderot, Israel",
        lat: 31.5211,
        lng: 34.5983
    },

    "Galaxy Patrol S1": {
        address: "Sydney Opera House",
        city: "Sydney, Australia",
        lat: -33.8568,
        lng: 151.2153
    },

    "Hidden Harbor": {
        address: "Old Port",
        city: "Marseille, France",
        lat: 43.2951,
        lng: 5.3740
    },

    "Golden Hour": {
        address: "Colosseum",
        city: "Rome, Italy",
        lat: 41.8902,
        lng: 12.4922
    },

    "Parallel Lines": {
        address: "Alexanderplatz",
        city: "Berlin, Germany",
        lat: 52.5219,
        lng: 13.4132
    },

    "Sunday Brunch Club": {
        address: "La Rambla",
        city: "Barcelona, Spain",
        lat: 41.3809,
        lng: 2.1734
    },

    "Echoes of Tomorrow": {
        address: "Burj Khalifa",
        city: "Dubai, UAE",
        lat: 25.1972,
        lng: 55.2744
    }

};

function withLocation(movie) {

    const location = LOCATIONS[movie.title] || {};

    return {
        ...movie,
        ...location
    };

}

const MOVIES = [

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
        title: "Iron Horizon",
        likes: 165,
        year: 2023,
        image: "assets/neon-chase.png",
        persona: "Dave",
        category: "Action",
        description: "Elite soldiers defend the last human colony against an endless siege."
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
        title: "Laugh Track",
        likes: 110,
        year: 2022,
        image: "assets/neon-chase.png",
        persona: "Allen",
        category: "Comedy",
        description: "A failed comedian discovers fame through the most embarrassing live stream ever."
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
        title: "The Last Lighthouse",
        likes: 175,
        year: 2020,
        image: "assets/last-lighthouse.png",
        persona: "Marry",
        category: "Drama",
        description: "A keeper's solitude turns into a battle for hope as storms close in."
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
        title: "Office Chaos",
        likes: 105,
        year: 2022,
        image: "assets/midnight-circuit.png",
        persona: "Marry",
        category: "Comedy",
        description: "Interns turn a corporate retreat into an unforgettable disaster."
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
        title: "The Quiet Room",
        likes: 95,
        year: 2020,
        image: "assets/last-lighthouse.png",
        persona: "Jessica",
        category: "Drama",
        description: "A therapist and her patient navigate grief in a world that refuses to pause."
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
        title: "Night Shift S1",
        likes: 188,
        year: 2023,
        image: "assets/midnight-circuit.png",
        persona: "Anna",
        category: "Drama",
        description: "TV Series — Night workers uncover secrets in a hospital after midnight."
    }),

    withLocation({
        title: "City Stories S2",
        likes: 142,
        year: 2022,
        image: "assets/neon-chase.png",
        persona: "Anna",
        category: "Comedy",
        description: "TV Series — Neighbors in one apartment building share hilarious misadventures."
    }),

    withLocation({
        title: "Retro Detectives S1",
        likes: 176,
        year: 2021,
        image: "assets/desert-signal.png",
        persona: "Anna",
        category: "Action",
        description: "TV Series — Two detectives solve cold cases using vintage tech and intuition."
    }),

    withLocation({
        title: "Campus Life S3",
        likes: 98,
        year: 2024,
        image: "assets/last-lighthouse.png",
        persona: "Family",
        category: "Comedy",
        description: "TV Series — Students balance exams, friendships, and streaming obsessions."
    }),

    withLocation({
        title: "Sunday Brunch Club",
        likes: 72,
        year: 2020,
        image: "assets/neon-chase.png",
        persona: "Family",
        category: "Comedy",
        description: "Friends meet every Sunday — and every brunch ends in chaos."
    }),

    withLocation({
        title: "Galaxy Patrol S1",
        likes: 210,
        year: 2024,
        image: "assets/desert-signal.png",
        persona: "Keren",
        category: "Sci-Fi",
        description: "TV Series — A patrol ship guards the edge of explored space."
    }),

    withLocation({
        title: "Hidden Harbor",
        likes: 118,
        year: 2019,
        image: "assets/last-lighthouse.png",
        persona: "Keren",
        category: "Drama",
        description: "A journalist returns to her hometown to investigate a missing fisherman."
    }),

    withLocation({
        title: "Golden Hour",
        likes: 134,
        year: 2021,
        image: "assets/midnight-circuit.png",
        persona: "Classic",
        category: "Drama",
        description: "Two photographers chase the perfect sunset across Europe."
    }),

    withLocation({
        title: "Parallel Lines",
        likes: 149,
        year: 2022,
        image: "assets/desert-signal.png",
        persona: "Classic",
        category: "Sci-Fi",
        description: "Every decision splits reality — and one woman sees all the outcomes."
    }),

    withLocation({
        title: "Echoes of Tomorrow",
        likes: 192,
        year: 2023,
        image: "assets/neon-chase.png",
        persona: "Classic",
        category: "Action",
        description: "Messages from the future arrive one minute too late to prevent disaster."
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

];

const WATCH_HISTORY = [

    { persona: "Dave", movie: "Midnight Circuit", currentTime: 820, duration: 1200, completed: false },
    { persona: "Dave", movie: "Desert Signal", currentTime: 450, duration: 1100, completed: false },
    { persona: "Dave", movie: "Iron Horizon", currentTime: 1180, duration: 1200, completed: true },
    { persona: "Dave", movie: "Neon Chase", currentTime: 300, duration: 980, completed: false },
    { persona: "Dave", movie: "Quantum Loop", currentTime: 900, duration: 900, completed: true },

    { persona: "Allen", movie: "Neon Chase", currentTime: 640, duration: 980, completed: false },
    { persona: "Allen", movie: "Laugh Track", currentTime: 720, duration: 960, completed: false },
    { persona: "Allen", movie: "Quantum Loop", currentTime: 960, duration: 960, completed: true },
    { persona: "Allen", movie: "Midnight Circuit", currentTime: 1100, duration: 1200, completed: true },
    { persona: "Allen", movie: "Echoes of Tomorrow", currentTime: 500, duration: 1050, completed: false },

    { persona: "Marry", movie: "The Last Lighthouse", currentTime: 700, duration: 1000, completed: false },
    { persona: "Marry", movie: "Broken Promises", currentTime: 1000, duration: 1000, completed: true },
    { persona: "Marry", movie: "Office Chaos", currentTime: 420, duration: 880, completed: false },
    { persona: "Marry", movie: "Golden Hour", currentTime: 880, duration: 880, completed: true },
    { persona: "Marry", movie: "Hidden Harbor", currentTime: 350, duration: 940, completed: false },

    { persona: "Jessica", movie: "Star Drift", currentTime: 560, duration: 1150, completed: false },
    { persona: "Jessica", movie: "Family Reunion", currentTime: 900, duration: 900, completed: true },
    { persona: "Jessica", movie: "The Quiet Room", currentTime: 610, duration: 1020, completed: false },
    { persona: "Jessica", movie: "Galaxy Patrol S1", currentTime: 1200, duration: 1200, completed: true },
    { persona: "Jessica", movie: "Neon Chase", currentTime: 200, duration: 980, completed: false },

    { persona: "Anna", movie: "Night Shift S1", currentTime: 780, duration: 1300, completed: false },
    { persona: "Anna", movie: "City Stories S2", currentTime: 950, duration: 950, completed: true },
    { persona: "Anna", movie: "Retro Detectives S1", currentTime: 540, duration: 1080, completed: false },
    { persona: "Anna", movie: "Star Drift", currentTime: 1150, duration: 1150, completed: true },
    { persona: "Anna", movie: "Midnight Circuit", currentTime: 400, duration: 1200, completed: false },

    { persona: "Family", movie: "Campus Life S3", currentTime: 680, duration: 980, completed: false },
    { persona: "Family", movie: "Sunday Brunch Club", currentTime: 860, duration: 860, completed: true },
    { persona: "Family", movie: "Laugh Track", currentTime: 520, duration: 960, completed: false },
    { persona: "Family", movie: "Family Reunion", currentTime: 900, duration: 900, completed: true },

    { persona: "Keren", movie: "Galaxy Patrol S1", currentTime: 720, duration: 1200, completed: false },
    { persona: "Keren", movie: "Hidden Harbor", currentTime: 940, duration: 940, completed: true },
    { persona: "Keren", movie: "Desert Signal", currentTime: 600, duration: 1100, completed: false },
    { persona: "Keren", movie: "Parallel Lines", currentTime: 1020, duration: 1020, completed: true },

    { persona: "Classic", movie: "Golden Hour", currentTime: 770, duration: 990, completed: false },
    { persona: "Classic", movie: "Parallel Lines", currentTime: 1020, duration: 1020, completed: true },
    { persona: "Classic", movie: "Echoes of Tomorrow", currentTime: 480, duration: 1050, completed: false },
    { persona: "Classic", movie: "The Last Lighthouse", currentTime: 1000, duration: 1000, completed: true },
    { persona: "Classic", movie: "Broken Promises", currentTime: 890, duration: 1000, completed: false }

];

const REVIEWS = [

    {
        title: "Best action ride this year",
        content: "Midnight Circuit never slows down. The final chase scene is unforgettable.",
        author: "anna",
        movie: "Midnight Circuit"
    },

    {
        title: "Mind-bending sci-fi",
        content: "Quantum Loop keeps you guessing until the very last loop reset.",
        author: "david",
        movie: "Quantum Loop"
    },

    {
        title: "Perfect family comedy",
        content: "Campus Life S3 is exactly what we needed for Friday night.",
        author: "anna",
        movie: "Campus Life S3"
    },

    {
        title: "Emotional and beautiful",
        content: "The Last Lighthouse made me cry. Stunning drama.",
        author: "maya",
        movie: "The Last Lighthouse"
    },

    {
        title: "Space done right",
        content: "Star Drift has incredible visuals and a strong crew dynamic.",
        author: "keren",
        movie: "Star Drift"
    },

    {
        title: "Laugh out loud",
        content: "Office Chaos is the funniest thing on RetroX right now.",
        author: "maya",
        movie: "Office Chaos"
    },

    {
        title: "Detective series gem",
        content: "Retro Detectives S1 mixes nostalgia with sharp storytelling.",
        author: "anna",
        movie: "Retro Detectives S1"
    },

    {
        title: "Underrated drama",
        content: "Hidden Harbor builds tension slowly and pays off brilliantly.",
        author: "keren",
        movie: "Hidden Harbor"
    },

    {
        title: "Great for retro fans",
        content: "Golden Hour feels like a classic film — elegant and moving.",
        author: "keren",
        movie: "Golden Hour"
    },

    {
        title: "Non-stop energy",
        content: "Neon Chase is pure adrenaline from start to finish.",
        author: "david",
        movie: "Neon Chase"
    },

    {
        title: "Sci-fi with heart",
        content: "Galaxy Patrol S1 balances epic scale with personal stories.",
        author: "keren",
        movie: "Galaxy Patrol S1"
    },

    {
        title: "Solid weekend watch",
        content: "Family Reunion is chaotic, warm, and surprisingly thoughtful.",
        author: "maya",
        movie: "Family Reunion"
    }

];

async function seedUsers() {

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const users = USERS.map(user => ({
        ...user,
        password: hashedPassword
    }));

    await User.deleteMany({});
    await User.insertMany(users);

    console.log(`Users seeded: ${users.length} (password: ${DEMO_PASSWORD})`);

}

async function seedPersonas() {

    await Persona.deleteMany({});
    await Persona.insertMany(PERSONAS);

    console.log(`Personas seeded: ${PERSONAS.length}`);

}

async function seedMovies() {

    await Movie.deleteMany({});
    await Movie.insertMany(MOVIES);

    console.log(`Movies & series seeded: ${MOVIES.length}`);

}

async function seedWatchHistory() {

    await WatchHistory.deleteMany({});
    await WatchHistory.insertMany(WATCH_HISTORY);

    console.log(`Watch history seeded: ${WATCH_HISTORY.length} records`);

}

async function seedReviews() {

    await Post.deleteMany({});
    await Post.insertMany(REVIEWS);

    console.log(`Reviews seeded: ${REVIEWS.length}`);

}

async function printSummary() {

    const [
        userCount,
        personaCount,
        movieCount,
        historyCount,
        reviewCount,
        mapCount
    ] = await Promise.all([

        User.countDocuments(),
        Persona.countDocuments(),
        Movie.countDocuments(),
        WatchHistory.countDocuments(),
        Post.countDocuments(),
        Movie.countDocuments({ lat: { $ne: null }, lng: { $ne: null } })

    ]);

    const chartSample = await WatchHistory.aggregate([

        { $group: { _id: "$persona", views: { $sum: 1 } } },
        { $sort: { views: -1 } }

    ]);

    console.log("\n=== Demo Data Summary ===");
    console.log(`Users:          ${userCount}`);
    console.log(`Personas:       ${personaCount}`);
    console.log(`Movies/Series:  ${movieCount}`);
    console.log(`Watch history:  ${historyCount}`);
    console.log(`Reviews:        ${reviewCount}`);
    console.log(`Map locations:  ${mapCount}`);
    console.log("Chart sample (views by persona):");

    chartSample.forEach(item => {
        console.log(`  - ${item._id}: ${item.views} views`);
    });

    console.log("\nLogin accounts:");
    console.log("  anna / retro1234");
    console.log("  keren / retro1234");
    console.log("  david / retro1234");
    console.log("  maya / retro1234");
    console.log("  admin / retro1234 (admin role)");

}

async function seedDemo() {

    try {

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB\n");

        console.log("Step 1/5 — Users...");
        await seedUsers();

        console.log("Step 2/5 — Personas...");
        await seedPersonas();

        console.log("Step 3/5 — Movies & TV series...");
        await seedMovies();

        console.log("Step 4/5 — Watch history...");
        await seedWatchHistory();

        console.log("Step 5/5 — Reviews...");
        await seedReviews();

        await printSummary();

        await mongoose.disconnect();

        process.exit(0);

    }

    catch (error) {

        console.error("Seed failed:", error.message);
        process.exit(1);

    }

}

seedDemo();
