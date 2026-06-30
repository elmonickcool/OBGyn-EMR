import { useState } from "react";
import {
  Box, Typography, TextField, Button, MenuItem,
  Stack, Snackbar, Alert, Grid, Collapse,
} from "@mui/material";
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
  amber:     "#FF8F00",
  amberLt:   "#FFF8E1",
  coral:     "#FF5252",
  coralLt:   "#FFEBEE",
  sky:       "#0288D1",
  skyLt:     "#E1F5FE",
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

function SubsectionHeader({ emoji, title, accent }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5, mt: 3, "&:first-of-type": { mt: 0 } }}>
      <Box sx={{ width: 4, height: 18, borderRadius: 2, background: accent }} />
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: accent }}>{title}</Typography>
      <Typography sx={{ fontSize: 14 }}>{emoji}</Typography>
    </Stack>
  );
}

// Toggle switch card — for Smoking / Alcohol / Illicit Drugs
function ToggleCard({ checked, onChange, label, emoji, accent, children }) {
  return (
    <Box sx={{
      borderRadius: 3,
      border: `1.5px solid ${checked ? accent : t.hairline}`,
      background: checked ? `${accent}0A` : t.white,
      overflow: "hidden",
      transition: "all 0.18s",
    }}>
      <Box
        onClick={() => onChange(!checked)}
        sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          px: 2.5, py: 1.6, cursor: "pointer", userSelect: "none",
        }}
      >
        <Box sx={{
          width: 22, height: 22, borderRadius: 1.5,
          border: `2px solid ${checked ? accent : t.midgray + "66"}`,
          background: checked ? accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.15s",
        }}>
          {checked && <Typography sx={{ fontSize: 12, color: "#fff", fontWeight: 900, lineHeight: 1 }}>✓</Typography>}
        </Box>
        <Typography sx={{ fontSize: 14 }}>{emoji}</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: checked ? 700 : 600, color: checked ? accent : t.ink }}>
          {label}
        </Typography>
      </Box>
      <Collapse in={checked}>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

function SocialHistoryTab({ patient, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const saveSocialHistory = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/social-history/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save social history");
      showToast("Social history saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        mb: 1.5, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.violetLt} 0%, ${t.tealLt} 100%)`,
        border: `1.5px solid ${t.violet}22`,
        display: "flex", alignItems: "center", gap: 1.2,
      }}>
        <Typography sx={{ fontSize: 18 }}>🌿</Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.violet }}>Social History</Typography>
          <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
            {patient.first_name} {patient.last_name} · Lifestyle and environmental factors
          </Typography>
        </Box>
      </Box>

      {/* ── Habits & Substance Use ──────────────────────────────── */}
      <SubsectionHeader emoji="🚬" title="Habits & Substance Use" accent={t.coral} />
      <Stack spacing={1.5}>
        <ToggleCard
          checked={form.smoking || false}
          onChange={(val) => setForm({ ...form, smoking: val })}
          label="Smoking"
          emoji="🚬"
          accent={t.coral}
        >
          <Grid container spacing={1.5} sx={{ mt: 0.2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sticks per day" type="number" fullWidth size="small"
                value={form.sticks_per_day || ""}
                onChange={(e) => setForm({ ...form, sticks_per_day: e.target.value })}
                sx={fieldSx(t.coral)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Smoking years" type="number" fullWidth size="small"
                value={form.smoking_years || ""}
                onChange={(e) => setForm({ ...form, smoking_years: e.target.value })}
                sx={fieldSx(t.coral)}
              />
            </Grid>
          </Grid>
        </ToggleCard>

        <ToggleCard
          checked={form.alcohol || false}
          onChange={(val) => setForm({ ...form, alcohol: val })}
          label="Alcohol use"
          emoji="🍷"
          accent={t.amber}
        >
          <TextField
            label="Alcohol details" fullWidth multiline rows={2} size="small"
            placeholder="Frequency, type, amount per occasion…"
            value={form.alcohol_details || ""}
            onChange={(e) => setForm({ ...form, alcohol_details: e.target.value })}
            sx={{ ...fieldSx(t.amber), mt: 0.2 }}
          />
        </ToggleCard>

        <ToggleCard
          checked={form.illicit_drugs || false}
          onChange={(val) => setForm({ ...form, illicit_drugs: val })}
          label="Illicit drugs"
          emoji="💊"
          accent={t.coral}
        >
          <TextField
            label="Drug details" fullWidth multiline rows={2} size="small"
            placeholder="Substance, frequency, last use…"
            value={form.drug_details || ""}
            onChange={(e) => setForm({ ...form, drug_details: e.target.value })}
            sx={{ ...fieldSx(t.coral), mt: 0.2 }}
          />
        </ToggleCard>
      </Stack>

      {/* ── Lifestyle ────────────────────────────────────────────── */}
      <SubsectionHeader emoji="🥗" title="Lifestyle" accent={t.teal} />
      <Stack spacing={2.5}>
        <FieldCard emoji="🥗" label="Diet" accent={t.teal}>
          <TextField
            placeholder="Dietary pattern, restrictions, typical meals…"
            fullWidth multiline rows={3} variant="outlined"
            value={form.diet || ""}
            onChange={(e) => setForm({ ...form, diet: e.target.value })}
            sx={fieldSx(t.teal)}
          />
        </FieldCard>

        <FieldCard emoji="🏃" label="Exercise" accent={t.sky}>
          <TextField
            select fullWidth variant="outlined"
            value={form.exercise || "None"}
            onChange={(e) => setForm({ ...form, exercise: e.target.value })}
            sx={fieldSx(t.sky)}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Occasional">Occasional</MenuItem>
            <MenuItem value="Regular">Regular</MenuItem>
          </TextField>
        </FieldCard>
      </Stack>

      {/* ── Living & Environment ─────────────────────────────────── */}
      <SubsectionHeader emoji="🏠" title="Living & Environment" accent={t.fuchsia} />
      <Stack spacing={2.5}>
        <FieldCard emoji="🏠" label="Living Situation" accent={t.fuchsia}>
          <TextField
            placeholder="e.g. Lives alone, with family, with partner…"
            fullWidth variant="outlined"
            value={form.living_situation || ""}
            onChange={(e) => setForm({ ...form, living_situation: e.target.value })}
            sx={fieldSx(t.fuchsia)}
          />
        </FieldCard>

        <FieldCard emoji="☣️" label="Exposure History" accent={t.violet}>
          <TextField
            placeholder="Occupational, chemical, radiation, or environmental exposures…"
            fullWidth multiline rows={3} variant="outlined"
            value={form.exposure_history || ""}
            onChange={(e) => setForm({ ...form, exposure_history: e.target.value })}
            sx={fieldSx(t.violet)}
          />
        </FieldCard>
      </Stack>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveSocialHistory}
          disabled={saving}
          sx={{
            borderRadius: 3, px: 4, py: 1.3, fontWeight: 800, fontSize: 14,
            background: `linear-gradient(135deg, ${t.violet}, ${t.teal})`,
            boxShadow: `0 6px 20px ${t.violet}44`,
            "&:hover": { background: `linear-gradient(135deg, #6200EA, #00897B)`, boxShadow: `0 8px 24px ${t.violet}55` },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "💾  Save Social History"}
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

export default SocialHistoryTab;