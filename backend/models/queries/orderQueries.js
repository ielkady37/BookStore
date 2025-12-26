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

  GET_USER_ORDERS: `
    SELECT 
      O.order_id, O.order_date, O.total_price,
      COUNT(OI.isbn) as total_items
    FROM customer_order O
    LEFT JOIN customer_order_items OI ON O.order_id = OI.order_id
    WHERE O.user_id = ?
    GROUP BY O.order_id, O.order_date, O.total_price
    ORDER BY O.order_date DESC
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
