const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const {
    surgery_name,
    surgery_date,
    details
  } = req.body;

  const sql = `
    INSERT INTO surgeries
    (
      patient_id,
      surgery_name,
      surgery_date,
      details
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      surgery_name,
      surgery_date,
      details
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Surgery added",
        id: result.insertId,
      });
    }
  );
});

module.exports = router;