import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  Chip,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { API_URL } from "../config";

// ─── Vibrant OB-Gyne Tokens ────────────────────────────────────────────────────
const t = {
  // Core palette
  fuchsia:    "#E91E8C",
  fuchsiaDk:  "#AD1457",
  fuchsiaLt:  "#FCE4EC",
  violet:     "#7C4DFF",
  violetLt:   "#EDE7F6",
  coral:      "#FF5252",
  coralLt:    "#FFEBEE",
  teal:       "#00BFA5",
  tealLt:     "#E0F2F1",
  amber:      "#FF8F00",
  amberLt:    "#FFF8E1",
  sky:        "#0288D1",
  skyLt:      "#E1F5FE",
  // Neutrals
  ink:        "#1A0533",
  midgray:    "#7B6F84",
  hairline:   "#EDE0F2",
  offwhite:   "#FDFAFF",
  white:      "#FFFFFF",
};

// Avatar colour pool — one per patient based on ID mod
const avatarPool = [
  { bg: "#FCE4EC", fg: "#AD1457" },
  { bg: "#EDE7F6", fg: "#6200EA" },
  { bg: "#E0F2F1", fg: "#00695C" },
  { bg: "#FFF3E0", fg: "#E65100" },
  { bg: "#E1F5FE", fg: "#0277BD" },
  { bg: "#F3E5F5", fg: "#7B1FA2" },
];
function avatarColor(id) { return avatarPool[Number(id) % avatarPool.length]; }
function initials(f, l) { return `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase(); }

// ─── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ label, value, bg, fg }) {
  return (
    <Box sx={{
      px: 2.5, py: 1.2,
      borderRadius: 3,
      background: bg,
      border: `1.5px solid ${fg}33`,
      textAlign: "center",
      minWidth: 90,
    }}>
      <Typography sx={{ fontSize: 22, fontWeight: 900, color: fg, lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: fg, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em", mt: 0.3 }}>{label}</Typography>
    </Box>
  );
}

function Patients() {
  const [patients, setPatients]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [query, setQuery]                 = useState("");
  const [deleteId, setDeleteId]           = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/patients`);
        if (!res.ok) throw new Error("Failed to fetch patients");
        setPatients(await res.json());
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = patients.filter((p) => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    return name.includes(query.toLowerCase()) || String(p.patient_id).includes(query);
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete patient");
      setPatients((prev) => prev.filter((p) => p.patient_id !== deleteId));
      setDeleteId(null);
    } catch (err) { setError(err.message); }
    finally { setDeleteLoading(false); }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 52, mb: 1 }}>🌸</Typography>
          <Typography sx={{ color: t.midgray, fontWeight: 600 }}>Loading patient records…</Typography>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ background: `linear-gradient(160deg, #FDF0F8 0%, #F3EEFF 50%, #E8F8FF 100%)`, minHeight: "100vh", pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{
          mb: 3,
          borderRadius: 5,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${t.fuchsia} 0%, ${t.violet} 60%, #4A148C 100%)`,
          boxShadow: `0 12px 40px ${t.fuchsia}55`,
          position: "relative",
        }}>
          {/* decorative circles */}
          <Box sx={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -20, right: 120, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <Box sx={{ px: { xs: 3, md: 5 }, pt: 4, pb: 3.5, position: "relative" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2}>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5 }}>
                  🌸 Doc Rikka Women's   Medical & Ultrasound Clinic 
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  Patient Records
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/add-patient"
                variant="contained"
                sx={{
                  backgroundColor: "#fff",
                  color: t.fuchsia,
                  fontWeight: 800,
                  borderRadius: 3,
                  px: 3.5,
                  py: 1.2,
                  fontSize: 14,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  "&:hover": { backgroundColor: t.fuchsiaLt, boxShadow: "0 6px 24px rgba(0,0,0,0.2)" },
                  alignSelf: { xs: "flex-start", sm: "center" },
                  flexShrink: 0,
                  mt: { xs: 0, sm: 0.5 },
                }}
              >
                + New Patient
              </Button>
            </Stack>

            {/* Stat pills */}
            <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}>
              <StatPill label="Total" value={patients.length} bg="rgba(255,255,255,0.18)" fg="#fff" />
              <StatPill label="Shown" value={filtered.length} bg="rgba(255,255,255,0.18)" fg="#fff" />
            </Stack>
          </Box>
        </Paper>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{
          p: "10px 16px",
          mb: 2.5,
          borderRadius: 3.5,
          border: `2px solid ${t.hairline}`,
          background: t.white,
          boxShadow: `0 2px 12px ${t.fuchsia}11`,
        }}>
          <TextField
            placeholder="Search by name or patient ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ fontSize: 20, mr: 0.5, mt: 0.2 }}>🔍</Typography>
                </InputAdornment>
              ),
              sx: { fontSize: 15, fontWeight: 500 },
            }}
          />
        </Paper>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: `2px solid ${t.hairline}`,
          boxShadow: `0 4px 24px ${t.fuchsia}14`,
        }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography sx={{ fontSize: 44, mb: 1.5 }}>🌿</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: t.ink }}>No patients found</Typography>
              <Typography sx={{ color: t.midgray, mt: 0.5 }}>Try a different name or ID</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                {/* Header */}
                <TableHead>
                  <TableRow sx={{ background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)` }}>
                    {[
                      { label: "ID",      w: 80  },
                      { label: "Patient", w: "auto" },
                      { label: "Age",     w: 80  },
                      { label: "Contact", w: 160 },
                      { label: "Actions", w: 220 },
                    ].map(({ label, w }) => (
                      <TableCell key={label} sx={{
                        width: w,
                        fontWeight: 800,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: t.fuchsiaDk,
                        py: 2,
                        borderBottom: `2px solid ${t.fuchsia}33`,
                      }}>
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* Rows */}
                <TableBody>
                  {filtered.map((patient, idx) => {
                    const ac = avatarColor(patient.patient_id);
                    return (
                      <TableRow
                        key={patient.patient_id}
                        hover
                        onClick={() => navigate(`/patients/${patient.patient_id}`)}
                        sx={{
                          cursor: "pointer",
                          background: idx % 2 === 0 ? t.white : t.offwhite,
                          "&:hover": { background: `${t.fuchsia}0A` },
                          transition: "background 0.15s",
                          "&:hover .row-actions": { opacity: 1 },
                        }}
                      >
                        {/* ID */}
                        <TableCell sx={{ py: 1.8 }}>
                          <Box sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            background: t.violetLt,
                            border: `1.5px solid ${t.violet}44`,
                          }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 800, color: t.violet }}>#{patient.patient_id}</Typography>
                          </Box>
                        </TableCell>

                        {/* Patient name + avatar */}
                        <TableCell sx={{ py: 1.8 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{
                              width: 38, height: 38,
                              fontSize: 13, fontWeight: 900,
                              backgroundColor: ac.bg,
                              color: ac.fg,
                              border: `2px solid ${ac.fg}33`,
                            }}>
                              {initials(patient.first_name, patient.last_name)}
                            </Avatar>
                            <Typography sx={{ fontWeight: 700, fontSize: 14, color: t.ink }}>
                              {patient.first_name} {patient.last_name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Age */}
                        <TableCell sx={{ py: 1.8 }}>
                          {patient.age
                            ? <Chip label={`${patient.age} yrs`} size="small" sx={{ fontWeight: 700, fontSize: 12, backgroundColor: t.tealLt, color: t.teal, border: `1.5px solid ${t.teal}33`, borderRadius: 1.5 }} />
                            : <Typography sx={{ color: t.midgray }}>—</Typography>}
                        </TableCell>

                        {/* Contact */}
                        <TableCell sx={{ py: 1.8, fontSize: 13, color: t.midgray, fontWeight: 500 }}>
                          {patient.contact_num || "—"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell sx={{ py: 1.8 }} onClick={(e) => e.stopPropagation()}>
                          <Stack direction="row" spacing={0.8} className="row-actions" sx={{ opacity: { xs: 1, md: 0.6 }, transition: "opacity 0.15s" }}>
                            <Button size="small" onClick={() => navigate(`/patients/${patient.patient_id}`)} sx={{
                              borderRadius: 2, fontWeight: 700, fontSize: 12, px: 1.8,
                              border: `1.5px solid ${t.violet}55`, color: t.violet,
                              "&:hover": { background: t.violetLt, borderColor: t.violet },
                            }}>View</Button>

                            <Button size="small" onClick={() => navigate(`/patients/${patient.patient_id}/edit`)} sx={{
                              borderRadius: 2, fontWeight: 700, fontSize: 12, px: 1.8,
                              background: t.teal, color: "#fff",
                              "&:hover": { background: "#00897B" },
                            }}>Edit</Button>

                            <Button size="small" onClick={() => setDeleteId(patient.patient_id)} sx={{
                              borderRadius: 2, fontWeight: 700, fontSize: 12, px: 1.8,
                              border: `1.5px solid ${t.coral}55`, color: t.coral,
                              "&:hover": { background: t.coralLt, borderColor: t.coral },
                            }}>Delete</Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* ── Delete Dialog ─────────────────────────────────────────────────── */}
        <Dialog
          open={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          PaperProps={{ sx: { borderRadius: 4, p: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxWidth: 420 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: t.ink, pb: 0.5 }}>
            🗑️ Remove patient record?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: t.midgray, fontSize: 14 }}>
              This permanently removes the patient and all associated data. This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setDeleteId(null)} disabled={deleteLoading} sx={{ borderRadius: 2.5, fontWeight: 700, color: t.midgray }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleteLoading}
              sx={{ borderRadius: 2.5, fontWeight: 800, background: t.coral, "&:hover": { background: "#C62828" }, px: 3 }}
            >
              {deleteLoading ? "Deleting…" : "Yes, delete"}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
}

export default Patients;