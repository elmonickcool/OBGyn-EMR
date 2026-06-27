import { Box, Typography, Stack, Chip, Avatar, Grid } from "@mui/material";

// ─── Shared Vibrant Tokens ─────────────────────────────────────────────────
const t = {
  fuchsia:   "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet:    "#7C4DFF",
  violetLt:  "#EDE7F6",
  teal:      "#00BFA5",
  tealLt:    "#E0F2F1",
  ink:       "#1A0533",
  midgray:   "#7B6F84",
  hairline:  "#EDE0F2",
  offwhite:  "#FDFAFF",
  white:     "#FFFFFF",
};

function initials(first, last) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function InfoRow({ emoji, label, value, accent }) {
  return (
    <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      px: 2,
      py: 1.6,
      borderRadius: 2.5,
      background: t.offwhite,
      border: `1.5px solid ${t.hairline}`,
      transition: "border-color 0.15s, box-shadow 0.15s",
      "&:hover": {
        borderColor: accent ?? t.fuchsia,
        boxShadow: `0 2px 12px ${(accent ?? t.fuchsia)}18`,
      },
    }}>
      <Box sx={{
        width: 34, height: 34, flexShrink: 0,
        borderRadius: 2,
        background: `${(accent ?? t.fuchsia)}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>
        {emoji}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: t.midgray, textTransform: "uppercase", letterSpacing: "0.09em", mb: 0.2 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: t.ink, lineHeight: 1.3 }}>
          {value || <span style={{ color: t.midgray, fontWeight: 400, fontStyle: "italic" }}>Not provided</span>}
        </Typography>
      </Box>
    </Box>
  );
}

function PatientInfoTab({ patient }) {
  return (
    <Box>
      {/* Patient card */}
      <Box sx={{
        mb: 3,
        p: 3,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${t.fuchsia} 0%, ${t.violet} 60%, #4A148C 100%)`,
        boxShadow: `0 8px 28px ${t.fuchsia}44`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -20, left: 140, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        <Stack direction="row" spacing={2.5} alignItems="center" sx={{ position: "relative" }}>
          <Avatar sx={{
            width: 56, height: 56,
            fontSize: 20, fontWeight: 900,
            background: "rgba(255,255,255,0.22)",
            border: "2px solid rgba(255,255,255,0.45)",
            color: "#fff",
            flexShrink: 0,
          }}>
            {initials(patient.first_name, patient.last_name)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {patient.first_name} {patient.last_name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.8, flexWrap: "wrap", gap: 0.8 }}>
              <Chip
                label={`ID #${patient.patient_id}`}
                size="small"
                sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 11, height: 22, borderRadius: 1.5, border: "1px solid rgba(255,255,255,0.3)" }}
              />
              {patient.age && (
                <Chip
                  label={`${patient.age} yrs`}
                  size="small"
                  sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 11, height: 22, borderRadius: 1.5, border: "1px solid rgba(255,255,255,0.3)" }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Info rows */}
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={6}>
          <InfoRow emoji="🪪"  label="Patient ID"   value={`#${patient.patient_id}`} accent={t.violet}  />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow emoji="🎂"  label="Age"          value={patient.age ? `${patient.age} years old` : null} accent={t.fuchsia} />
        </Grid>
        <Grid item xs={12}>
          <InfoRow emoji="📍"  label="Address"      value={patient.address}     accent={t.teal}    />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow emoji="📞"  label="Contact"      value={patient.contact_num} accent={t.fuchsia} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoRow emoji="👤"  label="Full Name"    value={`${patient.first_name} ${patient.last_name}`} accent={t.violet} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PatientInfoTab;