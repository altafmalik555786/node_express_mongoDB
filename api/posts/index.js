const Post = require("../../model/post");
const { CON_IDENTITY } = require("../../utils/const");
const { checkValidation, sendSuccessResponse, getUserFromToken, handleCloudinaryFiles } = require("../../utils/helper/api");
const { handleCatchedError } = require("../../utils/helper/common");

const postCreatePosts = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = await getUserFromToken(req, res)
        checkValidation({
            req,
            res,
            model: Post,
            requiredFields: ["title", "content"],
        });
        const uploadedFile = await handleCloudinaryFiles(req)
        const post = new Post({
            title,
            content,
            user: user._id,
            img: uploadedFile.secure_url,
            imgId: uploadedFile.public_id,
        });
        await post.save();
        return sendSuccessResponse({ res, message: 'Blog created successfully' });
    } catch (error) {
        handleCatchedError({ res, error: error, at: "postCreatePosts" })
    }
}



module.exports = {
    postCreatePosts
}