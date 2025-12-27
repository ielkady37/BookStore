const orderQueries = {
  CREATE_ORDER: `
    INSERT INTO customer_order (user_id, order_date, total_price)
    VALUES (?, NOW(), ?)
  `,

  CREATE_ORDER_ITEM: `
    INSERT INTO customer_order_items (order_id, isbn, quantity, price)
    VALUES (?, ?, ?, ?)
  `,

  DEDUCT_STOCK: `
    UPDATE stock 
    SET quantity = quantity - ? 
    WHERE isbn = ?
  `,

  GET_USER_ORDERS_WITH_ITEMS: `
    SELECT 
      o.order_id, 
      o.order_date, 
      o.total_price, 
      o.user_id,
      oi.isbn, 
      oi.quantity, 
      oi.price as item_price,
      b.title as book_title
    FROM customer_order o
    JOIN customer_order_items oi ON o.order_id = oi.order_id
    JOIN books b ON oi.isbn = b.isbn
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `,

  GET_ORDER_DETAILS: `
    SELECT 
      OI.isbn, B.title, OI.quantity, OI.price, 
      (OI.quantity * OI.price) as subtotal
    FROM customer_order_items OI
    JOIN books B ON OI.isbn = B.isbn
    WHERE OI.order_id = ?
  `,

  CREATE_PAYMENT: `
    INSERT INTO payments (order_id, credit_card_number, expiry_date, payment_status)
    VALUES (?, ?, ?, ?)
  `,
};

module.exports = orderQueries;
