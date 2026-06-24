import { useCallback } from "react";
import { TextField, Button } from "@mui/material";

function ConsultationTab({ patient, form, setForm }) {
  const handleSaveConsultation = useCallback(async () => {
    if (!form.chief_complaint?.trim()) {
      alert("Please enter a chief complaint");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/consultations/${patient.patient_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      alert("Consultation saved successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Save consultation error:", err);
    }
  }, [form, patient.patient_id]);

  return (
    <>
      <TextField
        label="Chief Complaint"
        fullWidth
        multiline
        rows={3}
        value={form.chief_complaint || ""}
        onChange={(e) =>
          setForm({
            ...form,
            chief_complaint: e.target.value,
          })
        }
      />

      <TextField
        label="History of Present Illness"
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
        value={form.hpi || ""}
        onChange={(e) =>
          setForm({
            ...form,
            hpi: e.target.value,
          })
        }
      />

      <TextField
        label="Physician Notes"
        fullWidth
        multiline
        rows={5}
        sx={{ mt: 2 }}
        value={form.notes || ""}
        onChange={(e) =>
          setForm({
            ...form,
            notes: e.target.value,
          })
        }
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={handleSaveConsultation}>
        Save Consultation
      </Button>
    </>
  );
}

export default ConsultationTab;
