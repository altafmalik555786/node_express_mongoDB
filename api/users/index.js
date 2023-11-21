const UserModel = require("../../model/user");
const {
  sendSuccessResponse,
  handlePutRequest,
} = require("../../utils/helper/api");
const { handleCatchedError } = require("../../utils/helper/common");

const getAllUsers = async (req, res) => {
  try {
    const data = await UserModel.find();
    sendSuccessResponse({ res, data });
  } catch (error) {
    handleCatchedError({ res, error, at: "getAllUsers" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    delete req.body.password;
    await handlePutRequest({
      req,
      res,
      model: Model,
      entity: "User",
      bodyData: { ...req.body },
    });
    const options = { new: true };
    const data = await Model.findByIdAndUpdate(id, req.body, options);
    sendSuccessResponse({ res, data, message: MESSAGE_UPDATED("User") });
  } catch (error) {
    handleCatchedError({ res, error, at: "updateUser" });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
};
