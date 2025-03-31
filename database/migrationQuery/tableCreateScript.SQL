CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR PRIMARY KEY,
    product_name TEXT,
    category TEXT
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    customer_address TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR PRIMARY KEY,
    customer_id VARCHAR,
    date_of_sale DATE,
    payment_method TEXT,
    total_amount NUMERIC(10,2),
    CONSTRAINT FK_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id VARCHAR,
    product_id VARCHAR,
    quantity_sold INT,
    unit_price NUMERIC(10,2),
    discount NUMERIC(5,2),
    shipping_cost NUMERIC(10,2),
    CONSTRAINT FK_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);