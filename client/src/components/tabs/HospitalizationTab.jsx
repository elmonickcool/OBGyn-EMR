import dayjs from "dayjs";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function HospitalizationTab({ patient, form, setForm }) {
  const saveHospitalization = async () => {
    if (!form.hospitalization_date) {
      alert("Please select a hospitalization date");
      return;
    }

    try {
      const res = await fetch(`http://192.168.0.101:3000/hospitalizations/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to save (HTTP ${res.status})`);
      }

      const data = await res.json();
      setForm({ hospitalization_details: "", hospitalization_date: "" });
      alert("Hospitalization saved successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Save hospitalization error:", err);
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
