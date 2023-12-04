const jwt = require("jsonwebtoken");
const { userRoles } = require('../../utils/json/index')
const { handleCatchedError } = require("../../utils/helper/common");
const { sendFailureResponse } = require("../../utils/helper/api");
const { secretKey } = require("../../utils/const/config-const");
const { MSG_INVALID_EXPIRY } = require("../../utils/const");

const isAdminMiddleware = async (req, res, next) => {
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
          message: `Authentication failed! ${MSG_INVALID_EXPIRY("Token")}!`,
        });
      } else {
        if (decoded?.role === userRoles?.admin) {
          req.authenticated = true;
          next();
        } else {
          sendFailureResponse({
            res,
            message: "You don not have admin access",
          });
        }
      }
    });
  } catch (error) {
    handleCatchedError({ res, at: "isAdminMiddleware", error });
  }
};

module.exports = { isAdminMiddleware };
