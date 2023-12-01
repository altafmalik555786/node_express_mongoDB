const { endPoints } = require("../const/index");
const Post = require("../../model/post");

const { router } = require("../../utils/instances");
const { postCreatePosts, getAllPosts, deletePosts } = require("../../api/posts");
const { authMiddleware } = require("../../middlewares/auth");
const { accessPermissionMiddleware } = require("../../middlewares/access-permission");
const { userRoles } = require("../../utils/json");

router.post(`${endPoints?.posts}`, authMiddleware, postCreatePosts);
router.get(`${endPoints?.posts}`, authMiddleware, getAllPosts);
router.delete(`${endPoints?.posts}`, accessPermissionMiddleware({
    model: Post,
    authorizedUser: [userRoles.admin, userRoles.master],
    unAuthorizedUser: [userRoles.user, userRoles.superMaster]
}), authMiddleware, deletePosts);

module.exports = { postsRouter: router };
