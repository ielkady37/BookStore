const bookQueries = {
  GET_ALL_BOOKS: `
    SELECT 
      B.isbn, B.title, B.publication_year, B.selling_price, B.category, 
      B.stock_quantity, B.threshold,
      P.name AS publisher_name,
      STRING_AGG(A.name, ', ') AS authors
    FROM Books B
    JOIN Publishers P ON B.publisher_id = P.publisher_id
    LEFT JOIN Book_Authors BA ON B.isbn = BA.isbn
    LEFT JOIN Authors A ON BA.author_id = A.author_id
    WHERE 
      (@isbn IS NULL OR B.isbn LIKE '%' + @isbn + '%') AND
      (@title IS NULL OR B.title LIKE '%' + @title + '%') AND
      (@category IS NULL OR B.category = @category) AND
      (@publisher IS NULL OR P.name LIKE '%' + @publisher + '%') AND
      (@author IS NULL OR A.name LIKE '%' + @author + '%')
    GROUP BY 
      B.isbn, B.title, B.publication_year, B.selling_price, B.category, 
      B.stock_quantity, B.threshold, P.name
  `,

  FIND_PUBLISHER_BY_NAME: `SELECT publisher_id FROM Publishers WHERE name = @name`,

  FIND_AUTHOR_BY_NAME: `SELECT author_id FROM Authors WHERE name = @name`,

  INSERT_PUBLISHER: `
    INSERT INTO Publishers (name, address, phone) 
    OUTPUT INSERTED.publisher_id 
    VALUES (@name, 'Unknown Address', '0000000000')
  `,

  INSERT_AUTHOR: `
    INSERT INTO Authors (name) 
    OUTPUT INSERTED.author_id 
    VALUES (@name)
  `,

  INSERT_BOOK: `
    INSERT INTO Books (isbn, title, publisher_id, publication_year, selling_price, category, stock_quantity, threshold)
    VALUES (@isbn, @title, @pub_id, @year, @price, @category, @stock, @threshold)
  `,

  LINK_BOOK_AUTHOR: `
    INSERT INTO Book_Authors (isbn, author_id) 
    VALUES (@isbn, @author_id)
  `,

  UPDATE_BOOK: `UPDATE Books SET selling_price = @price, stock_quantity = @stock WHERE isbn = @isbn`,
};

module.exports = bookQueries;
