import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { API_URL } from "../config";

function EditPatient() {
  const { id } = useParams();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    birth_date: "",
    address: "",
    contact_num: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/patients/${id}`);
        if (!response.ok) throw new Error("Failed to fetch patient");
        const data = await response.json();
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          age: data.age || "",
          birth_date: data.birth_date ? data.birth_date.slice(0, 10) : "",
          address: data.address || "",
          contact_num: data.contact_num || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "birth_date") {
      setForm((prev) => ({
        ...prev,
        birth_date: value,
        age: value ? calculateAge(value) : "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update patient");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, maxWidth: 900 }}>
        <Typography>Loading patient...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, maxWidth: 900 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Edit Patient
          </Typography>
          <Typography color="text.secondary">
            Update patient profile and contact details.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Birth Date"
                name="birth_date"
                type="date"
                value={form.birth_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                name="age"
                type="number"
                value={form.age}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contact Number"
                name="contact_num"
                value={form.contact_num}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditPatient;
