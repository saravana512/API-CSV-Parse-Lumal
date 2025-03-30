'use strict';

const express = require('express');

const router = express.Router();

const products = require('../controllers/products.controller');
const upload = require('../../service/multer');

router.post('/import', upload.single('file'), products.importproducts);

module.exports = router;
