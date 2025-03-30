'use strict';

const products = require('../models/product.model');

exports.importproducts = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).send('No file uploaded');
		}
		processCSV(req.file.path);
		res.send('File uploaded and processing started');
	} catch (error) {
		next(error);
	}
};

const processCSV = async filePath => {
	const client = await pool.connect();
	const queryText = `INSERT INTO orders (order_id, customer_id, date_of_sale, payment_method, total_amount)
                        VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING;`;
	try {
		const results = [];
		fs.createReadStream(filePath)
			.pipe(csvParser())
			.on('data', async row => {
				results.push(row);
				await client.query(queryText, [row['Order ID'], row['Customer ID'], row['Date of Sale'], row['Payment Method'], row['Quantity Sold'] * row['Unit Price'] * (1 - row['Discount'])]);
			})
			.on('end', () => {
				console.log('CSV file processed');
			});
	} catch (error) {
		console.error('Error processing CSV:', error);
	} finally {
		client.release();
	}
};
