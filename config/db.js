const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectDB() {

    const uri = process.env.MONGO_URI;

    if (!uri) {

        logger.error(
            "MongoDB connection failed: MONGO_URI is missing in .env"
        );
        process.exit(1);

    }

    try {

        await mongoose.connect(uri);

        logger.info(
            `MongoDB connected successfully (database: ${mongoose.connection.name})`
        );

    } catch (error) {

        logger.error("MongoDB connection failed", error);
        process.exit(1);

    }

}

module.exports = connectDB;
