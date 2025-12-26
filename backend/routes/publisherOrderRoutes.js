const express = require("express");
const publisherOrderController = require("../controllers/publisherOrderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("admin"));

router.get("/", publisherOrderController.getAllPending);
router.patch("/:id/confirm", publisherOrderController.confirmRestock);

module.exports = router;
