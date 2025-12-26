const reportQueries = {
  // a) Total sales for previous month
  GET_SALES_LAST_MONTH: `
    SELECT IFNULL(SUM(total_price), 0) as total_sales
    FROM customer_order
    WHERE order_date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
      AND order_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
  `,

  // b) Total sales for a certain day
  GET_SALES_BY_DATE: `
    SELECT IFNULL(SUM(total_price), 0) as total_sales
    FROM customer_order
    WHERE DATE(order_date) = ?
  `,

  // c) Top 5 Customers (Last 3 Months)
  GET_TOP_CUSTOMERS: `
    SELECT 
      U.username, 
      U.email, 
      SUM(O.total_price) as total_spent
    FROM users U
    JOIN customer_order O ON U.user_id = O.user_id
    WHERE O.order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
    GROUP BY U.user_id, U.username, U.email
    ORDER BY total_spent DESC
    LIMIT 5
  `,

  // d) Top 10 Selling Books (Last 3 Months)
  GET_TOP_SELLING_BOOKS: `
    SELECT 
      B.title, 
      SUM(OI.quantity) as total_copies_sold
    FROM books B
    JOIN customer_order_items OI ON B.isbn = OI.isbn
    JOIN customer_order O ON OI.order_id = O.order_id
    WHERE O.order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
    GROUP BY B.isbn, B.title
    ORDER BY total_copies_sold DESC
    LIMIT 10
  `,

  // e) Restock Frequency
  // Counts how many times we placed an order to a publisher for this book
  GET_RESTOCK_COUNT: `
    SELECT 
      B.title,
      COUNT(POI.order_id) as restock_count
    FROM books B
    LEFT JOIN publisher_order_items POI ON B.isbn = POI.isbn
    WHERE (? IS NULL OR B.isbn = ?)
    GROUP BY B.isbn, B.title
    ORDER BY restock_count DESC
  `,
};

module.exports = reportQueries;
