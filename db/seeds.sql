INSERT INTO employee_db.department
    (name)
VALUES
    ("Engineering"), 
    ("Sales"), 
    ("Operations"), 
    ("Marketing");

INSERT INTO employee_db.role
    (title, salary, department_id)
VALUES
    ("Engineer", 120000, 1), 
    ("Senior Engineer", 210000, 2), 
    ("Operations Manager", 150000, 3), 
    ("Marketing Director", 250000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES 
    ('Victoria', 'Beckham', 1, 2), 
    ('Melanie', 'C', 1, 2),
    ('Emma', 'Bunton', 1, null), 
    ('Melanie', 'B', 2, 2), 
    ('Geri', 'Halliwell', 4, null);