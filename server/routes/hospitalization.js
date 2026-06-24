const express = require('express');
const router = express.Router();
const db = require('../db');

// Add hospitalization record
router.post('/:patientId', (req, res) => {
  const { patientId } = req.params;
  const { hospitalization_date, hospitalization_details} = req.body;

  const sql = `
    INSERT INTO hospitalizations (patient_id, details, hospitalization_date)
    VALUES (?, ?, ?)
  `;  

    db.query(sql, [patientId, hospitalization_details, hospitalization_date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Hospitalization record added',
      id: result.insertId,
    });
});
});

router.get('/:patientId', (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT *
    FROM hospitalizations
    WHERE patient_id = ?
    ORDER BY hospitalization_date DESC
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
