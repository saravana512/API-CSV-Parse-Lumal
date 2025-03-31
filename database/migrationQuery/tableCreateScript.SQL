DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN 
        CREATE EXTENSION "uuid-ossp"; 
    END IF; 
END $$;

CREATE TABLE IF NOT EXISTS products (
    product_id UUID DEFAULT UUID_GENERATE_V4() PRIMARY KEY,
    product_name TEXT,
    category TEXT
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID DEFAULT UUID_GENERATE_V4() PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    customer_address TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    order_id UUID DEFAULT UUID_GENERATE_V4() PRIMARY KEY,
    file_order_id TEXT,
    customer_id UUID,
    date_of_sale DATE,
    payment_method TEXT,
    total_amount NUMERIC(10,2),
    CONSTRAINT FK_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id UUID,
    product_id UUID,
    quantity_sold INT,
    unit_price NUMERIC(10,2),
    discount NUMERIC(5,2),
    shipping_cost NUMERIC(10,2),
    CONSTRAINT FK_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);


-- - **Order ID:** (Unique identifier)
-- - **Product ID:** (Unique identifier)
-- - **Customer ID:** (Unique identifier)
-- - **Product Name:**
-- - **Category:**
-- - **Region:**
-- - **Date of Sale:**
-- - **Quantity Sold:**
-- - **Unit Price:**
-- - **Discount:**
-- - **Shipping Cost:**
-- - **Payment Method:**
-- - **Customer Name:**
-- - **Customer Email:**
-- - **Customer Address:**
-- - **(Other relevant fields):** (e.g., product descriptions, customer demographics, marketing campaign details)