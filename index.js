const inquirer = require('inquirer');
// const chalk = require('chalk'); //custom colors
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();



// Function to connect to the database
async function connectToDatabase() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return connection;
  }





  
// Function to get employee list
async function getEmployeeList() {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id, name, role FROM employees');
    await connection.end();
    return rows;
  }



























  const questions = inquirer
  .prompt( [
    {
        type: 'list',
        name: 'start-menu',
        message: `What would you like to do? (Move up and down using the arrow keys to reveal more choices.)`,
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View ALl Departments', 'Add Department', 'Quit'],
    },
  ]);


