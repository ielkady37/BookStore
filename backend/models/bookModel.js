const { sql, poolPromise } = require("../config/db");
const queries = require("./queries/bookQueries");

class BookModel {
  static async findAll(filters = {}) {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("isbn", sql.VarChar, filters.isbn || null);
    request.input("title", sql.NVarChar, filters.title || null);
    request.input("category", sql.VarChar, filters.category || null);
    request.input("publisher", sql.NVarChar, filters.publisher || null);
    request.input("author", sql.NVarChar, filters.author || null);

    const result = await request.query(queries.GET_ALL_BOOKS);
    return result.recordset;
  }

  static async create(bookData) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      let pubId;
      const pubRequest = new sql.Request(transaction);
      pubRequest.input("name", sql.NVarChar, bookData.publisher);

      const pubCheck = await pubRequest.query(queries.FIND_PUBLISHER_BY_NAME);

      if (pubCheck.recordset.length > 0) {
        pubId = pubCheck.recordset[0].publisher_id;
      } else {
        const pubResult = await pubRequest.query(queries.INSERT_PUBLISHER);
        pubId = pubResult.recordset[0].publisher_id;
      }

      const bookRequest = new sql.Request(transaction);
      bookRequest.input("isbn", sql.VarChar, bookData.isbn);
      bookRequest.input("title", sql.NVarChar, bookData.title);
      bookRequest.input("pub_id", sql.Int, pubId);
      bookRequest.input("year", sql.Int, bookData.publication_year);
      bookRequest.input("price", sql.Decimal(10, 2), bookData.selling_price);
      bookRequest.input("category", sql.VarChar, bookData.category);
      bookRequest.input("stock", sql.Int, bookData.stock_quantity);
      bookRequest.input("threshold", sql.Int, bookData.threshold);

      await bookRequest.query(queries.INSERT_BOOK);

      // 3. Handle Authors
      for (const authorName of bookData.authors) {
        let authorId;
        const authRequest = new sql.Request(transaction);
        authRequest.input("name", sql.NVarChar, authorName);

        const authCheck = await authRequest.query(queries.FIND_AUTHOR_BY_NAME);

        if (authCheck.recordset.length > 0) {
          authorId = authCheck.recordset[0].author_id;
        } else {
          const authResult = await authRequest.query(queries.INSERT_AUTHOR);
          authorId = authResult.recordset[0].author_id;
        }

        const linkRequest = new sql.Request(transaction);
        linkRequest.input("isbn", sql.VarChar, bookData.isbn);
        linkRequest.input("author_id", sql.Int, authorId);
        await linkRequest.query(queries.LINK_BOOK_AUTHOR);
      }

      await transaction.commit();
      return { success: true, isbn: bookData.isbn };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = BookModel;
