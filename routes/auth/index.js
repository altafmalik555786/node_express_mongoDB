const { login, registerUser } = require("../../api/auth");
const { endPoints } = require("../const/index.js");
const { router } = require("../../utils/instances");

router.post(`${endPoints?.login}`, login);
router.post(`${endPoints?.registerUser}`, registerUser);



module.exports = { AuthRouter: router };
