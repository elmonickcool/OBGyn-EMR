const express = require("express");
const router = express.Router();
const db = require("../db");

/* ADD medical history */
router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const { condition_id, remarks } = req.body;

  const sql = `
    INSERT INTO patient_medical_history
    (patient_id, condition_id, remarks)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [patientId, condition_id, remarks], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Medical history saved",
      id: result.insertId,
    });
  });
});

/* GET medical history */
router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT pmh.*, mc.condition_name
    FROM patient_medical_history pmh
    JOIN medical_conditions mc
      ON pmh.condition_id = mc.condition_id
    WHERE pmh.patient_id = ?
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

module.exports = router;