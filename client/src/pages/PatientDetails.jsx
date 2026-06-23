import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import PatientTabs from "../components/PatientTabs";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  const [form, setForm] = useState({
    chief_complaint: "",
    hpi: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:3000/patients/${id}`);

        if (!res.ok) throw new Error("Failed to fetch patient data");

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!patient) return <p>No patient found</p>;

  return (
    <Box sx={{ maxWidth: 850, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3 }}>

        <Typography variant="h4" gutterBottom>
          Patient Record
        </Typography>

        {/* 🔥 Reusable Tabs Component */}
        <PatientTabs
          patient={patient}
          tab={tab}
          setTab={setTab}
          form={form}
          setForm={setForm}
        />

      </Paper>
    </Box>
  );
}

export default PatientDetails;