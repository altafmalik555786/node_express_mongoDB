const { MSG_FORBIDDEN_UNAUTHORIZED_DONT_HAVE_PERMISSION } = require("../../utils/const");
const { getUserFromToken, getId, sendFailureResponse, isNotFoundByID } = require("../../utils/helper/api");
const { handleCatchedError } = require("../../utils/helper/common");

///////// Hints to use ////////
// accessPermissionMiddleware({model: [modelname], entity}) -------> for same user authority
// accessPermissionMiddleware({ authorizedUser: [userRoles.admin], entity }) -------> for Authorized User
// accessPermissionMiddleware({ unAuthorizedUser: [userRoles.user], entity }) -------> for Unauthorized User

const accessPermissionMiddleware = ({ model = null, authorizedUser = [], unAuthorizedUser = [], entity = "data" }) => {
  return async (req, res, next) => {
    const id = req.params.id || req.body.id;
    try {
      const user = await getUserFromToken(req, res)
      if (model) {
        const post = await isNotFoundByID({ req, res, id, model, entity });
        if (String(post.user) !== getId(user)) {
          return sendFailureResponse({ res, status: 403, message: MSG_FORBIDDEN_UNAUTHORIZED_DONT_HAVE_PERMISSION(req.method?.toLowerCase()) + " Because you didn't created this post." })
        }
      } else {
        next()
      }

      // Check for authorizedUser or unAuthorizedUser
      if (authorizedUser?.includes(user.role)) {
        next();
      } else if (unAuthorizedUser?.includes(user.role)) {
        sendFailureResponse({ res, status: 403, message: MSG_FORBIDDEN_UNAUTHORIZED_DONT_HAVE_PERMISSION(req.method?.toLowerCase()) })
      } else {
        next()
      }
    } catch (error) {
      handleCatchedError({ res, at: "accessPermissionMiddleware", error });
    }
  };
};

module.exports = { accessPermissionMiddleware };
