const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Token = require('../model/emailToken');
const crypto = require('crypto');
const app = express();


// Middleware function to parse request body
app.use(express.json());

// // Create a Set to store verification tokens
// const verificationTokens = new Set();

router.post('/email-verification', async (req, res) => {
  const { email } = req.body;
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const expiration = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  // Store the verification token in the database
  const newToken = new Token({
    token: verificationToken,
    email: email,
    expiration: expiration,
  });

  let transporter = await nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zeeshanlateef84@gmail.com', // Your Gmail email address
      pass: process.env.appSpecificPass // Your Gmail password or app-specific password
  },
  });

  try {
    await newToken.save();

    // Generate the verification link
    const verificationLink = `https://coolblogging.netlify.app/#/verify-register-email/?token=${verificationToken}`;
    const mailOptions = {
      from: '"Hello guys 👻" <zeeshanlateef84@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Email Verification', // Subject line
      text: `Click this link to verify your email: ${verificationLink}`,
    };
  
    await transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send verification email' });
      } else {
        res.status(200).send({success:true,  message: 'Verification email sent',link: verificationLink });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to store verification token' });
  }
});

  
  // Endpoint to handle email verification when the user clicks the link
router.get("/verify-email-success", async (req, res) => {
  const { token } = req.query;
  try {
    const storedToken = await Token.findOne({ token: token });
    if (storedToken && storedToken.expiration > new Date()) {

      // Delete all tokens associated with the user
      await Token.deleteMany({ email: storedToken.email });

      res.status(200).send({ success: true, message: "verified" });
    } else {
      res.status(400).send({ message: "Invalid or expired email token" });
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).send({ message: "Invalid token format" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to verify email", error: error.message });
    }
  }
});

module.exports = { router };
