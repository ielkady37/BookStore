const pool = require("../config/db");
const queries = require("../models/queries/reportQueries");
const catchAsync = require("../utils/catchAsync");

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const [salesLastMonth, topCustomers, topBooks] = await Promise.all([
    pool.query(queries.GET_SALES_LAST_MONTH),
    pool.query(queries.GET_TOP_CUSTOMERS),
    pool.query(queries.GET_TOP_SELLING_BOOKS),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      salesLastMonth: salesLastMonth[0][0]?.total_sales || 0,
      topCustomers: topCustomers[0],
      topSellingBooks: topBooks[0],
    },
  });
});

exports.getDailySales = catchAsync(async (req, res, next) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ status: "fail", message: "Date is required" });
  }

  const [rows] = await pool.query(queries.GET_SALES_BY_DATE, [date]);

  res.status(200).json({
    status: "success",
    data: {
      date,
      total_sales: rows[0]?.total_sales || 0,
    },
  });
});

exports.getRestockStats = catchAsync(async (req, res, next) => {
  const [rows] = await pool.query(queries.GET_RESTOCK_COUNT);

  res.status(200).json({
    status: "success",
    results: rows.length,
    data: rows,
  });
});
