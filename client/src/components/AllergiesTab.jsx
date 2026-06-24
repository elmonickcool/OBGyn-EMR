import { TextField, Button, Typography, MenuItem } from "@mui/material";

function AllergiesTab({ patient, form, setForm }) {
  const saveAllergy = async () => {
    try {
      const res = await fetch(`http://localhost:3000/allergies/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allergy_type: form.allergy_type,
          allergy_name: form.allergy_name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save allergy");
      }

      alert("Allergy saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Allergies
      </Typography>

      <TextField
        select
        fullWidth
        label="Allergy Type"
        SelectProps={{ native: true }}
        value={form.allergy_type || ""}
        onChange={(e) => setForm({ ...form, allergy_type: e.target.value })}
      >
        <MenuItem value="Food">Food</MenuItem>
        <MenuItem value="Drug">Drug</MenuItem>
        <MenuItem value="Environmental">Other</MenuItem>
      </TextField>

      <TextField
        label="Allergy Name"
        fullWidth
        sx={{ mt: 2 }}
        value={form.allergy_name || ""}
        onChange={(e) => setForm({ ...form, allergy_name: e.target.value })}
      />

      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={saveAllergy}
      >
        Save Allergy
      </Button>
    </>
  );
}

export default AllergiesTab;
