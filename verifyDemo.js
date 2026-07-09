require("dotenv").config();

const mongoose = require("mongoose");
const WatchHistory = require("./models/watchHistory.model");
const Movie = require("./models/movie.model");
const Persona = require("./models/persona.model");
const User = require("./models/userModel");
const Post = require("./models/postModel");

async function verify() {

    await mongoose.connect(process.env.MONGO_URI);

    const users = await User.find().select("username role");
    const personasByOwner = await Persona.aggregate([
        { $group: { _id: "$owner", count: { $sum: 1 } } }
    ]);

    const categoryChart = await WatchHistory.aggregate([
        { $group: { _id: "$movie", views: { $sum: 1 } } },
        { $lookup: { from: "movies", localField: "_id", foreignField: "title", as: "m" } },
        { $unwind: "$m" },
        { $group: { _id: "$m.category", total: { $sum: "$views" } } },
        { $sort: { total: -1 } }
    ]);

    const seriesCount = await Movie.countDocuments({
        title: { $regex: /S[0-9]/ }
    });

    const mapLocations = await Movie.countDocuments({
        lat: { $ne: null },
        lng: { $ne: null }
    });

    console.log("VERIFICATION OK");
    console.log("Users:", users.map(u => `${u.username}(${u.role})`).join(", "));
    console.log("Personas per user:", personasByOwner.map(p => `${p._id}:${p.count}`).join(", "));
    console.log("TV series count:", seriesCount);
    console.log("Reviews:", await Post.countDocuments());
    console.log("Map locations:", mapLocations);
    console.log("Category chart:", categoryChart.map(c => `${c._id}=${c.total}`).join(", "));

    await mongoose.disconnect();

}

verify().catch(error => {
    console.error("VERIFICATION FAILED:", error.message);
    process.exit(1);
});
