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
    INSERT INTO users (username, password_hash, is_online, last_activity, first_name, last_name, email, phone, shipping_address, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  SET_OFFLINE: `
    UPDATE users 
    SET is_online = FALSE, last_activity = ? 
    WHERE user_id = ?
  `,

  SET_ONLINE: `
    UPDATE users 
    SET is_online = TRUE 
    WHERE user_id = ?
  `,

  UPDATE_USER: `UPDATE users SET first_name=?, last_name=?, phone=?, shipping_address=? WHERE user_id=?`,
};

module.exports = userQueries;
