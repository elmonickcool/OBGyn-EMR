import { Box, Tabs, Tab } from "@mui/material";
import TabPanel from "./TabPanel";
import PatientInfoTab from "./tabs/PatientInfoTab";
import ConsultationTab from "./tabs/ConsultationTab";
import MedicalHistoryTab from "./tabs/MedicalHistoryTab";
import HospitalizationTab from "./tabs/HospitalizationTab";
import SurgeryTab from "./tabs/SurgeryTab";
import AllergiesTab from "./tabs/AllergiesTab";
import FamilyHistoryTab from "./tabs/FamilyHistoryTab";
import SocialHistoryTab from "./tabs/SocialHistoryTab";

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
        <Tab label="Social History" />
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

      <TabPanel value={tab} index={7}>
        <SocialHistoryTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>
    </Box>
  );
}

export default PatientTabs;
