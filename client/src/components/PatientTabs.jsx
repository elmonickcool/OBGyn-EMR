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
import GynecologicHistoryTab from "./tabs/GynecologicHistoryTab";
import ReviewOfSystemsTab from "./tabs/ReviewOfSystemsTab";

function PatientTabs({ patient, tab, setTab, form, setForm }) {
  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { backgroundColor: "#5f72be", height: 4, borderRadius: 2 } }}
        sx={{
          backgroundColor: "#f4f6fb",
          borderRadius: 3,
          mb: 2,
          minHeight: 56,
          px: 1,
        }}
      >
        <Tab label="Patient Info" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Consultation" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Medical History" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Hospitalization" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Surgery" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Allergies" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Family History" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Social History" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Gynecologic History" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
        <Tab label="Review of Systems" sx={{ textTransform: "none", minWidth: 120, fontWeight: 600 }} />
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

      <TabPanel value={tab} index={8}>
        <GynecologicHistoryTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>

      <TabPanel value={tab} index={9}>
        <ReviewOfSystemsTab patient={patient} form={form} setForm={setForm} />
      </TabPanel>
    </Box>
  );
}

export default PatientTabs;
