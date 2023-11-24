const { login } = require("../../api/auth");
const { Router } = require("express");
const { endPoints } = require("../const");

const router = Router();
router.post(`${endPoints?.login}`, login);

module.exports = router;
