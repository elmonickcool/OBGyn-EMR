const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const { allergy_type, allergy_name } = req.body;

  const sql = `
    INSERT INTO allergies
    (
      patient_id,
      allergy_type,
      allergy_name
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      allergy_type,
      allergy_name
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Allergy added",
        id: result.insertId,
      });
    }
  );
});

router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT *
    FROM allergies
    WHERE patient_id = ?
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