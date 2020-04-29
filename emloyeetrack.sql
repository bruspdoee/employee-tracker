
DROP DATABASE IF EXISTS employee_track_DB;
CREATE DATABASE employee_track_DB;
USE employee_track_DB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);


CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30)NOT NULL,
    salary DECIMAL (10,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES department (id)
   
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL, 
    manager_id INT ,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY(role_id) REFERENCES role(id)
);



INSERT INTO department (name) 
VALUES ("Sales"), ("Engineering"),("Legal"), ("Finance"),("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 60000 ,1),  
("Software Engineer", 80000,2),
("Lawyer", 100000, 3),
("Accountant",75000,4),
("Sales Executive", 30000 ,1),
("Lead Engineer", 95000,2),
("Legal Team Lead", 90000, 3),


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Brus", "Palaj", 1),
("Cruella", "Deville", 2),
("Tupac", "Shakur",3),
("Michael","Jordan",4);