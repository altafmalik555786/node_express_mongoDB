const { CON_IDENTITY } = require("../../utils/const");
const { getUserFromToken, getId, sendFailureResponse, isNotFoundByID } = require("../../utils/helper/api");
const { handleCatchedError, convertVartoString } = require("../../utils/helper/common");

///////// Hints to use ////////
// accessPermissionMiddleware({model: [modelname]}) -------> for same user authority

const accessPermissionMiddleware = ({ model = null }) => {
  return async (req, res, next) => {
    const id = req.params.id || req.body.id;
    try {
      if (model) {
        const post = await isNotFoundByID({ req, res, id, model });
        if (String(post.user) !== getId(await getUserFromToken(req, res))) {
          return sendFailureResponse({ res, status: 403,  message: 'You are not authorized to delete this post' })
        }
      }
      // // Check if user's role has the requiredPermission
      // if (user.role === 'admin' && requiredPermission === 'write') {
      //   next(); // Admin has 'write' permission
      // } else {
      //   res.status(403).json({ error: 'Unauthorized' }); // User doesn't have permission
      // }
    } catch (error) {
      handleCatchedError({ res, at: "accessPermissionMiddleware", error });
    }
  };
};

module.exports = { accessPermissionMiddleware };
