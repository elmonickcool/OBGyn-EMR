import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    birth_date: "",
    contact_num: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birth_date") {
      setForm({
        ...form,
        birth_date: value,
        age: calculateAge(value),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Patient</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Birth Date</label>
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
          <label>Age</label>
          <input
            type="number"
            name="age"
            className="form-control"
            value={form.age}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label>Contact Number</label>
          <input
            type="text"
            name="contact_num"
            className="form-control"
            value={form.contact_num}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Patient"}
        </button>
      </form>
    </div>
  );
}

export default AddPatient;