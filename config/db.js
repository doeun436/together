const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "cos", // MySQL 사용자 이름
  password: "cos1234", // MySQL 사용자 비밀번호
  database: "checklist_db", // 사용할 데이터베이스 이름
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = connection;
