import { Box, Typography, Checkbox, FormGroup, FormControlLabel, TextField, Button } from "@mui/material";

function ReviewOfSystemsTab({ patient, form, setForm }) {
  const saveReviewOfSystems = async () => {
    try {
      const res = await fetch(`http://localhost:3000/review-of-systems/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save review of systems");
      }

      alert("Review of systems saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review of Systems
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.fever || false}
              onChange={(e) => setForm({ ...form, fever: e.target.checked })}
            />
          }
          label="Fever"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.weight_loss || false}
              onChange={(e) => setForm({ ...form, weight_loss: e.target.checked })}
            />
          }
          label="Weight Loss"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.headache || false}
              onChange={(e) => setForm({ ...form, headache: e.target.checked })}
            />
          }
          label="Headache"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.chest_pain || false}
              onChange={(e) => setForm({ ...form, chest_pain: e.target.checked })}
            />
          }
          label="Chest Pain"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.shortness_of_breath || false}
              onChange={(e) => setForm({ ...form, shortness_of_breath: e.target.checked })}
            />
          }
          label="Shortness of Breath"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.abdominal_pain || false}
              onChange={(e) => setForm({ ...form, abdominal_pain: e.target.checked })}
            />
          }
          label="Abdominal Pain"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.urinary_symptoms || false}
              onChange={(e) => setForm({ ...form, urinary_symptoms: e.target.checked })}
            />
          }
          label="Urinary Symptoms"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.vaginal_bleeding_discharge || false}
              onChange={(e) => setForm({ ...form, vaginal_bleeding_discharge: e.target.checked })}
            />
          }
          label="Vaginal Bleeding/Discharge"
        />
      </FormGroup>

      <TextField
        label="Other Symptoms"
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
        value={form.ros_others || ""}
        onChange={(e) => setForm({ ...form, ros_others: e.target.value })}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveReviewOfSystems}>
        Save Review of Systems
      </Button>
    </Box>
  );
}

export default ReviewOfSystemsTab;
