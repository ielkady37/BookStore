const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const existingUser = await User.findByEmail(req.body.email);
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  const existingUsername = await User.findByUsername(req.body.username);
  if (existingUsername) {
    return next(new AppError("Username already in use", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const newUser = await User.create({
    username: req.body.username,
    password: hashedPassword,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    shipping_address: req.body.shipping_address,
    role: req.body.role || "CUSTOMER",
  });

  const token = signToken(newUser.user_id);

  newUser.password_hash = undefined;

  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user.user_id);

  user.password_hash = undefined;

  User.setOnline(user.user_id);

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});
