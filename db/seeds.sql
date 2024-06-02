INSERT INTO department (id, name)
VALUES (1, 'Sales'),
       (2, 'Service'),
       (3, 'Marketing');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 200000, 1),
       ('Marketing', 70000, 1),
       ('Sales', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jim', 'Potato', 1, 1),
       ('Larry', 'Spud', 2, 1);