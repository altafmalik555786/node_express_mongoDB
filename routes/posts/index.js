const { endPoints } = require("../const/index");

const { router } = require("../../utils/instances");
const { postCreatePosts, getAllPosts, deletePosts } = require("../../api/posts");
const { authMiddleware } = require("../../middlewares/auth");

router.post(`${endPoints?.posts}`, authMiddleware, postCreatePosts);
router.get(`${endPoints?.posts}`, authMiddleware, getAllPosts);
router.delete(`${endPoints?.posts}`, authMiddleware, deletePosts);

module.exports = { postsRouter: router };
