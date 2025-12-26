const OrderModel = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// For development/testing: accept any credit card info
const isValidCreditCard = (cc, expiry) => {
  // Just check that some values are provided
  return cc && cc.length > 0 && expiry;
};

exports.checkout = catchAsync(async (req, res, next) => {
  const { items, creditCard } = req.body;
  const userId = req.user.user_id;

  if (!items || items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  // Allow checkout even without credit card for testing
  const cardInfo = creditCard || { number: "0000000000000000", expiry: "2030-12-31" };

  try {
    const result = await OrderModel.checkout(userId, items, cardInfo);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await OrderModel.getUserOrders(req.user.user_id);

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: { orders },
  });
});
