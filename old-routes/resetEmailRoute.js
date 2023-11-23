const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../model/user");
const ResetCode = require('../model/resetEmail');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


// Middleware function to parse request body

// POST route for requesting password reset
router.post('/passwordResetEmail', async (req, res) => {
    try {
      const {email} = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
  
      // Generate a reset code
      // const resetCode = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit code
      const verificationToken = crypto.randomBytes(20).toString('hex');
  
      // Store the reset code in the database
      const resetCodeDocument = new ResetCode({
        email: email,
        code: verificationToken,
      });
      await resetCodeDocument.save();
      let transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'zeeshanlateef84@gmail.com', // Your Gmail email address
          pass: process.env.appSpecificPass // Your Gmail password or app-specific password
      },
      });
      // Send the reset code to the user via email
      const mailOptions = {
        from: '"Hello guys 👻" <zeeshanlateef84@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Email Verification Code', // Subject line
        text: `Click this link to verify your email: ${verificationToken}`,
      };

      await transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to send verification email' });
        } else {
          res.status(200).send({success:true,  message: 'Verification email sent',code: verificationToken });
        }
      });
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).send({ message: 'Invalid token format' });
          } else {
            res.status(500).json({ message: 'Failed to verify email', error: error.message });
          }
    }
  });

  // POST route for verifying password reset code
router.post('/verifyPasswordResetCode', async (req, res) => {
    const { email, code } = req.body;
  
    try {
        const storedCodeDocuments = await ResetCode.find({ email });

        if (storedCodeDocuments.length === 0) {
          res.status(400).send({ message: 'No reset codes found for this user' });
          return;
        }
    
        const codeIsValid = storedCodeDocuments.some((storedCodeDocument) => {
          return storedCodeDocument.code === code;
        });
  
      if (codeIsValid) {
        // Code is valid, allow the user to reset their password
        res.status(200).send({ message: 'Code verified, you can reset your password', success: true });
  
        // Delete all reset codes associated with the user
        await ResetCode.deleteMany({ email });
      } else {
        res.status(400).send({ message: 'Invalid or expired code' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  //reset  API
  router.post('/resetPassword', async (req, res) => {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
  
      // Update the user's password in the database
    const hash = bcrypt.hashSync(password, salt);
      user.password = hash;
      await user.save();
  
      res.status(200).send({ message: 'Password successfully updated', success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = { router };
