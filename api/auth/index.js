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

module.exports = {
  login,
};
