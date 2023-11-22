const { Router } = require("express");
const router = Router();
const { endPoints } = require("../const/index");
const { getAllUsers, updateUser, deleteUser } = require("../../api/users");
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../../utils/authMiddleware");
const { ROUTE_PARAM_SLASH_ID } = require("../../utils/const");

router.get(
  `${endPoints?.users}`,
  authMiddleware,
  isAdminMiddleware,
  getAllUsers
);
// router.get(`${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`, getAllUsers);
router.put(
  `${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`,
  authMiddleware,
  updateUser
);
router.delete(
  `${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`,
  authMiddleware,
  isAdminMiddleware,
  deleteUser
);

module.exports = router;
