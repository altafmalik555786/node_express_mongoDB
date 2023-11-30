require("dotenv").config();
const cors = require("cors");
const useCombineRoutes = require("./routes/config");
const { app } = require("./utils/instances");
const config = require('./config')

config()

useCombineRoutes();
app.options("*", cors());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server Started at http://${process.env.PORT || 5000}`);
});
