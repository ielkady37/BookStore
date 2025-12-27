CREATE DATABASE bookstore;
USE bookstore;

-- CATEGORIES
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO categories (name)
VALUES ('Science'), ('Art'), ('Religion'), ('History'), ('Geography');

-- USERS
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,                    
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PUBLISHERS
CREATE TABLE publisher (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20) UNIQUE
);

-- AUTHORS
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- BOOKS
CREATE TABLE books (
    isbn CHAR(13) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    publication_year YEAR,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    publisher_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- BOOK_AUTHORS
CREATE TABLE book_authors (
    isbn CHAR(13),
    author_id INT,
    PRIMARY KEY (isbn, author_id),
    FOREIGN KEY (isbn) REFERENCES books(isbn) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);

-- STOCK MANAGEMENT
CREATE TABLE stock (
    isbn CHAR(13) PRIMARY KEY,
    quantity INT NOT NULL CHECK (quantity >= 0),
    threshold INT NOT NULL CHECK (threshold >= 0),
    FOREIGN KEY (isbn) REFERENCES books(isbn) ON DELETE CASCADE
);

-- PUBLISHER ORDERS
CREATE TABLE publisher_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_id INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    status ENUM('PENDING', 'CONFIRMED') DEFAULT 'PENDING',
    FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

CREATE TABLE publisher_order_items (
    order_id INT,
    isbn CHAR(13),
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (order_id, isbn),
    FOREIGN KEY (order_id) REFERENCES publisher_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES books(isbn)
);

-- SHOPPING CART
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    cart_id INT,
    isbn CHAR(13),
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (cart_id, isbn),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES books(isbn)
);

-- CUSTOMER ORDERS
CREATE TABLE customer_order (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE customer_order_items (
    order_id INT,
    isbn CHAR(13),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    PRIMARY KEY (order_id, isbn),
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES books(isbn)
);

-- PAYMENTS
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE,
    credit_card_number CHAR(16),
    expiry_date DATE,
    payment_status ENUM('SUCCESS', 'FAILED'),
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id)
);

-- Trigger for Shopping Cart Cleanup on Logout
DELIMITER //

CREATE TRIGGER trg_clear_cart_on_offline
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    DECLARE v_cart_id INT;
    
    IF OLD.is_online = TRUE AND NEW.is_online = FALSE THEN
        SELECT cart_id INTO v_cart_id 
        FROM cart 
        WHERE user_id = NEW.user_id;
        
        IF v_cart_id IS NOT NULL THEN
            DELETE FROM cart_items WHERE cart_id = v_cart_id;
        END IF;
    END IF;
END //

DELIMITER ;


-- Trigger to Prevent Negative Stock 
DELIMITER //

CREATE TRIGGER trg_prevent_negative_stock
BEFORE UPDATE ON stock
FOR EACH ROW
BEGIN
    IF NEW.quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot update stock to negative quantity';
    END IF;
END //

DELIMITER ;

-- Trigger for Order Confirmation 
DELIMITER //

CREATE TRIGGER trg_update_stock_on_order_confirmation
AFTER UPDATE ON publisher_orders
FOR EACH ROW
BEGIN
    IF OLD.status = 'PENDING' AND NEW.status = 'CONFIRMED' THEN
        UPDATE stock s
        JOIN publisher_order_items poi ON s.isbn = poi.isbn
        SET s.quantity = s.quantity + poi.quantity
        WHERE poi.order_id = NEW.order_id;
    END IF;
END //

DELIMITER ;

-- Trigger to Validate Book Insertion
DELIMITER //

CREATE TRIGGER trg_validate_new_book
BEFORE INSERT ON books
FOR EACH ROW
BEGIN
    -- Validate ISBN length (should be 13 characters)
    IF LENGTH(NEW.isbn) != 13 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ISBN must be exactly 13 characters';
    END IF;
    
    -- Validate publication year is not in the future
    IF NEW.publication_year > YEAR(CURDATE()) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Publication year cannot be in the future';
    END IF;
    
    -- Validate price is positive
    IF NEW.price <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Price must be greater than 0';
    END IF;
END //

DELIMITER ;

-- Trigger to Prevent Book Deletion if in Stock
DELIMITER //

CREATE TRIGGER trg_prevent_book_deletion
BEFORE DELETE ON books
FOR EACH ROW
BEGIN
    DECLARE stock_qty INT;
    
    -- Check if book has stock
    SELECT quantity INTO stock_qty
    FROM stock
    WHERE isbn = OLD.isbn;
    
    IF stock_qty > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete book with existing stock';
    END IF;
END //

DELIMITER ;

-- Trigger for Credit Card Validation 
DELIMITER //

CREATE TRIGGER trg_validate_credit_card
BEFORE INSERT ON payments
FOR EACH ROW
BEGIN
    -- Validate credit card number (16 digits)
    IF NEW.credit_card_number IS NOT NULL AND 
       (LENGTH(NEW.credit_card_number) != 16 OR 
        NEW.credit_card_number NOT REGEXP '^[0-9]+$') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid credit card number (must be 16 digits)';
    END IF;
    
    -- Validate expiry date is in the future
    IF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Credit card has expired';
    END IF;
END //

DELIMITER ;

-- Trigger for Automatic Stock Reordering
DELIMITER //

CREATE TRIGGER trg_auto_reorder_stock
AFTER UPDATE ON stock
FOR EACH ROW
BEGIN
    -- Fixed reorder quantity
    DECLARE REORDER_QTY INT DEFAULT 50;
    DECLARE v_publisher_id INT;
    DECLARE v_new_order_id INT;
    DECLARE v_pending_order_exists INT DEFAULT 0;
    
    -- Only trigger when crossing from ABOVE to BELOW threshold
    IF OLD.quantity >= OLD.threshold AND NEW.quantity < NEW.threshold THEN
        
        -- Get publisher for this book
        SELECT publisher_id INTO v_publisher_id 
        FROM books WHERE isbn = NEW.isbn;
        
        -- Check for existing pending order (idempotency)
        SELECT COUNT(*) INTO v_pending_order_exists
        FROM publisher_orders po
        JOIN publisher_order_items poi ON po.order_id = poi.order_id
        WHERE poi.isbn = NEW.isbn AND po.status = 'PENDING';
        
        -- Create order only if no pending order exists
        IF v_pending_order_exists = 0 AND v_publisher_id IS NOT NULL THEN
            INSERT INTO publisher_orders (publisher_id, order_date, status)
            VALUES (v_publisher_id, CURDATE(), 'PENDING');
            
            SET v_new_order_id = LAST_INSERT_ID();
            
            INSERT INTO publisher_order_items (order_id, isbn, quantity)
            VALUES (v_new_order_id, NEW.isbn, REORDER_QTY);
        END IF;
    END IF;
END //

DELIMITER ;
