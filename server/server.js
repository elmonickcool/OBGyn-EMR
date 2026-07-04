const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Connector } = require("@google-cloud/cloud-sql-connector");
const mysql = require("mysql2/promise");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= CLOUD SQL CONNECTOR ================= */

const connector = new Connector();
let db;

async function initDB() {
  try {
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
      ipType: "PUBLIC",
    });

    db = await mysql.createConnection({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to Cloud SQL (Connector)");

    // 🚀 START SERVER ONLY AFTER DB CONNECTS
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB Connection failed:", err);
  }
}

initDB();

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Medical Records API is running 🚀");
});

/* ================= PATIENTS ================= */

// GET all patients
app.get("/patients", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patients");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET patient by ID
app.get("/patients/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD patient
app.post("/patients", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      age,
      birth_date,
      address,
      contact_num,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO patients 
      (first_name, last_name, age, birth_date, address, contact_num)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, age, birth_date, address || null, contact_num]
    );

    res.status(201).json({
      message: "Patient added successfully",
      patient_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE patient
app.put("/patients/:id", async (req, res) => {
  try {
    const { first_name, last_name, age, birth_date, address, contact_num } =
      req.body;

    const [result] = await db.query(
      `UPDATE patients
       SET first_name=?, last_name=?, age=?, birth_date=?, address=?, contact_num=?
       WHERE patient_id=?`,
      [
        first_name,
        last_name,
        age,
        birth_date,
        address || null,
        contact_num,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE patient
app.delete("/patients/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM patients WHERE patient_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CONDITIONS ================= */
app.get("/conditions", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM medical_conditions");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DASHBOARD ================= */
app.get("/dashboard", async (req, res) => {
  try {
    const dashboard = {};

    const [patients] = await db.query(
      "SELECT COUNT(*) AS totalPatients FROM patients"
    );
    dashboard.totalPatients = patients[0].totalPatients;

    const [consultations] = await db.query(`
      SELECT COUNT(*) AS todayConsultations
      FROM consultations
      WHERE DATE(created_at) = CURDATE()
    `);
    dashboard.todayConsultations = consultations[0].todayConsultations;

    const [allergies] = await db.query(
      "SELECT COUNT(*) AS totalAllergies FROM allergies"
    );
    dashboard.totalAllergies = allergies[0].totalAllergies;

    const [surgeries] = await db.query(
      "SELECT COUNT(*) AS totalSurgeries FROM surgeries"
    );
    dashboard.totalSurgeries = surgeries[0].totalSurgeries;

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ROUTES ================= */
app.use("/consultations", require("./routes/consultation"));
app.use("/medical-history", require("./routes/medicalHistory"));
app.use("/hospitalizations", require("./routes/hospitalization"));
app.use("/surgeries", require("./routes/surgeries"));
app.use("/allergies", require("./routes/allergies"));
app.use("/social-history", require("./routes/socialHistory"));
app.use("/family-history", require("./routes/familyHistory"));
app.use("/gynecologic-history", require("./routes/gynecologicHistory"));
app.use("/review-of-systems", require("./routes/reviewOfSystems"));
app.use("/vital-signs", require("./routes/vitalSign"));

/* ================= SERVER START ================= */
