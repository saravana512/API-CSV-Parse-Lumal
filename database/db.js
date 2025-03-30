const Pool = require('pg').Pool;

const pool = new Pool({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	database: process.env.DATABASE_NAME,
	ssl: Number(process.env.DATABASE_SSH) ? true : false,
	connectionTimeoutMillis: 0,
	idleTimeoutMillis: 0
});

module.exports = pool;
