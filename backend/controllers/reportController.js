const { sql, poolPromise } = require("../config/db");
const queries = require("../models/queries/reportQueries");
const catchAsync = require("../utils/catchAsync");

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const pool = await poolPromise;

  const [salesLastMonth, topCustomers, topBooks] = await Promise.all([
    pool.request().query(queries.GET_SALES_LAST_MONTH),
    pool.request().query(queries.GET_TOP_CUSTOMERS),
    pool.request().query(queries.GET_TOP_SELLING_BOOKS),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      salesLastMonth: salesLastMonth.recordset[0].total_sales,
      topCustomers: topCustomers.recordset,
      topSellingBooks: topBooks.recordset,
    },
  });
});

exports.getDailySales = catchAsync(async (req, res, next) => {
  const { date } = req.query;
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("date", sql.Date, date)
    .query(queries.GET_SALES_BY_DATE);

  res.status(200).json({
    status: "success",
    data: { date, total: result.recordset[0].total_sales },
  });
});

exports.getRestockStats = catchAsync(async (req, res, next) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("isbn", sql.VarChar, req.query.isbn || null)
    .query(queries.GET_RESTOCK_COUNT);

  res.status(200).json({
    status: "success",
    results: result.recordset.length,
    data: result.recordset,
  });
});
