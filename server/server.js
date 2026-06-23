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
  password: "",
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

// get all patients
app.get("/patients", (req, res) => {
    db.query("SELECT * FROM patients", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching patients" });
        }
        res.json(results);
    });
});

// get a patient by ID
app.get("/patients/:id", (req, res) => {
    const patientId = req.params.id;

    db.query("SELECT * FROM patients WHERE patient_id = ?", [patientId], (err, results) => {
        if(err) {
            return res.status(500).json({ error: "Error fetching patient" });
        }
        res.json(results[0]);
    });
});

//start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});