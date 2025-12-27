const reportQueries = {
  // Total sales for previous month
  GET_SALES_LAST_MONTH: `
    SELECT IFNULL(SUM(total_price), 0) as total_sales
    FROM customer_order
    WHERE order_date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
      AND order_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
  `,

  // Total sales for a certain day
  GET_SALES_BY_DATE: `
    SELECT IFNULL(SUM(total_price), 0) as total_sales
    FROM customer_order
    WHERE DATE(order_date) = ?
  `,

  // Top 5 Customers (Last 3 Months)
  GET_TOP_CUSTOMERS: `
    SELECT 
      U.username, 
      U.email, 
      COUNT(O.order_id) as orders_count,
      SUM(O.total_price) as total_spent
    FROM users U
    JOIN customer_order O ON U.user_id = O.user_id
    WHERE O.order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
    GROUP BY U.user_id, U.username, U.email
    ORDER BY total_spent DESC
    LIMIT 5
  `,

  // Top 10 Selling Books (Last 3 Months)
  GET_TOP_SELLING_BOOKS: `
    SELECT 
      B.title, 
      B.isbn,
      SUM(OI.quantity) as total_copies_sold
    FROM books B
    JOIN customer_order_items OI ON B.isbn = OI.isbn
    JOIN customer_order O ON OI.order_id = O.order_id
    WHERE O.order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
    GROUP BY B.isbn, B.title
    ORDER BY total_copies_sold DESC
    LIMIT 10
  `,

  // Restock Frequency
  GET_RESTOCK_COUNT: `
    SELECT 
      B.title,
      B.isbn,
      COUNT(POI.order_id) as restock_count,
      IFNULL(SUM(POI.quantity), 0) as total_quantity_restocked
    FROM books B
    LEFT JOIN publisher_order_items POI ON B.isbn = POI.isbn
    GROUP BY B.isbn, B.title
    HAVING restock_count > 0
    ORDER BY restock_count DESC
  `,
};

module.exports = reportQueries;
