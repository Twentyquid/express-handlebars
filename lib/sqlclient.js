import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'joma',
    password: 'joma1234',
    database: 'finance',
});


export default connection;