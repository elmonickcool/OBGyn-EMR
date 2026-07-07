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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
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
  ink: "#2B1620",      // deep plum-brown, masthead ground
  inkSoft: "#4A2F3B",  // secondary text on dark
  bg: "#FBF5F1",        // warm cream, content ground
  surface: "#FFFFFF",
  border: "#EDE1D8",
  rose: "#C4677A",
  roseDeep: "#A8495E",
  sage: "#7C9885",
  gold: "#D9A65C",
  cream: "#F6EDE6",
  text: "#34202E",
  textMuted: "#8C7A82",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// Animated doppler / heartbeat trace — the signature element.
// A looping waveform reminiscent of a fetal doppler read-out.
function DopplerTrace() {
  const path =
    "M0,30 L60,30 L75,30 L85,8 L95,52 L105,18 L115,30 L140,30 L160,30 L175,10 L185,50 L195,20 L205,30 L230,30 L400,30 L420,30 L435,8 L445,52 L455,18 L465,30 L490,30 L510,30 L525,10 L535,50 L545,20 L555,30 L580,30 L750,30 L770,30 L785,8 L795,52 L805,18 L815,30 L840,30";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 62,
        overflow: "hidden",
        mt: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(43,22,32,1) 0%, rgba(43,22,32,0) 6%, rgba(43,22,32,0) 94%, rgba(43,22,32,1) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 840 62"
        preserveAspectRatio="none"
        sx={{
          width: "200%",
          height: "100%",
          animation: "trace-scroll 9s linear infinite",
          "@keyframes trace-scroll": {
            from: { transform: "translateX(0)" },
            to: { transform: "translateX(-50%)" },
          },
        }}
      >
        <path d={path} fill="none" stroke={COLORS.rose} strokeWidth="1.6" opacity="0.85" />
        <path
          d={path}
          fill="none"
          stroke={COLORS.rose}
          strokeWidth="1.6"
          opacity="0.85"
          transform="translate(840,0)"
        />
      </Box>
    </Box>
  );
}

function StatUnit({ label, value, icon, accent, last }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        pr: { xs: 0, sm: 4 },
        pl: { xs: 0, sm: 0 },
        borderRight: last ? "none" : { xs: "none", sm: `1px solid rgba(255,255,255,0.12)` },
        flex: "1 1 auto",
      }}
    >
      <Box sx={{ color: accent, opacity: 0.9, display: "flex" }}>{icon}</Box>
      <Box>
        <Typography
          sx={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: { xs: 26, sm: 30 },
            lineHeight: 1,
            color: "#FBF5F1",
            fontWeight: 500,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(251,245,241,0.55)",
            mt: 0.3,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Stack>
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
      <Box sx={{ bgcolor: COLORS.ink, pt: { xs: 4, md: 5 }, pb: { xs: 3, md: 4 } }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            spacing={1}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: COLORS.gold,
                  mb: 1,
                }}
              >
                Doc Rikka · Women's Medical &amp; Ultrasound Clinic
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: { xs: 30, md: 38 },
                  color: "#FBF5F1",
                  lineHeight: 1.1,
                }}
              >
                {greeting()}, Doctor.
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: "rgba(251,245,241,0.6)",
              }}
            >
              {today}
            </Typography>
          </Stack>

          {/* Signature: doppler trace */}
          <DopplerTrace />

          {/* Inline stat strip */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 0 }}
            sx={{ mt: 1 }}
          >
            <StatUnit
              label="Total Patients"
              value={stats.totalPatients}
              icon={<PeopleAltOutlinedIcon fontSize="small" />}
              accent={COLORS.rose}
            />
            <StatUnit
              label="Today's Appointments"
              value={stats.todayAppointments ?? 18}
              icon={<EventNoteOutlinedIcon fontSize="small" />}
              accent={COLORS.gold}
            />
            <StatUnit
              label="Consultations"
              value={stats.todayConsultations ?? 12}
              icon={<MedicalServicesOutlinedIcon fontSize="small" />}
              accent={COLORS.sage}
            />
            <StatUnit
              label="New Patients"
              value={stats.newPatients ?? 5}
              icon={<PersonAddAlt1OutlinedIcon fontSize="small" />}
              accent={COLORS.rose}
              last
            />
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
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
                    fontWeight: 500,
                    color: COLORS.text,
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
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11,
                            letterSpacing: "0.06em",
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
                          sx={{ color: COLORS.textMuted, py: 5, border: "none", fontFamily: "'Inter', sans-serif" }}
                        >
                          No patients found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map((patient) => (
                        <TableRow
                          key={patient.patient_id}
                          sx={{
                            "&:hover": { bgcolor: COLORS.cream },
                            "& td": { borderBottom: `1px solid ${COLORS.border}` },
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  fontSize: 12,
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  bgcolor: COLORS.cream,
                                  color: COLORS.roseDeep,
                                }}
                              >
                                {patient.first_name?.[0]}
                                {patient.last_name?.[0]}
                              </Avatar>
                              <Typography
                                sx={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: COLORS.text }}
                              >
                                {patient.first_name} {patient.last_name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: COLORS.text }}
                          >
                            {patient.age}
                          </TableCell>
                          <TableCell
                            sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: COLORS.textMuted }}
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
                borderRadius: 3,
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
                  fontWeight: 500,
                  color: COLORS.text,
                  mb: 1,
                }}
              >
                Patients Per Day
              </Typography>
              <Divider sx={{ borderColor: COLORS.border, mb: 2 }} />
              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientChartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: COLORS.textMuted }}
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
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        borderRadius: 8,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: "none",
                      }}
                      labelStyle={{ color: COLORS.text, fontWeight: 600 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke={COLORS.roseDeep}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: COLORS.gold, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: COLORS.roseDeep }}
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