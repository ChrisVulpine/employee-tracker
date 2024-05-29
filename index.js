const inquirer = require('inquirer');
// const chalk = require('chalk'); //custom colors
const employeeDb = require('./lib/index');
console.log(employeeDb);


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
        ]).then((answers)=> {
            console.log(answers);
        
            switch (answers['start-menu']) {
                case 'View All Employees':

                employeeDb.viewAllEmployees().then((employees) =>{ //TODO: Make these appear on the table as not strings
                    console.table(employees);
                });
                    break; //stops the switch function
//===============================================================================================

                case 'Add Employee':
                employeeDb.addEmployee().then((employees) => {
                    console.table(employees);
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
        }).catch((err)=> {
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
