import { useCallback, useState } from "react";
import { Box, TextField, Button, Typography, Stack, Snackbar, Alert } from "@mui/material";

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
  ink:       "#1A0533",
  midgray:   "#7B6F84",
  hairline:  "#EDE0F2",
  offwhite:  "#FDFAFF",
  white:     "#FFFFFF",
};

// Shared sx for all textfields
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

function SectionLabel({ emoji, label, accent }) {
  return (
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
  );
}

function ConsultationTab({ patient, form, setForm }) {
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const handleSaveConsultation = useCallback(async () => {
    if (!form.chief_complaint?.trim()) {
      showToast("Please enter a chief complaint", "warning");
      return;
    }

    setSaving(true);
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
      showToast("Consultation saved successfully!", "success");
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
      console.error("Save consultation error:", err);
    } finally {
      setSaving(false);
    }
  }, [form, patient.patient_id]);

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)`,
        border: `1.5px solid ${t.fuchsia}22`,
        display: "flex", alignItems: "center", gap: 1.2,
      }}>
        <Typography sx={{ fontSize: 18 }}>📋</Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.fuchsiaDk }}>
            Consultation Record
          </Typography>
          <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
            {patient.first_name} {patient.last_name} · Auto-saved as draft
          </Typography>
        </Box>
      </Box>

      {/* Fields */}
      <Stack spacing={2.5}>

        {/* Chief Complaint */}
        <Box sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1.5px solid ${t.hairline}`,
          background: t.white,
          "&:focus-within": { borderColor: t.fuchsia, boxShadow: `0 0 0 3px ${t.fuchsia}14` },
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}>
          <SectionLabel emoji="🩺" label="Chief Complaint" accent={t.fuchsia} />
          <TextField
            placeholder="Describe the patient's primary concern or reason for visit…"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={form.chief_complaint || ""}
            onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })}
            sx={fieldSx(t.fuchsia)}
          />
        </Box>

        {/* HPI */}
        <Box sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1.5px solid ${t.hairline}`,
          background: t.white,
          "&:focus-within": { borderColor: t.violet, boxShadow: `0 0 0 3px ${t.violet}14` },
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}>
          <SectionLabel emoji="📖" label="History of Present Illness" accent={t.violet} />
          <TextField
            placeholder="Detail the onset, duration, character, and progression of the complaint…"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={form.hpi || ""}
            onChange={(e) => setForm({ ...form, hpi: e.target.value })}
            sx={fieldSx(t.violet)}
          />
        </Box>

        {/* Physician Notes */}
        <Box sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1.5px solid ${t.hairline}`,
          background: t.white,
          "&:focus-within": { borderColor: t.teal, boxShadow: `0 0 0 3px ${t.teal}14` },
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}>
          <SectionLabel emoji="✍️" label="Physician Notes" accent={t.teal} />
          <TextField
            placeholder="Assessment, plan, impressions, and follow-up instructions…"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            sx={fieldSx(t.teal)}
          />
        </Box>

      </Stack>

      {/* Save button */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSaveConsultation}
          disabled={saving}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.3,
            fontWeight: 800,
            fontSize: 14,
            background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
            boxShadow: `0 6px 20px ${t.fuchsia}44`,
            "&:hover": {
              background: `linear-gradient(135deg, ${t.fuchsiaDk}, #6200EA)`,
              boxShadow: `0 8px 24px ${t.fuchsia}55`,
            },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "💾  Save Consultation"}
        </Button>
      </Box>

      {/* Toast notifications — replaces alert() */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ConsultationTab;