const UserModel = require("../../model/user");
const {
  checkValidation,
  sendFailureResponse,
  sendSuccessResponse,
} = require("../../utils/helper/api");
const bcrypt = require("bcrypt");
const { handleCatchedError } = require("../../utils/helper/common");
const secretKey = process.env.secretKey;
const jwt = require("jsonwebtoken");
const { app } = require("../../utils/instances");

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
    handleCatchedError({ error });
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
    handleCatchedError({ res, error, at: "/register" });
  }
};

module.exports = {
  login,
  registerUser,
};
