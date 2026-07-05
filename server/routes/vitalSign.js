const express = require("express");
const router = express.Router();
const db = require("../db");

// GET
router.get("/:patientId", async (req, res) => {
  const { patientId } = req.params;
  try {
    const [results] = await db.query(
      "SELECT * FROM vital_signs WHERE patient_id = ? LIMIT 1",
      [patientId]
    );
    if (results.length === 0) {
      return res.status(404).json({ message: "Vital signs not found" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST
router.post("/:patientId", async (req, res) => {
  const { patientId } = req.params;
  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required." });
  }

  const {
    weight, height, bmi, blood_pressure, pulse_rate,
    respiratory_rate, temperature, oxygen_saturation, pain_scale,
  } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT vital_sign_id FROM vital_signs WHERE patient_id = ?",
      [patientId]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: "Vital signs already exist. Use UPDATE instead." });
    }

    const sql = `
      INSERT INTO vital_signs
      (patient_id, weight, height, bmi, blood_pressure, pulse_rate, respiratory_rate, temperature, oxygen_saturation, pain_scale)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `;

    const [result] = await db.query(sql, [
      patientId,
      weight || null, height || null, bmi || null, blood_pressure || null,
      pulse_rate || null, respiratory_rate || null, temperature || null,
      oxygen_saturation || null, pain_scale || null,
    ]);

    res.status(201).json({
      message: "Vital signs added successfully.",
      vital_sign_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT
router.put("/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const {
    weight, height, bmi, blood_pressure, pulse_rate,
    respiratory_rate, temperature, oxygen_saturation, pain_scale,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE vital_signs SET
        weight=?, height=?, bmi=?, blood_pressure=?, pulse_rate=?,
        respiratory_rate=?, temperature=?, oxygen_saturation=?, pain_scale=?
       WHERE patient_id=?`,
      [
        weight || null, height || null, bmi || null, blood_pressure || null,
        pulse_rate || null, respiratory_rate || null, temperature || null,
        oxygen_saturation || null, pain_scale || null, patientId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vital signs not found." });
    }
    res.json({ message: "Vital signs updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:patientId", async (req, res) => {
  const { patientId } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM vital_signs WHERE patient_id = ?",
      [patientId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vital signs not found." });
    }
    res.json({ message: "Vital signs deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;