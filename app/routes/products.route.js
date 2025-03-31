'use strict';

const express = require('express');

const router = express.Router();

const products = require('../controllers/products.controller');
const upload = require('../../service/multer');

router.post('/import', upload.single('file'), products.importproducts);
router.get('/analytics/revenuecalculation/:startDate/:endDate', products.revenueCalculation);
router.get('/analytics/top-products/:limit/:startDate/:endDate', products.topProducts);
router.get('/analytics/customers/:startDate/:endDate', products.customers);
router.get('/analytics/metrics/:startDate/:endDate', products.metrics);

module.exports = router;
