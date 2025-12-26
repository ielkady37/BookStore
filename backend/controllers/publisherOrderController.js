const PublisherOrderModel = require("../models/publisherOrderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllPending = catchAsync(async (req, res, next) => {
  const orders = await PublisherOrderModel.findAllPending();
  
  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await PublisherOrderModel.getOrderItems(order.order_id);
      return { ...order, items };
    })
  );

  res.status(200).json({
    status: "success",
    results: ordersWithItems.length,
    data: { orders: ordersWithItems },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await PublisherOrderModel.findAll();
  
  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await PublisherOrderModel.getOrderItems(order.order_id);
      return { ...order, items };
    })
  );

  res.status(200).json({
    status: "success",
    results: ordersWithItems.length,
    data: { orders: ordersWithItems },
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

// Create a manual publisher order
exports.createOrder = catchAsync(async (req, res, next) => {
  const { isbn, quantity } = req.body;

  if (!isbn) {
    return next(new AppError("ISBN is required", 400));
  }

  const orderQuantity = quantity || 50; // Default to 50 if not specified

  try {
    const result = await PublisherOrderModel.createOrder(isbn, orderQuantity);

    res.status(201).json({
      status: "success",
      message: "Publisher order created successfully",
      data: result,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});
