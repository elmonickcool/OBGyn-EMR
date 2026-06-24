import dayjs from "dayjs";
import { TextField, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function SurgeryTab({ patient, form, setForm }) {
  const saveSurgery = async () => {
    if (!form.surgery_name?.trim() || !form.surgery_date) {
      alert("Please enter surgery name and date");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/surgeries/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surgery_name: form.surgery_name,
          surgery_date: form.surgery_date,
          details: form.surgery_details,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to save surgery (HTTP ${res.status})`);
      }

      const data = await res.json();
      setForm({ surgery_name: "", surgery_date: "", surgery_details: "" });
      alert("Surgery record saved successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Save surgery error:", err);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Surgery Record
      </Typography>

      <TextField
        label="Surgery Name"
        fullWidth
        value={form.surgery_name || ""}
        onChange={(e) =>
          setForm({
            ...form,
            surgery_name: e.target.value,
          })
        }
      />

      <DatePicker
        label="Surgery Date"
        value={form.surgery_date ? dayjs(form.surgery_date) : null}
        onChange={(newValue) =>
          setForm({
            ...form,
            surgery_date: newValue ? newValue.format("YYYY-MM-DD") : "",
          })
        }
        slotProps={{
          textField: {
            fullWidth: true,
            sx: { mt: 2 },
          },
        }}
      />

      <TextField
        label="Details"
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
        value={form.surgery_details || ""}
        onChange={(e) =>
          setForm({
            ...form,
            surgery_details: e.target.value,
          })
        }
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={saveSurgery}>
        Save Surgery
      </Button>
    </>
  );
}

export default SurgeryTab;
