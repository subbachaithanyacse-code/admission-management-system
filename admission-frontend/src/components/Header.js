import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">🎓 Admission Management System</div>

      <div className="header-right">
        <span className="user-name">Welcome, Admin</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}

export default Header;
