const userQueries = {
  // Selects
  FIND_BY_EMAIL: `
    SELECT * FROM Users 
    WHERE email = @email
  `,

  FIND_BY_ID: `
    SELECT user_id, username, fname, lname, email, phone, address, role, credit_card 
    FROM Users 
    WHERE user_id = @id
  `,

  // Inserts
  CREATE_USER: `
    INSERT INTO Users (username, password, fname, lname, email, phone, address, role)
    OUTPUT INSERTED.user_id, INSERTED.username, INSERTED.email, INSERTED.role
    VALUES (@username, @password, @fname, @lname, @email, @phone, @address, @role)
  `,

  UPDATE_USER: `UPDATE Users SET fname=@fname, lname=@lname, phone=@phone, address=@address WHERE user_id=@id`,
};

module.exports = userQueries;
