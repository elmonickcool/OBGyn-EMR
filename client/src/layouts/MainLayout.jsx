import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px" }}
      >
        <h4 className="mb-4">EMR System</h4>

        <nav className="nav flex-column">

          <Link className="nav-link text-white" to="/">
            Patients
          </Link>

          <Link className="nav-link text-white" to="/add-patient">
            Add Patient
          </Link>

          <Link className="nav-link text-white" to="/dashboard">
            Dashboard
          </Link>

        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1">

        {/* TOPBAR */}
        <div className="bg-light p-3 border-bottom">
          <h5 className="m-0">Electronic Medical Records</h5>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;