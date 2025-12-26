const pool = require("../config/db");
const queries = require("./queries/orderQueries");

class OrderModel {
  static async checkout(userId, cartItems, creditCard) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Calculate total amount
      let totalAmount = 0;
      for (const item of cartItems) {
        totalAmount += parseFloat(item.price) * item.quantity;
      }

      // Step 1: Create customer_order
      const [orderResult] = await connection.query(queries.CREATE_ORDER, [
        userId,
        totalAmount,
      ]);
      const newOrderId = orderResult.insertId;

      // Step 2: Create payment record (linked to order)
      let expiryDate = null;
      if (creditCard?.expiry) {
        const parts = creditCard.expiry.split("/");
        if (parts.length === 2) {
          const month = parseInt(parts[0], 10);
          let year = parseInt(parts[1], 10);
          if (year < 100) year += 2000;
          expiryDate = new Date(year, month, 0);
        }
      }

      await connection.query(queries.CREATE_PAYMENT, [
        newOrderId,
        creditCard?.number?.slice(0, 16) || "0000000000000000",
        expiryDate,
        "SUCCESS",
      ]);

      // Step 3: Create customer_order_items and Step 4: Decrease stock quantity
      for (const item of cartItems) {
        // Create order item
        await connection.query(queries.CREATE_ORDER_ITEM, [
          newOrderId,
          item.isbn,
          item.quantity,
          item.price,
        ]);

        // Deduct from stock table
        await connection.query(queries.DEDUCT_STOCK, [
          item.quantity,
          item.isbn,
        ]);
      }

      // Clear the user's cart after successful checkout
      await connection.query(
        `DELETE ci FROM cart_items ci 
         JOIN cart c ON ci.cart_id = c.cart_id 
         WHERE c.user_id = ?`,
        [userId]
      );

      await connection.commit();
      return { success: true, orderId: newOrderId, total: totalAmount };
    } catch (err) {
      await connection.rollback();
      if (err.message.includes("cannot be negative") || err.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
        throw new Error(
          "Transaction failed: One or more items are out of stock."
        );
      }
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getUserOrders(userId) {
    const [rows] = await pool.query(queries.GET_USER_ORDERS, [userId]);
    return rows;
  }

  static async getOrderDetails(orderId) {
    const [rows] = await pool.query(queries.GET_ORDER_DETAILS, [orderId]);
    return rows;
  }
}

module.exports = OrderModel;
