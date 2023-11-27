const UserModel = require("../../model/user");
const { MESSAGE_DELETED } = require("../../utils/const");
const {
  sendSuccessResponse,
  handlePutRequest,
  isNotFoundByID,
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

const getSingleUser = async (req, res) => {
  try {
    const { id } = req?.body;
    isNotFoundByID({ req, res, model: UserModel, entity: 'User' })
    const data = await UserModel.findById(id);
    sendSuccessResponse({ res, data });
  } catch (error) {
    handleCatchedError({ res, error, at: "getSingleUser" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body
    delete req.body.password;
    await handlePutRequest({
      req,
      res,
      model: Model,
      entity: "User",
      requiredFields: [email, role],
      bodyData: { ...req.body },
    });
    const options = { new: true };
    const data = await UserModel.findByIdAndUpdate(id, req.body, options);
    sendSuccessResponse({ res, data, message: MESSAGE_UPDATED("User") });
  } catch (error) {
    handleCatchedError({ res, error, at: "updateUser" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await isNotFoundByID({ req, res, model: UserModel, entity: "User" });
    const data = await UserModel.findByIdAndDelete(userId);
    return sendSuccessResponse({ res, message: MESSAGE_DELETED("User"), data });
  } catch (error) {
    handleCatchedError({ res, error, at: "/user/:id" });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
};
