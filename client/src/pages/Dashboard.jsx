import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { API_URL } from "../config.js";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ---- Design tokens -------------------------------------------------------
const COLORS = {
  ink: "#2B1330",
  bg: "#FFF6F8",
  surface: "#FFFFFF",
  border: "#F4DCE4",
  fuchsia: "#D6336C",
  fuchsiaDeep: "#A82255",
  violet: "#6C3483",
  teal: "#17A398",
  gold: "#F4A950",
  textMuted: "#8C6E7C",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// Signature element: an animated ultrasound / doppler sonar sweep —
// concentric pinging rings + a rotating probe sweep, evoking the scan itself.
function SonarSweep() {
  const rings = [0, 0.9, 1.8];
  return (
    <Box
      sx={{
        position: "absolute",
        top: { xs: -30, md: -10 },
        right: { xs: -30, md: 10 },
        width: { xs: 180, md: 240 },
        height: { xs: 180, md: 240 },
        pointerEvents: "none",
      }}
    >
      {rings.map((delay, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: "35%",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.55)",
            animation: `sonar-ping 2.7s ease-out ${delay}s infinite`,
            "@keyframes sonar-ping": {
              "0%": { transform: "scale(0.6)", opacity: 0.9 },
              "100%": { transform: "scale(3.4)", opacity: 0 },
            },
          }}
        />
      ))}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.55) 35deg, rgba(255,255,255,0) 95deg, rgba(255,255,255,0) 360deg)",
          animation: "sonar-spin 3.2s linear infinite",
          "@keyframes sonar-spin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
          maskImage: "radial-gradient(circle, transparent 30%, black 31%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 31%, black 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: "46%",
          borderRadius: "50%",
          bgcolor: "#fff",
          boxShadow: "0 0 14px 4px rgba(255,255,255,0.7)",
          animation: "sonar-dot 2.7s ease-in-out infinite",
          "@keyframes sonar-dot": {
            "0%, 100%": { opacity: 0.6, transform: "scale(0.9)" },
            "50%": { opacity: 1, transform: "scale(1.2)" },
          },
        }}
      />
    </Box>
  );
}

function StatCard({ label, value, icon, gradient }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 160,
        p: 2.5,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 12px 30px -12px rgba(107,26,64,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 1.75,
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: gradient,
          color: "#fff",
          flexShrink: 0,
          boxShadow: "0 6px 16px -6px rgba(0,0,0,0.35)",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 24,
            lineHeight: 1,
            color: COLORS.ink,
            fontWeight: 500,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: COLORS.textMuted,
            mt: 0.3,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

function Dashboard() {
  const [patientChartData, setPatientChartData] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayConsultations: 0,
    todayAppointments: 0,
    newPatients: 0,
  });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);

    fetch(`${API_URL}/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch(console.error);

    fetch(`${API_URL}/dashboard/patients-per-day`)
      .then((res) => res.json())
      .then((data) => setPatientChartData(data))
      .catch(console.error);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ bgcolor: COLORS.bg, minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>

      {/* Masthead */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${COLORS.violet} 0%, ${COLORS.fuchsia} 65%, ${COLORS.fuchsiaDeep} 100%)`,
          pt: { xs: 4, md: 5 },
          pb: { xs: 9, md: 10 },
        }}
      >
        <SonarSweep />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            spacing={1}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <FavoriteRoundedIcon sx={{ fontSize: 16, color: COLORS.gold }} />
                <Typography
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: COLORS.gold,
                  }}
                >
                  Doc Rikka · Women's Medical &amp; Ultrasound Clinic
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: { xs: 32, md: 42 },
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                {greeting()}, Doctor.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                  mt: 0.5,
                }}
              >
                Here's today's clinic pulse.
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {today}
            </Typography>
          </Stack>
        </Container>

        {/* Floating glass stat cards, overlapping the banner edge */}
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, mt: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <StatCard
              label="Total Patients"
              value={stats.totalPatients}
              icon={<PeopleAltRoundedIcon fontSize="small" />}
              gradient={`linear-gradient(135deg, ${COLORS.fuchsia}, ${COLORS.fuchsiaDeep})`}
            />
            <StatCard
              label="Today's Appointments"
              value={stats.todayAppointments ?? 18}
              icon={<EventNoteRoundedIcon fontSize="small" />}
              gradient={`linear-gradient(135deg, ${COLORS.gold}, #E88A2E)`}
            />
            <StatCard
              label="Consultations"
              value={stats.todayConsultations ?? 12}
              icon={<MonitorHeartRoundedIcon fontSize="small" />}
              gradient={`linear-gradient(135deg, ${COLORS.teal}, #0E7A70)`}
            />
            <StatCard
              label="New Patients"
              value={stats.newPatients ?? 5}
              icon={<FavoriteRoundedIcon fontSize="small" />}
              gradient={`linear-gradient(135deg, ${COLORS.violet}, #4A2360)`}
            />
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 6 }, pb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.surface,
                height: 380,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1}>
                <Typography
                  sx={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: COLORS.ink,
                  }}
                >
                  Recent Patients
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    color: COLORS.textMuted,
                  }}
                >
                  {patients.length} on file
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: COLORS.border, mb: 1 }} />
              <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Name", "Age", "Last Visit"].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontFamily: "'Manrope', sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: COLORS.textMuted,
                            borderBottom: `1px solid ${COLORS.border}`,
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="center"
                          sx={{
                            color: COLORS.textMuted,
                            py: 5,
                            border: "none",
                            fontFamily: "'Manrope', sans-serif",
                          }}
                        >
                          No patients found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map((patient, i) => (
                        <TableRow
                          key={patient.patient_id}
                          sx={{
                            "&:hover": { bgcolor: "#FDF0F4" },
                            "& td": { borderBottom: `1px solid ${COLORS.border}` },
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 12,
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  color: "#fff",
                                  background:
                                    i % 2 === 0
                                      ? `linear-gradient(135deg, ${COLORS.fuchsia}, ${COLORS.violet})`
                                      : `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.violet})`,
                                }}
                              >
                                {patient.first_name?.[0]}
                                {patient.last_name?.[0]}
                              </Avatar>
                              <Typography
                                sx={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: COLORS.ink }}
                              >
                                {patient.first_name} {patient.last_name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: COLORS.ink }}
                          >
                            {patient.age}
                          </TableCell>
                          <TableCell
                            sx={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: COLORS.textMuted }}
                          >
                            {patient.updated_at
                              ? new Date(patient.updated_at).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.surface,
                height: 380,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.ink,
                  mb: 1,
                }}
              >
                Patients Per Day
              </Typography>
              <Divider sx={{ borderColor: COLORS.border, mb: 2 }} />
              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientChartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pulseLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={COLORS.fuchsia} />
                        <stop offset="100%" stopColor={COLORS.teal} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fill: COLORS.textMuted }}
                      axisLine={{ stroke: COLORS.border }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fill: COLORS.textMuted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 12,
                        borderRadius: 10,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: "0 8px 24px -8px rgba(107,26,64,0.25)",
                      }}
                      labelStyle={{ color: COLORS.ink, fontWeight: 700 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke="url(#pulseLine)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: COLORS.gold, strokeWidth: 0 }}
                      activeDot={{ r: 7, fill: COLORS.fuchsiaDeep }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;