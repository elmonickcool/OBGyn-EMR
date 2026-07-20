import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Chip,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { API_URL } from "../../config";

// ─── Shared Vibrant Tokens ─────────────────────────────────────────────────
const t = {
  fuchsia: "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet: "#7C4DFF",
  violetLt: "#EDE7F6",
  teal: "#00BFA5",
  tealLt: "#E0F2F1",
  amber: "#FF8F00",
  amberLt: "#FFF8E1",
  sky: "#0288D1",
  skyLt: "#E1F5FE",
  ink: "#1A0533",
  midgray: "#7B6F84",
  hairline: "#EDE0F2",
  offwhite: "#FDFAFF",
  white: "#FFFFFF",
};

const fieldSx = (accent) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    background: t.offwhite,
    fontSize: 14,
    "& fieldset": { borderColor: t.hairline, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: accent },
    "&.Mui-focused fieldset": { borderColor: accent, borderWidth: "2px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: accent },
});

function FieldCard({ emoji, label, accent, children, span = 6 }) {
  return (
    <Grid item xs={12} sm={span}>
      <Box
        sx={{
          p: 2,
          height: "100%",
          borderRadius: 3,
          border: `1.5px solid ${t.hairline}`,
          background: t.white,
          "&:focus-within": {
            borderColor: accent,
            boxShadow: `0 0 0 3px ${accent}14`,
          },
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: 1.5,
              background: `${accent}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {emoji}
          </Box>
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: accent,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {label}
          </Typography>
        </Stack>
        {children}
      </Box>
    </Grid>
  );
}

function SubsectionHeader({ emoji, title, accent }) {
  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
      sx={{ mb: 1.5, mt: 3, "&:first-of-type": { mt: 0 } }}
    >
      <Box sx={{ width: 4, height: 18, borderRadius: 2, background: accent }} />
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: accent }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 14 }}>{emoji}</Typography>
    </Stack>
  );
}

// Custom toggle-pill checkbox for Dysmenorrhea
function TogglePill({ checked, onChange, label, accent }) {
  return (
    <Box
      onClick={() => onChange(!checked)}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.2,
        borderRadius: 2.5,
        cursor: "pointer",
        userSelect: "none",
        border: `1.5px solid ${checked ? accent : t.hairline}`,
        background: checked ? `${accent}14` : t.offwhite,
        transition: "all 0.15s",
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: 1,
          border: `2px solid ${checked ? accent : t.midgray + "66"}`,
          background: checked ? accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {checked && (
          <Typography
            sx={{ fontSize: 10, color: "#fff", fontWeight: 900, lineHeight: 1 }}
          >
            ✓
          </Typography>
        )}
      </Box>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: checked ? 700 : 500,
          color: checked ? accent : t.ink,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function GynecologicHistoryTab({ patient, form, setForm }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const saveGynecologicHistory = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${API_URL}/gynecologic-history/${patient.patient_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to save gynecologic history");
      showToast("Gynecologic history saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };
  const calculateGestationalAge = (lmp) => {
    if (!lmp) return "";

    const today = new Date();
    const lmpDate = new Date(lmp);

    if (lmpDate > today) return "";

    const diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));

    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    return `${weeks} weeks ${days} days`;
  };

  const g = form.gravidity ?? 0;
  const p = form.parity ?? 0;
  const a = form.abortion_count ?? 0;
  const l = form.living_children ?? 0;

  return (
    <Box>
      {/* Section header */}
      <Box
        sx={{
          mb: 1.5,
          px: 2.5,
          py: 1.8,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${t.fuchsiaLt} 0%, ${t.violetLt} 100%)`,
          border: `1.5px solid ${t.fuchsia}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Typography sx={{ fontSize: 20 }}>🌸</Typography>
          <Box>
            <Typography
              sx={{ fontWeight: 800, fontSize: 14, color: t.fuchsiaDk }}
            >
              Gynecologic History
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: t.midgray, fontWeight: 500 }}
            >
              {patient.first_name} {patient.last_name}
            </Typography>
          </Box>
        </Stack>

        {/* Live GPAL summary */}
        <Chip
          label={`G${g} P${p} A${a} L${l}`}
          sx={{
            fontWeight: 800,
            fontSize: 13,
            height: 30,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
            color: "#fff",
            px: 1,
          }}
        />
      </Box>

      {/* ── Menstrual History ───────────────────────────────────── */}
      <SubsectionHeader
        emoji="🩸"
        title="Menstrual History"
        accent={t.fuchsia}
      />
      <Grid container spacing={1.5}>
        <FieldCard emoji="📅" label="Last Menstrual Period" accent={t.fuchsia}>
          <TextField
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.lmp || ""}
            onChange={(e) => setForm({ ...form, lmp: e.target.value })}
            sx={fieldSx(t.fuchsia)}
          />
        </FieldCard>

        <FieldCard emoji="🌱" label="Age at Menarche" accent={t.violet}>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 12"
            value={form.menarche_age || ""}
            onChange={(e) => setForm({ ...form, menarche_age: e.target.value })}
            sx={fieldSx(t.violet)}
          />
        </FieldCard>
        <FieldCard emoji="🤰" label="Gestational Age" accent={t.amber}>
          <TextField
            fullWidth
            variant="outlined"
            value={calculateGestationalAge(form.lmp)}
            InputProps={{
              readOnly: true,
            }}
            sx={fieldSx(t.amber)}
          />
        </FieldCard>

        <FieldCard emoji="🔁" label="Cycle Type" accent={t.teal}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={form.cycle_type || "Regular"}
            onChange={(e) => setForm({ ...form, cycle_type: e.target.value })}
            sx={fieldSx(t.teal)}
          >
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Irregular">Irregular</MenuItem>
          </TextField>
        </FieldCard>

        <FieldCard emoji="⏱️" label="Cycle Duration (days)" accent={t.sky}>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 28"
            value={form.cycle_duration || ""}
            onChange={(e) =>
              setForm({ ...form, cycle_duration: e.target.value })
            }
            sx={fieldSx(t.sky)}
          />
        </FieldCard>

        <Grid item xs={12}>
          <TogglePill
            checked={form.dysmenorrhea || false}
            onChange={(val) => setForm({ ...form, dysmenorrhea: val })}
            label="Dysmenorrhea (painful menstruation)"
            accent={t.fuchsia}
          />
        </Grid>
      </Grid>

      {/* ── Obstetric History ───────────────────────────────────── */}
      <SubsectionHeader
        emoji="🤰"
        title="Obstetric History (GPAL)"
        accent={t.violet}
      />
      <Grid container spacing={1.5}>
        <FieldCard emoji="G" label="Gravidity" accent={t.fuchsia}>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            value={form.gravidity ?? 0}
            onChange={(e) => setForm({ ...form, gravidity: e.target.value })}
            sx={fieldSx(t.fuchsia)}
          />
        </FieldCard>

        <FieldCard emoji="P" label="Parity" accent={t.violet}>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            value={form.parity ?? 0}
            onChange={(e) => setForm({ ...form, parity: e.target.value })}
            sx={fieldSx(t.violet)}
          />
        </FieldCard>

        <FieldCard emoji="A" label="Abortion Count" accent={t.amber}>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            value={form.abortion_count ?? 0}
            onChange={(e) =>
              setForm({ ...form, abortion_count: e.target.value })
            }
            sx={fieldSx(t.amber)}
          />
        </FieldCard>

        <FieldCard emoji="L" label="Living Children" accent={t.teal}>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            value={form.living_children ?? 0}
            onChange={(e) =>
              setForm({ ...form, living_children: e.target.value })
            }
            sx={fieldSx(t.teal)}
          />
        </FieldCard>
      </Grid>

      {/* ── Delivery & Contraception ────────────────────────────── */}
      <SubsectionHeader
        emoji="🍼"
        title="Delivery & Contraception"
        accent={t.teal}
      />
      <Grid container spacing={1.5}>
        <FieldCard emoji="🏥" label="Delivery Type" accent={t.sky}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={form.delivery_type || "NSVD"}
            onChange={(e) =>
              setForm({ ...form, delivery_type: e.target.value })
            }
            sx={fieldSx(t.sky)}
          >
            <MenuItem value="NSVD">NSVD</MenuItem>
            <MenuItem value="CS">CS</MenuItem>
            <MenuItem value="Both">Both</MenuItem>
          </TextField>
        </FieldCard>

        <FieldCard emoji="🛡️" label="Contraception" accent={t.teal}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="e.g. None, OCP, IUD, Condom…"
            value={form.contraception || ""}
            onChange={(e) =>
              setForm({ ...form, contraception: e.target.value })
            }
            sx={fieldSx(t.teal)}
          />
        </FieldCard>
      </Grid>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={saveGynecologicHistory}
          disabled={saving}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.3,
            fontWeight: 800,
            fontSize: 14,
            background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
            boxShadow: `0 6px 20px ${t.fuchsia}44`,
            "&:hover": {
              background: `linear-gradient(135deg, ${t.fuchsiaDk}, #6200EA)`,
              boxShadow: `0 8px 24px ${t.fuchsia}55`,
            },
            "&:disabled": { opacity: 0.6 },
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : "🌸  Save Gynecologic History"}
        </Button>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GynecologicHistoryTab;
