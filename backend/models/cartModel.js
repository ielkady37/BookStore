const pool = require("../config/db");
const queries = require("./queries/cartQueries");

class CartModel {
  // Get or create cart for user
  static async getOrCreateCart(userId) {
    const [rows] = await pool.query(queries.GET_CART, [userId]);
    
    if (rows.length > 0) {
      return rows[0].cart_id;
    }

    // Create new cart
    const [result] = await pool.query(queries.CREATE_CART, [userId]);
    return result.insertId;
  }

  // Get all cart items for user
  static async getCartItems(userId) {
    const [rows] = await pool.query(queries.GET_CART_ITEMS, [userId]);
    return rows;
  }

  // Add item to cart
  static async addItem(userId, isbn, quantity = 1) {
    const cartId = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    const [existing] = await pool.query(queries.GET_CART_ITEM, [cartId, isbn]);

    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + quantity;
      await pool.query(queries.UPDATE_CART_ITEM, [newQuantity, cartId, isbn]);
    } else {
      // Insert new item
      await pool.query(queries.ADD_CART_ITEM, [cartId, isbn, quantity]);
    }

    return await this.getCartItems(userId);
  }

  // Update item quantity
  static async updateQuantity(userId, isbn, quantity) {
    const cartId = await this.getOrCreateCart(userId);

    if (quantity <= 0) {
      await pool.query(queries.REMOVE_CART_ITEM, [cartId, isbn]);
    } else {
      await pool.query(queries.UPDATE_CART_ITEM, [quantity, cartId, isbn]);
    }

    return await this.getCartItems(userId);
  }

  // Remove item from cart
  static async removeItem(userId, isbn) {
    const cartId = await this.getOrCreateCart(userId);
    await pool.query(queries.REMOVE_CART_ITEM, [cartId, isbn]);
    return await this.getCartItems(userId);
  }

  // Clear entire cart
  static async clearCart(userId) {
    const cartId = await this.getOrCreateCart(userId);
    await pool.query(queries.CLEAR_CART, [cartId]);
    return [];
  }
}

module.exports = CartModel;
