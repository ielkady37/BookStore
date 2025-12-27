const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.updateMe = catchAsync(async (req, res, next) => {

  const allowedFields = ["first_name", "last_name", "phone", "shipping_address", "password"];
  const filteredBody = {};
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  await User.update(req.user.user_id, filteredBody);

  res.status(200).json({ status: "success", message: "Profile updated" });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.user_id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.setOffline = catchAsync(async (req, res, next) => {
  await User.setOffline(req.user.user_id);
  res.status(200).json({ status: "success", message: "User set to offline" });
});