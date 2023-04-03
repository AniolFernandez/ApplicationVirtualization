const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || '192.168.56.101',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'appvirt',
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        return;
    }
    console.log('Connected to database!');
});

module.exports = connection;