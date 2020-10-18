INSERT INTO department (department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Ishaaq', 'Sumner', 1, null),
('Humera', 'Day', 2, 1),
('Mollie', 'Terrell', 4, 5),
('Jaimee', 'Cornish', 7, 8),
('Jovan', 'Bowers', 3, null),
('Sohaib', 'Alvarez', 4, 5),
('Shaunna', 'Hogan', 2, 1),
('Ellie-Louise', 'Christensen', 6, null);
