const inquirer = require("inquirer");
require("console.table");
// Imported mysql.createConnection from connection.js
const db = require('./db/connection');

// Prompt user to choose what they want to do
//PROMPT OPTIONS FOR USER

const userOptions = () => {
    return inquirer.prompt({

        type: "list",
        name: "options",
        message: "What would you like to do",
        choices: [
          "View All Departments",  
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Department Budget",
          "Update Employees",
          "Update Employees Manager",
        ],
        }).then((answer) => {
            switch (answer.options) {
            case "Add Department":
                addDepartment();
                break;

            case "View All Departments":
                viewAllDepartments().then((data) => {
                console.table(data);
                return userOptions();
                });
                break;

            case "View Department Budget":
                viewDepartmentBudget().then((data) => {
                console.table(data);
                return userOptions();
                });
                break;

            case "Add Role":
                promptRoles();
                break;

            case "View All Roles":
                viewAllRoles().then((data) => {
                console.table(data);
                return userOptions();
                });
                break;

            case "Add Employee":
                promptEmployees();
                break;

            case "View All Employees":
                viewAllEmployees().then((data) => {
                console.table(data);
                return userOptions();
                }); 
                break;

            case "Update Employees":
                updateEmployee();
                break;

            case "Update Employees Manager":
                updateEmployeeManager();
            break;
        }
    });
};

// 1st call for ADD DEPARTMENT FUNCTION
const addDepartment = () => {

    return inquirer.prompt(
        {
            type: "input",
            name: "nameForDepartment",
            message: "Please enter the name of the departmen you want to add"
        }
    ).then((addDeptAnswer) => {

        const sql = `INSERT INTO departments (name) VALUES (?)`;
        const params = [answersDept.departmentName];

        db.query(sql, params, (err) => {

            console.log("Added new Department to DB!")
            return userOptions();
        })

    })
};

//VIEWALLDEPARTMENTS FUNCTION DECLARATION
const viewAllDepartments = () => {

    const sql = `SELECT * FROM departments`
    var response = db.promise().query(sql).then(([req, err]) => {
        return req;
    })
    return response;
};

// VIEW DEPARTMENTBUDGET FUNCTION DECLARATION
const viewDepartmentBudget = () => {

    const sql = `SELECT departments.name AS 'Department', SUM(roles.salary) AS 'Total Budget'
        from employees
        LEFT JOIN roles on employees.role_id = roles.id
        LEFT JOIN departments on roles.department_id = departments.id
        GROUP BY departments.name`;
    var response = db.promise().query(sql).then(([req, err]) => {
        return req;
    })
    return response;
};

// VIEWALLROLES FUNCTION DECLARATION
const viewAllRoles = () => {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name
        FROM roles
        LEFT JOIN departments ON roles.department_id = departments.id`;
    var response = db.promise().query(sql).then(([req, err]) => {
        return req;
    })
    return response;
};

// VIEWALLEMPLOYEES FUNCTION DECLARATION
const viewAllEmployees = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, 
        (SELECT CONCAT(x.first_name, " ", x.last_name) FROM employees x WHERE x.id = employees.manager_id) AS 'Manager'
        FROM employees
        LEFT JOIN roles ON roles.id = employees.role_id
        LEFT JOIN departments ON roles.department_id = departments.id`;
    var response = db.promise().query(sql).then(([req, err]) => {
        return req;
    })
    return response;
  };


//START APP!
userOptions()