import { Box, Tabs, Tab } from "@mui/material";
import TabPanel from "./TabPanel";
import PatientInfoTab from "./PatientInfoTab";
import ConsultationTab from "./ConsultationTab";
import MedicalHistoryTab from "./MedicalHistoryTab";
import HospitalizationTab from "./HospitalizationTab";
import SurgeryTab from "./SurgeryTab";
import AllergiesTab from "./AllergiesTab";
import FamilyHistoryTab from "./FamilyHistoryTab";

function PatientTabs({ patient, tab, setTab, form, setForm }) {
  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Patient Info" />
        <Tab label="Consultation" />
        <Tab label="Medical History" />
        <Tab label="Hospitalization" />
        <Tab label="Surgery" />
        <Tab label="Allergies" />
        <Tab label="Family History" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <PatientInfoTab patient={patient} />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <ConsultationTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <MedicalHistoryTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <HospitalizationTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>

      <TabPanel value={tab} index={4}>
        <SurgeryTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>

      <TabPanel value={tab} index={5}>
        <AllergiesTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>

      <TabPanel value={tab} index={6}>
        <FamilyHistoryTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>
    </Box>
  );
}

export default PatientTabs;
