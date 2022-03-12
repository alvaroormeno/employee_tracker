INSERT INTO departments (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Sales Associate', '80000', 1),
  ('Senior Engineer', '250000', 2),
  ('IT Engineer', '140000', 2),
  ('Account Manager', '110000', 3),
  ('HR Manager', '180000', 5),
  ('Legal Manager', '250000', 4),
  ('Lawyer', '190000', 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Alvaro', 'Zelaya', 1, 4),
  ('Salvador', 'Gavo', 2, NULL),
  ('Mike', 'Lopez', 3, 2),
  ('Laura', 'Martinez', 4, NULL),
  ('Melissa', 'Jacobs', 5, 4),
  ('Kevin', 'Mott', 6, NULL),
  ('Karen', 'Tipsy', 7, 2);