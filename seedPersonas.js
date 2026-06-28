require("dotenv").config();

const mongoose = require("mongoose");
const Persona = require("./models/persona.model");

async function seedPersonas() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        await Persona.deleteMany({});

        await Persona.insertMany([

            {
                name: "Dave",
                image: "assets/man1.jpg"
            },

            {
                name: "Allen",
                image: "assets/girl1.jpg"
            },

            {
                name: "Marry",
                image: "assets/woman1 (1).jpg"
            },

            {
                name: "Jessica",
                image: "assets/woman2.jpg"
            }

        ]);

        console.log("Personas inserted");

        process.exit();

    }

    catch(error){

        console.log(error);

        process.exit(1);

    }

}

seedPersonas();