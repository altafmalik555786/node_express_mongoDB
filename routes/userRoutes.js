const express = require("express");
const jwt = require("jsonwebtoken");
const Model = require("../model/user");
const mongoose = require('mongoose');
const { authMiddleware, isAdminMiddleware } = require('../utils/authMiddleware');
require("dotenv").config();
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const { sendFailureResponse, handleCatchedError, sendSuccessResponse, checkValidation, compareObjectsDeepEqual, isNotFoundByID, updateModel } = require("../utils/helper");
const { json } = require("body-parser");
const { UPDATED_MESSAGE } = require("../utils/const");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
// Secret key for signing and verifying tokens
const secretKey = process.env.secretKey;

// Middleware function to parse request body
app.use(express.json());


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Model.findOne({ email });
  checkValidation(req, res, { email, password })
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
    checkValidation(req, res, { password, email, role })
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
    checkValidation(req, res, { email: req.body.email, password: req.body.password })
    await isNotFoundByID({ res, model: Model, id, entity: "User" })

    // const user = await Model.findOne({ email: req.body.email });
    // delete user._id
    // delete user.__v

    // if (compareObjectsDeepEqual(user, req.body)) {
    //   console.log("user in", user)
    // }
    // console.log("user out", user)

    // const updatedData = req.body;
    // delete req.body.password
    // const data = await updateModel({ model: Model, id, bodyData: updatedData }, updatedData, {
    //   new: true,
    // }, (error, update) => {
    //   console.log("=================================", "error", error, "update", update)
    // })();
    // sendSuccessResponse({ res, data, message: UPDATED_MESSAGE("User") })

    // throw new Error('error')

    const updatedData = req.body;
    delete req.body.password
    const options = { new: true };
    const data = await Model.findByIdAndUpdate(id, updatedData, options);
    sendSuccessResponse({ res, data, message: UPDATED_MESSAGE("User") })
  } catch (error) {
    handleCatchedError({ res, error, at: "/user/:id"})
  }
});

// Delete specific user method
router.delete("/user/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // Invalid user ID format
      return res.status(404).send({ message: 'Invalid user ID' });
    }

    const user = await Model.findById(userId);
    if (user) {
      // User found, perform deletion
      const deletedUser = await Model.findByIdAndDelete(userId);
      return res.status(200).send({ success: true, message: `${deletedUser.name} has been deleted successfully.` });
    } else {
      // User not found
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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
