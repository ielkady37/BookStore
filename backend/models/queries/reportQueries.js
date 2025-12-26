const reportQueries = {
  // a) Total sales for previous month
  GET_SALES_LAST_MONTH: `
    SELECT ISNULL(SUM(total_amount), 0) as total_sales
    FROM Orders
    WHERE order_date >= DATEADD(month, DATEDIFF(month, 0, GETDATE()) - 1, 0)
      AND order_date < DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)
  `,

  // b) Total sales for a certain day
  GET_SALES_BY_DATE: `
    SELECT ISNULL(SUM(total_amount), 0) as total_sales
    FROM Orders
    WHERE CAST(order_date AS DATE) = @date
  `,

  // c) Top 5 Customers (Last 3 Months)
  GET_TOP_CUSTOMERS: `
    SELECT TOP 5 
      U.username, 
      U.email, 
      SUM(O.total_amount) as total_spent
    FROM Users U
    JOIN Orders O ON U.user_id = O.user_id
    WHERE O.order_date >= DATEADD(month, -3, GETDATE())
    GROUP BY U.user_id, U.username, U.email
    ORDER BY total_spent DESC
  `,

  // d) Top 10 Selling Books (Last 3 Months)
  GET_TOP_SELLING_BOOKS: `
    SELECT TOP 10 
      B.title, 
      SUM(OI.quantity) as total_copies_sold
    FROM Books B
    JOIN Order_Items OI ON B.isbn = OI.isbn
    JOIN Orders O ON OI.order_id = O.order_id
    WHERE O.order_date >= DATEADD(month, -3, GETDATE())
    GROUP BY B.isbn, B.title
    ORDER BY total_copies_sold DESC
  `,

  // e) Restock Frequency
  // Counts how many times we placed an order to a publisher for this book
  GET_RESTOCK_COUNT: `
    SELECT 
      B.title,
      COUNT(PO.pub_order_id) as restock_count
    FROM Books B
    LEFT JOIN Publisher_Orders PO ON B.isbn = PO.isbn
    WHERE (@isbn IS NULL OR B.isbn = @isbn)
    GROUP BY B.isbn, B.title
    ORDER BY restock_count DESC
  `,
};

module.exports = reportQueries;
