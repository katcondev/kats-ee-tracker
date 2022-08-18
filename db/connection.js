const mysql = require('mysql2');

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'process.env.PWDB',
    database: 'employee_db'
  },
  console.log(`Connected to the employee database.`)
);

module.exports = db;