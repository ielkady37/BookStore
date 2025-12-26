const OrderModel = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const isValidCreditCard = (cc, expiry) => {
  const ccRegex = /^[0-9]{16}$/;
  if (!ccRegex.test(cc)) return false;
  return new Date(expiry) > new Date();
};

exports.checkout = catchAsync(async (req, res, next) => {
  const { items, creditCard } = req.body;
  const userId = req.user.user_id;

  if (!items || items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  if (!creditCard || !isValidCreditCard(creditCard.number, creditCard.expiry)) {
    return next(
      new AppError("Transaction Failed: Invalid Credit Card Information", 402)
    );
  }

  try {
    const result = await OrderModel.checkout(userId, items, creditCard);

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
