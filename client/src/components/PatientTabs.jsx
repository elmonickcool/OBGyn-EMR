import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";

import TabPanel from "./TabPanel";

function PatientTabs({ patient, tab, setTab, form, setForm }) {
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);

  /* ================= FETCH CONDITIONS ================= */
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

  /* ================= CONSULTATION SAVE ================= */
  const handleSaveConsultation = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/consultations/${patient.patient_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save");

      alert("Saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= TOGGLE CHECKBOX ================= */
  const handleToggleCondition = (id) => {
    if (selectedConditions.includes(id)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== id));
    } else {
      setSelectedConditions([...selectedConditions, id]);
    }
  };

  /* ================= SAVE MEDICAL HISTORY ================= */
  const saveMedicalHistory = async () => {
    try {
      await Promise.all(
        selectedConditions.map((condition_id) =>
          fetch(
            `http://localhost:3000/medical-history/${patient.patient_id}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                condition_id,
                remarks: form.remarks || "",
              }),
            }
          )
        )
      );

      alert("Medical history saved!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box>
      {/* ================= TABS ================= */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Patient Info" />
        <Tab label="Consultation" />
        <Tab label="Notes" />
        <Tab label="Medical History" />
      </Tabs>

      {/* ================= PATIENT INFO ================= */}
      <TabPanel value={tab} index={0}>
        <Typography>ID: {patient.patient_id}</Typography>
        <Typography>
          Name: {patient.first_name} {patient.last_name}
        </Typography>
        <Typography>Age: {patient.age}</Typography>
        <Typography>Contact: {patient.contact_num || "N/A"}</Typography>
      </TabPanel>

      {/* ================= CONSULTATION ================= */}
      <TabPanel value={tab} index={1}>
        <TextField
          label="Chief Complaint"
          fullWidth
          multiline
          rows={4}
          value={form.chief_complaint}
          onChange={(e) =>
            setForm({ ...form, chief_complaint: e.target.value })
          }
        />

        <TextField
          label="History of Present Illness"
          fullWidth
          multiline
          rows={4}
          sx={{ mt: 2 }}
          value={form.hpi}
          onChange={(e) => setForm({ ...form, hpi: e.target.value })}
        />

        <Button sx={{ mt: 2 }} variant="contained" onClick={handleSaveConsultation}>
          Save Consultation
        </Button>
      </TabPanel>

      {/* ================= NOTES ================= */}
      <TabPanel value={tab} index={2}>
        <TextField
          label="Physician Notes"
          fullWidth
          multiline
          rows={5}
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />
      </TabPanel>

      {/* ================= MEDICAL HISTORY ================= */}
      <TabPanel value={tab} index={3}>
        <Typography variant="h6">Medical Conditions</Typography>

        <FormGroup>
          {conditions.map((c) => (
            <FormControlLabel
              key={c.condition_id}
              control={
                <Checkbox
                  checked={selectedConditions.includes(c.condition_id)}
                  onChange={() => handleToggleCondition(c.condition_id)}
                />
              }
              label={c.condition_name}
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
          onChange={(e) =>
            setForm({ ...form, remarks: e.target.value })
          }
        />

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={saveMedicalHistory}
        >
          Save Medical History
        </Button>
      </TabPanel>
    </Box>
  );
}

export default PatientTabs;