const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware.protect);

router
  .route("/")
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.clearCart);

router
  .route("/:isbn")
  .patch(cartController.updateCartItem)
  .delete(cartController.removeFromCart);

module.exports = router;
