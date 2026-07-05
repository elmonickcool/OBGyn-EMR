import { useEffect, useState } from "react";
import {
  Box, Button, Grid, Typography, TextField, Snackbar, Alert, Stack, Chip,
} from "@mui/material";
import { API_URL } from "../../config.js";

// ─── Shared Vibrant Tokens ─────────────────────────────────────────────────
const t = {
  fuchsia:   "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet:    "#7C4DFF",
  violetLt:  "#EDE7F6",
  teal:      "#00BFA5",
  tealLt:    "#E0F2F1",
  coral:     "#FF5252",
  coralLt:   "#FFEBEE",
  amber:     "#FF8F00",
  amberLt:   "#FFF8E1",
  sky:       "#0288D1",
  skyLt:     "#E1F5FE",
  ink:       "#1A0533",
  midgray:   "#7B6F84",
  hairline:  "#EDE0F2",
  offwhite:  "#FDFAFF",
  white:     "#FFFFFF",
};

// Per-field colour + icon config
const fieldConfig = [
  { name: "weight",            label: "Weight",            unit: "kg",    emoji: "⚖️",  accent: t.violet,  type: "number", md: 6 },
  { name: "height",            label: "Height",            unit: "cm",    emoji: "📏",  accent: t.violet,  type: "number", md: 6 },
  { name: "bmi",               label: "BMI",               unit: "",      emoji: "🧮",  accent: t.teal,    type: "text",   md: 6, readOnly: true },
  { name: "blood_pressure",    label: "Blood Pressure",    unit: "mmHg",  emoji: "💉",  accent: t.coral,   type: "text",   md: 6, placeholder: "120/80" },
  { name: "pulse_rate",        label: "Pulse Rate",        unit: "bpm",   emoji: "💓",  accent: t.fuchsia, type: "number", md: 6 },
  { name: "respiratory_rate",  label: "Respiratory Rate",  unit: "/min",  emoji: "🌬️", accent: t.sky,     type: "number", md: 6 },
  { name: "temperature",       label: "Temperature",       unit: "°C",    emoji: "🌡️", accent: t.amber,   type: "number", md: 6 },
  { name: "oxygen_saturation", label: "O₂ Saturation",    unit: "%",     emoji: "🫁",  accent: t.sky,     type: "number", md: 6 },
  { name: "pain_scale",        label: "Pain Scale",        unit: "/10",   emoji: "😣",  accent: t.coral,   type: "number", md: 12, min: 0, max: 10 },
];

// BMI classification
function bmiLabel(bmi) {
  const v = parseFloat(bmi);
  if (!v) return null;
  if (v < 18.5) return { label: "Underweight", color: t.sky };
  if (v < 25)   return { label: "Normal",       color: t.teal };
  if (v < 30)   return { label: "Overweight",   color: t.amber };
  return               { label: "Obese",         color: t.coral };
}

function calculateBMI(weight, height) {
  if (!weight || !height) return "";
  const h = parseFloat(height) / 100;
  if (h <= 0) return "";
  return (parseFloat(weight) / (h * h)).toFixed(2);
}

const fieldSx = (accent, readOnly) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    background: readOnly ? `${accent}0A` : t.offwhite,
    fontSize: 14,
    "& fieldset": { borderColor: readOnly ? `${accent}44` : t.hairline, borderWidth: "1.5px" },
    "&:hover fieldset": !readOnly && { borderColor: accent },
    "&.Mui-focused fieldset": { borderColor: accent, borderWidth: "2px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: accent },
});

