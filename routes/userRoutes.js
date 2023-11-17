const express = require("express");
const jwt = require("jsonwebtoken");
const Model = require("../model/user");
const mongoose = require('mongoose');
const { authMiddleware, isAdminMiddleware } = require('../utils/authMiddleware');
require("dotenv").config();
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const { sendFailureResponse, handleCatchedError, sendSuccessResponse, checkValidation, handlePutRequest, isNotFoundByID } = require("../utils/helper");
const { json } = require("body-parser");
const { MESSAGE_UPDATED, MESSAGE_DELETED, MESSAGE_NOT_FOUND } = require("../utils/const");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
// Secret key for signing and verifying tokens
const secretKey = process.env.secretKey;

// Middleware function to parse request body
app.use(express.json());


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Model.findOne({ email });
  checkValidation({ req, res, model: Model, bodyData: { email, password } })
  if (!user) {
    sendFailureResponse({ res, status: 404, message: "Email is invalid" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  try {
    if (user.email && isPasswordMatch) {
      const token = jwt.sign({ name: user.name, id: user._id, role: user.role }, `${secretKey}`, {
        expiresIn: "100h",
      });
      app.set("secret", secretKey);
      const data = {
        success: true,
        token: token,
        data: user
      }
      return res.status(200).json(data);
    } else {
      sendFailureResponse({ res, message: "Invalid credentials" });
    }
  } catch (error) {
    handleCatchedError({ error })
  }
});

// ADD USER
router.post("/register", async (req, res) => {
  try {
    const { password, email, role } = req.body;
    checkValidation({ req, res, model: Model, bodyData: { password, email, role } })
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      sendFailureResponse({ res, message: "Email already taken" })
    }
    const hash = bcrypt.hashSync(password, salt);
    const data = new Model({
      password: hash,
      email,
      role
    });
    await data.save();
    sendSuccessResponse({ res, message: "User registered successfully." })
  } catch (error) {
    handleCatchedError({ res, error, at: "/register" })
  }
});

//Get all Users
router.get("/user", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const data = await Model.find();
    sendSuccessResponse({ res, data })
  } catch (error) {
    handleCatchedError({ res, error, at: "/user" })
  }
});

// Update User
router.put("/user/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    delete req.body.password
    await handlePutRequest({ req, res, model: Model, entity: 'User', bodyData: { ...req.body } })
    const options = { new: true };
    const data = await Model.findByIdAndUpdate(id, req.body, options);
    sendSuccessResponse({ res, data, message: MESSAGE_UPDATED("User") })
  } catch (error) {
    handleCatchedError({ res, error, at: "/user/:id" })
  }
});

// Delete specific user method
router.delete("/user/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    await isNotFoundByID({ req, res, model: Model, entity: "User" })
    await Model.findByIdAndDelete(userId);
    return sendSuccessResponse({ res, message: MESSAGE_DELETED('User') })
  } catch (error) {
    handleCatchedError({ res, error })
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
