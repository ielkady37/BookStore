const BookModel = require("../models/bookModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const queries = require("../models/queries/bookQueries");

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await BookModel.findAll(req.query);

  res.status(200).json({
    status: "success",
    results: books.length,
    data: { books },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  if (
    !req.body.isbn ||
    !req.body.title ||
    !req.body.threshold ||
    !req.body.stock_quantity
  ) {
    return next(
      new AppError(
        "Missing required fields: ISBN, Title, Stock, Threshold",
        400
      )
    );
  }

  if (!Array.isArray(req.body.authors) || req.body.authors.length === 0) {
    return next(new AppError("A book must have at least one author", 400));
  }

  const result = await BookModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Book created successfully",
    data: result,
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const { isbn } = req.params;
  const pool = await poolPromise;

  const updates = req.body;

  await pool
    .request()
    .input("isbn", sql.VarChar, isbn)
    .input("price", sql.Decimal, updates.selling_price)
    .input("stock", sql.Int, updates.stock_quantity)
    .query(queries.UPDATE_BOOK);

  res.status(200).json({ status: "success", message: "Book updated" });
});
