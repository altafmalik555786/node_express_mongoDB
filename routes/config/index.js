const { Router } = require("express");
const router = Router();
const { sendFailureResponse } = require("../../utils/helper/api");
const { baseUrl } = require("../const");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const express = require("express");
const { app } = require("../../utils/instances");
const AuthRouter = require("../auth");
const UserRouter = require("../users");

const routerList = [UserRouter, AuthRouter];

////// Default Path start_poinnt //////
router.get("/", (req, res) => {
  res.send(`
    <h2>Welcome</h2> 
    <b> I'm here to welcome you to my Express, Sequelize Application.
    I'm building a product to act like a boilerplate.</b>
    <p>You are now at our root route "/".</p>
 `);
});
////// Default Path end_point ///////

app.use((req, res, next) => {
  const clientIP = req.ip; // This captures the client's IP address
  // You can save or log the IP address as needed
  console.log(`Client IP Address: ${clientIP}`);
  next();
});

app.use(express.json());

// const allowedOrigins = ["https://coolblogging.netlify.app"];
const allowedOrigins = ["http://localhost:8080/"];
app.use(
  cors({
    origin: allowedOrigins, // Use the CORS_ORIGIN environment variable
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: false,
  })
);

// console.log("routerList --=------------ ", routerList);

const useCombineRoutes = () => {
  app.use(router);

  routerList?.length > 0 &&
    routerList?.forEach((item) => {
      app.use(baseUrl, item);
    });

  // NOTE: Use other routers above to this comment.
  app.use((req, res) => {
    sendFailureResponse({ res, status: 404, message: "API not found" });
  });
};

module.exports = useCombineRoutes;
