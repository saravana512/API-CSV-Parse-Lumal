const format = require('pg-format');
const pool = require('../../database/db');

exports.loadProducts = async () => {
	return 'Products Import';
};

exports.listAllProducts = async () => {
	return (await pool.query('SELECT * FROM products')).rows;
};

exports.listAllCustomers = async () => {
	return (await pool.query('SELECT * FROM customers')).rows;
};

exports.insertOrders = async orderList => {
	const formatQuery = format(
		`INSERT INTO orders (order_id, customer_id, date_of_sale, payment_method, total_amount) 
		 VALUES %L 
		 ON CONFLICT (order_id) 
		 DO UPDATE SET 
		 customer_id = EXCLUDED.customer_id, 
		 date_of_sale = EXCLUDED.date_of_sale, 
		 payment_method = EXCLUDED.payment_method, 
		 total_amount = EXCLUDED.total_amount`,
		orderList
	);
	return await pool.query(formatQuery);
};

exports.insertOrdersItems = async orderItemsList => {
	const formatQuery = format(
		`INSERT INTO order_items (order_id, product_id, quantity_sold, unit_price, discount, shipping_cost) 
		 VALUES %L`,
		orderItemsList
	);
	return await pool.query(formatQuery);
};