function VitalSignsTab({ patient }) {
  const [form, setForm] = useState({
    weight: "", height: "", bmi: "", blood_pressure: "",
    pulse_rate: "", respiratory_rate: "", temperature: "",
    oxygen_saturation: "", pain_scale: "",
  });
  const [loading, setLoading] = useState(false);
  const [exists,  setExists]  = useState(false);
  const [toast,   setToast]   = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  useEffect(() => {
    if (!patient?.patient_id) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/vital-signs/${patient.patient_id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data) {
          setExists(true);
          setForm({
            weight:            data.weight            ?? "",
            height:            data.height            ?? "",
            bmi:               data.bmi               ?? "",
            blood_pressure:    data.blood_pressure    ?? "",
            pulse_rate:        data.pulse_rate        ?? "",
            respiratory_rate:  data.respiratory_rate  ?? "",
            temperature:       data.temperature       ?? "",
            oxygen_saturation: data.oxygen_saturation ?? "",
            pain_scale:        data.pain_scale        ?? "",
          });
        }
      } catch (err) { console.error(err); }
    })();
  }, [patient?.patient_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    updated.bmi = calculateBMI(updated.weight, updated.height);
    setForm(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/vital-signs/${patient.patient_id}`,
        { method: exists ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
      );
      if (!res.ok) throw new Error("Failed to save vital signs");
      setExists(true);
      showToast("Vital signs saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const bmiInfo = bmiLabel(form.bmi);

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)`,
        border: `1.5px solid ${t.fuchsia}22`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Typography sx={{ fontSize: 20 }}>🩺</Typography>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.fuchsiaDk }}>Vital Signs</Typography>
            <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
              {patient.first_name} {patient.last_name} · {exists ? "Update existing record" : "No record yet — create one"}
            </Typography>
          </Box>
        </Stack>
        <Chip
          label={exists ? "Existing Record" : "New Record"}
          size="small"
          sx={{
            fontWeight: 700, fontSize: 10, height: 22, borderRadius: 1.5,
            backgroundColor: exists ? t.tealLt : t.amberLt,
            color: exists ? t.teal : t.amber,
            border: `1.5px solid ${exists ? t.teal : t.amber}33`,
          }}
        />
      </Box>

      {/* Fields grid */}
      <Grid container spacing={2}>
        {fieldConfig.map(({ name, label, unit, emoji, accent, type, md, readOnly, placeholder, min, max }) => (
          <Grid item xs={12} md={md} key={name}>
            <Box sx={{
              p: 2,
              borderRadius: 3,
              border: `1.5px solid ${t.hairline}`,
              background: t.white,
              "&:focus-within": { borderColor: accent, boxShadow: `0 0 0 3px ${accent}14` },
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}>
              {/* Field label */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Box sx={{
                  width: 26, height: 26, borderRadius: 1.5,
                  background: `${accent}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                }}>
                  {emoji}
                </Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {label}{unit && <span style={{ opacity: 0.6, marginLeft: 4 }}>({unit})</span>}
                </Typography>
                {/* BMI classification badge */}
                {name === "bmi" && bmiInfo && (
                  <Chip
                    label={bmiInfo.label}
                    size="small"
                    sx={{ ml: "auto", fontSize: 10, fontWeight: 700, height: 20, borderRadius: 1, backgroundColor: `${bmiInfo.color}18`, color: bmiInfo.color }}
                  />
                )}
              </Stack>

              <TextField
                fullWidth
                variant="outlined"
                name={name}
                type={type}
                placeholder={placeholder ?? ""}
                value={form[name]}
                onChange={handleChange}
                InputProps={{ readOnly: !!readOnly }}
                inputProps={{ ...(min !== undefined && { min }), ...(max !== undefined && { max }) }}
                sx={fieldSx(accent, readOnly)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 3, px: 4, py: 1.3, fontWeight: 800, fontSize: 14,
            background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
            boxShadow: `0 6px 20px ${t.fuchsia}44`,
            "&:hover": { background: `linear-gradient(135deg, ${t.fuchsiaDk}, #6200EA)`, boxShadow: `0 8px 24px ${t.fuchsia}55` },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {loading ? "Saving…" : "💾  Save Vital Signs"}
        </Button>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))} sx={{ borderRadius: 3, fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default VitalSignsTab;