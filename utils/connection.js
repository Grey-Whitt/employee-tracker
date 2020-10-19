const mysql = require('mysql2');

//this is what keeps my data secure
require("dotenv").config();


// Creates the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST, //YOUR INFO HERE
    port: 3306,
    user: process.env.DB_USER, //YOUR INFO HERE
    password: process.env.DB_PASS, //YOUR INFO HERE
    database: 'company_db'
});

module.exports = connection;