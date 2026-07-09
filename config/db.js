const mongoose = require("mongoose");

async function connectDB() {

    const uri = process.env.MONGO_URI;

    if (!uri) {

        console.error("MongoDB connection failed:");
        console.error("MONGO_URI is missing. Add it to your .env file.");
        console.error("Example: MONGO_URI=mongodb://127.0.0.1:27017/netflix");
        process.exit(1);

    }

    try {

        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
        console.log(`Database: ${mongoose.connection.name}`);

    } catch (error) {

        console.error("MongoDB connection failed:");
        console.error(error.message);
        process.exit(1);

    }

}

module.exports = connectDB;
