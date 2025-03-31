'use strict';

const fs = require('node:fs');
const { CronJob } = require('cron');
const { v4: uuidv4 } = require('uuid');

const refreshTheproduct = require('../app/controllers/products.controller');
const path = require('node:path');

const job = new CronJob(
	'0 0 * * * *',
	function () {
		console.log('Cron job running every second');
		if (fs.existsSync(path.join(__dirname, '../uploads/products.csv'))) {
			refreshTheproduct.processCSV(path.join(__dirname, '../uploads/products.csv'), `CronJob - ${uuidv4()}`);
		}
	},
	null,
	false,
	'America/Los_Angeles'
);

job.start();
