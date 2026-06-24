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
} from "@mui/material";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients");

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return (
      fullName.includes(query.toLowerCase()) ||
      String(patient.patient_id).includes(query)
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/patients/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete patient");
      }

      setPatients((current) => current.filter((patient) => patient.patient_id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <Typography>Loading patients...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container sx={{ py: 3, maxWidth: 1200 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Patient List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse patients, search quickly, and open patient profiles.
            </Typography>
          </Box>
          <Button component={Link} to="/add-patient" variant="contained" color="primary" sx={{ minWidth: 160 }}>
            + Add Patient
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <TextField
            label="Search patients"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
            size="small"
            placeholder="Search by name or ID"
          />
          <Typography color="text.secondary">
            {filteredPatients.length} patient{filteredPatients.length === 1 ? "" : "s"}
          </Typography>
        </Stack>

        {filteredPatients.length === 0 ? (
          <Typography>No patients found.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.patient_id} hover>
                    <TableCell>{patient.patient_id}</TableCell>
                    <TableCell>{`${patient.first_name} ${patient.last_name}`}</TableCell>
                    <TableCell>{patient.age || "—"}</TableCell>
                    <TableCell>{patient.contact_num || "—"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/patients/${patient.patient_id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          onClick={() => navigate(`/patients/${patient.patient_id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => setDeleteId(patient.patient_id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete patient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this patient record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Patients;
