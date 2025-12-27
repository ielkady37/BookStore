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
    ROW_NUMBER() OVER (
        PARTITION BY o.user_id
        ORDER BY o.order_date
    ) AS order_number,
    o.order_date,
    b.isbn,
    b.title AS book_name,
    o.total_price
    FROM CUSTOMER_ORDERS o
    JOIN CUSTOMER_ORDER_ITEMS oi
        ON o.order_id = oi.order_id
    JOIN BOOKS b
        ON oi.isbn = b.isbn
    ORDER BY o.user_id, order_number;
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
