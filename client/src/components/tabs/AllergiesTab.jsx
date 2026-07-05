import { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, Stack, Snackbar, Alert } from "@mui/material";
import { API_URL } from "../../config.js";

// ─── Shared Vibrant Tokens ─────────────────────────────────────────────────
const t = {
  fuchsia:   "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  coral:     "#FF5252",
  coralDk:   "#C62828",
  coralLt:   "#FFEBEE",
  amber:     "#FF8F00",
  amberLt:   "#FFF8E1",
  violet:    "#7C4DFF",
  violetLt:  "#EDE7F6",
  ink:       "#1A0533",
  midgray:   "#7B6F84",
  hairline:  "#EDE0F2",
  offwhite:  "#FDFAFF",
  white:     "#FFFFFF",
};

const allergyTypes = [
  { value: "Food",          label: "Food",        emoji: "🍽️", accent: t.amber },
  { value: "Drug",          label: "Drug",         emoji: "💊", accent: t.coral },
  { value: "Environmental", label: "Other",        emoji: "🌿", accent: t.violet },
];

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

function FieldCard({ emoji, label, accent, children }) {
  return (
    <Box sx={{
      p: 2.5,
      borderRadius: 3,
      border: `1.5px solid ${t.hairline}`,
      background: t.white,
      "&:focus-within": { borderColor: accent, boxShadow: `0 0 0 3px ${accent}14` },
      transition: "border-color 0.15s, box-shadow 0.15s",
    }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Box sx={{
          width: 28, height: 28, borderRadius: 1.5,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>
          {emoji}
        </Box>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.09em" }}>
          {label}
        </Typography>
      </Stack>
      {children}
    </Box>
  );
}

function AllergiesTab({ patient, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const saveAllergy = async () => {
    if (!form.allergy_type?.trim() || !form.allergy_name?.trim()) {
      showToast("Please enter allergy type and name.", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/allergies/${patient.patient_id}`, {
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

      setForm({ allergy_type: "", allergy_name: "" });
      showToast("Allergy saved successfully!", "success");
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
      console.error("Save allergy error:", err);
    } finally {
      setSaving(false);
    }
  };

  const selectedType = allergyTypes.find((opt) => opt.value === form.allergy_type);

  return (
    <Box>
      {/* Section header — alert-styled since this is a safety-critical field */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.coralLt} 0%, ${t.fuchsiaLt} 100%)`,
        border: `1.5px solid ${t.coral}33`,
        display: "flex", alignItems: "center", gap: 1.2,
      }}>
        <Typography sx={{ fontSize: 18 }}>⚠️</Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.coralDk }}>Allergy Record</Typography>
          <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
            {patient.first_name} {patient.last_name} · Critical safety information
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2.5}>
        <FieldCard emoji={selectedType?.emoji ?? "🏷️"} label="Allergy Type" accent={selectedType?.accent ?? t.coral}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={form.allergy_type || ""}
            onChange={(e) => setForm({ ...form, allergy_type: e.target.value })}
            sx={fieldSx(selectedType?.accent ?? t.coral)}
          >
            {allergyTypes.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </FieldCard>

        <FieldCard emoji="🚫" label="Allergy Name" accent={t.coral}>
          <TextField
            placeholder="e.g. Penicillin, Shellfish, Latex…"
            fullWidth
            variant="outlined"
            value={form.allergy_name || ""}
            onChange={(e) => setForm({ ...form, allergy_name: e.target.value })}
            sx={fieldSx(t.coral)}
          />
        </FieldCard>
      </Stack>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveAllergy}
          disabled={saving}
          sx={{
            borderRadius: 3, px: 4, py: 1.3, fontWeight: 800, fontSize: 14,
            background: `linear-gradient(135deg, ${t.coral}, ${t.fuchsia})`,
            boxShadow: `0 6px 20px ${t.coral}44`,
            "&:hover": { background: `linear-gradient(135deg, ${t.coralDk}, ${t.fuchsiaDk})`, boxShadow: `0 8px 24px ${t.coral}55` },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "⚠️  Save Allergy"}
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

export default AllergiesTab;