const express = require("express");
const jwt = require("jsonwebtoken");
const Model = require("../model/user");
const mongoose = require('mongoose');
const { authMiddleware, isAdminMiddleware } = require('../utils/authMiddleware');
require("dotenv").config();
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const { returnFailureResponse, handleCatchedError, returnSuccessResponse,  checkValidation } = require("../utils/helper");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
// Secret key for signing and verifying tokens
const secretKey = process.env.secretKey;

// Middleware function to parse request body
app.use(express.json());

//Login User API

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Model.findOne({ email });
  if (!email || !password) {
    returnFailureResponse({ res, message: "Please provide all email and password." })
  }
  if (!user) {
    returnFailureResponse({ res, status: 404, message: "Email is invalid" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  try {
    if (user.email && isPasswordMatch) {
      const token = jwt.sign({ name: user.name, id: user._id, role: user.role }, `${secretKey}`, {
        expiresIn: "1h",
      });
      app.set("secret", secretKey);
      const data = {
        success: true,
        token: token,
        data: user
      }
      return res.status(200).json(data);
    } else {
      returnFailureResponse({ res, message: "Invalid credentials" });
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
      returnFailureResponse({ res, message: "Email already taken" })
    }

    const hash = bcrypt.hashSync(password, salt);
    const data = new Model({
      password: hash,
      email,
      role
    });

    await data.save();
    returnSuccessResponse({ res, message: "User registered successfully." })
  } catch (error) {
    handleCatchedError({ res, error, at: "/register" })
  }
});

//Get all Users
router.get("/getAllUsers", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const data = await Model.find();
    res.status(200).json({ results: data, success: true });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Update User
router.put("/updateUser/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete specific user method
router.delete("/deleteUser/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
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
      return res.status(200).send({ success: true, message: `${deletedUser.name} has been deleted.` });
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
