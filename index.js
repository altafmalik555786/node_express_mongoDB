require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const mongoString = process.env.DATABASE_URL;
const useCombineRoutes = require("./routes/config");
const { app } = require("./utils/instances");

mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

cloudinary.config({
  cloud_name: "dti8kpm5d",
  api_key: "312751717784482",
  api_secret: "a0Mw1XIVPe-EkEflZeKuykb8iHk",
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});



useCombineRoutes();
app.options("*", cors());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server Started at http://${process.env.PORT || 5000}`);
});
