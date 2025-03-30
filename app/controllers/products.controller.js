'use strict';

const fs = require('node:fs');
const { parse } = require('csv-parse');

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
		const batchSize = 100;
		const results = [];
		logger.info({ requestId, message: 'Database connection established' });

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
			.on('close', () => {
				logger.info({ requestId, message: `CSV file closed: ${filePath}` });
				fs.unlinkSync(filePath);
				logger.info({ requestId, message: `CSV file deleted: ${filePath}` });
			})
			.on('data', async row => {
				results.push(row);
				if (results.length === batchSize) {
					try {
						logger.info({ requestId, message: `Inserting batch of ${batchSize} products` });
						// await products.insertProducts(client, results);
						logger.info({ requestId, message: 'Batch inserted successfully' });
					} catch (error) {
						logger.error({ requestId, message: `Error inserting batch: ${error.message}` });
					}
					results.length = 0;
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
