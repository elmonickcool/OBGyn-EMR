import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, Container, Paper, Typography, TextField,
  Button, Grid, Stack, Snackbar, Alert, Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { API_URL } from "../config";

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

const readOnlySx = (accent) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    background: `${accent}0A`,
    fontSize: 14,
    "& fieldset": { borderColor: `${accent}44`, borderWidth: "1.5px" },
  },
});

function SectionCard({ emoji, title, subtitle, accent, children }) {
  return (
    <Box sx={{
      p: 3,
      borderRadius: 3,
      border: `1.5px solid ${t.hairline}`,
      background: t.white,
      boxShadow: `0 2px 12px ${accent}0A`,
      mb: 3,
    }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>
          {emoji}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: accent }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}>{subtitle}</Typography>}
        </Box>
      </Stack>
      {children}
    </Box>
  );
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const EMPTY_FORM = {
  first_name: "", last_name: "", age: "",
  birth_date: "", address: "", contact_num: "",
};

// ─── Plasma Success Screen ─────────────────────────────────────────────────
function PlasmaSuccess({ patient, onRegisterAnother, onGoHome, sessionCount }) {
  return (
    <Box sx={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, #FDF0F8 0%, #F3EEFF 50%, #E8F8FF 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      pb: 6, pt: 4,
    }}>
      <Container maxWidth="sm">

        {/* Plasma Burst Card */}
        <Paper elevation={0} sx={{
          borderRadius: 5,
          overflow: "hidden",
          position: "relative",
          boxShadow: `0 24px 60px ${t.fuchsia}30, 0 8px 24px ${t.violet}20`,
          animation: "plasma-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          "@keyframes plasma-in": {
            from: { opacity: 0, transform: "scale(0.85) translateY(20px)" },
            to:   { opacity: 1, transform: "scale(1) translateY(0)" },
          },
        }}>

          {/* Gradient header */}
          <Box sx={{
            background: `linear-gradient(135deg, ${t.fuchsia} 0%, ${t.violet} 60%, #4A148C 100%)`,
            px: 4, pt: 5, pb: 4,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}>
            {/* Decorative blobs */}
            {[
              { top: -30, right: -30, size: 120, op: 0.12 },
              { bottom: -20, left: -20, size: 90, op: 0.08 },
              { top: "30%", left: "20%", size: 60, op: 0.06 },
            ].map((blob, i) => (
              <Box key={i} sx={{
                position: "absolute",
                top: blob.top, right: blob.right,
                bottom: blob.bottom, left: blob.left,
                width: blob.size, height: blob.size,
                borderRadius: "50%",
                background: `rgba(255,255,255,${blob.op})`,
                pointerEvents: "none",
              }} />
            ))}

            {/* Checkmark burst */}
            <Box sx={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "2.5px solid rgba(255,255,255,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34, mx: "auto", mb: 2,
              animation: "pop 0.4s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
              "@keyframes pop": {
                from: { opacity: 0, transform: "scale(0.4)" },
                to:   { opacity: 1, transform: "scale(1)" },
              },
            }}>
              ✓
            </Box>

            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5 }}>
              Patient Registered Successfully
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
              {patient.first_name} {patient.last_name}
            </Typography>
            {patient.age && (
              <Chip
                label={`${patient.age} years old`}
                size="small"
                sx={{ mt: 1, background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 12, height: 24, borderRadius: 2, border: "1px solid rgba(255,255,255,0.3)" }}
              />
            )}

            {/* Session badge */}
            {sessionCount > 1 && (
              <Chip
                label={`${sessionCount} patients registered this session`}
                size="small"
                sx={{ mt: 1, ml: 0.5, background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 11, height: 22, borderRadius: 2 }}
              />
            )}
          </Box>

          {/* Patient summary */}
          <Box sx={{ background: t.white, px: 4, py: 3 }}>
            {[
              { label: "Date of Birth", value: patient.birth_date ? dayjs(patient.birth_date).format("MMMM D, YYYY") : "—", color: t.violet },
              { label: "Contact Number", value: patient.contact_num || "—", color: t.teal },
              { label: "Address", value: patient.address || "—", color: t.fuchsia },
            ].map((row) => (
              <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="flex-start"
                sx={{ py: 1.2, borderBottom: `1px solid ${t.hairline}` }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: t.midgray, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, mr: 2 }}>
                  {row.label}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: row.color, textAlign: "right", wordBreak: "break-word" }}>
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Box>

          {/* CTA buttons */}
          <Box sx={{ background: t.offwhite, px: 4, py: 3 }}>
            <Stack spacing={1.5}>
              <Button
                fullWidth
                onClick={onRegisterAnother}
                variant="contained"
                sx={{
                  py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: 14,
                  background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
                  boxShadow: `0 6px 20px ${t.fuchsia}44`,
                  "&:hover": { background: `linear-gradient(135deg, ${t.fuchsiaDk}, #6200EA)`, boxShadow: `0 8px 24px ${t.fuchsia}55` },
                  transition: "all 0.2s",
                }}
              >
                🌸 &nbsp; Register Another Patient
              </Button>
              <Button
                fullWidth
                onClick={onGoHome}
                variant="outlined"
                sx={{
                  py: 1.4, borderRadius: 3, fontWeight: 700, fontSize: 13,
                  borderColor: t.hairline, color: t.midgray,
                  "&:hover": { borderColor: t.violet, color: t.violet, background: t.violetLt },
                }}
              >
                ← Back to Patient List
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Floating confetti dots */}
        {[...Array(6)].map((_, i) => {
          const colors = [t.fuchsia, t.violet, t.teal, t.amber];
          const color  = colors[i % colors.length];
          const delay  = `${i * 0.08}s`;
          const left   = `${10 + i * 14}%`;
          return (
            <Box key={i} sx={{
              position: "fixed",
              top: "10%", left,
              width: 10, height: 10,
              borderRadius: "50%",
              background: color,
              opacity: 0,
              animation: `confetti 1.2s ${delay} ease-out forwards`,
              pointerEvents: "none",
              "@keyframes confetti": {
                "0%":   { opacity: 1, transform: "translateY(0) scale(1)" },
                "80%":  { opacity: 0.6 },
                "100%": { opacity: 0, transform: "translateY(120px) scale(0.4)" },
              },
            }} />
          );
        })}
      </Container>
    </Box>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function AddPatient() {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState({ open: false, message: "", severity: "error" });
  const [registered, setRegistered] = useState(null);   // holds last registered patient
  const [sessionCount, setSessionCount] = useState(0);  // how many this session
  const navigate = useNavigate();

  const showToast = (message, severity = "error") =>
    setToast({ open: true, message, severity });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birth_date") {
      setForm({ ...form, birth_date: value, age: calculateAge(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) {
      showToast("First and last name are required.", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add patient");
      // 🎉 Show plasma success screen instead of navigating away
      setRegistered({ ...form });
      setSessionCount((c) => c + 1);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setRegistered(null);
    setForm(EMPTY_FORM);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Plasma success screen ────────────────────────────────────────────────
  if (registered) {
    return (
      <PlasmaSuccess
        patient={registered}
        sessionCount={sessionCount}
        onRegisterAnother={handleRegisterAnother}
        onGoHome={() => navigate("/")}
      />
    );
  }

  const hasName = form.first_name.trim() && form.last_name.trim();
  const previewName = hasName ? `${form.first_name} ${form.last_name}` : null;

  // ── Registration form ────────────────────────────────────────────────────
  return (
    <Box sx={{ background: `linear-gradient(160deg, #FDF0F8 0%, #F3EEFF 50%, #E8F8FF 100%)`, minHeight: "100vh", pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>

        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{
          mb: 3,
          borderRadius: 5,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${t.fuchsia} 0%, ${t.violet} 60%, #4A148C 100%)`,
          boxShadow: `0 12px 40px ${t.fuchsia}44`,
          position: "relative",
        }}>
          <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -20, left: 200, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <Box sx={{ px: { xs: 3, md: 5 }, py: 3.5, position: "relative" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5 }}>
                  🌸 Doc Rikka Women's Clinic
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  New Patient Registration
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 0.6, fontSize: 13, fontWeight: 500 }}>
                  Register a new patient into the Electronic Medical Records System
                </Typography>

                {/* Live name preview */}
                {previewName && (
                  <Chip
                    label={`Registering: ${previewName}${form.age ? `, ${form.age} yrs` : ""}`}
                    size="small"
                    sx={{ mt: 1.5, background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 12, height: 24, borderRadius: 2, border: "1px solid rgba(255,255,255,0.3)" }}
                  />
                )}

                {/* Session count badge */}
                {sessionCount > 0 && (
                  <Chip
                    label={`${sessionCount} registered this session`}
                    size="small"
                    sx={{ mt: 1, ml: previewName ? 0.5 : 0, background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 11, height: 22, borderRadius: 2 }}
                  />
                )}
              </Box>

              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{
                  backgroundColor: "#fff", color: t.fuchsia,
                  fontWeight: 800, borderRadius: 2.5, px: 3, py: 1.2,
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  "&:hover": { backgroundColor: t.fuchsiaLt },
                }}
              >
                ← Back to Patients
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <Box component="form" onSubmit={handleSubmit}>

          {/* Personal Information */}
          <SectionCard emoji="👤" title="Personal Information" subtitle="Legal name and date of birth" accent={t.fuchsia}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 2, borderRadius: 3, border: `1.5px solid ${t.hairline}`, background: t.white,
                  "&:focus-within": { borderColor: t.fuchsia, boxShadow: `0 0 0 3px ${t.fuchsia}14` },
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.fuchsia, textTransform: "uppercase", letterSpacing: "0.09em", mb: 1 }}>
                    First Name *
                  </Typography>
                  <TextField
                    fullWidth variant="outlined" name="first_name"
                    placeholder="e.g. Maria"
                    value={form.first_name} onChange={handleChange} required
                    sx={fieldSx(t.fuchsia)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 2, borderRadius: 3, border: `1.5px solid ${t.hairline}`, background: t.white,
                  "&:focus-within": { borderColor: t.fuchsia, boxShadow: `0 0 0 3px ${t.fuchsia}14` },
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.fuchsia, textTransform: "uppercase", letterSpacing: "0.09em", mb: 1 }}>
                    Last Name *
                  </Typography>
                  <TextField
                    fullWidth variant="outlined" name="last_name"
                    placeholder="e.g. Santos"
                    value={form.last_name} onChange={handleChange} required
                    sx={fieldSx(t.fuchsia)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 2, borderRadius: 3, border: `1.5px solid ${t.hairline}`, background: t.white,
                  "&:focus-within": { borderColor: t.violet, boxShadow: `0 0 0 3px ${t.violet}14` },
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.violet, textTransform: "uppercase", letterSpacing: "0.09em", mb: 1 }}>
                    Date of Birth *
                  </Typography>
                  <DatePicker
                    value={form.birth_date ? dayjs(form.birth_date) : null}
                    onChange={(newValue) => {
                      const birthDate = newValue ? newValue.format("YYYY-MM-DD") : "";
                      setForm({ ...form, birth_date: birthDate, age: birthDate ? calculateAge(birthDate) : "" });
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true, required: true,
                        sx: fieldSx(t.violet),
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 2, borderRadius: 3,
                  border: `1.5px solid ${t.teal}44`,
                  background: `${t.teal}0A`,
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.teal, textTransform: "uppercase", letterSpacing: "0.09em" }}>
                      Age (Auto-calculated)
                    </Typography>
                    <Chip label="Read only" size="small" sx={{ fontSize: 9, height: 18, borderRadius: 1, backgroundColor: t.tealLt, color: t.teal, fontWeight: 700 }} />
                  </Stack>
                  <TextField
                    fullWidth variant="outlined"
                    value={form.age ? `${form.age} years old` : "—"}
                    InputProps={{ readOnly: true }}
                    sx={readOnlySx(t.teal)}
                  />
                </Box>
              </Grid>
            </Grid>
          </SectionCard>

          {/* Contact Information */}
          <SectionCard emoji="📞" title="Contact Information" subtitle="Address and phone number" accent={t.violet}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{
                  p: 2, borderRadius: 3, border: `1.5px solid ${t.hairline}`, background: t.white,
                  "&:focus-within": { borderColor: t.violet, boxShadow: `0 0 0 3px ${t.violet}14` },
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.violet, textTransform: "uppercase", letterSpacing: "0.09em", mb: 1 }}>
                    📍 Address
                  </Typography>
                  <TextField
                    fullWidth variant="outlined" multiline rows={3}
                    name="address" placeholder="Street, Barangay, City…"
                    value={form.address} onChange={handleChange}
                    sx={fieldSx(t.violet)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{
                  p: 2, borderRadius: 3, border: `1.5px solid ${t.hairline}`, background: t.white,
                  "&:focus-within": { borderColor: t.teal, boxShadow: `0 0 0 3px ${t.teal}14` },
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.teal, textTransform: "uppercase", letterSpacing: "0.09em", mb: 1 }}>
                    📱 Contact Number
                  </Typography>
                  <TextField
                    fullWidth variant="outlined"
                    name="contact_num" placeholder="09XX-XXX-XXXX"
                    value={form.contact_num} onChange={handleChange}
                    sx={fieldSx(t.teal)}
                  />
                </Box>
              </Grid>
            </Grid>
          </SectionCard>

          {/* Actions */}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                borderRadius: 3, fontWeight: 700, px: 3,
                borderColor: t.hairline, color: t.midgray,
                "&:hover": { borderColor: t.midgray, background: t.offwhite },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
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
              {loading ? "Registering…" : "🌸  Register Patient"}
            </Button>
          </Stack>
        </Box>

        {/* Toast */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))} sx={{ borderRadius: 3, fontWeight: 600 }}>
            {toast.message}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}

export default AddPatient;