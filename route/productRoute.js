const express = require("express");
const productController = require("../controller/productController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/create").post(authMiddleware, productController.createProduct);
router.route("/update/:id").put(authMiddleware, productController.updateProduct);
router.route("/").get(authMiddleware, productController.getProducts);


module.exports = router;
