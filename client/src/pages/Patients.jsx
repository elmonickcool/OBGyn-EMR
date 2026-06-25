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
        const response = await fetch("http://192.168.0.101:3000/patients");

        if (!response.ok) throw new Error("Failed to fetch patients");

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
    const fullName =
      `${patient.first_name} ${patient.last_name}`.toLowerCase();

    return (
      fullName.includes(query.toLowerCase()) ||
      String(patient.patient_id).includes(query)
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const response = await fetch(
        `http://192.168.0.101:3000/patients/${deleteId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete patient");

      setPatients((prev) =>
        prev.filter((p) => p.patient_id !== deleteId)
      );

      setDeleteId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading)
    return (
      <Typography sx={{ p: 3 }}>Loading patients...</Typography>
    );

  if (error)
    return (
      <Typography color="error" sx={{ p: 3 }}>
        {error}
      </Typography>
    );

  return (
    <Container sx={{ py: 3, maxWidth: 1200 }}>
      {/* HEADER */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
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
              Patient Records
            </Typography>
            <Typography sx={{ opacity: 0.85 }}>
              Manage and access all registered patients
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/add-patient"
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "#4f46e5",
              fontWeight: 700,
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            + Add Patient
          </Button>
        </Stack>
      </Paper>

      {/* SEARCH BAR */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Search patient"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            size="small"
          />

          <Chip
            label={`${filteredPatients.length} Patients`}
            color="primary"
          />
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        {filteredPatients.length === 0 ? (
          <Typography sx={{ p: 3 }}>
            No patients found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f4f6fb" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Patient
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Age
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.patient_id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: "#f9fafb" },
                    }}
                  >
                    <TableCell>
                      #{patient.patient_id}
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>
                          {patient.first_name}{" "}
                          {patient.last_name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {patient.age || "—"}
                    </TableCell>

                    <TableCell>
                      {patient.contact_num || "—"}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/patients/${patient.patient_id}`
                            )
                          }
                        >
                          View
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            navigate(
                              `/patients/${patient.patient_id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() =>
                            setDeleteId(patient.patient_id)
                          }
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

      {/* DELETE DIALOG */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Delete Patient</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this
            patient record?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeleteId(null)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Patients;