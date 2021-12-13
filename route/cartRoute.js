const express = require("express");
const cartController = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.route("/add").post(authMiddleware, roleMiddleware(["user"]), cartController.addCart);
router.route("/").get(authMiddleware, roleMiddleware(["user"]), cartController.getCart);
router.route("/delete").post(authMiddleware, roleMiddleware(["user"]), cartController.deleteCart);

module.exports = router;