// SELECT employee.id, employee.first_name AS 'First Name', 
// employee.last_name AS 'Last Name', role.title AS 'Job Title', 
// department.department_name AS 'Department', role.salary AS 'Salary', 
// CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
// FROM employee
// LEFT JOIN employee manager on manager.id = employee.manager_id
// INNER JOIN role ON (role.id = employee.role_id)
// INNER JOIN department ON (department.id = role.department_id);