const Post = require("../../model/post");
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
const UserModel = require('../../model/user')
const { isNotFoundByID, checkValidation, sendSuccessResponse, getUserFromToken } = require("../../utils/helper/api");
const { verifyToken, handleCatchedError } = require("../../utils/helper/common");

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
        const picture = req.files.files.data;
        const tempFilePath = req.files?.files.name;
        fs.writeFileSync(tempFilePath, picture);
        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(tempFilePath);
        const post = new Post({
            title,
            content,
            user: user._id,
            img: uploadResult.secure_url,
            imgId: uploadResult.public_id,
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