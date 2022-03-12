const inquirer = require("inquirer");
require("console.table");
// Imported mysql.createConnection from connection.js
const db = require('./db/connection');

// Prompt user to choose what they want to do
//PROMPT OPTIONS FOR USER

const userOptions = () => {
    return inquirer.prompt({

        type: "rawlist",
        name: "options",
        message: "What would you like to do",
        choices: [
          "View All Departments",  
          "View All Roles",
          "View All Employees",
          "Add New Department",
          "Add New Role",
          "Add New Employee",
          "View Department Budget",
          "Update Employee",
        ],
        }).then((answer) => {
            switch (answer.options) {
            case "Add New Department":
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

            case "Add New Role":
                addRole();
                break;

            case "View All Roles":
                viewAllRoles().then((data) => {
                console.table(data);
                return userOptions();
                });
                break;

            case "Add New Employee":
                addEmployee();
                break;

            case "View All Employees":
                viewAllEmployees().then((data) => {
                console.table(data);
                return userOptions();
                }); 
                break;
            case "Update Employee":
                updateEmployee();
                break;

        }
    });
};


//VIEWALLDEPARTMENTS FUNCTION DECLARATION
const viewAllDepartments = () => {

    console.log("///////////ALL DEPARTMENTS TABLE////////")

    const sql = `SELECT * FROM departments`
    var response = db.promise().query(sql).then(([req, err]) => {
        return req;
    })
    return response;
};

// VIEW DEPARTMENTBUDGET FUNCTION DECLARATION
const viewDepartmentBudget = () => {

    console.log("///////////ALL DEPARTMENTS BUDGET TABLE////////")

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

    console.log("///////////ALL ROLES TABLE////////")

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

    console.log("///////////ALL EMPLOYEES TABLE////////")

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

// ADD DEPARTMENT FUNCTION DECLARATION
const addDepartment = () => {

    return inquirer.prompt(
        {
            type: "input",
            name: "nameForDepartment",
            message: "Please enter the name of the department you want to add"
        }
    ).then((addDeptAnswer) => {

        const sql = `INSERT INTO departments (name) VALUES (?)`;
        const params = [addDeptAnswer.nameForDepartment];

        db.query(sql, params, (err) => {

            console.log("Added new Department to DB!")
            return userOptions();
        })

    })
};

// ADD NEW ROLE FUNCTION

const addRole = () => {

    // Variable to hold department names to be chosen after...
    let chooseDepartment = [];
    // - ViewAllDepartments function data is passed to foreach(), foreach() will read each
    //   "department" and push it into chooseDepartment array
    viewAllDepartments().then((data) => {
        data.forEach((department) => {
            chooseDepartment.push(department);
        })
    });
    

    return inquirer.prompt([
        {
            type: "input",
            name: "nameForRole",
            message: "Please enter the name of the ROLE you want to add",
        },
        {
            type: "input",
            name: "salaryForRole",
            message: "Please SALARY for the ROLE you want to add",
        },
        {
            type: "list",
            name: "depID",
            message: "Please choose the DEPARTMENT of the ROLE you want to add",
            choices: chooseDepartment

        },
    ])
    .then((newRoleAnswers) => {

            // // Find ID of department chosen above
            let departmentId = chooseDepartment.find((department) => {
                if (department.name === newRoleAnswers.depID) {
                    return department;
                }
            }).id; 


            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
            const params = [newRoleAnswers.nameForRole, newRoleAnswers.salaryForRole, departmentId   ];

            db.query(sql, params, (err) => {

                console.log("/////////// NEW ROLE HAS BEEN ADDED! ////////")

                
                return userOptions();
            
            })

    })
}

// ADD NEW EMPLOYEE!

const addEmployee = () => {

    // Empty var to me populated with an array of roles with their respective ids
    var chooseRole = [];
    // - The data "roles" of vieallroles is .then() passed into .forEach() method, foreach method will loop all roles 
    //   and for each role it will create a new object with only the role and id in its callback function
    //   and push it to rhe chooseRole empty array above      
    viewAllRoles().then((data) => {
        data.forEach((role) => {

            let roleNameIdOnly = {

                name: role.title,
                id: role.id,
            }
            chooseRole.push(roleNameIdOnly);
        })
        
    });

    

    var chooseManager = [];
    viewAllEmployees().then((data) => {
        data.forEach((employee) => {

            let employeeIdOnly = {

                name: employee.first_name + " " + employee.last_name,
                id: employee.id,
            }
            chooseManager.push(employeeIdOnly);
            
        })
    });


    return inquirer.prompt([


        
        {
            type: "input",
            name: "employeeFirstName",
            message: "Enter the employee's FIRST NAME",
        },
        {
            type: "input",
            name: "employeeLastName",
            message: "Enter the employee's LAST NAME",
        },
        {
            type: "list",
            name: "roleForEmployee",
            message: "What is the employee's role? (Required)",
            choices: chooseRole,
        },
        {
            type: "rawlist",
            name: "managerForEmployee",
            message: "Who is the employee's manager? (Required)",
            choices: chooseManager,

        },
    ])
    
    .then((newEmployeeAnswers) => { 
        
        let roleId = chooseRole.find((role) => {
            if (role.name === newEmployeeAnswers.roleForEmployee) {
                return role;
            }
        }).id; 

        let managerId = chooseManager.find((manager) => {
            if (manager.name === newEmployeeAnswers.managerForEmployee) {
                return manager;
            }
        }).id; 

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                    VALUES (?,?,?,?)`;
        const param = [newEmployeeAnswers.employeeFirstName, newEmployeeAnswers.employeeLastName, roleId, managerId,];

        db.query(sql, param, (err) => {

            console.log("/////////// NEW EMPLOYEE HAS BEEN ADDED! ////////")
            return userOptions();

        })
    })
};



// UPDATE EMPLOYEE FUNCTION DECLARATION
const updateEmployee = () => {

    var chooseEmployee = [];
    viewAllEmployees().then((data) => {
        data.forEach((employee) => {

            let employeeIdOnly = {

                name: employee.first_name + " " + employee.last_name,
                id: employee.id,
            }
            chooseEmployee.push(employeeIdOnly);
            
        })
        // console.log(chooseEmployee)
    });

    var chooseRole = [];
    
    viewAllRoles().then((data) => {
        data.forEach((role) => {

            let roleNameIdOnly = {

                name: role.title,
                id: role.id,
            }
            chooseRole.push(roleNameIdOnly);
        })
        // console.log(chooseRole)

    }).then( () => {

        return inquirer.prompt([
    
            {
                type: "list",
                name: "selectEmployee",
                message: "Choose an EMPLOYEE to update",
                choices: chooseEmployee,
            },
            {
                type: "list",
                name: "updateRole",
                message: "Choose a ROLE to update EMPLOYEE'S old ROLE",
                choices: chooseRole,

            },

        ])
        
        .then((updateEmployeeAnswers) => {

            let employeeId = chooseEmployee.find((employee) => {
                if (employee.name === updateEmployeeAnswers.selectEmployee) {
                    return employee;
                }
            }).id;

            let roleId = chooseRole.find((role) => {
                if (role.name === updateEmployeeAnswers.updateRole) {
                    return role;
                }
            }).id; 

             

            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
            
            const params = [roleId, employeeId];

            db.query(sql, params, (err) => {
            
                console.log("/////////// EMPLOYEE HAS BEEN UPDATED! ////////")
                return userOptions();


            });
        });

    })    
}




//START APP!
userOptions()