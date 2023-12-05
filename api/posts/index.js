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
        const { id } = req.params;
        console.log(CON_IDENTITY, "id", id)
        const decoded = await verifyToken(req, res);
        const userId = decoded.id;        
        const post = await findById({ req, res, model: Post, entity: 'Post' })

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // User has already liked the post, so we remove the like
            await post.updateOne({ $pull: { likes: userId } });
            return res.status(200).json({ success: true, message: 'Post unliked successfully' });
        } else {
            // User hasn't liked the post, so we add the like
            await post.updateOne({ $addToSet: { likes: userId } });
            return res.status(200).json({ success: true, message: 'Post liked successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    postCreatePosts,
    getAllPosts,
    deletePosts,
    postLikePost
}
