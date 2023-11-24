const { login } = require("../../api/auth");
const { endPoints } = require("../const/index.js");
const { router } = require("../../utils/instances");

router.post(`${endPoints?.login}`, login);

module.exports = { AuthRouter: router };
