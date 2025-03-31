'use strict';

const fs = require('node:fs');
const { parse } = require('csv-parse');
const moment = require('moment');

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
		const orderItems = [];

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

		const stream = fs.createReadStream(filePath).pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
				trim: true
			})
		);

		stream
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
					stream.pause();

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

					if (customerList.has(customerId)) {
						const { customer_id, customer_name, customer_email, customer_address } = customerList.get(customerId);
						const { product_id, product_name, category: dbCategory } = productList.get(productId) || {};

						if (customer_id !== customerId) {
							logger.warn({ requestId, message: `Customer ID mismatch: ${customer_id} !== ${customerId}` });
						}
						if (customer_name !== customerName) {
							logger.warn({ requestId, message: `Customer Name mismatch: ${customer_name} !== ${customerName}` });
						}
						if (customer_email !== customerEmail) {
							logger.warn({ requestId, message: `Customer Email mismatch: ${customer_email} !== ${customerEmail}` });
						}
						if (customer_address !== customerAddress) {
							logger.warn({ requestId, message: `Customer Address mismatch: ${customer_address} !== ${customerAddress}` });
						}

						if (customer_id === customerId && customer_name === customerName && customer_email === customerEmail && customer_address === customerAddress) {
							const date = moment(dateOfSale, 'DD/MM/YYYY').format('YYYY-MM-DD');
							results.push([orderId, customerId, date, paymentMethod, unitPrice]);
							if (results.length === batchSize) {
								logger.info({ requestId, message: `Inserting batch of ${results.length} products` });
								await products.insertOrders(results);
								results.length = 0;
							}
						}

						if (product_id !== productId) {
							logger.warn({ requestId, message: `Product ID mismatch: ${product_id} !== ${productId}` });
						}
						if (product_name !== productName) {
							logger.warn({ requestId, message: `Product Name mismatch: ${product_name} !== ${productName}` });
						}
						if (dbCategory !== category) {
							logger.warn({ requestId, message: `Category mismatch: ${dbCategory} !== ${category}` });
						}

						console.log(orderId, productId === productId && productName === productName && dbCategory === category);

						if (productId === productId && productName === productName && dbCategory === category) {
							orderItems.push([orderId, productId, quantitySold, unitPrice, discount, shippingCost]);
							if (orderItems.length === batchSize) {
								logger.info({ requestId, message: `Inserting batch of ${orderItems.length} order items` });
								await products.insertOrdersItems(orderItems);
								orderItems.length = 0;
							}
						}
					}

					logger.info({ requestId, message: 'Batch inserted successfully' });
				} catch (error) {
					logger.error({ requestId, message: `Error inserting batch: ${error.message}` });
				} finally {
					stream.resume();
				}
			})
			.on('end', async () => {
				try {
					if (results.length > 0) {
						logger.info({ requestId, message: `Inserting final batch of ${results.length} products` });
						await products.insertOrders(results);
						results.length = 0;
						logger.info({ requestId, message: 'Final batch inserted successfully' });
					}
					if (orderItems.length > 0) {
						logger.info({ requestId, message: `Inserting final batch of ${orderItems.length} order items` });
						await products.insertOrdersItems(orderItems);
						orderItems.length = 0;
						logger.info({ requestId, message: 'Final batch of order items inserted successfully' });
					}
				} catch (error) {
					logger.error({ requestId, message: `Error inserting final batch: ${error.message}` });
				}

				logger.info({ requestId, message: 'CSV file processing completed' });
			});
	} catch (error) {
		logger.error({ requestId, message: `Error processing CSV: ${error.message}` });
	} finally {
		logger.info({ requestId, message: 'Database connection released' });
	}
};
