const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/checkout", orderController.checkout);
router.get("/my-orders", orderController.getMyOrders);

module.exports = router;
