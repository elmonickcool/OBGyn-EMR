import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import PatientTabs from "../components/PatientTabs";

function PatientForms() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(() => {
    const storedForm = window.localStorage.getItem(`patient:${id}:form`);
    if (storedForm) {
      try {
        return JSON.parse(storedForm);
      } catch (err) {
        console.error("Failed to parse stored form data", err);
      }
    }
    return {
      chief_complaint: "",
      hpi: "",
      notes: "",
    };
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!patient) return <p>No patient found</p>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, pb: 4 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, backgroundColor: "#fff", boxShadow: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: 2, alignItems: { xs: "flex-start", md: "center" } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {patient.first_name} {patient.last_name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
              Fill or update patient records in the clinic forms section.
            </Typography>
          </Box>
          <Button component={Link} to={`/patients/${id}`} variant="outlined">
            View Profile
          </Button>
        </Box>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, backgroundColor: "#fff" }}>
        <PatientTabs patient={patient} tab={tab} setTab={setTab} form={form} setForm={setForm} />
      </Paper>
    </Box>
  );
}

export default PatientForms;
