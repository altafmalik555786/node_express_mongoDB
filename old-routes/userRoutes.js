const express = require("express");
const jwt = require("jsonwebtoken");
const Model = require("../model/user");
require("dotenv").config();
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const { handleCatchedError } = require("../utils/helper/common");
const {
  MESSAGE_CREATED,
} = require("../utils/const");
const {
  sendFailureResponse,
  checkValidation,
  sendSuccessResponse,
} = require("../utils/helper/api");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
// Secret key for signing and verifying tokens
const secretKey = process.env.secretKey;

// Middleware function to parse request body
app.use(express.json());

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Model.findOne({ email });
  checkValidation({ req, res, model: Model, bodyData: { email, password } });
  if (!user) {
    sendFailureResponse({ res, status: 404, message: "Email is invalid" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  try {
    if (user.email && isPasswordMatch) {
      const token = jwt.sign(
        { name: user.name, id: user._id, role: user.role },
        `${secretKey}`,
        {
          expiresIn: "100h",
        }
      );
      app.set("secret", secretKey);
      const data = {
        success: true,
        token: token,
        data: user,
      };
      return res.status(200).json(data);
    } else {
      sendFailureResponse({ res, message: "Invalid credentials" });
    }
  } catch (error) {
    handleCatchedError({ error });
  }
});

// ADD USER
router.post("/register", async (req, res) => {
  try {
    const { password, email, role } = req.body;
    checkValidation({
      req,
      res,
      model: Model,
      bodyData: { password, email, role },
    });
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return sendFailureResponse({ res, message: "Email already taken" });
    }
    const hash = bcrypt.hashSync(password, salt);
    const data = new Model({
      password: hash,
      email,
      role,
    });
    await data.save();
    sendSuccessResponse({ res, message: MESSAGE_CREATED("User") });
  } catch (error) {
    handleCatchedError({ res, error, at: "/register" });
  }
});

// //Reset User Password
// router.post("/resetPassword", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const verifyUser = await Model.findOne({ email });
//     if (!req.body.password) {
//       res.status(404).send({ message: "password require" });
//       return;
//     }
//     if (verifyUser) {
//       const updatedData = req.body;
//       const userId = req?.body._id;
//       const options = { new: true };
//        await Model.findByIdAndUpdate(
//         userId,
//         updatedData,
//         options
//       );
//       res.status(200).send({ message: "Your password successful updated", success:true });
//     } else {
//       res.status(404).send({ message: "User not Exist" });
//       return;
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = { router };
