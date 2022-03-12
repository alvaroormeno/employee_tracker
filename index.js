const express = require('express');
// Imported mysql.createConnection from connection.js
const db = require('./db/connection');

// Prompt user to choose what they want to do
//PROMPT OPTIONS FOR USER

const options = () => {
    return inquirer.prompt({

        type: "list",
        name: "options",
        message: "What would you like to do",
        choices: [
          "Add Department",
          "View All Departments",
          "View Department Budget",
          "Add Role",
          "View All Roles",
          "Add Employee",
          "View All Employees",
          "Update Employees",
          "Update Employees Manager",
        ],
      }).then((answer) => {
        switch (answer.options) {
          case "Add Department":
            AddDepartments();
            break;

          case "View All Departments":
            viewAllDepartments().then((data) => {
              console.table(data);
              return options();
            });
            break;

          case "View Department Budget":
            viewDepartmentBudget().then((data) => {
              console.table(data);
              return options();
            });
            break;

          case "Add Role":
            promptRoles();
            break;

          case "View All Roles":
            viewAllRoles().then((data) => {
              console.table(data);
              return options();
            });
            break;

          case "Add Employee":
            promptEmployees();
            break;

          case "View All Employees":
            viewAllEmployees().then((data) => {
              console.table(data);
              return options();
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