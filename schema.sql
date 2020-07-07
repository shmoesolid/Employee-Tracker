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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("name", "last_name", null, null);

SELECT * FROM employee;

