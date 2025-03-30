const { CronJob } = require('cron');

new CronJob(
	'0 0 * * * *',
	function () {
		console.log('You will see this message every second');
	},
	null,
	true,
	'America/Los_Angeles'
);
