const express = require("express");
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("admin"));

router.get("/dashboard", reportController.getDashboardStats);
router.get("/daily-sales", reportController.getDailySales);
router.get("/restock-history", reportController.getRestockStats);

module.exports = router;
