-- Migration: Add Auto-Reorder Trigger
-- This migration adds a database trigger that automatically creates
-- publisher orders when book stock drops below threshold

-- ============================================================================
-- AUTO REORDER TRIGGER FOR STOCK MANAGEMENT
-- ============================================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_auto_reorder_stock;

-- Create the auto-reorder trigger
DELIMITER //

CREATE TRIGGER trg_auto_reorder_stock
AFTER UPDATE ON stock
FOR EACH ROW
BEGIN
    -- Constant: Fixed reorder quantity for automatic orders
    DECLARE REORDER_QTY INT DEFAULT 50;
    
    -- Variables
    DECLARE v_publisher_id INT;
    DECLARE v_new_order_id INT;
    DECLARE v_pending_order_exists INT DEFAULT 0;
    
    -- THRESHOLD CROSSING DETECTION:
    -- Only trigger when stock transitions from ABOVE threshold to BELOW
    IF OLD.quantity >= OLD.threshold AND NEW.quantity < NEW.threshold THEN
        
        -- Get the publisher_id for this book
        SELECT publisher_id INTO v_publisher_id 
        FROM books 
        WHERE isbn = NEW.isbn;
        
        -- IDEMPOTENCY CHECK: Prevent duplicate orders
        SELECT COUNT(*) INTO v_pending_order_exists
        FROM publisher_orders po
        JOIN publisher_order_items poi ON po.order_id = poi.order_id
        WHERE poi.isbn = NEW.isbn 
          AND po.status = 'PENDING';
        
        -- Only create order if no pending order exists
        IF v_pending_order_exists = 0 AND v_publisher_id IS NOT NULL THEN
            
            -- Create publisher order
            INSERT INTO publisher_orders (publisher_id, order_date, status)
            VALUES (v_publisher_id, CURDATE(), 'PENDING');
            
            SET v_new_order_id = LAST_INSERT_ID();
            
            -- Add book to order
            INSERT INTO publisher_order_items (order_id, isbn, quantity)
            VALUES (v_new_order_id, NEW.isbn, REORDER_QTY);
            
        END IF;
        
    END IF;
    
END //

DELIMITER ;
