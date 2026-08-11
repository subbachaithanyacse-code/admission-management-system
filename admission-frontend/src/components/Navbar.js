import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="sidebar">
      <h2>Menu</h2>

      <Link to="/">🏠 Dashboard</Link>

      <Link to="/students">👨‍🎓 Students</Link>

      <Link to="/courses">📚 Courses</Link>

      <Link to="/admissions">📝 Admissions</Link>

      <Link to="/reports">📊 Reports</Link>

      <Link to="/users">👤 Users</Link>

      <Link to="/settings">⚙ Settings</Link>
    </div>
  );
}

export default Navbar;