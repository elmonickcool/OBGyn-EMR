import { TextField, Button, Typography } from "@mui/material";

function FamilyHistoryTab({ patient, form, setForm }) {
  const saveFamilyHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/family-history/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition_name: form.family_condition,
          remarks: form.family_remarks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }

      alert("Family history saved!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Typography variant="h6">Family History</Typography>

      <TextField
        label="Condition"
        fullWidth
        value={form.family_condition || ""}
        onChange={(e) => setForm({ ...form, family_condition: e.target.value })}
      />

      <TextField
        label="Remarks"
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        value={form.family_remarks || ""}
        onChange={(e) => setForm({ ...form, family_remarks: e.target.value })}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveFamilyHistory}>
        Save Family History
      </Button>
    </>
  );
}

export default FamilyHistoryTab;
