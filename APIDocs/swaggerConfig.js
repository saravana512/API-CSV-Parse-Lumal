'usestrict';
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'csvimport',
			version: '1.0.0',
			description: 'csvimport API Documentation'
		},
		servers: [
			{
				url: process.env.API_BASE_URL,
				description: 'csvimport API'
			}
		]
	},
	apis: [path.join(__dirname, 'docs/*.js')]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
