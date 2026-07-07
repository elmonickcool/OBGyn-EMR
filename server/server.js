
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

require("dotenv").config()
/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
  db.query("SELECT * FROM patients LIMIT 10 ORDER BY patient_id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/", (req, res) => {
  res.send("Medical Records API is running 🚀");
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
/* ================= DASHBOARD ================= */

app.get("/dashboard", (req, res) => {
  const dashboard = {};

  db.query(
    "SELECT COUNT(*) AS totalPatients FROM patients",
    (err, patients) => {
      if (err) return res.status(500).json({ error: err.message });

      dashboard.totalPatients = patients[0].totalPatients;

      db.query(
        `
        SELECT COUNT(*) AS todayConsultations
        FROM consultation
        WHERE DATE(created_at) = CURDATE()
        `,
        (err, consultations) => {
          if (err) return res.status(500).json({ error: err.message });

          dashboard.todayConsultations =
            consultations[0].todayConsultations;

          db.query(
            `
            SELECT COUNT(*) AS totalAllergies
            FROM allergies
            `,
            (err, allergies) => {
              if (err)
                return res.status(500).json({ error: err.message });

              dashboard.totalAllergies =
                allergies[0].totalAllergies;

              db.query(
                `
                SELECT COUNT(*) AS totalSurgeries
                FROM surgeries
                `,
                (err, surgeries) => {
                  if (err)
                    return res.status(500).json({ error: err.message });

                  dashboard.totalSurgeries =
                    surgeries[0].totalSurgeries;

                  res.json(dashboard);
                }
              );
            }
          );
        }
      );
    }
  );
});

// UPDATE patient
app.put("/patients/:id", (req, res) => {
  const { first_name, last_name, age, birth_date, address, contact_num } = req.body;
  const sql = `
    UPDATE patients
    SET first_name = ?, last_name = ?, age = ?, birth_date = ?, address = ?, contact_num = ?
    WHERE patient_id = ?
  `;

  db.query(
    sql,
    [first_name, last_name, age, birth_date, address || null, contact_num, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json({ message: "Patient updated successfully" });
    }
  );
});

// DELETE patient
app.delete("/patients/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE patient_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  });
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

/* ================= SOCIAL HISTORY ROUTES ================= */
app.use("/social-history", require("./routes/socialHistory"));

/* ================= FAMILY HISTORY ROUTES ================= */
app.use("/family-history", require("./routes/familyHistory"));

/* ================= GYNECOLOGIC HISTORY ROUTES ================= */
app.use("/gynecologic-history", require("./routes/gynecologicHistory"));

/* ================= REVIEW OF SYSTEMS ROUTES ================= */
app.use("/review-of-systems", require("./routes/reviewOfSystems"));

/* ================= VITAL SIGNS ROUTES ================= */
app.use("/vital-signs", require("./routes/vitalSign"));


/* ================= SERVER START ================= */
const PORT = process.env.PORT||3000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});