const { endPoints } = require("../const/index");
const {
    authMiddleware,
} = require("../../utils/authMiddleware");
const { router } = require("../../utils/instances");
const { postCreatePosts, getAllPosts } = require("../../api/posts");

router.post(`${endPoints?.posts}`, authMiddleware, postCreatePosts);
router.get(`${endPoints?.posts}`, authMiddleware, getAllPosts);

module.exports = { postsRouter: router };
