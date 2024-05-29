//FIXME: how to send user back to start-menu when finished with task
//TODO: Add Employee
//TODO: Update Employee Role
//TODO: Add Department
//TODO: Add Quit?
//TODO: Readme
//TODO: Demo Video



const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const dotenv = require('dotenv');
dotenv.config();

//================================================================================================================
// Connect to Database & Perform menu functions
//================================================================================================================

const employeeDb = {
    connection: async () => {
        return await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })
    },

//================================================================================================================
// ✅ View All Employees
//================================================================================================================

    async viewAllEmployees() {
        const connection = await this.connection();
        const [rows] = await connection.execute(`
            SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department, 
                role.salary, 
                CONCAT(manager.first_name, " ", manager.last_name) AS manager 
            FROM 
                employee 
            LEFT JOIN 
                role on employee.role_id = role.id 
            LEFT JOIN 
                department on role.department_id = department.id 
            LEFT JOIN 
                employee manager on manager.id = employee.manager_id;
            `);
        await connection.end();
        return rows;
    },

//================================================================================================================
// TODO: Add Employee
//================================================================================================================

    async addEmployee() {

        //inquirer prompt for first and last names
        try {
            const answers = await inquirer.prompt([
                {
                    name:"first_name",
                    message:"Please enter the employee's first name."
                },
                {
                    name:"last_name",
                    message:"Please enter the employee's last name."
                },

            ]);

        //declaring those values as variables     
        const firstName = answers.first_name;
        const lastName = answers.last_name;

        //using viewAllRoles function to build list of roles    
        const [rows] = await viewAllRoles();
        const roles = rows;
        const allRoles = roles.map(({id, title}) => ({
            name: title,
            value: id
        }));

        //inquirer prompt to choose role based on all roles in table
        const roleChoice = await inquirer.prompt({
            type: 'list',
            name: 'role_id',
            message: `Please choose the employee's role.`,
            choices: allRoles
        });

        //using viewAllEmployees function to build list of potential managers
        const [employeeRows] = await viewAllEmployees();
        let employees = employeeRows;
        const managerChoices = employees.map(({id, first_name, last_name})=> ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        //creates option to choose None as a manager choice
        managerChoices.unshift({name: "None", value: null });

        //inquirer prompt to select a manager
        const managerChoice = await prompt({
            type: 'list',
            name: 'manager_id',
            message: `Please select the employee's manager:`,
            choices: managerChoices

        });

        // building employee object to INSERT into table using variables created above
        const employee = {
            first_name: firstName, 
            last_name: lastName,
            manager_id: managerChoice.manager_id,
            role_id: roleChoice.role_id
        };
            
        } catch (error) {
            console.error('Error adding employee, please try again:', error) 
        }

        //connecting to db and inserting the new employee into the proper table
        const connection = await this.connection();
        const [result] = await connection.execute(`
         INSERT INTO employee (employee)
         VALUES (?)`, [firstName, lastName, role_id, manager_id]);
        await connection.end();
        console.log(`Employee`,{last_name, first_name}`was added!`)
        return result;
    },

//================================================================================================================
// TODO: Update Employee Role
//================================================================================================================

// async viewAllEmployees() {
//     const connection = await this.connection();
//     //const [rows] = await connection.execute('SELECT * FROM employee');
//     const [rows] = await connection.execute('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;');
//     await connection.end();
//     return rows;
// },

//================================================================================================================
//✅ View All Roles
//================================================================================================================

async viewAllRoles() {
    const connection = await this.connection();
    const [rows] = await connection.execute(`
        SELECT 
            role.id, 
            role.title, 
            role.salary,
            department.name AS department
        FROM
            role
        LEFT JOIN 
            department ON role.department_id = department.id;
        `);
    await connection.end();
    return rows;
},

//================================================================================================================
// TODO: Add Role
//================================================================================================================

// async viewAllEmployees() {
//     const connection = await this.connection();
//     //const [rows] = await connection.execute('SELECT * FROM employee');
//     const [rows] = await connection.execute('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;');
//     await connection.end();
//     return rows;
// },

//================================================================================================================
// ✅ View All Departments
//================================================================================================================

async viewAllDepartments() {
    const connection = await this.connection();
    const [rows] = await connection.execute(`
        SELECT 
            department.id, 
            department.name
        FROM
            department
        `);
    await connection.end();
    return rows;
},

//================================================================================================================
// TODO: Add Department
//================================================================================================================

// async viewAllEmployees() {
//     const connection = await this.connection();
//     //const [rows] = await connection.execute('SELECT * FROM employee');
//     const [rows] = await connection.execute('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;');
//     await connection.end();
//     return rows;
// },

//================================================================================================================
// TODO: Quit
//================================================================================================================











}


module.exports = employeeDb