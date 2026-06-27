const express = require("express");
const router = express.Router();
const db = require("../db");

//
// GET Vital Signs
//
router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT *
    FROM vital_signs
    WHERE patient_id = ?
    LIMIT 1
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Vital signs not found",
      });
    }

    res.json(results[0]);
  });
});

//
// ADD Vital Signs
//
router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      message: "Patient ID is required.",
    });
  }

  const {
    weight,
    height,
    bmi,
    blood_pressure,
    pulse_rate,
    respiratory_rate,
    temperature,
    oxygen_saturation,
    pain_scale,
  } = req.body;

  // Check if patient already has vital signs
  db.query(
    "SELECT vital_sign_id FROM vital_signs WHERE patient_id = ?",
    [patientId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (rows.length > 0) {
        return res.status(409).json({
          message: "Vital signs already exist. Use UPDATE instead.",
        });
      }

      const sql = `
        INSERT INTO vital_signs
        (
          patient_id,
          weight,
          height,
          bmi,
          blood_pressure,
          pulse_rate,
          respiratory_rate,
          temperature,
          oxygen_saturation,
          pain_scale
        )
        VALUES (?,?,?,?,?,?,?,?,?,?)
      `;

      db.query(
        sql,
        [
          patientId,
          weight || null,
          height || null,
          bmi || null,
          blood_pressure || null,
          pulse_rate || null,
          respiratory_rate || null,
          temperature || null,
          oxygen_saturation || null,
          pain_scale || null,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json(err);
          }

          res.status(201).json({
            message: "Vital signs added successfully.",
            vital_sign_id: result.insertId,
          });
        }
      );
    }
  );
});

//
// UPDATE Vital Signs
//
router.put("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const {
    weight,
    height,
    bmi,
    blood_pressure,
    pulse_rate,
    respiratory_rate,
    temperature,
    oxygen_saturation,
    pain_scale,
  } = req.body;

  const sql = `
    UPDATE vital_signs
    SET
      weight = ?,
      height = ?,
      bmi = ?,
      blood_pressure = ?,
      pulse_rate = ?,
      respiratory_rate = ?,
      temperature = ?,
      oxygen_saturation = ?,
      pain_scale = ?
    WHERE patient_id = ?
  `;

  db.query(
    sql,
    [
      weight || null,
      height || null,
      bmi || null,
      blood_pressure || null,
      pulse_rate || null,
      respiratory_rate || null,
      temperature || null,
      oxygen_saturation || null,
      pain_scale || null,
      patientId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Vital signs not found.",
        });
      }

      res.json({
        message: "Vital signs updated successfully.",
      });
    }
  );
});

//
// DELETE Vital Signs
//
router.delete("/:patientId", (req, res) => {
  const { patientId } = req.params;

  db.query(
    "DELETE FROM vital_signs WHERE patient_id = ?",
    [patientId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Vital signs not found.",
        });
      }

      res.json({
        message: "Vital signs deleted successfully.",
      });
    }
  );
});

module.exports = router;