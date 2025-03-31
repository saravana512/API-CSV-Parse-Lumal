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
	// file_order_id TEXT,
	// customer_id UUID,
	// date_of_sale DATE,
	// payment_method TEXT,
	// total_amount NUMERIC(10,2)
	const formatQuery = format('INSERT INTO orders (file_order_id, customer_id, date_of_sale,  payment_method, total_amount) VALUES %L', orderList);
	return await pool.query(formatQuery);
};
