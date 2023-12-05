const { endPoints } = require("../const/index");
const Post = require("../../model/post");

const { router } = require("../../utils/instances");
const { postCreatePosts, getAllPosts, deletePosts, postLikePost } = require("../../api/posts");
const { authMiddleware } = require("../../middlewares/auth");
const { accessPermissionMiddleware } = require("../../middlewares/access-permission");
const { userRoles } = require("../../utils/json");
const { ROUTE_PARAM_SLASH_ID } = require("../../utils/const");

router.post(`${endPoints?.posts}`, authMiddleware, postCreatePosts);
router.get(`${endPoints?.posts}`, authMiddleware, getAllPosts);
router.delete(`${endPoints?.posts}`,
    accessPermissionMiddleware({
        model: Post,
        authorizedUser: [userRoles.admin, userRoles.user],
        entity: "Post"
    }),
    authMiddleware, deletePosts);
router.post(`${endPoints?.likePost}${ROUTE_PARAM_SLASH_ID}`, authMiddleware, postLikePost);


module.exports = { postsRouter: router };
