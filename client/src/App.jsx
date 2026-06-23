import { Routes, Route } from "react-router-dom";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/patients/:id" element={<PatientDetails />} />
    </Routes>
  );
}

export default App;