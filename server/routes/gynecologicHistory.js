const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const {
    lmp,
    menarche_age,
    cycle_type,
    cycle_duration,
    dysmenorrhea,
    gravidity,
    parity,
    abortion_count,
    living_children,
    delivery_type,
    contraception,
  } = req.body;

  const sql = `
    INSERT INTO gynecologic_history (
      patient_id,
      lmp,
      menarche_age,
      cycle_type,
      cycle_duration,
      dysmenorrhea,
      gravidity,
      parity,
      abortion_count,
      living_children,
      delivery_type,
      contraception
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      lmp || null,
      menarche_age || null,
      cycle_type || null,
      cycle_duration || null,
      dysmenorrhea || false,
      gravidity || 0,
      parity || 0,
      abortion_count || 0,
      living_children || 0,
      delivery_type || null,
      contraception || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Gynecologic history insert error:", err);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Gynecologic history added",
        id: result.insertId,
      });
    }
  );
});

router.get("/:patientId", (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT *
    FROM gynecologic_history
    WHERE patient_id = ?
    ORDER BY gyne_id DESC
    LIMIT 1
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results[0] || null);
  });
});

module.exports = router;
