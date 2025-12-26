const orderQueries = {
  CREATE_ORDER: `
    INSERT INTO Orders (user_id, order_date, total_amount, status)
    OUTPUT INSERTED.order_id
    VALUES (@user_id, GETDATE(), @total, 'Completed')
  `,

  CREATE_ORDER_ITEM: `
    INSERT INTO Order_Items (order_id, isbn, quantity, unit_price)
    VALUES (@order_id, @isbn, @quantity, @price)
  `,

  DEDUCT_STOCK: `
    UPDATE Books 
    SET stock_quantity = stock_quantity - @qty 
    WHERE isbn = @isbn
  `,

  GET_USER_ORDERS: `
    SELECT 
      O.order_id, O.order_date, O.total_amount, O.status,
      COUNT(OI.isbn) as total_items
    FROM Orders O
    LEFT JOIN Order_Items OI ON O.order_id = OI.order_id
    WHERE O.user_id = @user_id
    GROUP BY O.order_id, O.order_date, O.total_amount, O.status
    ORDER BY O.order_date DESC
  `,

  GET_ORDER_DETAILS: `
    SELECT 
      OI.isbn, B.title, OI.quantity, OI.unit_price, 
      (OI.quantity * OI.unit_price) as subtotal
    FROM Order_Items OI
    JOIN Books B ON OI.isbn = B.isbn
    WHERE OI.order_id = @order_id
  `,
};

module.exports = orderQueries;
