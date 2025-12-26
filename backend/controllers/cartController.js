const CartModel = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get user's cart
exports.getCart = catchAsync(async (req, res, next) => {
  const items = await CartModel.getCartItems(req.user.user_id);

  res.status(200).json({
    status: "success",
    results: items.length,
    data: { items },
  });
});

// Add item to cart
exports.addToCart = catchAsync(async (req, res, next) => {
  const { isbn, quantity } = req.body;

  if (!isbn) {
    return next(new AppError("ISBN is required", 400));
  }

  const items = await CartModel.addItem(req.user.user_id, isbn, quantity || 1);

  res.status(200).json({
    status: "success",
    message: "Item added to cart",
    data: { items },
  });
});

// Update item quantity
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { isbn } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return next(new AppError("Quantity is required", 400));
  }

  const items = await CartModel.updateQuantity(req.user.user_id, isbn, quantity);

  res.status(200).json({
    status: "success",
    message: "Cart updated",
    data: { items },
  });
});

// Remove item from cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { isbn } = req.params;

  const items = await CartModel.removeItem(req.user.user_id, isbn);

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: { items },
  });
});

// Clear cart
exports.clearCart = catchAsync(async (req, res, next) => {
  await CartModel.clearCart(req.user.user_id);

  res.status(200).json({
    status: "success",
    message: "Cart cleared",
    data: { items: [] },
  });
});
