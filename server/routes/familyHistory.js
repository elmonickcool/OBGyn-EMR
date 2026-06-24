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

module.exports = router;