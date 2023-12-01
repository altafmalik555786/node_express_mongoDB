const { endPoints } = require("../const/index");
const Post = require("../../model/post");

const { router } = require("../../utils/instances");
const { postCreatePosts, getAllPosts, deletePosts } = require("../../api/posts");
const { authMiddleware } = require("../../middlewares/auth");
const { accessPermissionMiddleware } = require("../../middlewares/access-permission");

router.post(`${endPoints?.posts}`, authMiddleware, postCreatePosts);
router.get(`${endPoints?.posts}`, authMiddleware, getAllPosts);
router.delete(`${endPoints?.posts}`, accessPermissionMiddleware({model: Post}), authMiddleware , deletePosts);

module.exports = { postsRouter: router };
