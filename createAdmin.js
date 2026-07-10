require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/userModel");

async function createAdmin() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        const exists = await User.findOne({

            username: "admin"

        });

        if (exists) {

            console.log("Admin already exists.");

            process.exit();

        }

        const hashedPassword = await bcrypt.hash(

            "admin123",

            10

        );

        const admin = new User({

            username: "admin",

            password: hashedPassword,

            role: "admin"

        });

        await admin.save();

        console.log("Admin created successfully.");

        process.exit();

    }

    catch (err) {

        console.log(err);

        process.exit();

    }

}

createAdmin();