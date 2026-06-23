const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const { chief_complaint, hpi, notes } = req.body;

  const sql = `
    INSERT INTO consultation (
      patient_id,
      consultation_date,
      chief_complaint,
      history_of_present_illness,
      physician_note
    )
    VALUES (?, NOW(), ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      consultation_date = NOW(),
      chief_complaint = VALUES(chief_complaint),
      history_of_present_illness = VALUES(history_of_present_illness),
      physician_note = VALUES(physician_note)
  `;

  db.query(
    sql,
    [patientId, chief_complaint, hpi, notes],
    (err, result) => {
      if (err) {
        console.error("UPSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Consultation saved (upsert)",
        affectedRows: result.affectedRows,
      });
    }
  );
});

module.exports = router;