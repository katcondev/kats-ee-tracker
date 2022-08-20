require('dotenv').config();
const inquirer = require('inquirer');
const queries = require('./db/queries');
const db = require('./db/connection');


const {
    response
} = require('express');
const {
    exec
} = require('child_process');
var sql = "";

function start() {
    inquirer
        .prompt([{
            type: "list",
            message: questions[0],
            name: "activity",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Role",
                "Update Managers",
                "View Budget"
            ]
        }]).then((response) => {
            switch (response.activity) {
                case "View All Departments":
                    sql = `SELECT * FROM employee_db.department`;
                    queries(sql);
                    break;
                case "View All Roles":
                    sql = `SELECT employee_db.role.id, employee_db.role.title, employee_db.role.salary, employee_db.department.name AS department
                    FROM  employee_db.role
                    INNER JOIN employee_db.department ON employee_db.role.department_id=employee_db.department.id;`;
                    queries(sql);
                    break;
                case "View All Employees":
                    sql = `SELECT employee_db.employee.id, employee_db.employee.first_name, employee_db.employee.last_name, employee_db.role.title AS role
                    FROM  employee_db.employee
                    INNER JOIN employee_db.role ON employee_db.employee.role_id=employee_db.role.id;`;
                    queries(sql);
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Add Department":
                    addDept();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Update Role":
                    updateRole();
                    break;
                case "Update Managers":
                    updateEmpManager();
                    break;
                case "View Budget":
                    totalBudget();
                    break;
            }
        })
}

//simplify questions into array
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

const addEmp = () => {
    roles = `SELECT distinct(title),id FROM employee_db.role;`;
    var roleList = [];
    var roleNameList = [];
    var managerList = [];
    var managerNameList = ['N/A'];
    db.promise().query(roles)
        .then(response => {
            if (response[0].length <= 0) {
                console.log("Please add a role to add an employee");
            } else {
                roleList.push(response[0]);
                response[0].forEach(role => {
                    roleNameList.push(role.title);
                });
                managers = `SELECT * FROM employee_db.employee;`;
                db.promise().query(managers)
                    .then(response => {
                        if (response[0].length > 0) {
                            managerList.push(response[0]);
                            response[0].forEach(manager => {
                                managerNameList.push(`${manager.first_name} ${manager.last_name}`);
                            });
                        }
                        inquirer
                            .prompt([{
                                    type: "input",
                                    message: questions[5],
                                    name: "firstName"
                                },
                                {
                                    type: "input",
                                    message: questions[6],
                                    name: "lastName"
                                },
                                {
                                    type: "list",
                                    message: questions[7],
                                    name: "role",
                                    choices: roleNameList
                                },
                                {
                                    type: "list",
                                    message: questions[8],
                                    name: "manager",
                                    choices: managerNameList
                                }
                            ]).then((response) => {
                                var roleId;
                                var managerId;
                                for (var i = 0; i < roleList[0].length; i++) {
                                    if (roleList[0][i].title == response.role) {
                                        roleId = roleList[0][i].id;
                                    };
                                }
                                if (response.manager != "N/A") {
                                    for (var i = 0; i < managerList[0].length; i++) {
                                        if (((response.manager).includes(managerList[0][i].first_name)) && ((response.manager).includes(managerList[0][i].last_name))) {
                                            managerId = managerList[0][i].id;
                                        };
                                    }
                                }
                                if (managerId) {
                                    sql = `INSERT INTO employee_db.employee(first_name, last_name, role_id, manager_id) VALUES('${response.firstName}', '${response.lastName}', '${roleId}', '${managerId}')`;
                                    queries(sql, "Employee");
                                } else {
                                    sql = `INSERT INTO employee_db.employee(first_name, last_name, role_id) VALUES('${response.firstName}', '${response.lastName}', '${roleId}')`;
                                    queries(sql, "Employee");
                                }
                            })
                    })
            }
        })
}

