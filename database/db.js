const pg = require('pg');

const pool = new pg.Pool({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	database: process.env.DATABASE_NAME,
	port: 5432,
	max: 50,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000
});

module.exports = pool;
