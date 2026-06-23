import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Paper } from "@mui/material";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:3000/patients/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch patient data");
        }

        const data = await res.json();
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // Loading UI
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading patient details...</Typography>
      </Box>
    );
  }

  // Error UI
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // No data fallback
  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No patient found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>

        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Patient Details
        </Typography>

        {/* Patient Info */}
       <Box sx={{ mb: 3 }}>
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography>
      <strong>ID:</strong> {patient.patient_id}
    </Typography>

    <Typography>
      <strong>Date:</strong>{" "}
      {patient.created_at
        ? new Date(patient.created_at).toLocaleDateString()
        : "N/A"}
    </Typography>
  </Box>

  <Typography>
    <strong>Name:</strong> {patient.first_name} {patient.last_name}
  </Typography>

  <Typography>
    <strong>Age:</strong> {patient.age}
  </Typography>
</Box>

        {/* Consultation Section */}
        <Typography variant="h5" gutterBottom>
          Consultation
        </Typography>

       
        <TextField
          label="Chief Complaint"
          multiline
          rows={5}
          fullWidth
        />
      </Paper>
    </Box>
  );
}

export default PatientDetails;