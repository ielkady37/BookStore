const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("./../middlewares/authMiddleware");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.patch("/update-me", authMiddleware.protect, userController.updateMe);

module.exports = router;
