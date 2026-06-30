import { useState } from "react";
import dayjs from "dayjs";
import { Box, Typography, TextField, Button, Stack, Snackbar, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { API_URL } from "../../config";

// ─── Shared Vibrant Tokens ─────────────────────────────────────────────────
const t = {
  fuchsia:   "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet:    "#7C4DFF",
  violetLt:  "#EDE7F6",
  amber:     "#FF8F00",
  amberLt:   "#FFF8E1",
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

function SurgeryTab({ patient, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const saveSurgery = async () => {
    if (!form.surgery_name?.trim() || !form.surgery_date) {
      showToast("Please enter surgery name and date.", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/surgeries/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surgery_name: form.surgery_name,
          surgery_date: form.surgery_date,
          details: form.surgery_details,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to save surgery (HTTP ${res.status})`);

      setForm({ ...form, surgery_name: "", surgery_date: "", surgery_details: "" });
      showToast("Surgery record saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message}`, "error");
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
        background: `linear-gradient(90deg, ${t.amberLt} 0%, ${t.fuchsiaLt} 100%)`,
        border: `1.5px solid ${t.amber}22`,
        display: "flex", alignItems: "center", gap: 1.2,
      }}>
        <Typography sx={{ fontSize: 18 }}>🔧</Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.amber }}>Surgery Record</Typography>
          <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
            {patient.first_name} {patient.last_name} · Add a new surgical procedure
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2.5}>
        <FieldCard emoji="🏷️" label="Surgery Name" accent={t.amber}>
          <TextField
            placeholder="e.g. Cesarean Section, Myomectomy, D&C…"
            fullWidth
            variant="outlined"
            value={form.surgery_name || ""}
            onChange={(e) => setForm({ ...form, surgery_name: e.target.value })}
            sx={fieldSx(t.amber)}
          />
        </FieldCard>

        <FieldCard emoji="📅" label="Surgery Date" accent={t.violet}>
          <DatePicker
            value={form.surgery_date ? dayjs(form.surgery_date) : null}
            onChange={(newValue) =>
              setForm({ ...form, surgery_date: newValue ? newValue.format("YYYY-MM-DD") : "" })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: "Select date…",
                sx: fieldSx(t.violet),
              },
            }}
          />
        </FieldCard>

        <FieldCard emoji="📝" label="Details" accent={t.fuchsia}>
          <TextField
            placeholder="Indications, procedure notes, surgeon, findings, complications…"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={form.surgery_details || ""}
            onChange={(e) => setForm({ ...form, surgery_details: e.target.value })}
            sx={fieldSx(t.fuchsia)}
          />
        </FieldCard>
      </Stack>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveSurgery}
          disabled={saving}
          sx={{
            borderRadius: 3, px: 4, py: 1.3, fontWeight: 800, fontSize: 14,
            background: `linear-gradient(135deg, ${t.amber}, ${t.fuchsia})`,
            boxShadow: `0 6px 20px ${t.amber}44`,
            "&:hover": { background: `linear-gradient(135deg, #E65100, ${t.fuchsiaDk})`, boxShadow: `0 8px 24px ${t.amber}55` },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "💾  Save Surgery"}
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

export default SurgeryTab;