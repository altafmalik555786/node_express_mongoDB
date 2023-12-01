const { endPoints } = require("../const/index");
const {
    authMiddleware, isAdminMiddleware,
} = require("../../utils/authMiddleware");
const { router } = require("../../utils/instances");
const { postCreatePosts, getAllPosts, deletePosts } = require("../../api/posts");

router.post(`${endPoints?.posts}`, authMiddleware, postCreatePosts);
router.get(`${endPoints?.posts}`, authMiddleware, getAllPosts);
router.delete(`${endPoints?.posts}`, authMiddleware, deletePosts);

module.exports = { postsRouter: router };
