// import required modules
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// create an instance of express
const app = express();
// set up middleware
app.use(cors());
app.use(express.json());
// create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "medical_records",
});
// connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});