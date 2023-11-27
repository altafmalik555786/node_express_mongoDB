const { login, registerUser, postRequestPasswordReset, postVerifyCode, postResetPassword } = require("../../api/auth");
const { endPoints } = require("../const/index.js");
const { router } = require("../../utils/instances");

router.post(`${endPoints?.login}`, login);
router.post(`${endPoints?.registerUser}`, registerUser);
router.post(`${endPoints?.requestResetPassword}`, postRequestPasswordReset);
router.post(`${endPoints?.verifyCode}`, postVerifyCode);
router.post(`${endPoints?.resetPassword}`, postResetPassword);


module.exports = { AuthRouter: router };
