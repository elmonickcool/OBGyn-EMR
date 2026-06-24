import dayjs from "dayjs";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function HospitalizationTab({ patient, form, setForm }) {
  const saveHospitalization = async () => {
    try {
      const res = await fetch(`http://localhost:3000/hospitalizations/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      alert("Hospitalization saved!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <TextField
        label="Hospitalization Details"
        fullWidth
        multiline
        rows={4}
        value={form.hospitalization_details || ""}
        onChange={(e) =>
          setForm({ ...form, hospitalization_details: e.target.value })
        }
      />
      <DatePicker
        label="Hospitalization Date"
        value={form.hospitalization_date ? dayjs(form.hospitalization_date) : null}
        onChange={(newValue) =>
          setForm({
            ...form,
            hospitalization_date: newValue ? newValue.format("YYYY-MM-DD") : "",
          })
        }
        slotProps={{
          textField: {
            fullWidth: true,
            sx: { mt: 2 },
          },
        }}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveHospitalization}>
        Save Hospitalization
      </Button>
    </>
  );
}

export default HospitalizationTab;
