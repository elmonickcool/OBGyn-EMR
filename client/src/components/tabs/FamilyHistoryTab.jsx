import { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Snackbar, Alert } from "@mui/material";
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

function FamilyHistoryTab({ patient, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const saveFamilyHistory = async () => {
    if (!form.family_condition?.trim()) {
      showToast("Please enter the family condition.", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/family-history/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition_name: form.family_condition,
          remarks: form.family_remarks || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to save family history (HTTP ${res.status})`);
      }

      setForm({ ...form, family_condition: "", family_remarks: "" });
      showToast("Family history saved successfully!", "success");
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
      console.error("Save family history error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.tealLt} 0%, ${t.violetLt} 100%)`,
        border: `1.5px solid ${t.teal}22`,
        display: "flex", alignItems: "center", gap: 1.2,
      }}>
        <Typography sx={{ fontSize: 18 }}>👨‍👩‍👧</Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.teal }}>Family History</Typography>
          <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
            {patient.first_name} {patient.last_name} · Hereditary or familial conditions
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2.5}>
        <FieldCard emoji="🧬" label="Condition" accent={t.teal}>
          <TextField
            placeholder="e.g. Diabetes, Hypertension, Breast Cancer, Ovarian Cancer…"
            fullWidth
            variant="outlined"
            value={form.family_condition || ""}
            onChange={(e) => setForm({ ...form, family_condition: e.target.value })}
            sx={fieldSx(t.teal)}
          />
        </FieldCard>

        <FieldCard emoji="📝" label="Remarks" accent={t.violet}>
          <TextField
            placeholder="Which relative, age of onset, severity, or other relevant context…"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={form.family_remarks || ""}
            onChange={(e) => setForm({ ...form, family_remarks: e.target.value })}
            sx={fieldSx(t.violet)}
          />
        </FieldCard>
      </Stack>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveFamilyHistory}
          disabled={saving}
          sx={{
            borderRadius: 3, px: 4, py: 1.3, fontWeight: 800, fontSize: 14,
            background: `linear-gradient(135deg, ${t.teal}, ${t.violet})`,
            boxShadow: `0 6px 20px ${t.teal}44`,
            "&:hover": { background: `linear-gradient(135deg, #00897B, #6200EA)`, boxShadow: `0 8px 24px ${t.teal}55` },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "💾  Save Family History"}
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

export default FamilyHistoryTab;