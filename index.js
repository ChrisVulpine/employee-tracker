const inquirer = require('inquirer');
const employeeDb = require('./lib/index');
const chalk = require('chalk');

//================================================================================================================
// Iquirer Menu Prompt with cases based on choices  *functions found in --> /lib/index.js
//================================================================================================================

const questionPrompt = () => {
    console.log(''); //to aesthetically space
    console.log(chalk.yellow `---------------------`, `Welcome to Your Employee Tracker!`, chalk.yellow `------------------------`);
    console.log(''); //to aesthetically space
    inquirer.prompt([
        {
            type: 'list',
            name: 'start-menu',
            message: `What would you like to do?`,
            choices: ['1. View All Employees', '2. Add Employee', '3. Update Employee Role', '4. View All Roles', '5. Add Role', '6. View All Departments', '7. Add Department', (chalk.red `----Quit----`)],
        },
    ]).then(async (answers) => {

//==================================== 1. View All Employees =====================================================

        switch (answers['start-menu']) {
            case '1. View All Employees':

                employeeDb.viewAllEmployees().then((employees) => {
                    console.table(employees);
                    questionPrompt();
                });
                break;

//==================================== 2. Add Employee ===========================================================

            case '2. Add Employee':
                employeeDb.viewAllRoles().then((roles) => {
                    const roleChoices = roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }));
                    inquirer.prompt([
                        {
                            name: 'firstName',
                            message: "Please enter the employee's first name:"
                        },
                        {
                            name: 'lastName',
                            message: "Please enter the employee's last name:"
                        },
                        {
                            name: 'roleId',
                            type: 'list',
                            message: "Choose the employee's role:",
                            choices: roleChoices
                        },
                        {
                            name: 'managerId',
                            message: "Enter the manager's ID (if any):",
                            default: null
                        }
                    ]).then(employee => {
                        employeeDb.addEmployee(employee).then(() => {
                            questionPrompt();
                        });
                    });
                });
                break;

//==================================== 3. Update Employee Role ===========================================================

            case '3. Update Employee Role':
                const employeesToUpdate = await employeeDb.viewAllEmployees();
                // console.log(employeesToUpdate);
                const employeeChoices = employeesToUpdate.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }));

                const rolesToUpdate = await employeeDb.viewAllRoles();
                const roleChoicesToUpdate = rolesToUpdate.map(role => ({
                    name: `${role.title} (${role.department})`,
                    value: role.id
                }));

                const updateAnswers = await inquirer.prompt([
                    {
                        name: 'employeeId',
                        type: 'list',
                        message: "Select the employee whose role you want to update.",
                        choices: employeeChoices
                    },
                    {
                        name: 'roleId',
                        type: 'list',
                        message: "Select the new role for the employee.",
                        choices: roleChoicesToUpdate
                    }
                ]);

                await employeeDb.updateEmployeeRole(updateAnswers.employeeId, updateAnswers.roleId);
                questionPrompt();
                break;

//==================================== 4. View All Roles ======================================================

            case '4. View All Roles':
                employeeDb.viewAllRoles().then((employees) => {
                    console.table(employees);
                    questionPrompt();
                })
                break;

//==================================== 5. Add Role ===========================================================

            case '5. Add Role':
                const departments = await employeeDb.viewAllDepartments();
                const departmentChoices = departments.map(department => ({
                    name: department.name,
                    value: department.id
                }));

                const roleAnswers = await inquirer.prompt([
                    {
                        name: 'title',
                        message: "Please enter the role's title."
                    },
                    {
                        name: 'salary',
                        message: "Please enter the role's salary.",
                        validate: value => !isNaN(value) ? true : 'Please enter a valid number'
                    },
                    {
                        name: 'departmentId',
                        type: 'list',
                        message: "Choose the department for this role.",
                        choices: departmentChoices
                    }
                ]);

                await employeeDb.addRole(roleAnswers);
                questionPrompt();
                break;

//==================================== 6. View All Departments ===========================================================

            case '6. View All Departments':
                employeeDb.viewAllDepartments().then((employees) => {
                    console.table(employees);
                    questionPrompt();
                })
                break;

//==================================== 7. Add Department ===========================================================

            case '7. Add Department':
                inquirer.prompt([
                    {
                        name: 'departmentName',
                        message: "Enter the department's name:"
                    }
                ]).then(({ departmentName }) => {
                    employeeDb.addDepartment(departmentName).then(() => {
                        questionPrompt();
                    });
                });
                break;

//==================================== Default/Quit ===========================================================

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
    console.log(chalk.green `starting...`);
    questionPrompt()
}

//================================================================================================================
// Calling init function to initiate application
//================================================================================================================

init()