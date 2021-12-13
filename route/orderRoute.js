const express = require("express");
const orderController = require("../controller/orderController");
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.route("/").post(authMiddleware, roleMiddleware(["user"]), orderController.createOrder);
router.route("/").get(authMiddleware, roleMiddleware(["user","seller"]), orderController.getOrder);
router.route("/").put(authMiddleware, roleMiddleware(["user","seller"]), orderController.updateOrderStatus);


module.exports = router;
