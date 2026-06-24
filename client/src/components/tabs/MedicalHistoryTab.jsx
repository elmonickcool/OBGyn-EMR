import { useEffect, useState, useCallback } from "react";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";

function MedicalHistoryTab({ patient, form, setForm }) {
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const res = await fetch("http://localhost:3000/conditions");
        const data = await res.json();
        setConditions(data);
      } catch (err) {
        console.error("Error fetching conditions:", err);
      }
    };

    fetchConditions();
  }, []);

  const handleToggleCondition = useCallback((id) => {
    setSelectedConditions((current) =>
      current.includes(id) ? current.filter((condition) => condition !== id) : [...current, id],
    );
  }, []);

  const saveMedicalHistory = useCallback(async () => {
    try {
      await Promise.all(
        selectedConditions.map((condition_id) =>
          fetch(`http://localhost:3000/medical-history/${patient.patient_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              condition_id,
              remarks: form.remarks || "",
            }),
          }),
        ),
      );

      alert("Medical history saved!");
    } catch (err) {
      alert(err.message);
    }
  }, [patient.patient_id, form.remarks, selectedConditions]);

  return (
    <>
      <Typography variant="h6">Medical Conditions</Typography>

      <FormGroup>
        {conditions.map((condition) => (
          <FormControlLabel
            key={condition.condition_id}
            control={
              <Checkbox
                checked={selectedConditions.includes(condition.condition_id)}
                onChange={() => handleToggleCondition(condition.condition_id)}
              />
            }
            label={condition.condition_name}
          />
        ))}
      </FormGroup>

      <TextField
        label="Remarks"
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        value={form.remarks || ""}
        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveMedicalHistory}>
        Save Medical History
      </Button>
    </>
  );
}

export default MedicalHistoryTab;
