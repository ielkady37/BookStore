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
    name VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(20)
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