const addDept = () => {
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

const addRole = () => {
    deptList = `SELECT * FROM employee_db.department`;
    var deptChoices = [];
    var deptJson = [];
    db.promise().query(deptList)
        .then(response => {
            if (response[0].length <= 0) {
                console.log("Please add a department to create a new role");
            } else {
                deptJson.push(response[0]);
                response[0].forEach(dept => {
                    deptChoices.push(dept.name);
                });
                inquirer
                    .prompt([{
                            type: "input",
                            message: questions[2],
                            name: "roleName"
                        },
                        {
                            type: "input",
                            message: questions[3],
                            name: "salary"
                        },
                        {
                            type: "list",
                            message: questions[4],
                            name: "department",
                            choices: deptChoices
                        }
                    ]).then((response) => {
                        var deptId;
                        for (var i = 0; i < deptJson[0].length; i++) {
                            if (deptJson[0][i].name == response.department) {
                                deptId = deptJson[0][i].id;
                            };
                        }
                        sql = `INSERT INTO employee_db.role(title, salary, department_id) VALUES('${response.roleName}', '${response.salary}', '${deptId}')`;
                        queries(sql, "Role");
                        
                    })
            }
        })
}

function updateRole() {
    var employeeList = [];
    var employeeData = [];
    const sql = `SELECT * FROM employee_db.employee;`;
    db.promise().query(sql)
        .then(response => {
            if (response[0].length > 0) {
                employeeData.push(response[0]);
                response[0].forEach(employee => {
                    employeeList.push(`${employee.first_name} ${employee.last_name}`);
                });
                const roleQuery = `SELECT distinct(title),id FROM employee_db.role;`;
                var roleList = [];
                var roleNameList = [];
                db.promise().query(roleQuery)
                    .then(response => {
                        if (response[0].length <= 0) {
                            console.log("Please add a role to add an employee");
                        } else {
                            roleList.push(response[0]);
                            response[0].forEach(role => {
                                roleNameList.push(role.title);
                            });
                        }
                    })
                inquirer
                    .prompt([{
                            type: "list",
                            message: questions[11],
                            name: "employeeName",
                            choices: employeeList
                        },
                        {
                            type: "list",
                            message: questions[7],
                            name: "employeeRole",
                            choices: roleNameList
                        }
                    ]).then(response => {
                        var employeeId;
                        var roleId;
                        for (var i = 0; i < employeeData[0].length; i++) {
                            if (((response.employeeName).includes(employeeData[0][i].first_name)) && ((response.employeeName).includes(employeeData[0][i].last_name))) {
                                employeeId = employeeData[0][i].id;
                            };
                        }
                        for (var i = 0; i < roleList[0].length; i++) {
                            if (roleList[0][i].title == response.employeeRole) {
                                roleId = roleList[0][i].id;
                            };
                        }
                        const sql = `UPDATE employee_db.employee SET role_id = ${roleId} WHERE id = ${employeeId}`
                        queries(sql, "Employee");
                    })
            } else {
                console.log("Please add an employee to the database!");
            }
        })

}

function updateEmpManager() {
    var employeeList = [];
    var employeeData = [];
    const sql = `SELECT * FROM employee_db.employee;`;
    db.promise().query(sql)
        .then(response => {
            if (response[0].length > 0) {
                employeeData.push(response[0]);
                response[0].forEach(employee => {
                    employeeList.push(`${employee.first_name} ${employee.last_name}`);
                });
                inquirer
                    .prompt([{
                            type: "list",
                            message: questions[10],
                            name: "employeeName",
                            choices: employeeList
                        },
                        {
                            type: "list",
                            message: questions[8],
                            name: "manager",
                            choices: employeeList
                        }
                    ]).then(response => {
                        var employeeId;
                        var managerId;
                        for (var i = 0; i < employeeData[0].length; i++) {
                            if (((response.employeeName).includes(employeeData[0][i].first_name)) && ((response.employeeName).includes(employeeData[0][i].last_name))) {
                                employeeId = employeeData[0][i].id;
                            };
                        }
                        for (var i = 0; i < employeeData[0].length; i++) {
                            if (((response.manager).includes(employeeData[0][i].first_name)) && ((response.manager).includes(employeeData[0][i].last_name))) {
                                managerId = employeeData[0][i].id;
                            };
                        }
                        const sql = `UPDATE employee_db.employee SET manager_id = ${managerId} WHERE id = ${employeeId}`
                        queries(sql, "Employee");
                    })
            } else {
                console.log("Please add an employee to the database!");
            }
        })

}


function totalBudget() {
    var salaryList = [0];
    const sql = `SELECT salary FROM employee_db.role;`;
    db.promise().query(sql)
        .then(response => {
            response[0].forEach(salary => {
                salaryList.push(parseFloat(salary.salary));
            });
            var sum = 0;
            for (i = 0; i < salaryList.length; i++) {
                sum += salaryList[i];
            }
            console.log(`$${sum}`);
        })
}

// start the prompt 
start();