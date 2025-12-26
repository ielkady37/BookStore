const { sql, poolPromise } = require("../config/db");
const queries = require("./queries/publisherOrderQueries");

class PublisherOrderModel {
  static async findAllPending() {
    const pool = await poolPromise;
    const result = await pool.request().query(queries.GET_ALL_PENDING);
    return result.recordset;
  }

  static async confirm(id) {
    const pool = await poolPromise;
    await pool.request().input("id", sql.Int, id).query(queries.CONFIRM_ORDER);
  }
}

module.exports = PublisherOrderModel;
