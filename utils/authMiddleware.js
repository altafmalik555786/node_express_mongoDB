const jwt = require('jsonwebtoken');
const { handleCatchedError } = require('./helper');
const { userRoles } = require('./json');
const { sendFailureResponse } = require('./helper/api');
const secretKey = process.env.secretKey;

const authMiddleware = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return sendFailureResponse({ res, status: 404, message: "Authentication failed! Token not found." })
    }
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return sendFailureResponse({ res, message: 'Invalid token!' });
      } else {
        req.decoded = decoded;
        req.authenticated = true;
        next();
      }
    });
  } catch (error) {
    handleCatchedError({ res, at: 'authMiddleware', error })
  }
};

const isAdminMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return sendFailureResponse({ res, status: 404, message: "Authentication failed! Token not found." })
    }
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return sendFailureResponse({ res, message: 'Authentication failed! Invalid token!' });
      } else {
        if (decoded?.role === userRoles?.isAdmin) {
          req.authenticated = true;
          next();
        } else {
          sendFailureResponse({ res, message: "You don not have admin access" })
        }
      }
    });
  } catch (error) {
    handleCatchedError({ res, at: 'isAdminMiddleware', error })
  }
};

module.exports = { authMiddleware, isAdminMiddleware };