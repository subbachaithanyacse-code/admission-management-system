import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Admissions from "./pages/Admissions";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

function Layout() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "🏠",
    },
    {
      path: "/students",
      label: "Students",
      icon: "👨‍🎓",
    },
    {
      path: "/courses",
      label: "Courses",
      icon: "📚",
    },
    {
      path: "/admissions",
      label: "Admissions",
      icon: "📝",
    },
    {
      path: "/reports",
      label: "Reports",
      icon: "📊",
    },
    {
      path: "/users",
      label: "Users",
      icon: "👤",
    },
  ];

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-header">
          <div className="college-logo">
            🎓
          </div>

          <div>
            <h2>Admission</h2>
            <span>Management System</span>
          </div>
        </div>

        <nav className="sidebar-menu">

          {menuItems.map((item) => {

            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${
                  isActive ? "active" : ""
                }`}
              >
                <span className="menu-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}

        </nav>

        <div className="sidebar-footer">
          <p>Admission Management</p>
          <span>System v1.0</span>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header className="top-header">

          <div>
            <h3>
              Admission Management System
            </h3>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>

          </div>

        </header>

        <div className="page-content">

          <Routes>

            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Students */}
            <Route
              path="/students"
              element={<Students />}
            />

            {/* Courses */}
            <Route
              path="/courses"
              element={<Courses />}
            />

            {/* Admissions */}
            <Route
              path="/admissions"
              element={<Admissions />}
            />

            {/* Reports */}
            <Route
              path="/reports"
              element={<Reports />}
            />

            {/* Users */}
            <Route
              path="/users"
              element={<Users />}
            />

          </Routes>

        </div>

      </main>

      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          background: #f5f7fb;
        }

        .app-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* =========================
           SIDEBAR
        ========================= */

        .sidebar {
          width: 250px;
          min-height: 100vh;
          background: #111827;
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .sidebar-header {
          height: 80px;
          padding: 15px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #374151;
        }

        .college-logo {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 18px;
        }

        .sidebar-header span {
          display: block;
          color: #9ca3af;
          font-size: 11px;
          margin-top: 3px;
        }

        .sidebar-menu {
          padding: 20px 12px;
          flex: 1;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 15px;
          margin-bottom: 6px;
          color: #d1d5db;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: 0.2s;
        }

        .menu-item:hover {
          background: #1f2937;
          color: white;
        }

        .menu-item.active {
          background: #2563eb;
          color: white;
        }

        .menu-icon {
          width: 25px;
          text-align: center;
          font-size: 18px;
        }

        .sidebar-footer {
          padding: 18px;
          border-top: 1px solid #374151;
          color: #9ca3af;
        }

        .sidebar-footer p {
          margin: 0;
          font-size: 12px;
        }

        .sidebar-footer span {
          font-size: 11px;
        }

        /* =========================
           MAIN CONTENT
        ========================= */

        .main-content {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .top-header {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 25px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .top-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 17px;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-avatar {
          width: 38px;
          height: 38px;
          background: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .admin-profile strong {
          display: block;
          color: #1f2937;
          font-size: 13px;
        }

        .admin-profile span {
          display: block;
          color: #6b7280;
          font-size: 11px;
          margin-top: 2px;
        }

        .page-content {
          min-height: calc(100vh - 70px);
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 800px) {

          .sidebar {
            width: 70px;
          }

          .sidebar-header {
            justify-content: center;
            padding: 10px;
          }

          .sidebar-header > div:last-child {
            display: none;
          }

          .menu-item {
            justify-content: center;
            padding: 13px 5px;
          }

          .menu-item span:last-child {
            display: none;
          }

          .sidebar-footer {
            display: none;
          }

          .main-content {
            margin-left: 70px;
            width: calc(100% - 70px);
          }

          .top-header {
            padding: 0 15px;
          }

        }

      `}</style>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;