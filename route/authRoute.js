const express = require("express");
const authController = require("../controller/authController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/register").post(authController.createUser);
router.route("/activate").put(authController.activateUser);
router.route("/resend").post(authController.resendActivationUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").post(authController.logoutUser);

module.exports = router;
