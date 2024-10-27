// Import the sqlite3 module
var sqlite3 = require('sqlite3').verbose();

// Open a connection to the database (or create it if it doesn't exist)
var db = new sqlite3.Database('example.db', function (err) {
    if (err) {
        return console.error("Error connecting to the database: ", err.message);
    }
    console.log("Connected to the SQLite database.");
});

// SQL query to create 'employees' table
var createEmployeesTable = `
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department_id INTEGER
  );
`;

// SQL query to create 'departments' table
var createDepartmentsTable = `
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL
  );
`;

// Run the create tables queries
db.run(createEmployeesTable, function (err) {
    if (err) {
        return console.error("Error creating employees table: ", err.message);
    }
    console.log("Employees table created successfully.");

    db.run(createDepartmentsTable, function (err) {
        if (err) {
            return console.error("Error creating departments table: ", err.message);
        }
        console.log("Departments table created successfully.");

        // Insert values into 'departments' table
        var insertDepartmentsQuery = `
      INSERT INTO departments (department_name)
      VALUES 
      ('HR'),
      ('Engineering'),
      ('Marketing');
    `;

        db.run(insertDepartmentsQuery, function (err) {
            if (err) {
                return console.error("Error inserting values into departments: ", err.message);
            }
            console.log("Values inserted into 'departments' table.");

            // Insert values into 'employees' table
            var insertEmployeesQuery = `
        INSERT INTO employees (name, department_id)
        VALUES 
        ('Alice', 1),
        ('Bob', 2),
        ('Charlie', 2),
        ('David', 3);
      `;

            db.run(insertEmployeesQuery, function (err) {
                if (err) {
                    return console.error("Error inserting values into employees: ", err.message);
                }
                console.log("Values inserted into 'employees' table.");

                // SQL JOIN query to get employee names with their department names
                var joinQuery = `
          SELECT employees.name AS employee_name, departments.department_name
          FROM employees
          JOIN departments ON employees.department_id = departments.id;
        `;

                db.all(joinQuery, function (err, rows) {
                    if (err) {
                        return console.error("Error executing JOIN query: ", err.message);
                    }
                    console.log("Employees with their departments:");
                    rows.forEach(function (row) {
                        console.log(`Employee: ${row.employee_name}, Department: ${row.department_name}`);
                    });

                    // Close the database connection
                    db.close(function (err) {
                        if (err) {
                            return console.error("Error closing the database: ", err.message);
                        }
                        console.log("Database connection closed.");
                    });
                });
            });
        });
    });
});