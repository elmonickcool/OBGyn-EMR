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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { API_URL } from "../config.js";


function StatCard({ title, value, icon, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: color,
        color: "#fff",
        height: "100%",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: "rgba(255,255,255,.2)", width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}

function Dashboard() {
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
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 5,
          background: "linear-gradient(135deg,#7B2FF7 0%, #F107A3 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          OB-Gyne Electronic Medical Record
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          Welcome back, Doctor 👋
        </Typography>
      </Paper>

      {/* Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<PeopleIcon />}
            color="linear-gradient(135deg,#4F46E5,#3B82F6)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments ?? 18}
            icon={<EventNoteIcon />}
            color="linear-gradient(135deg,#EC4899,#F472B6)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Consultations"
            value={stats.todayConsultations ?? 12}
            icon={<MedicalServicesIcon />}
            color="linear-gradient(135deg,#10B981,#34D399)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Patients"
            value={stats.newPatients ?? 5}
            icon={<PersonAddAlt1Icon />}
            color="linear-gradient(135deg,#F59E0B,#FBBF24)"
          />
        </Grid>
      </Grid>

      {/* Lower Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: 350, overflow: "auto" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Recent Patients
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Age</strong></TableCell>
                    <TableCell><strong>Last Visit</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: "text.secondary", py: 4 }}>
                        No patients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.patient_id} hover>
                        <TableCell>
                          {patient.first_name} {patient.last_name}
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>
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

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: 350 }}>
            <Typography variant="h6" fontWeight="bold">
              Today's Schedule
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Upcoming appointments...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;