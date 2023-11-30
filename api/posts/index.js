const Post = require("../../model/post");
const { MESSAGE_CREATED } = require("../../utils/const");
const { checkValidation, sendSuccessResponse, getUserFromToken, handleCloudinaryFiles, getPaginatedData } = require("../../utils/helper/api");
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
        await getPaginatedData({ req, res, model: Post, populate: ["user", "-password -email -contact"]})
    } catch (error) {
        handleCatchedError({ res, error, at: "getAllPosts" })
    }
};

module.exports = {
    postCreatePosts,
    getAllPosts
}