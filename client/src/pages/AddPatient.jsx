import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    birth_date: "",
    address: "",
    contact_num: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birth_date") {
      setForm({
        ...form,
        birth_date: value,
        age: calculateAge(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to add patient");

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          {/* Card */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">

              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="fw-bold">Add New Patient</h3>
                <p className="text-muted mb-0">
                  Fill in the patient information below
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Birth Date</label>
                  <input
                    type="date"
                    name="birth_date"
                    className="form-control"
                    value={form.birth_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Age (auto-calculated)</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control bg-light"
                    value={form.age}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    name="contact_num"
                    className="form-control"
                    value={form.contact_num}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Saving Patient..." : "Save Patient"}
                </button>

              </form>
            </div>
          </div>
          {/* End Card */}

        </div>
      </div>
    </div>
  );
}

export default AddPatient;