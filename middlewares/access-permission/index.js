const Post = require("../../model/post");
const { CON_IDENTITY } = require("../../utils/const");
const { getUserFromToken } = require("../../utils/helper/api");
const { handleCatchedError, convertVartoString } = require("../../utils/helper/common");

///////// Hints to use ////////
// accessPermissionMiddleware({model: [modelname]}) -------> for same user authority

const accessPermissionMiddleware = ({ model }) => {
  return async (req, res, next) => {
    const id = req.params.id || req.body.id;
    try {

      // if (String(post.user) !== userId) {
      //     return res.status(403).json({ message: 'You are not authorized to delete this post' });
      // }

      console.log(CON_IDENTITY, convertVartoString({Post}))
      
      if (model && user) {

        const user = await getUserFromToken(req, res)
        const post = await isNotFoundByID({ req, res, id, model: post, entity: "Post" });

  if (String(model.user) !== userId) {
          return res.status(403).json({ message: 'You are not authorized to delete this post' });
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
