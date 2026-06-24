import { Box, Typography, TextField, Button, Checkbox, FormGroup, FormControlLabel, MenuItem } from "@mui/material";

function SocialHistoryTab({ patient, form, setForm }) {
  const saveSocialHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/social-history/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save social history");
      }

      alert("Social history saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Social History
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.smoking || false}
              onChange={(e) => setForm({ ...form, smoking: e.target.checked })}
            />
          }
          label="Smoking"
        />
        {form.smoking && (
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Sticks per day"
              type="number"
              fullWidth
              value={form.sticks_per_day || ""}
              onChange={(e) => setForm({ ...form, sticks_per_day: e.target.value })}
            />
            <TextField
              label="Smoking years"
              type="number"
              fullWidth
              value={form.smoking_years || ""}
              onChange={(e) => setForm({ ...form, smoking_years: e.target.value })}
            />
          </Box>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={form.alcohol || false}
              onChange={(e) => setForm({ ...form, alcohol: e.target.checked })}
            />
          }
          label="Alcohol use"
        />
        {form.alcohol && (
          <TextField
            label="Alcohol details"
            fullWidth
            multiline
            rows={2}
            value={form.alcohol_details || ""}
            onChange={(e) => setForm({ ...form, alcohol_details: e.target.value })}
          />
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={form.illicit_drugs || false}
              onChange={(e) => setForm({ ...form, illicit_drugs: e.target.checked })}
            />
          }
          label="Illicit drugs"
        />
        {form.illicit_drugs && (
          <TextField
            label="Drug details"
            fullWidth
            multiline
            rows={2}
            value={form.drug_details || ""}
            onChange={(e) => setForm({ ...form, drug_details: e.target.value })}
          />
        )}
      </FormGroup>

      <TextField
        label="Diet"
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        value={form.diet || ""}
        onChange={(e) => setForm({ ...form, diet: e.target.value })}
      />

      <TextField
        select
        fullWidth
        label="Exercise"
        sx={{ mt: 2 }}
        value={form.exercise || "None"}
        onChange={(e) => setForm({ ...form, exercise: e.target.value })}
      >
        <MenuItem value="None">None</MenuItem>
        <MenuItem value="Occasional">Occasional</MenuItem>
        <MenuItem value="Regular">Regular</MenuItem>
      </TextField>

      <TextField
        label="Living Situation"
        fullWidth
        sx={{ mt: 2 }}
        value={form.living_situation || ""}
        onChange={(e) => setForm({ ...form, living_situation: e.target.value })}
      />

      <TextField
        label="Exposure History"
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        value={form.exposure_history || ""}
        onChange={(e) => setForm({ ...form, exposure_history: e.target.value })}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveSocialHistory}>
        Save Social History
      </Button>
    </Box>
  );
}

export default SocialHistoryTab;
