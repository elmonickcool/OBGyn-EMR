import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function AddPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    birth_date: "",
    address: "",
    contact_num: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff =
      today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birth_date") {
      setForm({
        ...form,
        birth_date: value,
        age: calculateAge(value),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://192.168.0.101:3000/patients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="700">
              Patient Registration
            </Typography>

            <Typography sx={{ opacity: 0.85 }}>
              Register a new patient into the
              Electronic Medical Records System
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "#4f46e5",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            Back to Patients
          </Button>
        </Stack>
      </Paper>

      {/* FORM */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
          >
            Personal Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
  label="Birth Date"
  value={
    form.birth_date
      ? dayjs(form.birth_date)
      : null
  }
  onChange={(newValue) => {
    const birthDate = newValue
      ? newValue.format("YYYY-MM-DD")
      : "";

    setForm({
      ...form,
      birth_date: birthDate,
      age: birthDate
        ? calculateAge(birthDate)
        : "",
    });
  }}
  slotProps={{
    textField: {
      fullWidth: true,
      required: true,
    },
  }}
/>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                value={form.age}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mt: 4 }}
            gutterBottom
          >
            Contact Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact_num"
                value={form.contact_num}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 4 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading
                ? "Saving Patient..."
                : "Save Patient"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default AddPatient;