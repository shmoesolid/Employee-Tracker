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
    ("Edward", "Jones", 4, null),
     ("John", "Ground", 3, 2),
    ("Shawn", "Bradley", 2, 1),
    ("Chad", "Greybeard", 6, null),
    ("Albert", "Big", 5, null);