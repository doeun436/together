// db.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // MySQL 사용자명
  password: "cos1234", // MySQL 비밀번호
  database: "checklist_app",
});

module.exports = pool.promise();
