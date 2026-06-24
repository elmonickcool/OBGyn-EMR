import { Typography } from "@mui/material";

function PatientInfoTab({ patient }) {
  return (
    <>
      <Typography>ID: {patient.patient_id}</Typography>
      <Typography>
        Name: {patient.first_name} {patient.last_name}
      </Typography>
      <Typography>Age: {patient.age}</Typography>
      <Typography>Address: {patient.address || "N/A"}</Typography>
      <Typography>Contact: {patient.contact_num || "N/A"}</Typography>
    </>
  );
}

export default PatientInfoTab;
