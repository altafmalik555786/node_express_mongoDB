const UserModel = require("../../model/user");
const ResetCode = require("../../model/resetEmail");
const Token = require('../../model/emailToken')
const {
  checkValidation,
  sendFailureResponse,
  sendSuccessResponse,
  recordNotFound,
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
  MSG_VERIFIED,
  MSG_INVALID_EXPIRY,
  MSG_UPDATED,
  MSG_CREATED,
} = require("../../utils/const");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await recordNotFound({
    res,
    findOne: { email },
    model: UserModel,
    entity: "User",
    message: "Email is invalid",
  });

  await checkValidation({
    req,
    res,
    model: UserModel,
    bodyData: { email, password },
    requiredFields: ["email", "password"],
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

    const existingUser = await recordNotFound({
      res,
      findOne: { email },
      model: UserModel,
      entity: "User",
      status: 400,
    });

    if (existingUser) {
      return sendFailureResponse({ res, message: "Email already taken" });
    }

    checkValidation({
      req,
      res,
      model: UserModel,
      bodyData: { password, email, role },
      requiredFields: ["password", "email", "role"],
    });

    const hash = bcrypt.hashSync(password, salt);
    const data = new UserModel({
      password: hash,
      email,
      role,
    });
    await data.save();
    sendSuccessResponse({ res, message: MSG_CREATED("User") });
  } catch (error) {
    handleCatchedError({ res, error, at: "registerUser" });
  }
};

const postVerifyEmail = async (req, res) => {
  const { email } = req.body;

  await recordNotFound({
    res,
    findOne: { email },
    model: UserModel,
    entity: "Email",
  });

  const verificationToken = crypto.randomBytes(20).toString("hex");
  const expiration = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  // Store the verification token in the database
  const newToken = new Token({
    token: verificationToken,
    email: email,
    expiration: expiration,
  });

  let transporter = await nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: senderMail, // Your Gmail email address
      pass: appSpecificPass, // Your Gmail password or app-specific password
    },
  });

  try {
    await newToken.save();

    // Generate the verification link
    const verificationLink = `https://coolblogging.netlify.app/#/verify-register-email/?token=${verificationToken}`;
    const mailOptions = {
      from: `'Hello guys 👻' <${senderMail}>`, // sender address
      to: email, // list of receivers
      subject: "Email Verification", // Subject line
      text: `Click this link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        sendFailureResponse({ res, message: "Failed to send verification email" })
      } else {
        sendSuccessResponse({ res, message: "Verification link has been sent to your E-mail.", data: verificationLink })
      }
    });
  } catch (error) {
    handleCatchedError({
      res,
      error,
      status: 500,
      at: "postVerifyEmail",
      message: "Failed to store verification token",
    });
  }
};

const getVeriyEmailSuccess = async (req, res) => {
  const { token } = req.query;
  try {
    const storedToken = await recordNotFound({
      res,
      findOne: { token },
      model: Token,
      entity: "Token",
    });
    if (storedToken && storedToken.expiration > new Date()) {
      await Token.deleteMany({ email: storedToken.email });
      sendSuccessResponse({ res, message: "Email has been verified" })
    } else {
      sendFailureResponse({ res, message: MSG_INVALID_EXPIRY("Email token") })
    }
  } catch (error) {
    handleCatchedError({
      res,
      error,
      status: 500,
      at: "getVeriyEmailSuccess",
      message: "Email verification failed",
    });
  }
}

const postRequestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    await recordNotFound({
      res,
      findOne: { email },
      model: UserModel,
      entity: "User",
    });

    const verificationToken = crypto.randomBytes(20).toString("hex");

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
      sendSuccessResponse({ res, message: MSG_VERIFIED("Code") });
      await ResetCode.deleteMany({ email });
    } else {
      sendFailureResponse({
        res,
        status: 400,
        message: MSG_INVALID_EXPIRY("Code"),
      });
    }
  } catch (error) {
    handleCatchedError({ res, error, at: "postVerifyCode" });
  }
};

const postResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await recordNotFound({
      res,
      findOne: { email },
      model: UserModel,
      entity: "User",
    });

    const hash = bcrypt.hashSync(password, salt);
    user.password = hash;

    await user.save();

    sendSuccessResponse({ res, message: MSG_UPDATED("Password") });
  } catch (error) {
    handleCatchedError({ res, error, at: "postResetPassword" });
  }
};

module.exports = {
  login,
  registerUser,
  postRequestPasswordReset,
  postVerifyCode,
  postResetPassword,
  postVerifyEmail,
  getVeriyEmailSuccess
};
