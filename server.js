'use strict';

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');

const app = express();

const helloWorldRoute = require('./app/routes/helloWorld.route');
const { requestId } = require('./service/uuidGenerator');
const { consoleWritter } = require('./service/consoleViewer');
const notFound = require('./middlewares/notFound');
const erorrHandler = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');
const everyReqDetails = require('./middlewares/everyReqCatcher');
const swaggerSpec = require('./APIDocs/swaggerConfig');
const productRoute = require('./app/routes/products.route');

const port = process.env.PORT;

process.on('uncaughtException', error => {
	console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled rejection:', error);
});

// Disable the 'X-Powered-By' header
app.disable('x-powered-by');

app.use(limiter);
app.use(hpp());
app.use('*', cors());
app.use(compression({ level: 1 }));
app.use(requestId);
app.use(helmet());
app.use(express.json({ limit: '500mb', extended: true }));
app.use(everyReqDetails);

app.use('/api/', helloWorldRoute);
app.use('/api/products', productRoute);
app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error handlers
app.use('*', notFound);
app.use(erorrHandler);

const server = app.listen(port, () => {
	consoleWritter(port);
});

process.on('SIGINT', () => {
	server.close(() => {
		console.log('Server shutting down');
		process.exit(0);
	});
});
