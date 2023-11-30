const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
const mongoString = process.env.DATABASE_URL;
const eventListnerFunction = require("./utils/helper/emitters/event-listner");

const config = () => {

    // MongoDB Connection
    mongoose.connect(mongoString);
    const database = mongoose.connection;
    database.on("error", (error) => {
        console.log(error);
    });
    database.once("connected", () => {
        console.log("Database Connected");
    });

    // Cloudinary Files
    cloudinary.config({
        cloud_name: "dti8kpm5d",
        api_key: "312751717784482",
        api_secret: "a0Mw1XIVPe-EkEflZeKuykb8iHk",
    });

    // Handling the unhandledRejection
    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Promise Rejection:", err);
    });

    // Handling the uncaughtException
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
    });


    // This file has been imported to listen the events
    eventListnerFunction()



}

module.exports = config