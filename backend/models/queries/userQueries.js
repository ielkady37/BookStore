const userQueries = {
  // Selects
  FIND_BY_EMAIL: `
    SELECT * FROM users 
    WHERE email = ?
  `,

  FIND_BY_USERNAME: `
    SELECT * FROM users 
    WHERE username = ?
  `,

  FIND_BY_ID: `
    SELECT user_id, username, first_name, last_name, email, phone, shipping_address, role 
    FROM users 
    WHERE user_id = ?
  `,

  // Inserts
  CREATE_USER: `
    INSERT INTO users (username, password_hash, first_name, last_name, email, phone, shipping_address, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  UPDATE_USER: `UPDATE users SET first_name=?, last_name=?, phone=?, shipping_address=? WHERE user_id=?`,
};

module.exports = userQueries;
