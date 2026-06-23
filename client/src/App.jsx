import { useState, useEffect } from "react";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if(!selectedPatientId) return;
    const loadPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients");

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    
    };

    loadPatients();
  }, [selectedPatientId]);

  const getPatientById = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/patients/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient");
      }

      const data = await response.json();
      setSelectedPatient(data);
      setShowDetails(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h1>Electronic Medical Records</h1>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.patient_id}>
                <td>{patient.patient_id}</td>
                <td>{patient.first_name}</td>
                <td>{patient.last_name}</td>
                <td>{patient.age}</td>
                <td>{patient.address}</td>
                <td>{patient.contact_num}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      setSelectedPatientId(patient.patient_id) ||
                      getPatientById(patient.patient_id)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ DETAILS SECTION (OUTSIDE TABLE) */}
      {showDetails && selectedPatient && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Patient Details - {selectedPatient.first_name} {selectedPatient.last_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Patient ID:</strong> {selectedPatient.patient_id}</p>
                <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                {/* Add more patient details here as needed */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
  );
}

export default App;