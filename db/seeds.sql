INSERT INTO department (id, name)
VALUES (1, 'Sales'),
       (2, 'Service');

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Manager', 200000, 1),
       (2, 'Marketing', 70000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, 'Jim', 'Potato', 1, 1),
       (4, 'Larry', 'Spud', 2, 1);