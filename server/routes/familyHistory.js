const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const { condition_name, remarks } = req.body;

  const sql = `
    INSERT INTO family_history
    (patient_id, condition_name, remarks)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [patientId, condition_name, remarks],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Family history added",
        id: result.insertId,
      });
    }
  );
});

router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT *
    FROM family_history
    WHERE patient_id = ?
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;