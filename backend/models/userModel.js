const pool = require("../config/db");
const queries = require("./queries/userQueries");

class UserModel {
  static async findByEmail(email) {
    const [rows] = await pool.query(queries.FIND_BY_EMAIL, [email]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.query(queries.FIND_BY_USERNAME, [username]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(queries.FIND_BY_ID, [id]);
    return rows[0];
  }

  static async create(userData) {
    const { username, password, first_name, last_name, email, phone, shipping_address, role } =
      userData;

    const [result] = await pool.query(queries.CREATE_USER, [
      username,
      password,
      first_name || null,
      last_name || null,
      email,
      phone || null,
      shipping_address || null,
      role || "CUSTOMER",
    ]);

    // Return the created user
    const [rows] = await pool.query(queries.FIND_BY_ID, [result.insertId]);
    return rows[0];
  }

  static async update(id, userData) {
    const { first_name, last_name, phone, shipping_address } = userData;
    await pool.query(queries.UPDATE_USER, [first_name, last_name, phone, shipping_address, id]);
    return await this.findById(id);
  }
}

module.exports = UserModel;
