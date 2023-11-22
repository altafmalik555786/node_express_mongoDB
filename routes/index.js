const { Router } = require("express");
const router = Router();
const express = require("express");
const userRouter = require("./users");
const { sendFailureResponse } = require("../utils/helper/api");
const { baseUrl } = require("./const");

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

const useCombineRoutes = (app) => {
  app.use(router);
  app.use(baseUrl, userRouter);

  // NOTE: Use other routers above to this comment.
  app.use((req, res) => {
    sendFailureResponse({ res, status: 404, message: "API not found" });
  });
};

module.exports = useCombineRoutes;
