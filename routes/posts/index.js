const { endPoints } = require("../const/index");

const {
    authMiddleware,
} = require("../../utils/authMiddleware");
const { router } = require("../../utils/instances");
const { postCreatePosts } = require("../../api/posts");

router.post(
    `${endPoints?.posts}`,
    authMiddleware,
    postCreatePosts
);


module.exports = { postsRouter: router };
