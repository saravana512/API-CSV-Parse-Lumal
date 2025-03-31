'use strict';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products and analytics
 */

/**
 * @swagger
 * /import:
 *   post:
 *     tags:
 *       - Products
 *     summary: Import products from a CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Products imported successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /analytics/revenuecalculation/{startDate}/{endDate}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Calculate revenue within a date range
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for revenue calculation
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for revenue calculation
 *     responses:
 *       200:
 *         description: Revenue calculated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /analytics/top-products/{limit}/{startDate}/{endDate}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get top products within a date range
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: Number of top products to retrieve
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the query
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the query
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /analytics/customers/{startDate}/{endDate}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get customer analytics within a date range
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the query
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the query
 *     responses:
 *       200:
 *         description: Customer analytics retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /analytics/metrics/{startDate}/{endDate}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get metrics within a date range
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the query
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the query
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *       400:
 *         description: Bad request
 */
