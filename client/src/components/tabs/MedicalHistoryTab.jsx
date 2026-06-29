import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Checkbox, TextField, Button,
  Stack, Chip, Snackbar, Alert, Grid,
} from "@mui/material";

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

function ConditionPill({ condition, selected, onToggle }) {
  return (
    <Checkbox
  checked={selected}
  disableRipple
  onChange={() => onToggle(condition.condition_id)}
  sx={{
    p: 0,
    mr: 0.5,
    color: t.midgray,
    "&.Mui-checked": {
      color: t.violet,
    },
    "& .MuiSvgIcon-root": {
      fontSize: 24,
    },
  }}
/>
  );
}

function MedicalHistoryTab({ patient, form, setForm }) {
  const [conditions, setConditions]           = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [saving, setSaving]                   = useState(false);
  const [toast, setToast]                     = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://192.168.0.101:3000/conditions");
        setConditions(await res.json());
      } catch (err) {
        console.error("Error fetching conditions:", err);
      }
    })();
  }, []);

  const handleToggleCondition = useCallback((id) => {
    setSelectedConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = () => {
    if (selectedConditions.length === conditions.length) {
      setSelectedConditions([]);
    } else {
      setSelectedConditions(conditions.map((c) => c.condition_id));
    }
  };

  const saveMedicalHistory = useCallback(async () => {
    if (selectedConditions.length === 0) {
      showToast("Please select at least one condition.", "warning");
      return;
    }
    setSaving(true);
    try {
      const results = await Promise.all(
        selectedConditions.map(async (condition_id) => {
          const res = await fetch(
            `http://192.168.0.101:3000/medical-history/${patient.patient_id}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ condition_id, remarks: form.remarks || "" }),
            }
          );
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || `Failed to save condition ${condition_id}`);
          }
          return res.json();
        })
      );
      setSelectedConditions([]);
      setForm({ ...form, remarks: "" });
      showToast(`Successfully saved ${results.length} condition(s)!`, "success");
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  }, [patient.patient_id, form, selectedConditions, setForm]);

  const allSelected = conditions.length > 0 && selectedConditions.length === conditions.length;

  return (
    <Box>

      {/* Section header */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.violetLt} 0%, ${t.fuchsiaLt} 100%)`,
        border: `1.5px solid ${t.violet}22`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 1,
      }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Typography sx={{ fontSize: 20 }}>🩺</Typography>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.violet }}>Medical Conditions</Typography>
            <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
              {patient.first_name} {patient.last_name} · Select all that apply
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {selectedConditions.length > 0 && (
            <Chip
              label={`${selectedConditions.length} selected`}
              size="small"
              sx={{ fontWeight: 700, fontSize: 11, height: 24, borderRadius: 1.5, backgroundColor: t.violetLt, color: t.violet, border: `1.5px solid ${t.violet}33` }}
            />
          )}
          <Button
            size="small"
            onClick={handleSelectAll}
            sx={{
              fontSize: 11, fontWeight: 700, borderRadius: 2, px: 1.5,
              border: `1.5px solid ${t.violet}44`, color: t.violet,
              "&:hover": { background: t.violetLt },
            }}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </Stack>
      </Box>

      {/* Condition pills grid */}
      <Box sx={{
        mb: 3, p: 2.5,
        borderRadius: 3,
        border: `1.5px solid ${t.hairline}`,
        background: t.white,
      }}>
        {conditions.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: 32, mb: 1 }}>🌿</Typography>
            <Typography sx={{ color: t.midgray, fontSize: 13 }}>Loading conditions…</Typography>
          </Box>
        ) : (
          <Grid container spacing={1.2}>
            {conditions.map((condition) => (
              <Grid item xs={12} sm={6} md={4} key={condition.condition_id}>
                <ConditionPill
                  condition={condition}
                  selected={selectedConditions.includes(condition.condition_id)}
                  onToggle={handleToggleCondition}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Remarks */}
      <Box sx={{
        mb: 3, p: 2.5,
        borderRadius: 3,
        border: `1.5px solid ${t.hairline}`,
        background: t.white,
        "&:focus-within": { borderColor: t.fuchsia, boxShadow: `0 0 0 3px ${t.fuchsia}14` },
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Box sx={{
            width: 26, height: 26, borderRadius: 1.5,
            background: `${t.fuchsia}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>
            📝
          </Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: t.fuchsia, textTransform: "uppercase", letterSpacing: "0.09em" }}>
            Remarks
          </Typography>
        </Stack>
        <TextField
          fullWidth multiline rows={3} variant="outlined"
          placeholder="Additional notes, context, or observations about the selected conditions…"
          value={form.remarks || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
          sx={fieldSx(t.fuchsia)}
        />
      </Box>

      {/* Save */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveMedicalHistory}
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
          {saving ? "Saving…" : "💾  Save Medical History"}
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

export default MedicalHistoryTab;