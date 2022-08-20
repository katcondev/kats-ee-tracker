require('dotenv').config();

const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: "Penkitten1127!",
    database: 'employee_db'
  },
  console.log(`Connected to the employee database.`)
);

module.exports = db;