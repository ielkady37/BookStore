const cartQueries = {
  // Get or create cart for user
  GET_CART: `
    SELECT cart_id FROM cart WHERE user_id = ?
  `,

  CREATE_CART: `
    INSERT INTO cart (user_id) VALUES (?)
  `,

  // Get all items in user's cart with book details
  GET_CART_ITEMS: `
    SELECT 
      ci.isbn, ci.quantity,
      b.title, b.price AS selling_price, b.publication_year,
      c.name AS category,
      p.name AS publisher_name,
      s.quantity AS stock_quantity, s.threshold,
      GROUP_CONCAT(a.name SEPARATOR ', ') AS authors
    FROM cart_items ci
    JOIN cart ca ON ci.cart_id = ca.cart_id
    JOIN books b ON ci.isbn = b.isbn
    JOIN categories c ON b.category_id = c.category_id
    JOIN publisher p ON b.publisher_id = p.publisher_id
    LEFT JOIN stock s ON b.isbn = s.isbn
    LEFT JOIN book_authors ba ON b.isbn = ba.isbn
    LEFT JOIN authors a ON ba.author_id = a.author_id
    WHERE ca.user_id = ?
    GROUP BY ci.isbn, ci.quantity, b.title, b.price, b.publication_year, 
             c.name, p.name, s.quantity, s.threshold
  `,

  // Add item to cart (or update if exists)
  GET_CART_ITEM: `
    SELECT quantity FROM cart_items WHERE cart_id = ? AND isbn = ?
  `,

  ADD_CART_ITEM: `
    INSERT INTO cart_items (cart_id, isbn, quantity) VALUES (?, ?, ?)
  `,

  UPDATE_CART_ITEM: `
    UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND isbn = ?
  `,

  REMOVE_CART_ITEM: `
    DELETE FROM cart_items WHERE cart_id = ? AND isbn = ?
  `,

  CLEAR_CART: `
    DELETE FROM cart_items WHERE cart_id = ?
  `,
};

module.exports = cartQueries;
