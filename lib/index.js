//FIXME: how to send user back to start-menu when finished with task


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
        console.log(rows);
        return rows;
    },

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
        // await connection.end();
        // console.log({roles: rows});
        return rows;
    },

    //================================================================================================================
    // ✅ Add Employee
    //================================================================================================================
    
    async addEmployee(employee) {
       
        const connection = await employeeDb.connection();

        try {

        const [result] = await connection.execute(`
         INSERT INTO employee (first_name, last_name, role_id, manager_id)
         VALUES (?, ?, ?, ?)`, [employee.firstName, employee.lastName, employee.roleId, employee.managerId]);
        await connection.end();
        console.log(`Employee ${employee.firstName} ${employee.lastName} was added!`)
        return result;

        } catch (error) {
            console.error('Error adding employee, please try again:', error);
        } 
      
    },

    //================================================================================================================
    // ✅ Update Employee Role
    //================================================================================================================

    async updateEmployeeRole(employeeId, roleId) {
        const connection = await employeeDb.connection();

        try {

            const [result] = await connection.execute(`
            UPDATE employee
            SET role_id = ?
            WHERE id = ?`,
            [roleId, employeeId]
        );
        await connection.end();
        console.log(`Employee role updated successfully!`);
        return result; 
        } catch (error) {
            console.error('Error updating employee role, please try again.', error);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    //================================================================================================================
    // ✅ Add Role
    //================================================================================================================
    async addRole({ title, salary, departmentId }) {
        const connection = await this.connection();
        try {
            const [result] = await connection.execute(`
                INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`, [title, salary, departmentId]);
            await connection.end();
            console.log(`Role ${title} was added!`);
            return result;
        } catch (error) {
            console.error('Error adding role, please try again:', error);
        }
    },






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







    //================================================================================================================
    // TODO: Quit
    //================================================================================================================











}


module.exports = employeeDb