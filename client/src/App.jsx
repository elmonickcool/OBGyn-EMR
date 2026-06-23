import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import AddPatient from "./pages/AddPatient";

function App() {
  return (
    <Routes>

      {/* Layout wrapper */}
      <Route path="/" element={<MainLayout />}>

        {/* Pages inside layout */}
        <Route index element={<Patients />} />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="patients/:id" element={<PatientDetails />} />

      </Route>

    </Routes>
  );
}

export default App;