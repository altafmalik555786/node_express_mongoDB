const nodemailer = require("nodemailer");
const Token = require('../model/emailToken');
const crypto = require('crypto');
const { router } = require("../utils/instances");
const { appSpecificPass } = require('../utils/const/config-const')


  
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
