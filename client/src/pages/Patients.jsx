import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h1>Patient List</h1>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
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
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/patients/${patient.patient_id}`)
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
                No patients found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Patients;