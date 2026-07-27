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

router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT *
    FROM consultation
    WHERE patient_id = ?
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json(null);
    }
  });
});

// ── Follow-up consultations ────────────────────────────────────────────────

router.post("/:patientId/followups", (req, res) => {
  const { patientId } = req.params;
  const { follow_up_date, notes } = req.body;

  if (!notes || !notes.trim()) {
    return res.status(400).json({ error: "Follow-up notes are required" });
  }

  const sql = `
    INSERT INTO consultation_followup (patient_id, follow_up_date, notes)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [patientId, follow_up_date, notes], (err, result) => {
    if (err) {
      console.error("FOLLOW-UP INSERT ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Follow-up consultation saved",
      id: result.insertId,
    });
  });
});

router.get("/:patientId/followups", (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT id, patient_id, follow_up_date, notes, created_at
    FROM consultation_followup
    WHERE patient_id = ?
    ORDER BY follow_up_date DESC, created_at DESC
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("FOLLOW-UP FETCH ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});
router.get("/dashboard/recent-followups", (req, res) => {
  const sql = `
    SELECT
      cf.id,
      cf.patient_id,
      cf.follow_up_date,
      cf.notes,
      cf.created_at,
      p.first_name,
      p.last_name
    FROM consultation_followup cf
    JOIN patients p ON p.patient_id = cf.patient_id
    ORDER BY cf.follow_up_date DESC, cf.created_at DESC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("RECENT FOLLOWUPS ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
module.exports = router;