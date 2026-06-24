import { Box, Typography, TextField, Button, Checkbox, FormGroup, FormControlLabel, MenuItem } from "@mui/material";

function GynecologicHistoryTab({ patient, form, setForm }) {
  const saveGynecologicHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/gynecologic-history/${patient.patient_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save gynecologic history");
      }

      alert("Gynecologic history saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gynecologic History
      </Typography>

      <TextField
        label="Last Menstrual Period"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={form.lmp || ""}
        onChange={(e) => setForm({ ...form, lmp: e.target.value })}
      />

      <TextField
        label="Age at Menarche"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={form.menarche_age || ""}
        onChange={(e) => setForm({ ...form, menarche_age: e.target.value })}
      />

      <TextField
        select
        fullWidth
        label="Cycle Type"
        sx={{ mt: 2 }}
        value={form.cycle_type || "Regular"}
        onChange={(e) => setForm({ ...form, cycle_type: e.target.value })}
      >
        <MenuItem value="Regular">Regular</MenuItem>
        <MenuItem value="Irregular">Irregular</MenuItem>
      </TextField>

      <TextField
        label="Cycle Duration (days)"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={form.cycle_duration || ""}
        onChange={(e) => setForm({ ...form, cycle_duration: e.target.value })}
      />

      <FormGroup sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.dysmenorrhea || false}
              onChange={(e) => setForm({ ...form, dysmenorrhea: e.target.checked })}
            />
          }
          label="Dysmenorrhea"
        />
      </FormGroup>

      <TextField
        label="Gravidity"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={form.gravidity || 0}
        onChange={(e) => setForm({ ...form, gravidity: e.target.value })}
      />

      <TextField
        label="Parity"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={form.parity || 0}
        onChange={(e) => setForm({ ...form, parity: e.target.value })}
      />

      <TextField
        label="Abortion Count"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={form.abortion_count || 0}
        onChange={(e) => setForm({ ...form, abortion_count: e.target.value })}
      />

      <TextField
        label="Living Children"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={form.living_children || 0}
        onChange={(e) => setForm({ ...form, living_children: e.target.value })}
      />

      <TextField
        select
        fullWidth
        label="Delivery Type"
        sx={{ mt: 2 }}
        value={form.delivery_type || "NSVD"}
        onChange={(e) => setForm({ ...form, delivery_type: e.target.value })}
      >
        <MenuItem value="NSVD">NSVD</MenuItem>
        <MenuItem value="CS">CS</MenuItem>
        <MenuItem value="Both">Both</MenuItem>
      </TextField>

      <TextField
        label="Contraception"
        fullWidth
        sx={{ mt: 2 }}
        value={form.contraception || ""}
        onChange={(e) => setForm({ ...form, contraception: e.target.value })}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveGynecologicHistory}>
        Save Gynecologic History
      </Button>
    </Box>
  );
}

export default GynecologicHistoryTab;
