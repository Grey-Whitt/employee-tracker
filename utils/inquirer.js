const inquirer = require('inquirer')
const connection = require('./connection')
const cTable = require('console.table')
//this is where I import all of the queries
const { employees, departments, roles, addDepartmentQ, addRoleQ, addEmployeeQ } = require('./query')


//this function loads the 'home page'
const homePage = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'homeChoice',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all departments', 'View all roles', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']

        }
    ])
        //after it asks you what you want to do it runs the appropriate function
        .then(({ homeChoice }) => {
            switch (homeChoice) {
                case 'View all employees':
                    getEmployees();
                    break;
                case 'View all departments':
                    getDeps();
                    break;
                case 'View all roles':
                    getRoles();
                    break;
                case 'Add a department':
                    addDep();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee()
                    break;
                case 'Update an employee role':
                    updateEmployee()
                    break;
                case 'Exit':
                    console.log('Thanks for using my program!')
                    connection.end();
                    break;
            }
        })
}

//this loads the formatted list of employees
const getEmployees = () => {
    connection.query(employees, function (err, res) {
        if (err) throw err;
        console.table(res);
        homePage();
    });
}

//gets all departments
const getDeps = () => {
    connection.query(departments, function (err, res) {
        if (err) throw err;
        console.table(res);
        homePage();
    });
}

//gets all roles
const getRoles = () => {
    connection.query(roles, function (err, res) {
        if (err) throw err;
        console.table(res);
        homePage();
    });
}

//this is where you add a department
const addDep = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDep',
            message: 'Enter the name of the department you would like to add',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }

        }
    ])
        //sends the query and adds the department to the DB
        .then(({ newDep }) => {
            connection.query(addDepartmentQ, newDep, function (err, res) {
                if (err) throw err;
                console.table(res);
                homePage();
            })
        })

}

//adds new roles
function addRole() {
    inquirer.prompt([{
        name: 'title',
        type: 'input',
        message: 'Enter the role title '
    },
    {
        name: 'salary',
        type: 'number',
        message: 'Enter the roles salary ',
        ...validateNumbers()
    },
    {
        name: 'department',
        type: 'list',
        message: 'Select a department',
        choices: queryDepartments()
    }
    ])
        .then(response => {

            //this takes the name of the department and gets the corresponding id
            connection.query('SELECT id FROM department WHERE department_name = ?', [response.department], (error, result) => {

                if (error) throw error;
                result.forEach(id => {
                    resId = id.id;
                })

                //add the role to the db
                connection.query(addRoleQ, {
                    title: response.title,
                    salary: response.salary,
                    department_id: resId
                }, (error, result) => {
                    if (error) throw error;
                })

                getRoles();
            })
        })
}

//updates employees
function updateEmployee() {
    inquirer.prompt([
        //I had to put this here because the query functions dont work as the first inquire
        {
            name: 'captcha',
            type: 'input',
            message: "Confirm you aren't a robot - type anything"
        },
        {
            name: 'updateEmployee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: queryEmployees()
        },
        {
            type: 'list',
            name: 'updateRole',
            message: 'What role would you like the employee to have',
            choices: queryRoles()
        }

    ])
    .then(({updateEmployee, updateRole}) => {
        //gets the new role id
        connection.query('SELECT id FROM role WHERE title = ?', updateRole, (err, res) => {
            if (err) throw error;

            const roleId = res[0].id


            let employeeName = updateEmployee.split(' ')

            //updates the employee
            connection.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?', [roleId, employeeName[0], employeeName[1]], (error, result) => {
                if (error) throw error;

                getEmployees();
            })

            
        })
    })
}

//this is for adding new employees
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employees first name',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employees last name',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a name');
                    return false;
                }
            }
        },
        {
            name: 'role',
            type: 'list',
            message: 'Select the role:',
            choices: queryRoles()
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Select the manager:',
            choices: queryEmployees()
        }
    ])
        .then(({ firstName, lastName, role, manager }) => {

            //this is a chain of queries to get the correct data to add to the employee DB
            connection.query('SELECT id FROM role WHERE title = ?', role, (err, res) => {
                if (err) throw error;

                const roles_id = res[0].id


                let managerName = manager.split(' ')



                connection.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [managerName[0], managerName[1]], (err, res) => {
                    if (err) throw error;

                    const managers_id = res[0].id

                    connection.query(addEmployeeQ, {
                        first_name: firstName,
                        last_name: lastName,
                        role_id: roles_id,
                        manager_id: managers_id
                    }, (error, result) => {
                        if (error) throw error;
                    })
                    getEmployees();
                })
            })
        })
}


//this gets the roles to use as choices for inquirer  
function queryRoles() {
    let roles = [];
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw error;

        res.forEach(role => {
            roles.push(role.title);
        })
    })

    return roles;
}

//does the same as above but for employees
function queryEmployees() {
    let employeeArray = []
    let sql = 'SELECT first_name, last_name FROM employee'
    connection.promise().query(sql)

        .then(([data]) => {

            data.forEach(({ first_name, last_name }) => {
                name = first_name.concat(' ', last_name)
                employeeArray.push(name)
            })


        })


    return employeeArray;
}

//does the same as above but for departments
function queryDepartments() {
    let departments = [];
    connection.query('SELECT department_name FROM department', (error, response) => {
        if (error) throw error;

        response.forEach(department => {
            departments.push(department.department_name);
        })

    })

    return departments
}

//this function validates number inputs to make sure they are > 0 and not a string
const validateNumbers = moreValidationChecks => ({
    validate: input => {
        if (input === '') {
            return 'Please provide a valid number greater then 0'
        }
        return moreValidationChecks ? moreValidationChecks(input) : true
    },
    filter: input => {
        // clear the invalid input
        return Number.isNaN(input) || Number(input) <= 0 ? '' : Number(input)
    },
})

module.exports = {
    homePage
}