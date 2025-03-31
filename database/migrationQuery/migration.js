const fs = require('fs');
const path = require('path');

const pool = require('../../database/db');
const { logger } = require('../../config/logger');

const sqlFilePath = path.join('database/migrationQuery/tableCreateScript.SQL');

async function runMigration() {
	try {
		const sql = fs.readFileSync(sqlFilePath, 'utf8');
		await pool.query(sql);
		logger.info('Migration script executed successfully.');
	} catch (err) {
		logger.error('Error executing migration script:', err);
	} finally {
		logger.info('Migration script execution finished.');
	}
}

runMigration();
