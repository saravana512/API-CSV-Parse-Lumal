'use strict';

const products = require('../models/product.model');

exports.importproducts = async (req, res, next) => {
	try {
		console.log('req.file', req.file);
		const data = await products.loadProducts();
		res.status(200).json({
			Message: 'Products Imported Successfully',
			data: data
		});
	} catch (error) {
		next(error);
	}
};
