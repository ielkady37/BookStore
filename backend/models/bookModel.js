const pool = require("../config/db");
const queries = require("./queries/bookQueries");

class BookModel {
  static async findAll(filters = {}) {
    const params = [
      filters.isbn || null, filters.isbn || null,
      filters.title || null, filters.title || null,
      filters.category || null, filters.category || null,
      filters.publisher || null, filters.publisher || null,
      filters.author || null, filters.author || null,
    ];

    const [rows] = await pool.query(queries.GET_ALL_BOOKS, params);
    return rows;
  }

  static async create(bookData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Handle Publisher
      let pubId;
      const [pubCheck] = await connection.query(queries.FIND_PUBLISHER_BY_NAME, [bookData.publisher]);

      if (pubCheck.length > 0) {
        pubId = pubCheck[0].publisher_id;
      } else {
        const [pubResult] = await connection.query(queries.INSERT_PUBLISHER, [bookData.publisher]);
        pubId = pubResult.insertId;
      }

      // 2. Insert Book
      await connection.query(queries.INSERT_BOOK, [
        bookData.isbn,
        bookData.title,
        pubId,
        bookData.publication_year,
        bookData.selling_price,
        bookData.category,
      ]);

      // 3. Insert Stock
      await connection.query(queries.INSERT_STOCK, [
        bookData.isbn,
        bookData.stock_quantity,
        bookData.threshold,
      ]);

      // 4. Handle Authors
      for (const authorName of bookData.authors) {
        let authorId;
        const [authCheck] = await connection.query(queries.FIND_AUTHOR_BY_NAME, [authorName]);

        if (authCheck.length > 0) {
          authorId = authCheck[0].author_id;
        } else {
          const [authResult] = await connection.query(queries.INSERT_AUTHOR, [authorName]);
          authorId = authResult.insertId;
        }

        await connection.query(queries.LINK_BOOK_AUTHOR, [bookData.isbn, authorId]);
      }

      await connection.commit();
      return { success: true, isbn: bookData.isbn };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = BookModel;
