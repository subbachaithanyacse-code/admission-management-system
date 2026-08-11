import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Admissions from "./pages/Admissions";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>

        <aside
          style={{
            width: "240px",
            background: "#0f172a",
            color: "white",
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <h2>Admission</h2>

          <p style={{ color: "#94a3b8" }}>
            Management System
          </p>

          <hr />

          <NavLink to="/" style={linkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/students" style={linkStyle}>
            Students
          </NavLink>

          <NavLink to="/courses" style={linkStyle}>
            Courses
          </NavLink>

          <NavLink to="/admissions" style={linkStyle}>
            Admissions
          </NavLink>

          <NavLink to="/reports" style={linkStyle}>
            Reports
          </NavLink>

          <NavLink to="/users" style={linkStyle}>
            Users
          </NavLink>

          <NavLink to="/settings" style={linkStyle}>
            Settings
          </NavLink>
        </aside>

        <main
          style={{
            flex: 1,
            background: "#f1f5f9"
          }}
        >
          <header
            style={{
              background: "white",
              padding: "20px",
              borderBottom: "1px solid #ddd"
            }}
          >
            <h2>Admission Management System</h2>
          </header>

          <div style={{ padding: "25px" }}>
            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/students"
                element={<Students />}
              />

              <Route
                path="/courses"
                element={<Courses />}
              />

              <Route
                path="/admissions"
                element={<Admissions />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="/users"
                element={<Users />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

const linkStyle = {
  display: "block",
  color: "#cbd5e1",
  textDecoration: "none",
  padding: "12px 8px",
  marginTop: "5px"
};

export default App;
