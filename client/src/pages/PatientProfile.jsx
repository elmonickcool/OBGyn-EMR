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
} from "@mui/material";
import { formatDate, formatDateTime } from "../utils/dateUtils";

function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [consultation, setConsultation] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [hospitalizations, setHospitalizations] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [socialHistory, setSocialHistory] = useState(null);
  const [gynecologicHistory, setGynecologicHistory] = useState(null);
  const [reviewOfSystems, setReviewOfSystems] = useState(null);

  const sectionCardSx = {
    borderRadius: 3,
    boxShadow: 1,
    border: "1px solid",
    borderColor: "divider",
    minHeight: 150,
    backgroundColor: "#fff",
  };

  const sectionTitleSx = {
    fontWeight: 700,
    mb: 1,
    color: "text.primary",
  };

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

    const fetchResource = async (url, setter) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setter(data);
        }
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err);
      }
    };

    fetchPatient();
    fetchResource(`http://192.168.0.101:3000/medical-history/${id}`, setMedicalHistory);
    fetchResource(`http://192.168.0.101:3000/consultations/${id}`, setConsultation);
    fetchResource(`http://192.168.0.101:3000/allergies/${id}`, setAllergies);
    fetchResource(`http://192.168.0.101:3000/surgeries/${id}`, setSurgeries);
    fetchResource(`http://192.168.0.101:3000/hospitalizations/${id}`, setHospitalizations);
    fetchResource(`http://192.168.0.101:3000/family-history/${id}`, setFamilyHistory);
    fetchResource(`http://192.168.0.101:3000/social-history/${id}`, setSocialHistory);
    fetchResource(`http://192.168.0.101:3000/gynecologic-history/${id}`, setGynecologicHistory);
    fetchResource(`http://192.168.0.101:3000/review-of-systems/${id}`, setReviewOfSystems);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!patient) return <p>No patient found</p>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, pb: 4 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, background: "linear-gradient(135deg, #5f72be 0%, #9b23d3 100%)", color: "white", boxShadow: "0 20px 45px rgba(54, 84, 155, 0.18)" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: 2, alignItems: { xs: "flex-start", md: "center" } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", letterSpacing: "-0.03em" }}>
              {patient.first_name} {patient.last_name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Patient ID: {patient.patient_id}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button component={Link} to="/" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.7)" }}>
              Back to list
            </Button>
            <Button component={Link} to={`/patients/${id}/forms`} variant="contained" color="secondary">
              View Forms
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, boxShadow: 2, backgroundColor: "#f6f8ff", border: "1px solid rgba(145, 158, 171, 0.16)" }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}>
          Patient summary at a glance
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Quick access to important patient details for clinic workflows.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={sectionCardSx}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Age
                </Typography>
                <Typography variant="h5">{patient.age} years</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={sectionCardSx}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Birth Date
                </Typography>
                <Typography variant="h6">
                  {formatDate(patient.birth_date)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={sectionCardSx}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Contact
                </Typography>
                <Typography variant="h6">{patient.contact_num || "N/A"}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={sectionCardSx}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body2">{patient.address || "N/A"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
<Grid container spacing={2}>
     <Grid item xs={12} md={6}>
  <Card sx={sectionCardSx}>
    <CardContent>
      <Typography variant="h6" sx={sectionTitleSx}>
  Medical History
</Typography>

{medicalHistory.length > 0 ? (
  <>
    <Box sx={{ mb: 2 }}>
      {medicalHistory.map((item) => (
        <Chip
          key={item.history_id}
          label={item.condition_name}
          color="primary"
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
      ))}
    </Box>

    <Typography variant="subtitle2">
      <b>Remarks:</b>
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {medicalHistory[0]?.remarks || "No remarks"}
    </Typography>
  </>
) : (
  <Typography variant="body2" color="text.secondary">
    No medical history recorded
  </Typography>
)}
    </CardContent>
  </Card>
</Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Allergies
              </Typography>
              {allergies.length > 0 ? (
                <Box>
                  {allergies.map((allergy) => (
                    <Box key={allergy.allergy_id} sx={{ mb: 1 }}>
                      <Chip
                        label={`${allergy.allergy_type}: ${allergy.allergy_name}`}
                        variant="outlined"
                        color="error"
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No allergies recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Consultation
              </Typography>
              {consultation ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Chief Complaint:</strong> {consultation.chief_complaint || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {formatDateTime(consultation.consultation_date)}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {consultation.physician_note || "No notes"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No consultation recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Surgeries
              </Typography>
              {surgeries.length > 0 ? (
                <Box>
                  {surgeries.map((surgery) => (
                    <Box key={surgery.surgery_id} sx={{ mb: 1.5 }}>
                      <Typography variant="body2">
                        <strong>{surgery.surgery_name}</strong> - {formatDate(surgery.surgery_date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {surgery.details || "No details"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No surgeries recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Hospitalizations
              </Typography>
              {hospitalizations.length > 0 ? (
                <Box>
                  {hospitalizations.map((hosp) => (
                    <Box key={hosp.hospitalization_id} sx={{ mb: 1.5, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Date:</strong> {formatDate(hosp.hospitalization_date)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Details:</strong> {hosp.details || "No details"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hospitalizations recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Family History
              </Typography>
              {familyHistory.length > 0 ? (
                <Box>
                  {familyHistory.map((item) => (
                    <Box key={item.id} sx={{ mb: 1.5, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>{item.condition_name}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.remarks || "No remarks"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No family history recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Social History
              </Typography>
              {socialHistory ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Smoking:</strong> {socialHistory.smoking ? "Yes" : "No"}
                  </Typography>
                  {socialHistory.smoking && (
                    <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                      {socialHistory.sticks_per_day || "-"} sticks/day, {socialHistory.smoking_years || "-"} years
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Alcohol:</strong> {socialHistory.alcohol ? "Yes" : "No"}
                  </Typography>
                  {socialHistory.alcohol && (
                    <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                      {socialHistory.alcohol_details || "No details"}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Illicit Drugs:</strong> {socialHistory.illicit_drugs ? "Yes" : "No"}
                  </Typography>
                  {socialHistory.illicit_drugs && (
                    <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                      {socialHistory.drug_details || "No details"}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Diet:</strong> {socialHistory.diet || "Not specified"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Exercise:</strong> {socialHistory.exercise || "Not specified"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Living Situation:</strong> {socialHistory.living_situation || "Not specified"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Exposure History:</strong> {socialHistory.exposure_history || "Not specified"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No social history recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Gynecologic History
              </Typography>
              {gynecologicHistory ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>LMP:</strong> {formatDate(gynecologicHistory.lmp)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Cycle:</strong> {gynecologicHistory.cycle_type || "N/A"}, {gynecologicHistory.cycle_duration || "N/A"} days
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Dysmenorrhea:</strong> {gynecologicHistory.dysmenorrhea ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>G/P:</strong> {gynecologicHistory.gravidity || 0}/{gynecologicHistory.parity || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Abortions:</strong> {gynecologicHistory.abortion_count || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Children:</strong> {gynecologicHistory.living_children || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Delivery:</strong> {gynecologicHistory.delivery_type || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Contraception:</strong> {gynecologicHistory.contraception || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No gynecologic history recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sectionCardSx}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitleSx}>
                Review of Systems
              </Typography>
              {reviewOfSystems ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Symptoms:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                    {[
                      { key: "fever", label: "Fever" },
                      { key: "weight_loss", label: "Weight Loss" },
                      { key: "headache", label: "Headache" },
                      { key: "chest_pain", label: "Chest Pain" },
                      { key: "shortness_of_breath", label: "Shortness of Breath" },
                      { key: "abdominal_pain", label: "Abdominal Pain" },
                      { key: "urinary_symptoms", label: "Urinary Symptoms" },
                      { key: "vaginal_bleeding_discharge", label: "Vaginal Bleeding/Discharge" },
                    ].filter((item) => reviewOfSystems[item.key]).map((item) => (
                      <Chip key={item.key} label={item.label} color="primary" size="small" />
                    ))}
                    {!["fever","weight_loss","headache","chest_pain","shortness_of_breath","abdominal_pain","urinary_symptoms","vaginal_bleeding_discharge"].some((key) => reviewOfSystems[key]) && (
                      <Typography variant="body2" color="text.secondary">
                        No positive ROS findings
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Other Symptoms:</strong> {reviewOfSystems.others || "None"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No review of systems recorded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PatientProfile;
