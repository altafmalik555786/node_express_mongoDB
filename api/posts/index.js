const Post = require("../../model/post");
const { MESSAGE_CREATED, MESSAGE_DELETED, ERROR_RECORD_NOT_FOUND } = require("../../utils/const");
const { checkValidation, sendSuccessResponse, getUserFromToken, handleCloudinaryFiles, getPaginatedData, verifyToken, isNotFoundByID, sendFailureResponse, destoryCloudinaryFiles } = require("../../utils/helper/api");
const { handleCatchedError } = require("../../utils/helper/common");


const postCreatePosts = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = await getUserFromToken(req, res)
        checkValidation({ req, res, model: Post, requiredFields: ["title", "content"] });
        const uploadedFile = await handleCloudinaryFiles(req)
        const post = new Post({ title, content, user: user._id, img: uploadedFile.secure_url, imgId: uploadedFile.public_id });
        const data = await post.save();
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
        const { id, imgId } = req.body;
        await destoryCloudinaryFiles(imgId)
        await Post.deleteOne({ _id: id });
        sendSuccessResponse({ res, message: MESSAGE_DELETED('Post') })
    } catch (error) {
        handleCatchedError({ res, error: error, at: "postCreatePosts" })
    }
}

module.exports = {
    postCreatePosts,
    getAllPosts,
    deletePosts
}