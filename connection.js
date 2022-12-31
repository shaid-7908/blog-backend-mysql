const mysql =require('mysql2')
const dotenv=require("dotenv")
dotenv.config()

global.conn=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
})

let connection = async function () {
	try {
		await conn.connect();
		console.log("Connected to SQL.");
	} catch (error) {
		console.log("Error in connecting to database");
		return error;
	}
};
module.exports = connection;