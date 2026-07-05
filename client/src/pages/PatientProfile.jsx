import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { formatDate, formatDateTime } from "../utils/dateUtils";
import { API_URL } from "../config";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  rose:      "#C2185B",
  roseSoft:  "#F8BBD9",
  rosePale:  "#FFF0F6",
  plum:      "#7B1FA2",
  plumLight: "#E1BEE7",
  sage:      "#558B6E",
  sagePale:  "#EDF7F1",
  neutral50: "#FAFAFA",
  neutral100:"#F5F5F5",
  neutral300:"#E0E0E0",
  neutral600:"#757575",
  neutral800:"#212121",
  white:     "#FFFFFF",
};

// ─── Palette helpers ──────────────────────────────────────────────────────────
const headerGradient = `linear-gradient(135deg, ${tokens.rose} 0%, ${tokens.plum} 100%)`;

const sectionMeta = {
  medicalHistory:     { color: tokens.plum,  bg: tokens.plumLight,  emoji: "🩺" },
  allergies:          { color: "#B71C1C",    bg: "#FFEBEE",          emoji: "⚠️" },
  consultation:       { color: tokens.rose,  bg: tokens.rosePale,   emoji: "📋" },
  surgeries:          { color: "#E65100",    bg: "#FFF3E0",          emoji: "🔧" },
  hospitalizations:   { color: "#1565C0",    bg: "#E3F2FD",          emoji: "🏥" },
  familyHistory:      { color: tokens.sage,  bg: tokens.sagePale,   emoji: "👨‍👩‍👧" },
  socialHistory:      { color: "#4527A0",    bg: "#EDE7F6",          emoji: "🌿" },
  gynecologic:        { color: tokens.rose,  bg: tokens.rosePale,   emoji: "🌸" },
  reviewOfSystems:    { color: tokens.sage,  bg: tokens.sagePale,   emoji: "📝" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, meta, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1.5px solid ${meta.bg}`,
        height: "100%",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: meta.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {meta.emoji}
          </Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: meta.color, lineHeight: 1.2 }}
          >
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function VitalPill({ label, value, unit }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        py: 1.5,
        borderRadius: 2.5,
        backgroundColor: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.3)",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{ fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}
      >
        {value ?? "—"}
        {unit && (
          <Typography
            component="span"
            sx={{ fontSize: 11, fontWeight: 500, ml: 0.3, opacity: 0.8 }}
          >
            {unit}
          </Typography>
        )}
      </Typography>
      <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.75)", mt: 0.3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </Typography>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vitalSigns, setVitalSigns] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [hospitalizations, setHospitalizations] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [socialHistory, setSocialHistory] = useState(null);
  const [gynecologicHistory, setGynecologicHistory] = useState(null);
  const [reviewOfSystems, setReviewOfSystems] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/patients/${id}`);
        if (!res.ok) throw new Error("Failed to fetch patient data");
        setPatient(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchResource = async (url, setter) => {
      try {
        const res = await fetch(url);
        if (res.ok) setter(await res.json());
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err);
      }
    };

    const BASE = `${API_URL}`;
    fetchPatient();
    fetchResource(`${BASE}/medical-history/${id}`,     setMedicalHistory);
    fetchResource(`${BASE}/vital-signs/${id}`,          setVitalSigns);
    fetchResource(`${BASE}/consultations/${id}`,        setConsultation);
    fetchResource(`${BASE}/allergies/${id}`,            setAllergies);
    fetchResource(`${BASE}/surgeries/${id}`,            setSurgeries);
    fetchResource(`${BASE}/hospitalizations/${id}`,     setHospitalizations);
    fetchResource(`${BASE}/family-history/${id}`,       setFamilyHistory);
    fetchResource(`${BASE}/social-history/${id}`,       setSocialHistory);
    fetchResource(`${BASE}/gynecologic-history/${id}`,  setGynecologicHistory);
    fetchResource(`${BASE}/review-of-systems/${id}`,    setReviewOfSystems);
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 48, mb: 1 }}>🌸</Typography>
          <Typography color="text.secondary">Loading patient record…</Typography>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );

  if (!patient)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No patient found.</Typography>
      </Box>
    );

  // initials for avatar
  const initials = `${patient.first_name?.[0] ?? ""}${patient.last_name?.[0] ?? ""}`.toUpperCase();

  // ROS keys
  const rosKeys = [
    { key: "fever",                      label: "Fever" },
    { key: "weight_loss",                label: "Weight Loss" },
    { key: "headache",                   label: "Headache" },
    { key: "chest_pain",                 label: "Chest Pain" },
    { key: "shortness_of_breath",        label: "Shortness of Breath" },
    { key: "abdominal_pain",             label: "Abdominal Pain" },
    { key: "urinary_symptoms",           label: "Urinary Symptoms" },
    { key: "vaginal_bleeding_discharge", label: "Vaginal Bleeding/Discharge" },
  ];
  const positiveROS = reviewOfSystems
    ? rosKeys.filter((k) => reviewOfSystems[k.key])
    : [];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1.5, md: 3 }, pb: 6, backgroundColor: tokens.neutral50, minHeight: "100vh" }}>

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 4,
          overflow: "hidden",
          background: headerGradient,
          boxShadow: "0 8px 32px rgba(194, 24, 91, 0.25)",
        }}
      >
        {/* Top strip: name + actions */}
        <Box sx={{ px: { xs: 2.5, md: 4 }, pt: 3.5, pb: 2.5, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { md: "center" }, gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                fontSize: 24,
                fontWeight: 800,
                background: "rgba(255,255,255,0.22)",
                border: "2px solid rgba(255,255,255,0.5)",
                color: "#fff",
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                {patient.first_name} {patient.last_name}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 13, mt: 0.5, fontWeight: 500 }}>
                Patient ID: {patient.patient_id} &nbsp;·&nbsp; {patient.age} yrs &nbsp;·&nbsp; {formatDate(patient.birth_date)}
              </Typography>
              {patient.contact_num && (
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 12, mt: 0.3 }}>
                  📞 {patient.contact_num}
                </Typography>
              )}
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              size="small"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.55)", borderRadius: 2, fontWeight: 600, "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.08)" } }}
            >
              ← Back
            </Button>
            <Button
              component={Link}
              to={`/patients/${id}/forms`}
              variant="contained"
              size="small"
              sx={{ backgroundColor: "#fff", color: tokens.rose, borderRadius: 2, fontWeight: 700, "&:hover": { backgroundColor: tokens.roseSoft } }}
            >
              View Forms
            </Button>
          </Stack>
        </Box>

        {/* Vitals Ribbon */}
        {vitalSigns && (
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              pb: 3,
              pt: 0.5,
            }}
          >
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5 }}>
              Latest Vital Signs
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <VitalPill label="Weight"    value={vitalSigns.weight}            unit="kg"  />
              <VitalPill label="Height"    value={vitalSigns.height}            unit="cm"  />
              <VitalPill label="BMI"       value={vitalSigns.bmi}                          />
              <VitalPill label="BP"        value={vitalSigns.blood_pressure}    unit="mmHg"/>
              <VitalPill label="Pulse"     value={vitalSigns.pulse_rate}        unit="bpm" />
              <VitalPill label="RR"        value={vitalSigns.respiratory_rate}             />
              <VitalPill label="Temp"      value={vitalSigns.temperature}       unit="°C"  />
              <VitalPill label="SpO₂"      value={vitalSigns.oxygen_saturation} unit="%"   />
              <VitalPill label="Pain"      value={vitalSigns.pain_scale != null ? `${vitalSigns.pain_scale}/10` : null} />
            </Box>
          </Box>
        )}
      </Paper>

      {/* ── Address banner (subtle) ────────────────────────────────────── */}
      {patient.address && (
        <Box sx={{ mb: 2.5, px: 2, py: 1.2, backgroundColor: tokens.white, borderRadius: 2.5, border: `1px solid ${tokens.neutral300}`, display: "inline-flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 14, color: tokens.neutral600 }}>
            📍 <strong style={{ color: tokens.neutral800 }}>{patient.address}</strong>
          </Typography>
        </Box>
      )}

      {/* ── Section Grid ──────────────────────────────────────────────── */}
      <Grid container spacing={2.5}>

        {/* Medical History */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Medical History" meta={sectionMeta.medicalHistory}>
            {medicalHistory.length > 0 ? (
              <>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1.5 }}>
                  {medicalHistory.map((item) => (
                    <Chip
                      key={item.history_id}
                      label={item.condition_name}
                      size="small"
                      sx={{ backgroundColor: sectionMeta.medicalHistory.bg, color: sectionMeta.medicalHistory.color, fontWeight: 600, borderRadius: 1.5 }}
                    />
                  ))}
                </Box>
                {medicalHistory[0]?.remarks && (
                  <Typography variant="body2" color="text.secondary" sx={{ borderLeft: `3px solid ${tokens.plumLight}`, pl: 1.5, fontStyle: "italic" }}>
                    {medicalHistory[0].remarks}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">No medical history recorded</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Allergies */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Allergies" meta={sectionMeta.allergies}>
            {allergies.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                {allergies.map((allergy) => (
                  <Chip
                    key={allergy.allergy_id}
                    label={`${allergy.allergy_type}: ${allergy.allergy_name}`}
                    variant="outlined"
                    size="small"
                    sx={{ color: "#B71C1C", borderColor: "#EF9A9A", backgroundColor: "#FFEBEE", fontWeight: 600, borderRadius: 1.5, alignSelf: "flex-start" }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No known allergies</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Gynecologic History — featured full width */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1.5px solid ${tokens.roseSoft}`,
              background: `linear-gradient(120deg, ${tokens.rosePale} 0%, #fff5fb 100%)`,
              "&:hover": { boxShadow: "0 4px 20px rgba(194,24,91,0.1)" },
              transition: "box-shadow 0.2s",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: tokens.roseSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  🌸
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: tokens.rose }}>
                  Gynecologic History
                </Typography>
              </Stack>

              {gynecologicHistory ? (
                <Grid container spacing={2}>
                  {[
                    { label: "LMP",               value: formatDate(gynecologicHistory.lmp) },
                    { label: "Cycle",              value: gynecologicHistory.cycle_type ? `${gynecologicHistory.cycle_type}, ${gynecologicHistory.cycle_duration ?? "?"} days` : "N/A" },
                    { label: "Dysmenorrhea",       value: gynecologicHistory.dysmenorrhea ? "Yes" : "No" },
                    { label: "Gravidity / Parity", value: `G${gynecologicHistory.gravidity ?? 0} / P${gynecologicHistory.parity ?? 0}` },
                    { label: "Abortions",          value: gynecologicHistory.abortion_count ?? 0 },
                    { label: "Living Children",    value: gynecologicHistory.living_children ?? 0 },
                    { label: "Delivery Type",      value: gynecologicHistory.delivery_type || "N/A" },
                    { label: "Contraception",      value: gynecologicHistory.contraception || "N/A" },
                  ].map(({ label, value }) => (
                    <Grid item xs={6} sm={3} key={label}>
                      <Box sx={{ textAlign: "center", p: 1.5, backgroundColor: "#fff", borderRadius: 2, border: `1px solid ${tokens.roseSoft}` }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 800, color: tokens.rose }}>{value}</Typography>
                        <Typography sx={{ fontSize: 10, color: tokens.neutral600, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", mt: 0.3 }}>{label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">No gynecologic history recorded</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Consultation */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Latest Consultation" meta={sectionMeta.consultation}>
            {consultation ? (
              <Box>
                <Box sx={{ p: 1.5, backgroundColor: tokens.rosePale, borderRadius: 2, mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: tokens.rose, mb: 0.3 }}>Chief Complaint</Typography>
                  <Typography variant="body2">{consultation.chief_complaint || "N/A"}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  {formatDateTime(consultation.consultation_date)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  {consultation.physician_note || "No physician notes recorded"}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No consultation recorded</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Review of Systems */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Review of Systems" meta={sectionMeta.reviewOfSystems}>
            {reviewOfSystems ? (
              <Box>
                {positiveROS.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1.5 }}>
                    {positiveROS.map((item) => (
                      <Chip
                        key={item.key}
                        label={item.label}
                        size="small"
                        sx={{ backgroundColor: tokens.sagePale, color: tokens.sage, fontWeight: 600, borderRadius: 1.5 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>No positive ROS findings</Typography>
                )}
                {reviewOfSystems.others && (
                  <Typography variant="body2" color="text.secondary" sx={{ borderLeft: `3px solid ${tokens.sagePale}`, pl: 1.5, fontStyle: "italic" }}>
                    {reviewOfSystems.others}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No review of systems recorded</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Surgeries */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Surgeries" meta={sectionMeta.surgeries}>
            {surgeries.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {surgeries.map((surgery) => (
                  <Box key={surgery.surgery_id} sx={{ p: 1.5, backgroundColor: "#FFF3E0", borderRadius: 2, borderLeft: "3px solid #FF8F00" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{surgery.surgery_name}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatDate(surgery.surgery_date)}</Typography>
                    {surgery.details && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>{surgery.details}</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No surgeries recorded</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Hospitalizations */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Hospitalizations" meta={sectionMeta.hospitalizations}>
            {hospitalizations.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {hospitalizations.map((hosp) => (
                  <Box key={hosp.hospitalization_id} sx={{ p: 1.5, backgroundColor: "#E3F2FD", borderRadius: 2, borderLeft: "3px solid #1565C0" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatDate(hosp.hospitalization_date)}</Typography>
                    <Typography variant="body2" color="text.secondary">{hosp.details || "No details"}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No hospitalizations recorded</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Family History */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Family History" meta={sectionMeta.familyHistory}>
            {familyHistory.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {familyHistory.map((item) => (
                  <Box key={item.id} sx={{ p: 1.5, backgroundColor: tokens.sagePale, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: tokens.sage }}>{item.condition_name}</Typography>
                    {item.remarks && <Typography variant="body2" color="text.secondary">{item.remarks}</Typography>}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No family history recorded</Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Social History */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Social History" meta={sectionMeta.socialHistory}>
            {socialHistory ? (
              <Grid container spacing={1}>
                {[
                  { label: "Smoking",         value: socialHistory.smoking ? `Yes — ${socialHistory.sticks_per_day ?? "?"} sticks/day, ${socialHistory.smoking_years ?? "?"} yrs` : "No" },
                  { label: "Alcohol",         value: socialHistory.alcohol ? `Yes${socialHistory.alcohol_details ? ` — ${socialHistory.alcohol_details}` : ""}` : "No" },
                  { label: "Illicit Drugs",   value: socialHistory.illicit_drugs ? `Yes${socialHistory.drug_details ? ` — ${socialHistory.drug_details}` : ""}` : "No" },
                  { label: "Diet",            value: socialHistory.diet || "Not specified" },
                  { label: "Exercise",        value: socialHistory.exercise || "Not specified" },
                  { label: "Living Situation",value: socialHistory.living_situation || "Not specified" },
                  { label: "Exposure",        value: socialHistory.exposure_history || "Not specified" },
                ].map(({ label, value }) => (
                  <Grid item xs={12} key={label}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 120, color: "#4527A0" }}>{label}:</Typography>
                      <Typography variant="body2" color="text.secondary">{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">No social history recorded</Typography>
            )}
          </SectionCard>
        </Grid>

      </Grid>
    </Box>
  );
}

export default PatientProfile;