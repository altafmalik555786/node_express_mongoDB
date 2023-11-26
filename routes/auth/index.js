const { login, registerUser, postRequestPasswordReset } = require("../../api/auth");
const { endPoints } = require("../const/index.js");
const { router } = require("../../utils/instances");

router.post(`${endPoints?.login}`, login);
router.post(`${endPoints?.registerUser}`, registerUser);
router.post(`${endPoints?.requestResetPassword}`, postRequestPasswordReset);



module.exports = { AuthRouter: router };
