const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medical_records",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to database");
  }
});

module.exports = db;