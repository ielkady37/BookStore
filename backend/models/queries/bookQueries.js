const bookQueries = {
  GET_ALL_BOOKS: `
    SELECT 
      B.isbn, B.title, B.publication_year, B.price AS selling_price, 
      C.name AS category,
      S.quantity AS stock_quantity, S.threshold,
      P.name AS publisher_name,
      GROUP_CONCAT(A.name SEPARATOR ', ') AS authors
    FROM books B
    JOIN publisher P ON B.publisher_id = P.publisher_id
    JOIN categories C ON B.category_id = C.category_id
    LEFT JOIN stock S ON B.isbn = S.isbn
    LEFT JOIN book_authors BA ON B.isbn = BA.isbn
    LEFT JOIN authors A ON BA.author_id = A.author_id
    WHERE 
      (? IS NULL OR B.isbn LIKE CONCAT('%', ?, '%')) AND
      (? IS NULL OR B.title LIKE CONCAT('%', ?, '%')) AND
      (? IS NULL OR C.name = ?) AND
      (? IS NULL OR P.name LIKE CONCAT('%', ?, '%')) AND
      (? IS NULL OR A.name LIKE CONCAT('%', ?, '%'))
    GROUP BY 
      B.isbn, B.title, B.publication_year, B.price, 
      C.name, S.quantity, S.threshold, P.name
  `,

  FIND_PUBLISHER_BY_PHONE: `SELECT publisher_id FROM publisher WHERE phone = ?`,

  FIND_AUTHOR_BY_NAME: `SELECT author_id FROM authors WHERE name = ?`,

  INSERT_PUBLISHER: `
    INSERT INTO publisher (name, address, phone) 
    VALUES (?, ?, ?)
  `,

  INSERT_AUTHOR: `
    INSERT INTO authors (name) 
    VALUES (?)
  `,

  INSERT_BOOK: `
    INSERT INTO books (isbn, title, publisher_id, publication_year, price, category_id)
    VALUES (?, ?, ?, ?, ?, (SELECT category_id FROM categories WHERE name = ?))
  `,

  INSERT_STOCK: `
    INSERT INTO stock (isbn, quantity, threshold)
    VALUES (?, ?, ?)
  `,

  LINK_BOOK_AUTHOR: `
    INSERT INTO book_authors (isbn, author_id) 
    VALUES (?, ?)
  `,

  UPDATE_BOOK: `UPDATE books B JOIN stock S ON B.isbn = S.isbn SET B.price = ?, S.quantity = ? WHERE B.isbn = ?`,
};

module.exports = bookQueries;
