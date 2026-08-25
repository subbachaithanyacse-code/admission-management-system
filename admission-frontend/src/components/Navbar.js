import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "13px 18px",
    marginBottom: "6px",
    borderRadius: "7px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#d1d5db",
    backgroundColor: isActive ? "#2563eb" : "transparent",
    fontWeight: isActive ? "600" : "500",
  });

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "240px",
        backgroundColor: "#111827",
        padding: "20px 15px",
        boxSizing: "border-box",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        Admission System
      </h2>

      <p
        style={{
          color: "#9ca3af",
          textAlign: "center",
          marginTop: 0,
          marginBottom: "25px",
          fontSize: "13px",
        }}
      >
        Admin Panel
      </p>

      <div
        style={{
          color: "#d1d5db",
          padding: "10px",
          marginBottom: "15px",
          backgroundColor: "#1f2937",
          borderRadius: "7px",
          textAlign: "center",
        }}
      >
        👤 {username}
      </div>

      <NavLink to="/dashboard" style={linkStyle}>
        📊 Dashboard
      </NavLink>

      <NavLink to="/students" style={linkStyle}>
        👨‍🎓 Students
      </NavLink>

      <NavLink to="/courses" style={linkStyle}>
        📚 Courses
      </NavLink>

      <NavLink to="/admissions" style={linkStyle}>
        📝 Admissions
      </NavLink>

      <NavLink to="/reports" style={linkStyle}>
        📈 Reports
      </NavLink>

      <NavLink to="/settings" style={linkStyle}>
        ⚙️ Settings
      </NavLink>

      <div
        style={{
          borderTop: "1px solid #374151",
          marginTop: "25px",
          paddingTop: "20px",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
