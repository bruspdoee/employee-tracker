//Packages 
const inquirer = require("inquirer");
const mysql = require("mysql");
const questions = require("./actions");
const consoleTable = require('console.table');

//setting up the connection with the DB
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "Itsbrus16!",
    database: "employee_track_db"
});

connection.connect(function (err) {
    if (err) throw err;

});


determineAction()
async function determineAction() {

    const results = await inquirer.prompt(questions.actions);
    switch (results.actions) {
        case 'Add new employee': 
            addEmployee();
            break;
        case 'View all employees':
            viewAll();
            break;
        case 'View employees by department':
            viewByDpt();
            break;
        case 'Update employee role':
            updateRole();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case "Add role":
            addRole(); 
            break;
        case 'View all departments':
            viewAllDpt(); 
            break;
        case 'Add department':
            addDpt(); 
            break;

        default:
            connection.end();
            break;

    }
}

function addEmployee() {

    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;

        inquirer.prompt([

            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title);
                    }

                    return choiceArray;
                },
                message: "What is the employee's role?"
            },

            {
                type: "input",
                name: "emanager",
                message: "Who is the employee's manager?"
            }

        ]).then(function (res) {


            for (var i = 0; i < results.length; i++) {
                if (results[i].title === res.choice) {
                    res.role_id = results[i].id;
                }
            }
            var query = "INSERT INTO employee SET ?"
            const VALUES = {
                first_name: res.firstname,
                last_name: res.lastname,
                role_id: res.role_id
            }
            connection.query(query, VALUES, function (err) {
                if (err) throw err;
                console.log("Employee successfully added!");
            }
            )
        })
    })

}

function viewAll() {
    connection.query("SELECT * FROM employee_track_db.employee;", function (err, results) {
        console.table(results);
        if (err) throw err;
    });
}

function viewAllDpt() {
    connection.query("SELECT DISTINCT department FROM employee_track_db.department", function (err, results) {
        console.table(results);
        if (err) throw err;
    });
}

function viewAllRoles() {
    connection.query("SELECT DISTINCT title FROM employee_track_db.role;", function (err, results) {
        console.table(results);
        if (err) throw err;
    });
}


function addDpt() {
    inquirer
        .prompt({
            name: "newDpt",
            type: "input",
            message: "Which Department would you like to add?"
        })
        .then(function (result) {

            var query = "INSERT INTO department SET?"
            console.log(query)
            var query1 = connection.query(query, [{ name: result.newDpt }], function (err) {
                if (err) throw err;
                console.table("Department Created Successfully!");
            });


        })
}

function addRole() {
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";


    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;


            inquirer.prompt([

                {
                    name: "newRole",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arrayOfChoices.push(roles[i].title);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which Role would you like to add?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the salary you would like to add?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which department this role belongs to?"
                },

            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "INSERT INTO role SET ?"
                const VALUES = {

                    title: result.newRole,
                    salary: result.newSalary,
                    department_id: result.department_id
                }
                connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly created!");
                });

            })
        })
    })
}


function updateRole() {
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";


    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;
            inquirer.prompt([

                {
                    name: "newRole",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arrayOfChoices.push(roles[i].title);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which Role would you like to update?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the new salary for this role?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }
                        return arrayOfChoices;
                    },
                    message: "Which department this role belongs to?"
                },
            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "UPDATE role SET title=?,salary= ? WHERE department_id= ?"
                const VALUES = [

                    { title: result.newRole },
                    { salary: result.newSalary },
                    { department_id: result.department_id }
                ]
                let query1 = connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly Updated!");
                });

            })
        })
    })
}