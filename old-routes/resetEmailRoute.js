const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../model/user");
const ResetCode = require("../model/resetEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


//reset  API
router.post("/resetPassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Update the user's password in the database
    const hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    await user.save();

    res
      .status(200)
      .send({ message: "Password successfully updated", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { router };
