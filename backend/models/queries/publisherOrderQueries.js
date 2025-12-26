const publisherOrderQueries = {
  GET_ALL_PENDING: `
    SELECT 
      po.order_id,
      po.order_date,
      po.status,
      p.name as publisher_name,
      poi.isbn,
      poi.quantity,
      b.title as book_title
    FROM publisher_orders po
    JOIN publisher p ON po.publisher_id = p.publisher_id
    JOIN publisher_order_items poi ON po.order_id = poi.order_id
    JOIN books b ON poi.isbn = b.isbn
    WHERE po.status = 'PENDING'
    ORDER BY po.order_date DESC
  `,

  GET_ALL_ORDERS: `
    SELECT 
      po.order_id,
      po.order_date,
      po.status,
      p.name as publisher_name,
      poi.isbn,
      poi.quantity,
      b.title as book_title
    FROM publisher_orders po
    JOIN publisher p ON po.publisher_id = p.publisher_id
    JOIN publisher_order_items poi ON po.order_id = poi.order_id
    JOIN books b ON poi.isbn = b.isbn
    ORDER BY po.order_date DESC
  `,

  CONFIRM_ORDER: `
    UPDATE publisher_orders 
    SET status = 'CONFIRMED' 
    WHERE order_id = ?
  `,

  GET_ORDER_ITEMS: `
    SELECT poi.*, b.title
    FROM publisher_order_items poi
    JOIN books b ON poi.isbn = b.isbn
    WHERE poi.order_id = ?
  `,

  UPDATE_STOCK_ON_CONFIRM: `
    UPDATE stock s
    JOIN publisher_order_items poi ON s.isbn = poi.isbn
    SET s.quantity = s.quantity + poi.quantity
    WHERE poi.order_id = ?
  `,

  CREATE_ORDER: `
    INSERT INTO publisher_orders (publisher_id, order_date, status)
    VALUES (?, CURDATE(), 'PENDING')
  `,

  CREATE_ORDER_ITEM: `
    INSERT INTO publisher_order_items (order_id, isbn, quantity)
    VALUES (?, ?, ?)
  `,

  GET_BOOK_PUBLISHER: `
    SELECT publisher_id FROM books WHERE isbn = ?
  `,
};

module.exports = publisherOrderQueries;
