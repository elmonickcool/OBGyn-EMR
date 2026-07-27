import { useCallback, useEffect, useState } from "react";
import {
  Box, TextField, Button, Typography, Stack, Snackbar, Alert,
  ToggleButtonGroup, ToggleButton, CircularProgress, Divider,
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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function ConsultationTab({ patient, form, setForm }) {
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState({ open: false, message: "", severity: "success" });

  // ── Follow-up state ──────────────────────────────────────────────────────
  const [mode, setMode] = useState("new"); // "new" | "followup"
  const [followUps, setFollowUps] = useState([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(true);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    follow_up_date: todayISO(),
    notes: "",
  });

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
        `${API_URL}/consultations/${patient.patient_id}`,
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

  // ── Fetch existing follow-ups for this patient ──────────────────────────
  const fetchFollowUps = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/consultations/${patient.patient_id}/followups`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load follow-ups");
      setFollowUps(Array.isArray(data) ? data : data.followups || []);
    } catch (err) {
      console.error("Fetch follow-ups error:", err);
    } finally {
      setLoadingFollowUps(false);
    }
  }, [patient.patient_id]);

  useEffect(() => {
    if (!patient?.patient_id) return;
    let ignore = false;

    const loadFollowUps = async () => {
      try {
        const res = await fetch(
          `${API_URL}/consultations/${patient.patient_id}/followups`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load follow-ups");
        }

        if (!ignore) {
          setFollowUps(Array.isArray(data) ? data : data.followups || []);
        }
      } catch (err) {
        console.error("Fetch follow-ups error:", err);
      } finally {
        if (!ignore) setLoadingFollowUps(false);
      }
    };

    loadFollowUps();

    return () => { ignore = true; };
  }, [patient?.patient_id]);

  // ── Save a new follow-up ─────────────────────────────────────────────────
  const handleSaveFollowUp = useCallback(async () => {
    if (!followUpForm.notes?.trim()) {
      showToast("Please enter follow-up notes", "warning");
      return;
    }

    setSavingFollowUp(true);
    try {
      const res = await fetch(
        `${API_URL}/consultations/${patient.patient_id}/followups`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(followUpForm),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save follow-up");
      showToast("Follow-up consultation added!", "success");
      setFollowUpForm({ follow_up_date: todayISO(), notes: "" });
      fetchFollowUps();
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
      console.error("Save follow-up error:", err);
    } finally {
      setSavingFollowUp(false);
    }
  }, [followUpForm, patient.patient_id, fetchFollowUps]);

  return (
    <Box>
      {/* Section header */}
      <Box sx={{
        mb: 3, px: 2.5, py: 1.8,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)`,
        border: `1.5px solid ${t.fuchsia}22`,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.2,
        flexWrap: "wrap",
      }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Typography sx={{ fontSize: 18 }}>📋</Typography>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: t.fuchsiaDk }}>
              Consultation Record
            </Typography>
            <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>
              {patient.first_name} {patient.last_name} · Auto-saved as draft
            </Typography>
          </Box>
        </Stack>

        {/* Mode toggle */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          size="small"
          onChange={(_, v) => v && setMode(v)}
          sx={{
            background: t.white,
            borderRadius: 2.5,
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: 12.5,
              px: 2,
              py: 0.7,
              border: `1.5px solid ${t.hairline}`,
              color: t.midgray,
              "&.Mui-selected": {
                background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
                color: t.white,
                "&:hover": { background: `linear-gradient(135deg, ${t.fuchsiaDk}, #6200EA)` },
              },
            },
          }}
        >
          <ToggleButton value="new">📝 Initial</ToggleButton>
          <ToggleButton value="followup">🔁 Follow-up</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {mode === "new" ? (
        <>
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
        </>
      ) : (
        <>
          {/* Follow-up form */}
          <Stack spacing={2.5}>
            <Box sx={{
              p: 2.5,
              borderRadius: 3,
              border: `1.5px solid ${t.hairline}`,
              background: t.white,
              "&:focus-within": { borderColor: t.coral, boxShadow: `0 0 0 3px ${t.coral}14` },
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}>
              <SectionLabel emoji="📅" label="Follow-up Date" accent={t.coral} />
              <TextField
                type="date"
                fullWidth
                variant="outlined"
                value={followUpForm.follow_up_date}
                onChange={(e) => setFollowUpForm({ ...followUpForm, follow_up_date: e.target.value })}
                sx={fieldSx(t.coral)}
              />
            </Box>

            <Box sx={{
              p: 2.5,
              borderRadius: 3,
              border: `1.5px solid ${t.hairline}`,
              background: t.white,
              "&:focus-within": { borderColor: t.coral, boxShadow: `0 0 0 3px ${t.coral}14` },
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}>
              <SectionLabel emoji="🔁" label="Follow-up Notes" accent={t.coral} />
              <TextField
                placeholder="Progress since last visit, response to treatment, updated plan…"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                sx={fieldSx(t.coral)}
              />
            </Box>
          </Stack>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleSaveFollowUp}
              disabled={savingFollowUp}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.3,
                fontWeight: 800,
                fontSize: 14,
                background: `linear-gradient(135deg, ${t.coral}, ${t.fuchsia})`,
                boxShadow: `0 6px 20px ${t.coral}44`,
                "&:hover": {
                  background: `linear-gradient(135deg, #E53935, ${t.fuchsiaDk})`,
                  boxShadow: `0 8px 24px ${t.coral}55`,
                },
                "&:disabled": { opacity: 0.6 },
                transition: "all 0.2s",
              }}
            >
              {savingFollowUp ? "Saving…" : "➕  Add Follow-up"}
            </Button>
          </Box>

          {/* Follow-up history */}
          <Divider sx={{ my: 3, borderColor: t.hairline }} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: t.midgray, textTransform: "uppercase", letterSpacing: "0.09em", mb: 1.5 }}>
            Follow-up History
          </Typography>

          {loadingFollowUps ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={22} sx={{ color: t.fuchsia }} />
            </Box>
          ) : followUps.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: t.midgray, fontStyle: "italic", py: 1 }}>
              No follow-up consultations recorded yet.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {followUps.map((fu, idx) => (
                <Box
                  key={fu.id ?? idx}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: `1.5px solid ${t.hairline}`,
                    background: t.coralLt + "55",
                    borderLeft: `4px solid ${t.coral}`,
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: t.coral, mb: 0.5 }}>
                    {fu.follow_up_date ? new Date(fu.follow_up_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    }) : "—"}
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: t.ink, whiteSpace: "pre-wrap" }}>
                    {fu.notes}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </>
      )}

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