const { CON_IDENTITY } = require("../../utils/const");
const { getUserFromToken, getId, sendFailureResponse, isNotFoundByID } = require("../../utils/helper/api");
const { handleCatchedError, convertVartoString } = require("../../utils/helper/common");

///////// Hints to use ////////
// accessPermissionMiddleware({model: [modelname]}) -------> for same user authority

const accessPermissionMiddleware = ({ model = null, authorisedUser = [], unAuthorisedUser = [] }) => {
  return async (req, res, next) => {
    const id = req.params.id || req.body.id;
    try {
      const user = await getUserFromToken(req, res)
      if (model) {
        const post = await isNotFoundByID({ req, res, id, model });
        if (String(post.user) !== getId(user)) {
          return sendFailureResponse({ res, status: 403, message: 'You are not authorized to delete this post' })
        }
      } else {
        next()
      }

      // Check for authorisedUser

      if (authorisedUser?.includes(user.role)) {
        next(); 
      } else if (unAuthorisedUser?.includes(user.role)) {
        res.status(403).json({ error: 'Unauthorized' }); // User doesn't have permission
      } else {
        next()
      }

      
    } catch (error) {
      handleCatchedError({ res, at: "accessPermissionMiddleware", error });
    }
  };
};

module.exports = { accessPermissionMiddleware };
