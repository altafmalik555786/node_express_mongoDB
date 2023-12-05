const Post = require("../../model/post");
const { MSG_CREATED, MSG_DELETED, CON_IDENTITY } = require("../../utils/const");
const { checkValidation, sendSuccessResponse, getUserFromToken, handleCloudinaryFiles, getPaginatedData, verifyToken, findById, sendFailureResponse, destoryCloudinaryFiles } = require("../../utils/helper/api");
const { handleCatchedError } = require("../../utils/helper/common");

const postCreatePosts = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = await getUserFromToken(req, res)
        checkValidation({ req, res, model: Post, requiredFields: ["title", "content"] });
        const uploadedFile = await handleCloudinaryFiles(req)
        const post = new Post({ title, content, user: user._id, img: uploadedFile.secure_url, imgId: uploadedFile.public_id });
        const data = await post.save();
        return sendSuccessResponse({ res, data, message: MSG_CREATED('Blog') });
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
        const { id, imgId } = req.body;
        await destoryCloudinaryFiles({ id: imgId, res })
        await Post.deleteOne({ _id: id });
        sendSuccessResponse({
            res,
            message: MSG_DELETED('Post')
        })
    } catch (error) {
        handleCatchedError({ res, error: error, at: "postCreatePosts" })
    }
}

const postLikePost = async (req, res) => {
    try {
        const decoded = await verifyToken(req, res);
        const userId = decoded.id;
        const post = await findById({ req, res, model: Post, entity: 'Post' })
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            await post.updateOne({ $pull: { likes: userId } });
            sendSuccessResponse({ res, message: 'Post unliked successfully' })
        } else {
            await post.updateOne({ $addToSet: { likes: userId } });
            sendSuccessResponse({ res, message: 'Post liked successfully' })
        }
    } catch (error) {
        handleCatchedError({ res, error, at: "postLikePost" })
    }
};

const postCommontOnPosts = async (req, res) => {
    try {
        const { comment } = req.body;
        const decoded = await verifyToken(req, res);
        const userId = decoded.id;
        const post = await findById({ req, res, model: Post, entity: 'Post' })


        // Create the comment object
        const newComment = {
            user: userId,
            text: comment,
        };

        // Add the comment to the post's comments array
        post.comments.push(newComment);
        await post.save();

        return res.status(200).json({ success: true, message: 'Comment added successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    postCreatePosts,
    getAllPosts,
    deletePosts,
    postLikePost,
    postCommontOnPosts,
}
