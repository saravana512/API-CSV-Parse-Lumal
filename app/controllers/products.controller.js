'use strict';

const fs = require('node:fs');
const { parse } = require('csv-parse');
const moment = require('moment');

const pool = require('../../database/db');
const products = require('../models/product.model');
const { logger } = require('../../config/logger');

exports.importproducts = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip} 'Importing products req received'` });

		if (!req.file) {
			logger.warn({ requestId: req.id, message: 'No file uploaded' });
			return res.status(400).send('No file uploaded');
		}

		logger.info({ requestId: req.id, message: `File upload started: ${req.file.path}` });
		processCSV(req.file.path, req.id);
		res.send('File uploaded and processing started');
	} catch (error) {
		logger.error({ requestId: req.id, message: `Error in importproducts: ${error.message}` });
		next(error);
	}
};

const processCSV = async (filePath, requestId) => {
	try {
		const batchSize = 5;
		const results = [];
		logger.info({ requestId, message: 'Database connection established' });

		const productList = new Map();
		const customerList = new Map();
		const productsDbList = products.listAllProducts();
		const customersDbList = products.listAllCustomers();

		const [pDbList, cDbList] = await Promise.all([productsDbList, customersDbList]);

		pDbList.forEach(element => {
			productList.set(element.product_id, element);
		});

		cDbList.forEach(element => {
			customerList.set(element.customer_id, element);
		});

		pDbList.length = 0;
		cDbList.length = 0;

		fs.createReadStream(filePath)
			.pipe(
				parse({
					columns: true,
					skip_empty_lines: true,
					trim: true
				})
			)
			.on('error', error => {
				logger.error({ requestId, message: `Error reading CSV file: ${error.message}` });
			})
			.on('open', () => {
				logger.info({ requestId, message: `CSV file opened: ${filePath}` });
			})
			.on('close', async () => {
				logger.info({ requestId, message: `CSV file closed: ${filePath}` });
				await fs.promises.unlink(filePath);
				logger.info({ requestId, message: `CSV file deleted: ${filePath}` });
			})
			.on('data', async row => {
				try {
					logger.info({ requestId, message: `Inserting batch of ${batchSize} products` });

					const {
						'Order ID': orderId,
						'Product ID': productId,
						'Customer ID': customerId,
						'Product Name': productName,
						Category: category,
						Region: region,
						'Date of Sale': dateOfSale,
						'Quantity Sold': quantitySold,
						'Unit Price': unitPrice,
						Discount: discount,
						'Shipping Cost': shippingCost,
						'Payment Method': paymentMethod,
						'Customer Name': customerName,
						'Customer Email': customerEmail,
						'Customer Address': customerAddress
					} = row;

					// file_order_id TEXT,
					// customer_id UUID,
					// date_of_sale DATE,
					// payment_method TEXT,
					// total_amount NUMERIC(10,2)

					if (customerList.has(customerId)) {
						const date = moment(dateOfSale, 'DD/MM/YYYY').format('YYYY-MM-DD');
						results.push([orderId, customerId, date, paymentMethod, unitPrice]);
						if (results.length === batchSize) {
							logger.info({ requestId, message: `Inserting batch of ${results.length} products` });
							await products.insertOrders(results);
							results.length = 0;
						}
					}

					logger.info({ requestId, message: 'Batch inserted successfully' });
				} catch (error) {
					logger.error({ requestId, message: `Error inserting batch: ${error.message}` });
				}
			})
			.on('end', async () => {
				if (results.length > 0) {
					try {
						logger.info({ requestId, message: `Inserting final batch of ${results.length} products` });
						// await products.insertProducts(client, results);
						logger.info({ requestId, message: 'Final batch inserted successfully' });
					} catch (error) {
						logger.error({ requestId, message: `Error inserting final batch: ${error.message}` });
					}
				}
				logger.info({ requestId, message: 'CSV file processing completed' });
			});
	} catch (error) {
		logger.error({ requestId, message: `Error processing CSV: ${error.message}` });
	} finally {
		logger.info({ requestId, message: 'Database connection released' });
	}
};
