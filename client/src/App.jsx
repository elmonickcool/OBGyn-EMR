import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import PatientForms from "./pages/PatientForms";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>

      {/* Layout wrapper */}
      <Route path="/" element={<MainLayout />}>

        {/* Pages inside layout */}
        <Route index element={<Patients />} />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="patients/:id" element={<PatientProfile />} />
        <Route path="patients/:id/forms" element={<PatientForms />} />
        <Route path="patients/:id/edit" element={<EditPatient />} />
        <Route path="dashboard" element={<Dashboard />} />

      </Route>

    </Routes>
  );
}

export default App;