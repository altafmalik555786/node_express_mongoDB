const jwt = require("jsonwebtoken");
const { handleCatchedError } = require("../../utils/helper/common");
const { sendFailureResponse } = require("../../utils/helper/api");
const { secretKey } = require("../../utils/const/config-const");
const { MSG_INVALID_EXPIRY } = require("../../utils/const");

const authMiddleware = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return sendFailureResponse({
        res,
        status: 404,
        message: "Authentication failed! Token not found.",
      });
    }
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return sendFailureResponse({
          res,
          message: MSG_INVALID_EXPIRY("Token"),
        });
      } else {
        req.decoded = decoded;
        req.authenticated = true;
        next();
      }
    });
  } catch (error) {
    handleCatchedError({ res, at: "authMiddleware", error });
  }
};


module.exports = { authMiddleware };
