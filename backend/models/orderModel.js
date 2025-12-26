const { sql, poolPromise } = require("../config/db");
const queries = require("./queries/orderQueries");

class OrderModel {
  static async checkout(userId, cartItems, creditCard) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      let totalAmount = 0;
      for (const item of cartItems) {
        totalAmount += item.price * item.quantity;
      }

      const orderRequest = new sql.Request(transaction);
      orderRequest.input("user_id", sql.Int, userId);
      orderRequest.input("total", sql.Decimal(10, 2), totalAmount);

      const orderResult = await orderRequest.query(queries.CREATE_ORDER);
      const newOrderId = orderResult.recordset[0].order_id;

      for (const item of cartItems) {
        const stockRequest = new sql.Request(transaction);
        stockRequest.input("qty", sql.Int, item.quantity);
        stockRequest.input("isbn", sql.VarChar, item.isbn);
        await stockRequest.query(queries.DEDUCT_STOCK);

        const itemRequest = new sql.Request(transaction);
        itemRequest.input("order_id", sql.Int, newOrderId);
        itemRequest.input("isbn", sql.VarChar, item.isbn);
        itemRequest.input("quantity", sql.Int, item.quantity);
        itemRequest.input("price", sql.Decimal(10, 2), item.price);
        await itemRequest.query(queries.CREATE_ORDER_ITEM);
      }

      await transaction.commit();
      return { success: true, orderId: newOrderId, total: totalAmount };
    } catch (err) {
      await transaction.rollback();
      if (err.message.includes("stock quantity cannot be negative")) {
        throw new Error(
          "Transaction failed: One or more items are out of stock."
        );
      }
      throw err;
    }
  }

  static async getUserOrders(userId) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("user_id", sql.Int, userId)
      .query(queries.GET_USER_ORDERS);
    return result.recordset;
  }
}

module.exports = OrderModel;
