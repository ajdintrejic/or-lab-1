const Pool = require("pg").Pool;

const pool = new Pool({
	user: "orlabuser",
	password: "orlabpasswd",
	host: "localhost",
	port: "5432",
	database: "orlab1"
})

module.exports = pool;