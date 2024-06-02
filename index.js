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
    ]).then(async (answers) => {
        // console.log(answers);

//===============================================================================================

        switch (answers['start-menu']) {
            case 'View All Employees':

                employeeDb.viewAllEmployees().then((employees) => {
                    console.table(employees);
                });
                break; //stops the switch function
//===============================================================================================

            case 'Add Employee':
    
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
                        name: "roleId",
                        message: "Choose the employee's role ID. 1.Manager, 2.Marketing 3. Sales",
                        type: "list",
                        choices: [1, 2, 3]
                    },
                    {
                        name: "managerId",
                        message: "Choose the employee's role ID. 1.Bob, 2.Laura 3. Jim",
                        type: "list",
                        choices: [1, 2, 3]
                    }

                ]).then((employee) => {
                    console.table(employee);

                    employeeDb.addEmployee(employee)


                });
                break;
//===============================================================================================
            case 'Update Employee Role':
                const employeesToUpdate = await employeeDb.viewAllEmployees();
                console.log(employeesToUpdate);
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
                break;
    
//===============================================================================================

            case 'View All Roles':
                employeeDb.viewAllRoles().then((employees) => {
                    console.table(employees);
                })
                break;

//===============================================================================================
            case 'Add Role':
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
