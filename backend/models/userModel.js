const { sql, poolPromise } = require("../config/db");
const queries = require("./queries/userQueries");

class UserModel {
  static async findByEmail(email) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(queries.FIND_BY_EMAIL);

    return result.recordset[0];
  }

  static async findById(id) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(queries.FIND_BY_ID);

    return result.recordset[0];
  }

  static async create(userData) {
    const pool = await poolPromise;
    const { username, password, fname, lname, email, phone, address, role } =
      userData;

    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .input("fname", sql.NVarChar, fname)
      .input("lname", sql.NVarChar, lname)
      .input("email", sql.NVarChar, email)
      .input("phone", sql.NVarChar, phone)
      .input("address", sql.NVarChar, address)
      .input("role", sql.NVarChar, role || "customer")
      .query(queries.CREATE_USER);

    return result.recordset[0];
  }
}

module.exports = UserModel;
