const UserModel = require("../../model/user");
const ResetCode = require("../../model/resetEmail");
const {
  checkValidation,
  sendFailureResponse,
  sendSuccessResponse,
} = require("../../utils/helper/api");
const bcrypt = require("bcrypt");
const { handleCatchedError } = require("../../utils/helper/common");
const jwt = require("jsonwebtoken");
const { app } = require("../../utils/instances");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {
  senderMail,
  secretKey,
  appSpecificPass,
} = require("../../utils/const/config-const");
const {
  MESSAGE_VERIFIED,
  MESSAGE_INVALID_EXPIRY,
  MESSAGE_NOT_FOUND,
} = require("../../utils/const");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    sendFailureResponse({ res, status: 404, message: "Email is invalid" });
  }
  checkValidation({
    req,
    res,
    model: UserModel,
    bodyData: { email, password },
  });
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  try {
    if (user.email && isPasswordMatch) {
      const token = jwt.sign(
        { name: user.name, id: user._id, role: user.role },
        `${secretKey}`,
        {
          expiresIn: "1000h",
        }
      );
      app.set("secret", secretKey);
      return sendSuccessResponse({
        res,
        data: { token, ...user.toObject() },
        message: "Login successfully",
      });
    } else {
      sendFailureResponse({ res, message: "Invalid credentials" });
    }
  } catch (error) {
    handleCatchedError({ res, error, at: "login" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { password, email, role } = req.body;
    checkValidation({
      req,
      res,
      model: UserModel,
      bodyData: { password, email, role },
    });
    const existingUser = await UserModel.findOne({ email });
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
    handleCatchedError({ res, error, at: "registerUser" });
  }
};

const postRequestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      sendFailureResponse({
        res,
        status: 404,
        message: `${MESSAGE_NOT_FOUND("User")} not found`,
      });
      return;
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Store the reset code in the database
    const resetCodeDocument = new ResetCode({
      email: email,
      code: verificationToken,
    });
    await resetCodeDocument.save();
    let transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: senderMail, // Your Gmail email address
        pass: appSpecificPass, // Your Gmail password or app-specific password
      },
    });
    // Send the reset code to the user via email
    const mailOptions = {
      from: `"Reset Password Code 👻" <${senderMail}>`,
      to: email, // list of receivers
      subject: "Email Verification Code", // Subject line
      text: `Click this link to verify your email: ${verificationToken}`,
    };

    await transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        sendFailureResponse({
          res,
          status: 500,
          message: "Failed to send verification email",
        });
      } else {
        sendSuccessResponse({
          res,
          message: "Verification email sent",
          data: verificationToken,
        });
      }
    });
  } catch (error) {
    if (error.name === "CastError") {
      sendFailureResponse({
        res,
        message: "Invalid token format",
      });
    } else {
      sendFailureResponse({
        res,
        status: 500,
        message: "Failed to verify email",
      });
    }
  }
};

const postVerifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const storedCodeDocuments = await ResetCode.find({ email });

    if (storedCodeDocuments.length === 0) {
      sendFailureResponse({
        res,
        status: 404,
        message: "No reset codes found for this user",
      });
      return;
    }

    const codeIsValid = storedCodeDocuments.some((storedCodeDocument) => {
      return storedCodeDocument.code === code;
    });

    if (codeIsValid) {
      sendSuccessResponse({ res, message: MESSAGE_VERIFIED("Code") });
      await ResetCode.deleteMany({ email });
    } else {
      sendFailureResponse({
        res,
        status: 400,
        message: MESSAGE_INVALID_EXPIRY("Code"),
      });
    }
  } catch (error) {
    handleCatchedError({ res, error, at: "verifyCode" });
  }
};

module.exports = {
  login,
  registerUser,
  postRequestPasswordReset,
  postVerifyCode,
};
