const PublisherOrderModel = require("../models/publisherOrderModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllPending = catchAsync(async (req, res, next) => {
  const orders = await PublisherOrderModel.findAllPending();
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: { orders },
  });
});

exports.confirmRestock = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await PublisherOrderModel.confirm(id);

  res.status(200).json({
    status: "success",
    message: "Order confirmed and stock updated.",
  });
});
