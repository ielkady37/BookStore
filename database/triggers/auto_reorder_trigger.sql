-- ============================================================================
-- AUTO REORDER TRIGGER FOR STOCK MANAGEMENT
-- ============================================================================
-- This trigger automatically creates a publisher order when a book's stock
-- quantity drops BELOW its threshold. It only fires when:
--   1. The OLD quantity was >= threshold (was in stock)
--   2. The NEW quantity is < threshold (now below minimum)
-- This prevents duplicate orders from being created on subsequent updates
-- while the stock is still below threshold.
-- ============================================================================

USE bookstore;

-- Set delimiter for trigger creation
DELIMITER //

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_auto_reorder_stock //

-- Create the auto-reorder trigger
CREATE TRIGGER trg_auto_reorder_stock
AFTER UPDATE ON stock
FOR EACH ROW
BEGIN
    -- Constant: Fixed reorder quantity for automatic orders
    DECLARE REORDER_QTY INT DEFAULT 50;
    
    -- Variables to store publisher and order info
    DECLARE v_publisher_id INT;
    DECLARE v_new_order_id INT;
    DECLARE v_pending_order_exists INT DEFAULT 0;
    
    -- ========================================================================
    -- THRESHOLD CROSSING DETECTION:
    -- Only trigger when stock transitions from ABOVE threshold to BELOW
    -- OLD.quantity >= OLD.threshold means it WAS in acceptable range
    -- NEW.quantity < NEW.threshold means it's NOW below minimum
    -- This ensures the order is placed only ONCE per crossing event
    -- ========================================================================
    IF OLD.quantity >= OLD.threshold AND NEW.quantity < NEW.threshold THEN
        
        -- Get the publisher_id for this book
        SELECT publisher_id INTO v_publisher_id 
        FROM books 
        WHERE isbn = NEW.isbn;
        
        -- ====================================================================
        -- IDEMPOTENCY CHECK:
        -- Check if there's already a PENDING publisher order for this book
        -- to prevent duplicate auto-reorders if the trigger fires multiple
        -- times before the order is confirmed/restocked
        -- ====================================================================
        SELECT COUNT(*) INTO v_pending_order_exists
        FROM publisher_orders po
        JOIN publisher_order_items poi ON po.order_id = poi.order_id
        WHERE poi.isbn = NEW.isbn 
          AND po.status = 'PENDING';
        
        -- Only create a new order if no pending order exists for this book
        IF v_pending_order_exists = 0 AND v_publisher_id IS NOT NULL THEN
            
            -- ================================================================
            -- CREATE PUBLISHER ORDER:
            -- Insert a new order to the book's publisher with PENDING status
            -- ================================================================
            INSERT INTO publisher_orders (publisher_id, order_date, status)
            VALUES (v_publisher_id, CURDATE(), 'PENDING');
            
            -- Get the newly created order ID
            SET v_new_order_id = LAST_INSERT_ID();
            
            -- ================================================================
            -- CREATE ORDER ITEM:
            -- Add the book to the order with the fixed reorder quantity
            -- ================================================================
            INSERT INTO publisher_order_items (order_id, isbn, quantity)
            VALUES (v_new_order_id, NEW.isbn, REORDER_QTY);
            
        END IF;
        
    END IF;
    
END //

-- Reset delimiter
DELIMITER ;

-- ============================================================================
-- VERIFICATION: Show trigger was created
-- ============================================================================
SHOW TRIGGERS LIKE 'stock';
