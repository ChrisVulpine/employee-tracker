const inquirer = require('inquirer');
// const chalk = require('chalk'); //custom colors
const employeeDb = require('./lib/index');
// console.log(employeeDb);


//================================================================================================================
// Iquirer Menu Prompt with switches based on choices  *functions found in --> /lib/index.js
//================================================================================================================

const questionPrompt = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'start-menu',
            message: `What would you like to do? (Move up and down using the arrow keys to reveal more choices.)`,
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        },
    ]).then((answers) => {
        // console.log(answers);

        switch (answers['start-menu']) {
            case 'View All Employees':

                employeeDb.viewAllEmployees().then((employees) => { //TODO: Make these appear on the table as not strings
                    console.table(employees);
                });
                break; //stops the switch function
            //===============================================================================================

            case 'Add Employee':
                const roleTitles = employeeDb.viewAllRoles().then((roles) => {
                    // console.log(typeof roles);
                    return roles.filter((role) => {
                        // console.log(role.title);
                        return "title" in role;
                    });
                })
                // console.log({roleTitles});
                inquirer.prompt([
                    {
                        name: "firstName",
                        message: "Please enter the employee's first name."
                    },
                    {
                        name: "lastName",
                        message: "Please enter the employee's last name."
                    },
                    {
                        name: "role",
                        message: "Choose the employee's role.",
                        type: "list",
                        choices: ['manager', 'marketing', 'sales']
                    },

                ]).then((employee) => {
                    console.table(employee);

                    employeeDb.addEmployee(employee)


                })
                break;

            //===============================================================================================

            case 'View All Roles':
                employeeDb.viewAllRoles().then((employees) => {
                    console.table(employees);
                })
                break;

            //===============================================================================================

            case 'View All Departments':
                employeeDb.viewAllDepartments().then((employees) => {
                    console.table(employees);
                })
                break;

            //===============================================================================================






            default:
                process.exitCode = 1 //common error code in cli apps 
                process.exit()
        }
    }).catch((err) => {
        console.log(err);
        throw err;
    })
};

//================================================================================================================
// Wrapper init function for all functions
//================================================================================================================

function init() {
    console.log('starting cli...');
    questionPrompt()
}

//================================================================================================================
// Calling init function to initiate application
//================================================================================================================

init()
