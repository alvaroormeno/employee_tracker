// Import MYSQL2 package which was installed using node
const mysql = require('mysql2');

// Code that connects application to the MYSQL DATA BASE
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'mysqlroot1',
      database: 'election'
    },
    console.log('Connected to the election database.')
);


module.exports = db;