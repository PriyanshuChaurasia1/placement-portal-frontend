import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">Placement Portal</span>
      {user && (
        <div className="nav-links">
          {user.role === "STUDENT" && (
            <>
              <Link to="/student">Dashboard</Link>
              <Link to="/student/profile">Profile</Link>
              <Link to="/student/jobs">Jobs</Link>
              <Link to="/student/applications">Applications</Link>
            </>
          )}
          {user.role === "OFFICER" && (
            <>
              <Link to="/officer">Dashboard</Link>
              <Link to="/officer/companies">Companies</Link>
              <Link to="/officer/jobs">Jobs</Link>
              <Link to="/officer/students">Students</Link>
            </>
          )}
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}