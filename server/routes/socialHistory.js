const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:patientId", (req, res) => {
  const { patientId } = req.params;
  const {
    smoking,
    sticks_per_day,
    smoking_years,
    alcohol,
    alcohol_details,
    illicit_drugs,
    drug_details,
    diet,
    exercise,
    living_situation,
    exposure_history,
  } = req.body;

  const sql = `
    INSERT INTO social_history (
      patient_id,
      smoking,
      sticks_per_day,
      smoking_years,
      alcohol,
      alcohol_details,
      illicit_drugs,
      drug_details,
      diet,
      exercise,
      living_situation,
      exposure_history
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      smoking || false,
      sticks_per_day || null,
      smoking_years || null,
      alcohol || false,
      alcohol_details || null,
      illicit_drugs || false,
      drug_details || null,
      diet || null,
      exercise || null,
      living_situation || null,
      exposure_history || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Social history insert error:", err);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Social history added",
        id: result.insertId,
      });
    }
  );
});

module.exports = router;
