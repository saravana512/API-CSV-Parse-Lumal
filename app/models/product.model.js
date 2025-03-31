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

exports.revenueCalculation = async (start_date, end_date) => {
	const totalRevenueQuery = `
        SELECT SUM(total_price) AS total_revenue
        FROM orders
        WHERE order_date BETWEEN $1 AND $2
    `;

	const revenueByProductQuery = `
        SELECT product_name, SUM(total_price) AS total_revenue
        FROM orders
        WHERE order_date BETWEEN $1 AND $2
        GROUP BY product_name
    `;

	const revenueByCategoryQuery = `
        SELECT category, SUM(total_price) AS total_revenue
        FROM orders
        WHERE order_date BETWEEN $1 AND $2
        GROUP BY category
    `;

	const [totalRevenueResult, revenueByProductResult, revenueByCategoryResult] = await Promise.all([
		pool.query(totalRevenueQuery, [start_date, end_date]),
		pool.query(revenueByProductQuery, [start_date, end_date]),
		pool.query(revenueByCategoryQuery, [start_date, end_date])
	]);

	const total_revenue = totalRevenueResult.rows[0]?.total_revenue || 0;

	return {
		total_revenue,
		revenue_by_product: revenueByProductResult.rows,
		revenue_by_category: revenueByCategoryResult.rows
	};
};

exports.topProducts = async (start_date, end_date, limit) => {
	const topProductsQuery = `
    SELECT product_name, SUM(quantity) AS total_sold
    FROM orders
    WHERE order_date BETWEEN $1 AND $2
    GROUP BY product_name
    ORDER BY total_sold DESC
    LIMIT $3
    `;

	const topProductsByCategoryQuery = `
    SELECT category, product_name, SUM(quantity) AS total_sold
    FROM orders
    WHERE order_date BETWEEN $1 AND $2
    GROUP BY category, product_name
    ORDER BY category, total_sold DESC
    `;

	const topProductsByRegionQuery = `
    SELECT region, product_name, SUM(quantity) AS total_sold
    FROM orders
    WHERE order_date BETWEEN $1 AND $2
    GROUP BY region, product_name
    ORDER BY region, total_sold DESC
    `;

	const [topProductsResult, topProductsByCategoryResult, topProductsByRegionResult] = await Promise.all([
		pool.query(topProductsQuery, [start_date, end_date, limit]),
		pool.query(topProductsByCategoryQuery, [start_date, end_date]),
		pool.query(topProductsByRegionQuery, [start_date, end_date])
	]);

	return {
		top_products_overall: topProductsResult.rows,
		top_products_by_category: topProductsByCategoryResult.rows,
		top_products_by_region: topProductsByRegionResult.rows
	};
};

exports.customerAnalytics = async (start_date, end_date) => {
	const query = `
            SELECT 
                COUNT(DISTINCT customer_id) AS total_customers,
                COUNT(order_id) AS total_orders,
                AVG(total_price) AS avg_order_value
            FROM orders
            WHERE order_date BETWEEN $1 AND $2
        `;
	const { rows } = await pool.query(query, [start_date, end_date]);
	return rows;
};
