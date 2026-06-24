const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const {
    fever,
    weight_loss,
    headache,
    chest_pain,
    shortness_of_breath,
    abdominal_pain,
    urinary_symptoms,
    vaginal_bleeding_discharge,
    ros_others,
  } = req.body;

  // First, get the latest consultation for this patient
  const consultationQuery = `
    SELECT consultation_id FROM consultation
    WHERE patient_id = ?
    ORDER BY consultation_date DESC
    LIMIT 1
  `;

  db.query(consultationQuery, [patientId], (err, consultationResults) => {
    if (err) {
      console.error("Error fetching consultation:", err);
      return res.status(500).json({ error: err.message });
    }

    if (!consultationResults || consultationResults.length === 0) {
      return res.status(400).json({ error: "No consultation found for this patient. Please save consultation first." });
    }

    const consultationId = consultationResults[0].consultation_id;

    const sql = `
      INSERT INTO review_of_systems (
        consultation_id,
        fever,
        weight_loss,
        headache,
        chest_pain,
        shortness_of_breath,
        abdominal_pain,
        urinary_symptoms,
        vaginal_bleeding_discharge,
        others
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        consultationId,
        fever || false,
        weight_loss || false,
        headache || false,
        chest_pain || false,
        shortness_of_breath || false,
        abdominal_pain || false,
        urinary_symptoms || false,
        vaginal_bleeding_discharge || false,
        ros_others || null,
      ],
      (err, result) => {
        if (err) {
          console.error("Review of systems insert error:", err);
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: "Review of systems added",
          id: result.insertId,
        });
      }
    );
  });
});

router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const consultationQuery = `
    SELECT consultation_id FROM consultation
    WHERE patient_id = ?
    ORDER BY consultation_date DESC
    LIMIT 1
  `;

  db.query(consultationQuery, [patientId], (err, consultationResults) => {
    if (err) {
      console.error("Error fetching consultation:", err);
      return res.status(500).json({ error: err.message });
    }

    if (!consultationResults || consultationResults.length === 0) {
      return res.json(null);
    }

    const consultationId = consultationResults[0].consultation_id;
    const sql = `
      SELECT *
      FROM review_of_systems
      WHERE consultation_id = ?
      ORDER BY ros_id DESC
      LIMIT 1
    `;

    db.query(sql, [consultationId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      res.json(results[0] || null);
    });
  });
});

module.exports = router;
