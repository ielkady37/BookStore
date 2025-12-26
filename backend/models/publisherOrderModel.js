const pool = require("../config/db");
const queries = require("./queries/publisherOrderQueries");

class PublisherOrderModel {
  static async findAllPending() {
    const [rows] = await pool.query(queries.GET_ALL_PENDING);
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.query(queries.GET_ALL_ORDERS);
    return rows;
  }

  static async confirm(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update stock quantities
      await connection.query(queries.UPDATE_STOCK_ON_CONFIRM, [id]);

      // Update order status
      await connection.query(queries.CONFIRM_ORDER, [id]);

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getOrderItems(orderId) {
    const [rows] = await pool.query(queries.GET_ORDER_ITEMS, [orderId]);
    return rows;
  }

  // Create a manual publisher order for a book
  static async createOrder(isbn, quantity) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get the publisher for this book
      const [bookRows] = await connection.query(queries.GET_BOOK_PUBLISHER, [isbn]);
      if (bookRows.length === 0) {
        throw new Error("Book not found");
      }
      const publisherId = bookRows[0].publisher_id;

      // Create the order
      const [orderResult] = await connection.query(queries.CREATE_ORDER, [publisherId]);
      const orderId = orderResult.insertId;

      // Add the book to the order
      await connection.query(queries.CREATE_ORDER_ITEM, [orderId, isbn, quantity]);

      await connection.commit();
      return { orderId, isbn, quantity, publisherId };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = PublisherOrderModel;
