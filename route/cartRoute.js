const express = require("express");
const cartController = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/add").post(authMiddleware, cartController.addCart);
router.route("/get").get(authMiddleware, cartController.getCart);
router.route("/delete").post(authMiddleware, cartController.deleteCart);

module.exports = router;