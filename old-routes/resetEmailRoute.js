const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../model/user");
const ResetCode = require("../model/resetEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// POST route for verifying password reset code
router.post("/verifyPasswordResetCode", async (req, res) => {
  const { email, code } = req.body;

  try {
    const storedCodeDocuments = await ResetCode.find({ email });

    if (storedCodeDocuments.length === 0) {
      res.status(400).send({ message: "No reset codes found for this user" });
      return;
    }

    const codeIsValid = storedCodeDocuments.some((storedCodeDocument) => {
      return storedCodeDocument.code === code;
    });

    if (codeIsValid) {
      // Code is valid, allow the user to reset their password
      res
        .status(200)
        .send({
          message: "Code verified, you can reset your password",
          success: true,
        });

      // Delete all reset codes associated with the user
      await ResetCode.deleteMany({ email });
    } else {
      res.status(400).send({ message: "Invalid or expired code" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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
