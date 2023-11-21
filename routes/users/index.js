const { Router } = require("express");
const router = Router();
const { endPoints } = require("../const/index");
const { getAllUsers, updateUser } = require("../../api/users");
const { authMiddleware, isAdminMiddleware } = require("../../utils/authMiddleware");
const { ROUTE_PARAM_SLASH_ID } = require("../../utils/const");

// router.post(`${endPoints?.users}`, playListApi.postPlayList);
router.get(`${endPoints?.users}`, authMiddleware, isAdminMiddleware, getAllUsers);
// router.get(`${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`, playListApi.getSinglePlayList);
router.put(`${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`, authMiddleware, updateUser);
// router.delete(`${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`, playListApi.deletePlayList);

module.exports = router;
