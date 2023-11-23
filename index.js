require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
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

useCombineRoutes();
app.options("*", cors());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server Started at http://${process.env.PORT || 5000}`);
});
