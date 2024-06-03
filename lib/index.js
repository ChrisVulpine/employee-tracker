const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const dotenv = require('dotenv');
const chalk = require('chalk');
dotenv.config();

//================================================================================================================
// Connect to Database
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
// View All Employees
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
// View All Roles
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
        return rows;
    },

//================================================================================================================
// Add Employee
//================================================================================================================
    
    async addEmployee(employee) {
        const { firstName, lastName, roleId, managerId } = employee;
        const connection = await this.connection();
        try {
            const [result] = await connection.execute(`
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`, [firstName, lastName, roleId, managerId || null]);

            await connection.end();
            console.log(''); //to aesthetically space results
            console.log(`Employee, ${chalk.green(`${firstName} ${lastName}`)} was added!`);
            return result;
        } catch (error) {
            console.error('Error adding employee, please try again:', error);
        }
    },

//================================================================================================================
// Update Employee Role
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
        console.log(''); //to aesthetically space results
        console.log(`Employee`, chalk.green(`role`), `updated successfully!`);
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
// Add Role
//================================================================================================================

    async addRole({ title, salary, departmentId }) {
        const connection = await this.connection();
        try {
            const [result] = await connection.execute(`
                INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`, [title, salary, departmentId]);
            await connection.end();
            console.log(''); //to aesthetically space results
            console.log(`Role ${chalk.green(`${title}`)} was added!`);
            return result;
        } catch (error) {
            console.error('Error adding role, please try again:', error);
        }
    },

//================================================================================================================
// View All Departments
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
// Add Department
//================================================================================================================

    async addDepartment(departmentName) {
        const connection = await this.connection();
        try {
            const [result] = await connection.execute(`
                INSERT INTO department (name)
                VALUES (?)`,
                [departmentName]
            );
            await connection.end();
            console.log(''); //to aesthetically space results
            console.log(`Department ${chalk.green(`${departmentName}`)} added successfully!`);
            return result;
        } catch (error) {
            console.error('Error adding department:', error);
            throw error;
        }
    },
}

module.exports = employeeDb