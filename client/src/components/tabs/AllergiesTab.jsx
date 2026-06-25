import { TextField, Button, Typography, MenuItem } from "@mui/material";

function AllergiesTab({ patient, form, setForm }) {
  const saveAllergy = async () => {
    if (!form.allergy_type?.trim() || !form.allergy_name?.trim()) {
      alert("Please enter allergy type and name");
      return;
    }

    try {
      const res = await fetch(`http://0.0.0.0:3000/allergies/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allergy_type: form.allergy_type,
          allergy_name: form.allergy_name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to save allergy (HTTP ${res.status})`);
      }

      const data = await res.json();
      setForm({ allergy_type: "", allergy_name: "" });
      alert("Allergy saved successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Save allergy error:", err);
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
