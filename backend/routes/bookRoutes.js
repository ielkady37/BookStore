const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes (Everyone can search)
router
  .route("/")
  .get(bookController.getAllBooks)
  // Protected Route (Only Admin can add)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    bookController.createBook
  );

router.patch(
  "/:isbn",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  bookController.updateBook
);

module.exports = router;
