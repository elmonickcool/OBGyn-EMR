import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Paper, Button, Avatar, Stack, Chip } from "@mui/material";
import PatientTabs from "../components/PatientTabs";

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

function initials(first, last) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function PatientForms() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(() => {
    try {
      const stored = window.localStorage.getItem(`patient:${id}:form`);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error("Failed to parse stored form data", err);
    }
    return { chief_complaint: "", hpi: "", notes: "" };
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`http://192.168.0.101:3000/patients/${id}`);
        if (!res.ok) throw new Error("Failed to fetch patient data");
        setPatient(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    window.localStorage.setItem(`patient:${id}:form`, JSON.stringify(form));
  }, [form, id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 52, mb: 1 }}>🌸</Typography>
          <Typography sx={{ color: t.midgray, fontWeight: 600 }}>Loading patient forms…</Typography>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );

  if (!patient)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography sx={{ color: t.midgray }}>No patient found.</Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1.5, md: 2.5 }, pb: 6 }}>

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{
        mb: 3,
        borderRadius: 5,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${t.fuchsia} 0%, ${t.violet} 60%, #4A148C 100%)`,
        boxShadow: `0 12px 40px ${t.fuchsia}44`,
        position: "relative",
      }}>
        {/* decorative orbs */}
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -20, left: 180, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        <Box sx={{ px: { xs: 3, md: 5 }, py: 3.5, position: "relative" }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>

            {/* Left: avatar + name */}
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar sx={{
                width: 58, height: 58,
                fontSize: 22, fontWeight: 900,
                background: "rgba(255,255,255,0.22)",
                border: "2px solid rgba(255,255,255,0.45)",
                color: "#fff",
                flexShrink: 0,
              }}>
                {initials(patient.first_name, patient.last_name)}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {patient.first_name} {patient.last_name}
                  </Typography>
                  <Chip
                    label="Forms"
                    size="small"
                    sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 10, height: 20, borderRadius: 1 }}
                  />
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.68)", fontSize: 13, fontWeight: 500 }}>
                  Patient ID: {patient.patient_id} · Fill or update patient records below
                </Typography>
              </Box>
            </Stack>

            {/* Right: action buttons */}
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                size="small"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.45)",
                  borderRadius: 2.5,
                  fontWeight: 700,
                  "&:hover": { borderColor: "#fff", background: "rgba(255,255,255,0.08)" },
                }}
              >
                ← Patients
              </Button>
              <Button
                component={Link}
                to={`/patients/${id}`}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  color: t.fuchsia,
                  fontWeight: 800,
                  borderRadius: 2.5,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  "&:hover": { backgroundColor: t.fuchsiaLt },
                }}
              >
                View Profile
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* ── Forms Panel ─────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `2px solid ${t.hairline}`,
        boxShadow: `0 4px 28px ${t.fuchsia}12`,
        background: t.white,
      }}>
        {/* Panel header strip */}
        <Box sx={{
          px: 3,
          py: 1.8,
          background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)`,
          borderBottom: `1.5px solid ${t.hairline}`,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
        }}>
          <Typography sx={{ fontSize: 16 }}>📋</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: t.fuchsiaDk, letterSpacing: "0.01em" }}>
            Clinical Forms
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <Chip
              label="Auto-saved"
              size="small"
              sx={{ backgroundColor: t.tealLt, color: t.teal, fontWeight: 700, fontSize: 10, height: 20, borderRadius: 1 }}
            />
          </Box>
        </Box>

        {/* Tabs content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <PatientTabs
            patient={patient}
            tab={tab}
            setTab={setTab}
            form={form}
            setForm={setForm}
          />
        </Box>
      </Paper>

    </Box>
  );
}

export default PatientForms;