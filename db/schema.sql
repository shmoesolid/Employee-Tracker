DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
	id INT AUTO_INCREMENT NOT NULL,
	name VARCHAR(30),

	PRIMARY KEY (id)
);

CREATE TABLE role(
	id INT AUTO_INCREMENT NOT NULL,
	title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    
	PRIMARY KEY (id),
    FOREIGN KEY (department_id)
		REFERENCES department(id)
);

CREATE TABLE employee(
	id INT AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    
	PRIMARY KEY (id),
    INDEX (role_id),
    INDEX (manager_id),
    
    FOREIGN KEY (role_id)
		REFERENCES role(id),
	FOREIGN KEY (manager_id)
		REFERENCES employee(id)
);

INSERT INTO department(name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO role (title, salary, department_id)
VALUES 
	("Sales Lead", "100000", 1),
	("Salesperson", "80000", 1),
    ("Software Engineer", "120000", 2),
    ("Lead Engineer", "160000", 2),
    ("Accountant", "110000", 3),
    ("Lawyer", "200000", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
	("Joe", "Blow", 1, null),
    ("John", "Ground", 3, null),
    ("Edward", "Jones", 4, 2);

USE employee_db;
SELECT 
	e.id, e.first_name, e.last_name, 
    r.title, d.name AS department, r.salary, 
    CONCAT(e2.first_name, " ", e2.last_name) AS manager
FROM
	employee e
LEFT JOIN role r
	ON e.role_id = r.id
LEFT JOIN department d
	ON r.department_id = d.id
LEFT JOIN employee e2
	ON e.manager_id = e2.id;
