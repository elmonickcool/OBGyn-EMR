const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medical_records",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});

/* ================= PATIENTS ================= */

// GET all patients
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET patient by ID
app.get("/patients/:id", (req, res) => {
  db.query(
    "SELECT * FROM patients WHERE patient_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!results.length) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json(results[0]);
    }
  );
});

// ADD patient
app.post("/patients", (req, res) => {
  const {
    first_name,
    last_name,
    age,
    birth_date,
    address,
    contact_num,
  } = req.body;

  const sql = `
    INSERT INTO patients
    (first_name, last_name, age, birth_date, address, contact_num)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, age, birth_date, address || null, contact_num],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Patient added successfully",
        patient_id: result.insertId,
      });
    }
  );
});

/* ================= CONDITIONS ================= */

app.get("/conditions", (req, res) => {
  db.query("SELECT * FROM medical_conditions", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/* ================= CONSULTATIONS ROUTES ================= */
app.use("/consultations", require("./routes/consultation"));

/* ================= MEDICAL HISTORY ROUTES ================= */
app.use("/medical-history", require("./routes/medicalHistory"));

/* ================= HOSPITALIZATION ROUTES ================= */
app.use("/hospitalizations", require("./routes/hospitalization"));

/* ================= SURGERIES ROUTES ================= */
app.use("/surgeries", require("./routes/surgeries"));

/* ================= ALLERGIES ROUTES ================= */
app.use("/allergies", require("./routes/allergies"));

/* ================= SERVER START ================= */
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});