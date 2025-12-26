const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/errorHandler");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRoutes");
const orderRouter = require("./routes/orderRoutes");
const reportRouter = require("./routes/reportRoutes");
const publisherOrderRouter = require("./routes/publisherOrderRoutes");
const cartRouter = require("./routes/cartRoutes");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/publisher-orders", publisherOrderRouter);
app.use("/api/v1/cart", cartRouter);

// UNHANDLED ROUTES
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
