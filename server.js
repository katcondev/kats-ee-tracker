// const connection = require('./config/connection');
const inquirer = require('inquirer');
const queries = require('./lib/queries');
const db = require('./db/connection');

const {
    response
} = require('express');
const {
    exec
} = require('child_process');
var sql = "";
// Create an array of questions for user input
const questions = [
    "What would you like to do?",
    "Enter the name of the department:",
    "Enter your name of the role:",
    "What is the salary of this role?",
    "Which department does the role belong to?",
    "Enter the employee's first name:",
    "Enter the employee's last name:",
    "Select employee's role:",
    "Select employee's manager:",
    "Which employee role do you want to update?",
    "Which employee's manager do you want to update?",
    "Select a department:",
    "Select an employee:"
];


const addDepartment = () => {
    inquirer
        .prompt([{
            type: "input",
            message: questions[1],
            name: "departmentName"
        }]).then((response) => {
            sql = `INSERT INTO employee_db.department(name) VALUES('${response.departmentName}')`;
            queries(sql, "Department");
        })
}

