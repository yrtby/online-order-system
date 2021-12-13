const express = require("express");
const productController = require("../controller/productController");
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.route("/create").post(authMiddleware, roleMiddleware(["seller"]), productController.createProduct);
router.route("/update/:id").put(authMiddleware, roleMiddleware(["seller"]), productController.updateProduct);
router.route("/").get(authMiddleware, roleMiddleware(["user","seller"]), productController.getProducts);


module.exports = router;
