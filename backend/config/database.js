const mysql = require("mysql2");
const config = require('../utils/config.js');

const pool = mysql
	.createPool({
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_NAME,
	})
	.promise();
	
	module.exports = pool;