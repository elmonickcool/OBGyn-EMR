import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

function VitalSignsTab({ patient }) {
  const [form, setForm] = useState({
    weight: "",
    height: "",
    bmi: "",
    blood_pressure: "",
    pulse_rate: "",
    respiratory_rate: "",
    temperature: "",
    oxygen_saturation: "",
    pain_scale: "",
  });

  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [message, setMessage] = useState("");

  
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return "";

    const h = parseFloat(height) / 100;

    if (h <= 0) return "";

    return (parseFloat(weight) / (h * h)).toFixed(2);
  };


useEffect(() => {
  if (!patient?.patient_id) return;

  const loadVitalSigns = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/vital-signs/${patient.patient_id}`
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data) {
        setExists(true);

        setForm({
          weight: data.weight ?? "",
          height: data.height ?? "",
          bmi: data.bmi ?? "",
          blood_pressure: data.blood_pressure ?? "",
          pulse_rate: data.pulse_rate ?? "",
          respiratory_rate: data.respiratory_rate ?? "",
          temperature: data.temperature ?? "",
          oxygen_saturation: data.oxygen_saturation ?? "",
          pain_scale: data.pain_scale ?? "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadVitalSigns();
}, [patient?.patient_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...form,
      [name]: value,
    };

    updated.bmi = calculateBMI(updated.weight, updated.height);

    setForm(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const url = `http://localhost:3000/vital-signs/${patient.patient_id}`;

      const response = await fetch(url, {
        method: exists ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save vital signs");
      }

      setExists(true);
      setMessage("Vital signs saved successfully.");
    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3 }}>

      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 700 }}
      >
        Vital Signs
      </Typography>

      {message && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Height (cm)"
            name="height"
            type="number"
            value={form.height}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="BMI"
            name="bmi"
            value={form.bmi}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Blood Pressure"
            name="blood_pressure"
            placeholder="120/80"
            value={form.blood_pressure}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pulse Rate (bpm)"
            name="pulse_rate"
            type="number"
            value={form.pulse_rate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Respiratory Rate"
            name="respiratory_rate"
            type="number"
            value={form.respiratory_rate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Temperature (°C)"
            name="temperature"
            type="number"
            value={form.temperature}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Oxygen Saturation (%)"
            name="oxygen_saturation"
            type="number"
            value={form.oxygen_saturation}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Pain Scale (0-10)"
            name="pain_scale"
            type="number"
            inputProps={{
              min: 0,
              max: 10,
            }}
            value={form.pain_scale}
            onChange={handleChange}
          />
        </Grid>

      </Grid>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Vital Signs"}
        </Button>
      </Box>

    </Paper>
  );
}

export default VitalSignsTab;