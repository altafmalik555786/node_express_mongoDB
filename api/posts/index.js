const Post = require("../../model/post");
const { MESSAGE_CREATED, CON_IDENTITY } = require("../../utils/const");
const { checkValidation, sendSuccessResponse, getUserFromToken, handleCloudinaryFiles, getPaginatedData, verifyToken, isNotFoundByID } = require("../../utils/helper/api");
const { handleCatchedError } = require("../../utils/helper/common");

const postCreatePosts = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = await getUserFromToken(req, res)
        checkValidation({ req, res, model: Post, requiredFields: ["title", "content"] });
        const uploadedFile = await handleCloudinaryFiles(req)
        const post = new Post({ title, content, user: user._id, img: uploadedFile.secure_url, imgId: uploadedFile.public_id });
        await post.save();
        return sendSuccessResponse({ res, message: MESSAGE_CREATED('Blog') });
    } catch (error) {
        handleCatchedError({ res, error: error, at: "postCreatePosts" })
    }
}

const getAllPosts = async (req, res) => {
    try {
        await getPaginatedData({ req, res, model: Post, populate: ["user", "-password -email -contact"] })
    } catch (error) {
        handleCatchedError({ res, error, at: "getAllPosts" })
    }
};

const deletePosts = async (req, res) => {
    try {
        const decoded = await verifyToken(req, res);
        const userId = decoded.id;
        const { id, imgId } = req.body;
        const post = await isNotFoundByID({ req, res, id, model: Post, entity: "Post" });

        if (String(post.user) !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        // Delete the post
        cloudinary.uploader.destroy(imgId, async (destroyErr, destroyResult) => {
            if (destroyErr) {
                console.error('Error deleting the image from Cloudinary:', destroyErr);
            }
            await Post.deleteOne({ _id: id });
            return res.status(200).json({ success: true, message: 'Post deleted successfully' });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    postCreatePosts,
    getAllPosts,
    deletePosts
}