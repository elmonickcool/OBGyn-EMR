import { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Chip, Snackbar, Alert, Grid } from "@mui/material";
import { API_URL } from "../../config";

// ─── Shared Vibrant Tokens ─────────────────────────────────────────────────
const t = {
  fuchsia:   "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet:    "#7C4DFF",
  violetLt:  "#EDE7F6",
  teal:      "#00BFA5",
  tealLt:    "#E0F2F1",
  ink:       "#1A0533",
  midgray:   "#7B6F84",
  hairline:  "#EDE0F2",
  offwhite:  "#FDFAFF",
  white:     "#FFFFFF",
};

const fieldSx = (accent) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    background: t.offwhite,
    fontSize: 14,
    "& fieldset": { borderColor: t.hairline, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: accent },
    "&.Mui-focused fieldset": { borderColor: accent, borderWidth: "2px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: accent },
});

// Each symptom mapped to a form key + icon
const symptoms = [
  { key: "fever",                      label: "Fever",                      emoji: "🌡️" },
  { key: "weight_loss",                label: "Weight Loss",                emoji: "⚖️" },
  { key: "headache",                   label: "Headache",                   emoji: "🤕" },
  { key: "chest_pain",                 label: "Chest Pain",                 emoji: "💢" },
  { key: "shortness_of_breath",        label: "Shortness of Breath",        emoji: "🫁" },
  { key: "abdominal_pain",             label: "Abdominal Pain",             emoji: "🤰" },
  { key: "urinary_symptoms",           label: "Urinary Symptoms",           emoji: "💧" },
  { key: "vaginal_bleeding_discharge", label: "Vaginal Bleeding/Discharge", emoji: "🌸" },
];

function SymptomPill({ symptom, checked, onToggle }) {
  return (
    <Box
      onClick={() => onToggle(symptom.key)}
      sx={{
        display: "flex", alignItems: "center", gap: 1.2,
        px: 2, py: 1.3, borderRadius: 2.5, cursor: "pointer", userSelect: "none",
        border: `1.5px solid ${checked ? t.fuchsia : t.hairline}`,
        background: checked
          ? `linear-gradient(90deg, ${t.fuchsiaLt}, ${t.violetLt})`
          : t.offwhite,
        boxShadow: checked ? `0 2px 10px ${t.fuchsia}22` : "none",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: t.fuchsia,
          background: checked
            ? `linear-gradient(90deg, ${t.fuchsiaLt}, ${t.violetLt})`
            : `${t.fuchsia}08`,
        },
      }}
    >
      <Box sx={{
        width: 20, height: 20, borderRadius: 1,
        border: `2px solid ${checked ? t.fuchsia : t.midgray + "66"}`,
        background: checked ? `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s",
      }}>
        {checked && <Typography sx={{ fontSize: 11, color: "#fff", fontWeight: 900, lineHeight: 1 }}>✓</Typography>}
      </Box>
      <Typography sx={{ fontSize: 13 }}>{symptom.emoji}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: checked ? 700 : 500, color: checked ? t.fuchsiaDk : t.ink, lineHeight: 1.2 }}>
        {symptom.label}
      </Typography>
    </Box>
  );
}

function ReviewOfSystemsTab({ patient, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const handleToggle = (key) => {
    setForm({ ...form, [key]: !form[key] });
  };

  const handleSelectAll = () => {
    const allOn = symptoms.every((s) => form[s.key]);
    const next = { ...form };
    symptoms.forEach((s) => { next[s.key] = !allOn; });
    setForm(next);
  };

  const saveReviewOfSystems = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/review-of-systems/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save review of systems");
      showToast("Review of systems saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const positiveCount = symptoms.filter((s) => form[s.key]).length;
  const allOn = symptoms.length > 0 && positiveCount === symptoms.length;

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)`,
        border: `1.5px solid ${t.fuchsia}22`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1,
      }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Typography sx={{ fontSize: 20 }}>📝</Typography>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.fuchsiaDk }}>Review of Systems</Typography>
            <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
              {patient.first_name} {patient.last_name} · Mark all positive findings
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {positiveCount > 0 && (
            <Chip
              label={`${positiveCount} positive`}
              size="small"
              sx={{ fontWeight: 700, fontSize: 11, height: 24, borderRadius: 1.5, backgroundColor: t.fuchsiaLt, color: t.fuchsiaDk, border: `1.5px solid ${t.fuchsia}33` }}
            />
          )}
          <Button
            size="small"
            onClick={handleSelectAll}
            sx={{
              fontSize: 11, fontWeight: 700, borderRadius: 2, px: 1.5,
              border: `1.5px solid ${t.fuchsia}44`, color: t.fuchsiaDk,
              "&:hover": { background: t.fuchsiaLt },
            }}
          >
            {allOn ? "Clear All" : "Mark All"}
          </Button>
        </Stack>
      </Box>

      {/* Symptom pills */}
      <Box sx={{
        mb: 3, p: 2.5,
        borderRadius: 3,
        border: `1.5px solid ${t.hairline}`,
        background: t.white,
      }}>
        <Grid container spacing={1.2}>
          {symptoms.map((symptom) => (
            <Grid item xs={12} sm={6} md={4} key={symptom.key}>
              <SymptomPill
                symptom={symptom}
                checked={form[symptom.key] || false}
                onToggle={handleToggle}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Other Symptoms */}
      <Box sx={{
        mb: 3, p: 2.5,
        borderRadius: 3,
        border: `1.5px solid ${t.hairline}`,
        background: t.white,
        "&:focus-within": { borderColor: t.teal, boxShadow: `0 0 0 3px ${t.teal}14` },
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Box sx={{
            width: 26, height: 26, borderRadius: 1.5,
            background: `${t.teal}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>
            ➕
          </Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: t.teal, textTransform: "uppercase", letterSpacing: "0.09em" }}>
            Other Symptoms
          </Typography>
        </Stack>
        <TextField
          fullWidth multiline rows={4} variant="outlined"
          placeholder="Any additional symptoms not listed above…"
          value={form.ros_others || ""}
          onChange={(e) => setForm({ ...form, ros_others: e.target.value })}
          sx={fieldSx(t.teal)}
        />
      </Box>

      {/* Save */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveReviewOfSystems}
          disabled={saving}
          sx={{
            borderRadius: 3, px: 4, py: 1.3, fontWeight: 800, fontSize: 14,
            background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
            boxShadow: `0 6px 20px ${t.fuchsia}44`,
            "&:hover": { background: `linear-gradient(135deg, ${t.fuchsiaDk}, #6200EA)`, boxShadow: `0 8px 24px ${t.fuchsia}55` },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "💾  Save Review of Systems"}
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

export default ReviewOfSystemsTab;