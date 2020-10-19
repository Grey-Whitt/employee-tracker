//this file holds all of the SQL queries so they dont take up too much space in the main logic file
const employees = `
SELECT employee.id, employee.first_name AS 'First Name', 
employee.last_name AS 'Last Name', role.title AS 'Job Title', 
department.department_name AS 'Department', role.salary AS 'Salary', 
CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
FROM employee
LEFT JOIN employee manager on manager.id = employee.manager_id
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id);
`
const departments = `
Select department.id, department_name AS 'Departments'
FROM department;
`

const roles = `
SELECT role.title AS 'Tile' ,role.salary AS 'Salary',
department.department_name AS 'Department'
FROM role ,department
WHERE role.department_id = department.id;
`

const addDepartmentQ = `
INSERT INTO department (department_name)
VALUES (?)
`

const addRoleQ = `
INSERT INTO role SET ?
`

const addEmployeeQ = `
INSERT INTO employee SET ?
`

const updateEmployee = `
UPDATE employee
SET role_id = ?
WHERE id = ?;
`

module.exports = {
    employees,
    departments,
    roles,
    addDepartmentQ,
    addRoleQ,
    addEmployeeQ,
    updateEmployee
}