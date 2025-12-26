const publisherOrderQueries = {
  GET_ALL_PENDING: `
    SELECT * FROM Publisher_Orders 
    WHERE status = 'Ordered'
    ORDER BY order_date DESC
  `,

  CONFIRM_ORDER: `
    UPDATE Publisher_Orders 
    SET status = 'Received' 
    WHERE pub_order_id = @id
  `,
};

module.exports = publisherOrderQueries;
