import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

export async function createTestConnection() {
    return mysql.createConnection(process.env.MYSQL_URL);
}

export async function getConnection() {
    return await createTestConnection();
}
