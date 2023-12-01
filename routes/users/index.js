const { endPoints } = require("../const/index");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("../../api/users");
const { ROUTE_PARAM_SLASH_ID } = require("../../utils/const");
const { router } = require("../../utils/instances");
const { authMiddleware } = require("../../middlewares/auth");
const { isAdminMiddleware } = require("../../middlewares/is-admin");

router.get(
  `${endPoints?.users}`,
  authMiddleware,
  isAdminMiddleware,
  getAllUsers
);
router.get(
  `${endPoints?.users}${ROUTE_PARAM_SLASH_ID}`,
  authMiddleware,
  getSingleUser
);
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

module.exports = { UserRouter: router };
